import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Question from "../models/question.model.js";
import PastQuestion from "../models/pastQuestion.model.js";
import { slugify } from "../models/schemaUtils.js";

export const listSupportTickets = (_req, res) => {
  res.json({
    message: "Support tickets endpoint ready",
    data: [],
  });
};

export const getRevenueSummary = (_req, res) => {
  res.json({
    message: "Revenue summary endpoint ready",
    data: {
      grossRevenue: 0,
      activeSubscribers: 0,
    },
  });
};

// Normalize incoming values so downstream validation behaves consistently.
function normalizeText(value) {
  return String(value || "").trim();
}

// Tags can come as CSV text or array; convert both to a clean string array.
function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  const text = normalizeText(value);
  if (!text) return [];
  return text.split(",").map((item) => normalizeText(item)).filter(Boolean);
}

// Keep difficulty bounded to supported enum values.
function normalizeDifficulty(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (["easy", "medium", "hard"].includes(normalized)) {
    return normalized;
  }
  return "medium";
}

// Accept only the canonical objective options.
function normalizeCorrectOption(value) {
  const normalized = normalizeText(value).toUpperCase();
  if (["A", "B", "C", "D"].includes(normalized)) {
    return normalized;
  }
  return null;
}

// Resolve subject by exact name first, then by slug fallback.
async function resolveSubject(subjectName) {
  const name = normalizeText(subjectName);
  if (!name) return null;

  const subjectByName = await Subject.findOne({ name });
  if (subjectByName) return subjectByName;

  const subjectBySlug = await Subject.findOne({ slug: slugify(name) });
  if (subjectBySlug) return subjectBySlug;

  return null;
}

// Resolve topic under the chosen subject, or create a minimal shell when missing.
async function resolveOrCreateTopic({ subjectId, topicName }) {
  const normalizedTopicName = normalizeText(topicName);
  if (!normalizedTopicName) return null;

  const topicSlug = slugify(normalizedTopicName);
  let topic = await Topic.findOne({ subject: subjectId, slug: topicSlug });
  if (topic) return topic;

  topic = await Topic.findOne({ subject: subjectId, name: normalizedTopicName });
  if (topic) return topic;

  return Topic.create({
    subject: subjectId,
    name: normalizedTopicName,
    slug: topicSlug,
    summary: `Imported from admin question upload for ${normalizedTopicName}.`,
    content: `Imported topic shell for ${normalizedTopicName}.`,
    simpleExplanation: `Imported topic shell for ${normalizedTopicName}.`,
    highYieldSummary: `Imported topic shell for ${normalizedTopicName}.`,
    keyDefinitions: [],
    importantFormulasFacts: [],
    aiExplanations: {
      whyCorrectIsCorrect: null,
      whyOthersAreWrong: null,
      simpleBreakdown: null,
    },
    status: "active",
  });
}

// Validate one uploaded row and return either row-level errors or normalized payload.
function validateUploadRow(rawRow, index) {
  const rowNumber = index + 1;
  const fieldErrors = [];

  const subject = normalizeText(rawRow.subject);
  const topic = normalizeText(rawRow.topic);
  const content = normalizeText(rawRow.question || rawRow.content);
  const optionA = normalizeText(rawRow.optionA ?? rawRow.a);
  const optionB = normalizeText(rawRow.optionB ?? rawRow.b);
  const optionC = normalizeText(rawRow.optionC ?? rawRow.c);
  const optionD = normalizeText(rawRow.optionD ?? rawRow.d);
  const correctOption = normalizeCorrectOption(rawRow.correctOption || rawRow.answer);
  const examYearRaw = Number(rawRow.year ?? rawRow.examYear);
  const questionNumberRaw = Number(rawRow.questionNumber);

  if (!subject) fieldErrors.push("subject is required");
  if (!topic) fieldErrors.push("topic is required");
  if (!content) fieldErrors.push("question/content is required");
  if (!optionA || !optionB || !optionC || !optionD) fieldErrors.push("options A-D are required");
  if (!correctOption) fieldErrors.push("correctOption must be A, B, C, or D");
  if (!Number.isInteger(examYearRaw) || examYearRaw < 1978 || examYearRaw > 2100) fieldErrors.push("valid year is required");
  if (!Number.isInteger(questionNumberRaw) || questionNumberRaw <= 0) fieldErrors.push("questionNumber must be a positive integer");

  if (fieldErrors.length > 0) {
    return {
      valid: false,
      rowNumber,
      error: fieldErrors.join("; "),
    };
  }

  return {
    valid: true,
    rowNumber,
    normalized: {
      subject,
      topic,
      content,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctOption,
      explanation: normalizeText(rawRow.explanation) || null,
      examYear: examYearRaw,
      questionNumber: questionNumberRaw,
      paper: normalizeText(rawRow.paper) || "UTME",
      examBody: normalizeText(rawRow.examBody) || "JAMB",
      difficulty: normalizeDifficulty(rawRow.difficulty),
      tags: normalizeTags(rawRow.tags),
      sourceUrl: normalizeText(rawRow.sourceUrl) || null,
    },
  };
}

