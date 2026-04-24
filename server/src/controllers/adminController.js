import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Question from "../models/question.model.js";
import PastQuestion from "../models/pastQuestion.model.js";
import { slugify } from "../models/schemaUtils.js";
import multer from "multer";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

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

const noteUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const allowedNoteMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const parseTopicNoteUploadMiddleware = noteUpload.single("noteFile");

function getExtension(fileName = "") {
  const parts = String(fileName).toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function normalizeLineList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value = "") {
  return String(value)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function extractTextFromNoteFile(file) {
  const extension = getExtension(file?.originalname);

  if (!allowedNoteMimeTypes.has(file?.mimetype) && !["pdf", "docx"].includes(extension)) {
    throw new Error("Only PDF and DOCX note files are supported.");
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return String(result?.value || "").trim();
  }

  const parsed = await pdfParse(file.buffer);
  return String(parsed?.text || "").trim();
}

function parseTopicNoteHeuristics({ topicName, sourceText }) {
  const lines = String(sourceText || "")
    .split("\n")
    .map((line) => line.trim());

  const nonEmptyLines = lines.filter(Boolean);
  const overview = nonEmptyLines.slice(0, 4).join(" ").slice(0, 1200);

  const sectionMarkers = [
    /^\d+[\).:-]\s+/,
    /^(chapter|section|part)\s+\d+/i,
    /^(dalton|thomson|rutherford|bohr|schrodinger|quantum|electron|proton|neutron)\b/i,
  ];

  const sections = [];
  let current = null;

  for (const line of lines) {
    if (!line) continue;

    const isHeading =
      line.length < 120 &&
      sectionMarkers.some((pattern) => pattern.test(line));

    if (isHeading) {
      if (current) sections.push(current);
      current = {
        sectionTitle: line.replace(/^\d+[\).:-]\s*/, "").trim(),
        definition: "",
        explanation: "",
        examples: [],
        jambPoint: "",
        quickTip: "",
        aiExplanation: { paragraphs: [] },
      };
      continue;
    }

    if (!current) {
      current = {
        sectionTitle: "Core Notes",
        definition: "",
        explanation: "",
        examples: [],
        jambPoint: "",
        quickTip: "",
        aiExplanation: { paragraphs: [] },
      };
    }

    if (!current.definition) {
      current.definition = line;
    } else {
      current.explanation = `${current.explanation}\n${line}`.trim();
    }
  }

  if (current) sections.push(current);

  const normalizedSections = sections
    .map((section, index) => {
      const explanationParagraphs = splitParagraphs(section.explanation).slice(0, 3);

      return {
        sectionTitle: section.sectionTitle || `Section ${index + 1}`,
        order: index,
        definition: section.definition || "",
        explanation: section.explanation || section.definition || "",
        examples: normalizeLineList(section.examples).slice(0, 6),
        jambPoint: section.jambPoint || "",
        quickTip: section.quickTip || "",
        aiExplanation: {
          paragraphs: explanationParagraphs.length > 0 ? explanationParagraphs : [section.definition || "Review this section carefully."],
        },
      };
    })
    .filter((section) => section.sectionTitle);

  const firstSection = normalizedSections[0];

  return {
    topicName: String(topicName || "").trim(),
    overview,
    referenceBook: "",
    jambFocus: ["Definition-based questions", "Interpretation and comparison questions"],
    learningGoals: [
      "Understand the core definitions in this topic",
      "Apply the concepts to objective exam-style questions",
    ],
    prerequisites: [],
    relatedTopics: [],
    revisionPriority: "medium",
    sections: normalizedSections,
    // Legacy compatibility values derived from structured fields.
    highYieldSummary: overview,
    simpleExplanation: firstSection?.explanation || overview,
    keyDefinitions: normalizedSections.map((section) => section.definition).filter(Boolean).slice(0, 8),
    importantFormulasFacts: normalizedSections.map((section) => section.jambPoint).filter(Boolean).slice(0, 8),
    aiExplanations: {
      whyCorrectIsCorrect: "Correct answers align with core definitions and rule conditions from the section notes.",
      whyOthersAreWrong: "Distractors usually break a condition, misuse a definition, or confuse related terms.",
      simpleBreakdown: "1) Read the stem carefully. 2) Match with core definition. 3) Eliminate options that violate the rule.",
      paragraphs: firstSection?.aiExplanation?.paragraphs || [],
    },
  };
}

function extractJsonFromText(rawText) {
  const text = String(rawText || "").trim();
  if (!text) return null;

  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : text;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
}

