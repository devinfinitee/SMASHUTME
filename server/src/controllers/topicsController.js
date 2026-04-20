import Topic from "../models/topic.model.js";
import Subject from "../models/subject.model.js";
import { slugify } from "../models/schemaUtils.js";

const ALLOWED_SUBJECTS = new Set([
  "Use of English",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Government",
  "Literature in English",
  "CRK",
  "IRK",
  "Geography",
  "Commerce",
  "Accounting",
  "Agricultural Science",
  "History",
  "French",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Arabic",
  "Music",
  "Fine Arts",
  "Computer Studies",
  "Home Economics",
  "Technical Drawing",
  "Civic Education",
]);

function buildTopicErrorResponse(fieldErrors, fallbackMessage) {
  return {
    error: fallbackMessage,
    fieldErrors,
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeText(item)).filter(Boolean);
}

function mapYieldClass(yieldClass) {
  if (yieldClass === "foundational") {
    return { isHighYield: false, difficultyLevel: "easy" };
  }

  if (yieldClass === "low") {
    return { isHighYield: false, difficultyLevel: "hard" };
  }

  return { isHighYield: true, difficultyLevel: "medium" };
}

async function getOrCreateSubject(subjectName) {
  const normalizedSubjectName = normalizeText(subjectName);
  const slug = slugify(normalizedSubjectName);

  let subject = await Subject.findOne({ slug });

  if (!subject) {
    subject = await Subject.findOne({ name: normalizedSubjectName });
  }

  if (!subject) {
    subject = await Subject.create({
      name: normalizedSubjectName,
      slug,
      isCore: normalizedSubjectName === "Use of English",
      isActive: true,
      metadata: {
        questionCount: 0,
        topicCount: 0,
        totalPastQuestions: 0,
      },
    });
  }

  return subject;
}

export const getTopicBySlug = (req, res) => {
  res.json({
    message: "Topic endpoint ready",
    slug: req.params.slug,
  });
};

export const createTopic = async (req, res) => {
  try {
    const {
      subject,
      topicName,
      heading,
      highYieldSummary,
      keyDefinitions,
      simpleExplanation,
      importantFormulasFacts,
      aiExplanations,
      yieldClass,
      summary,
      content,
      commonTraps,
      order,
      status,
    } = req.body || {};
    const fieldErrors = {};

    const normalizedSubject = normalizeText(subject);
    const normalizedTopicName = normalizeText(topicName || heading);
    const normalizedHighYieldSummary = normalizeText(highYieldSummary || summary);
    const normalizedSimpleExplanation = normalizeText(simpleExplanation || content);
    const normalizedYieldClass = normalizeText(yieldClass);
    const parsedKeyDefinitions = normalizeStringArray(keyDefinitions);
    const parsedImportantFormulasFacts = normalizeStringArray(importantFormulasFacts);
    const parsedAiExplanations = {
      whyCorrectIsCorrect: normalizeText(aiExplanations?.whyCorrectIsCorrect),
      whyOthersAreWrong: normalizeText(aiExplanations?.whyOthersAreWrong),
      simpleBreakdown: normalizeText(aiExplanations?.simpleBreakdown),
    };

    if (!normalizedSubject) {
      fieldErrors.subject = "Please select a subject.";
    } else if (!ALLOWED_SUBJECTS.has(normalizedSubject)) {
      fieldErrors.subject = "The selected subject is not supported.";
    }

    if (!normalizedTopicName) {
      fieldErrors.topicName = "Topic name is required.";
    } else if (normalizedTopicName.length < 3) {
      fieldErrors.topicName = "Topic name must be at least 3 characters.";
    } else if (normalizedTopicName.length > 180) {
      fieldErrors.topicName = "Topic name must be 180 characters or less.";
    }

    if (!normalizedHighYieldSummary) {
      fieldErrors.highYieldSummary = "High-yield summary is required.";
    }

    if (parsedKeyDefinitions.length === 0) {
      fieldErrors.keyDefinitions = "Add at least one key definition.";
    }

    if (!normalizedSimpleExplanation) {
      fieldErrors.simpleExplanation = "Simple explanation is required.";
    } else if (normalizedSimpleExplanation.length < 20) {
      fieldErrors.simpleExplanation = "Simple explanation must be at least 20 characters.";
    }

    if (parsedImportantFormulasFacts.length === 0) {
      fieldErrors.importantFormulasFacts = "Add at least one important formula or fact.";
    }

    if (!parsedAiExplanations.whyCorrectIsCorrect) {
      fieldErrors.whyCorrectIsCorrect = "Why correct answer is correct is required.";
    }

    if (!parsedAiExplanations.whyOthersAreWrong) {
      fieldErrors.whyOthersAreWrong = "Why others are wrong is required.";
    }

    if (!parsedAiExplanations.simpleBreakdown) {
      fieldErrors.simpleBreakdown = "Simple breakdown is required.";
    }

    if (!["foundational", "high", "low"].includes(normalizedYieldClass)) {
      fieldErrors.yieldClass = "Please choose a valid yield class.";
    }

    const parsedOrder = order === undefined || order === null || order === "" ? 0 : Number(order);
    if (Number.isNaN(parsedOrder) || parsedOrder < 0) {
      fieldErrors.order = "Topic order must be a non-negative number.";
    }

    const parsedCommonTraps = normalizeStringArray(commonTraps);

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json(buildTopicErrorResponse(fieldErrors, "Please fix the highlighted topic fields."));
    }

    const subjectDoc = await getOrCreateSubject(normalizedSubject);
    const slug = slugify(normalizedTopicName);

    const existingTopic = await Topic.findOne({ subject: subjectDoc._id, slug });
    if (existingTopic) {
      return res.status(409).json(buildTopicErrorResponse({ topicName: "A topic with this name already exists for the selected subject." }, "Topic already exists."));
    }

    const yieldMapping = mapYieldClass(normalizedYieldClass);
    const topicSummary = normalizedHighYieldSummary || normalizedSimpleExplanation.slice(0, 180);

    const topic = await Topic.create({
      subject: subjectDoc._id,
      name: normalizedTopicName,
      slug,
      summary: topicSummary,
      content: normalizedSimpleExplanation,
      highYieldSummary: normalizedHighYieldSummary,
      keyDefinitions: parsedKeyDefinitions,
      simpleExplanation: normalizedSimpleExplanation,
      importantFormulasFacts: parsedImportantFormulasFacts,
      aiExplanations: parsedAiExplanations,
      commonTraps: parsedCommonTraps,
      order: parsedOrder,
      status: status && ["draft", "active", "archived"].includes(status) ? status : "active",
      ...yieldMapping,
    });

    subjectDoc.metadata.topicCount = Number(subjectDoc.metadata?.topicCount || 0) + 1;
    await subjectDoc.save();

    const populatedTopic = await Topic.findById(topic._id).populate("subject", "name slug code icon");

    return res.status(201).json({
      message: "Topic saved successfully.",
      topic: populatedTopic,
    });
  } catch (error) {
    console.error("Create topic error:", error);

    if (error?.code === 11000) {
      return res.status(409).json(buildTopicErrorResponse({}, "A topic with this subject and heading already exists."));
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to save topic.",
    });
  }
};

export const updateTopicProgress = (req, res) => {
  const { status } = req.body || {};

  res.json({
    message: "Topic progress endpoint ready",
    slug: req.params.slug,
    status: status || null,
  });
};