export const uploadPastQuestions = async (req, res) => {
  try {
    const { items } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Upload payload must include a non-empty items array.",
      });
    }

    if (items.length > 500) {
      return res.status(400).json({
        error: "Upload supports a maximum of 500 rows per request.",
      });
    }

    // Track per-row outcomes so admins can see exactly what imported or failed.
    const results = [];
    const touchedSubjectIds = new Set();
    let importedCount = 0;
    let skippedCount = 0;

    // Process row-by-row so bad rows can be skipped without aborting the whole upload.
    for (let index = 0; index < items.length; index += 1) {
      const parsed = validateUploadRow(items[index], index);

      if (!parsed.valid) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: parsed.error });
        continue;
      }

      const row = parsed.normalized;
      const subject = await resolveSubject(row.subject);
      if (!subject) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: `Unknown subject: ${row.subject}` });
        continue;
      }

      const topic = await resolveOrCreateTopic({ subjectId: subject._id, topicName: row.topic });
      if (!topic) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: `Unable to resolve topic: ${row.topic}` });
        continue;
      }

      // Upsert canonical Question record keyed by subject/topic/year/question-number.
      const questionDoc = await Question.findOneAndUpdate(
        {
          subject: subject._id,
          topic: topic._id,
          "sourceMeta.examYear": row.examYear,
          "sourceMeta.questionNumber": row.questionNumber,
        },
        {
          subject: subject._id,
          topic: topic._id,
          sourceType: "past-question",
          questionType: "objective",
          content: row.content,
          options: row.options,
          correctOption: row.correctOption,
          explanation: row.explanation,
          difficulty: row.difficulty,
          tags: row.tags,
          status: "published",
          sourceMeta: {
            examBody: row.examBody,
            examYear: row.examYear,
            paper: row.paper,
            questionNumber: row.questionNumber,
            sourceUrl: row.sourceUrl,
          },
          isPastQuestion: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // Upsert PastQuestion source record and link back to the canonical Question.
      await PastQuestion.findOneAndUpdate(
        {
          subject: subject._id,
          topic: topic._id,
          examYear: row.examYear,
          questionNumber: row.questionNumber,
        },
        {
          subject: subject._id,
          topic: topic._id,
          examBody: row.examBody,
          examYear: row.examYear,
          paper: row.paper,
          questionNumber: row.questionNumber,
          content: row.content,
          options: row.options,
          correctOption: row.correctOption,
          explanation: row.explanation,
          sourceUrl: row.sourceUrl,
          tags: row.tags,
          mappedQuestion: questionDoc._id,
          status: "imported",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      touchedSubjectIds.add(String(subject._id));
      importedCount += 1;
      results.push({ row: parsed.rowNumber, status: "imported", subject: subject.name, topic: topic.name });
    }

    // Recompute subject-level counters for dashboard/admin analytics consistency.
    const touchedSubjectIdsArray = Array.from(touchedSubjectIds);
    for (const subjectId of touchedSubjectIdsArray) {
      const [questionCount, totalPastQuestions] = await Promise.all([
        Question.countDocuments({ subject: subjectId }),
        PastQuestion.countDocuments({ subject: subjectId }),
      ]);

      await Subject.updateOne(
        { _id: subjectId },
        {
          $set: {
            "metadata.questionCount": questionCount,
            "metadata.totalPastQuestions": totalPastQuestions,
          },
        },
      );
    }

    return res.status(200).json({
      message: "Past question upload completed.",
      summary: {
        totalRows: items.length,
        importedCount,
        skippedCount,
      },
      results,
    });
  } catch (error) {
    console.error("Upload past questions error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to upload past questions.",
    });
  }
};