async function enrichTopicNoteWithGemini({ topicName, extractedText, fallbackStructured }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallbackStructured;

  const prompt = `You are converting study notes into strict JSON for a topic editor.
Return ONLY JSON with this exact shape:
{
  "topicName": "string",
  "overview": "string",
  "referenceBook": "string",
  "jambFocus": ["string"],
  "learningGoals": ["string"],
  "prerequisites": ["string"],
  "relatedTopics": ["string"],
  "revisionPriority": "low|medium|high|critical",
  "sections": [
    {
      "sectionTitle": "string",
      "order": 0,
      "definition": "string",
      "explanation": "string",
      "examples": ["string"],
      "jambPoint": "string",
      "quickTip": "string",
      "aiExplanation": { "paragraphs": ["string"] }
    }
  ]
}
Rules:
- Keep sections concise and exam-focused.
- aiExplanation.paragraphs must have at least one paragraph per section.
- Do not include markdown.

Topic Name: ${topicName || "Unknown"}
Notes:
${extractedText.slice(0, 18000)}
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    return fallbackStructured;
  }

  const body = await response.json().catch(() => ({}));
  const candidateText = body?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const parsed = extractJsonFromText(candidateText);
  if (!parsed || typeof parsed !== "object") {
    return fallbackStructured;
  }

  const sections = Array.isArray(parsed.sections)
    ? parsed.sections
        .map((section, index) => ({
          sectionTitle: String(section?.sectionTitle || "").trim(),
          order: Number.isFinite(Number(section?.order)) ? Number(section.order) : index,
          definition: String(section?.definition || "").trim(),
          explanation: String(section?.explanation || "").trim(),
          examples: normalizeLineList(section?.examples),
          jambPoint: String(section?.jambPoint || "").trim(),
          quickTip: String(section?.quickTip || "").trim(),
          aiExplanation: {
            paragraphs: normalizeLineList(section?.aiExplanation?.paragraphs),
          },
        }))
        .filter((section) => section.sectionTitle)
    : [];

  if (sections.length === 0) {
    return fallbackStructured;
  }

  const merged = {
    ...fallbackStructured,
    topicName: String(parsed.topicName || fallbackStructured.topicName || "").trim(),
    overview: String(parsed.overview || fallbackStructured.overview || "").trim(),
    referenceBook: String(parsed.referenceBook || fallbackStructured.referenceBook || "").trim(),
    jambFocus: normalizeLineList(parsed.jambFocus),
    learningGoals: normalizeLineList(parsed.learningGoals),
    prerequisites: normalizeLineList(parsed.prerequisites),
    relatedTopics: normalizeLineList(parsed.relatedTopics),
    revisionPriority: ["low", "medium", "high", "critical"].includes(String(parsed.revisionPriority || "").toLowerCase())
      ? String(parsed.revisionPriority).toLowerCase()
      : fallbackStructured.revisionPriority,
    sections,
  };

  const firstSection = merged.sections[0];
  merged.highYieldSummary = merged.overview || fallbackStructured.highYieldSummary;
  merged.simpleExplanation = firstSection?.explanation || merged.overview || fallbackStructured.simpleExplanation;
  merged.keyDefinitions = merged.sections.map((section) => section.definition).filter(Boolean).slice(0, 8);
  merged.importantFormulasFacts = merged.sections.map((section) => section.jambPoint).filter(Boolean).slice(0, 8);
  merged.aiExplanations = {
    ...fallbackStructured.aiExplanations,
    paragraphs: firstSection?.aiExplanation?.paragraphs || fallbackStructured.aiExplanations?.paragraphs || [],
  };

  return merged;
}

export const parseTopicNoteFile = async (req, res) => {
  try {
    const topicName = normalizeText(req.body?.topicName);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Please upload a note file in PDF or DOCX format." });
    }

    const extractedText = await extractTextFromNoteFile(file);
    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({ error: "Unable to extract enough text from the uploaded note file." });
    }

    const fallbackStructured = parseTopicNoteHeuristics({ topicName, sourceText: extractedText });
    const structured = await enrichTopicNoteWithGemini({
      topicName,
      extractedText,
      fallbackStructured,
    });

    return res.status(200).json({
      message: "Note parsed successfully.",
      data: structured,
      meta: {
        fileName: file.originalname,
        usedGemini: Boolean(process.env.GEMINI_API_KEY),
      },
    });
  } catch (error) {
    console.error("Parse topic note file error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to parse note file.",
    });
  }
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
