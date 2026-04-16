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
    const { subject, heading, content, yieldClass, summary, commonTraps, order, status } = req.body || {};
    const fieldErrors = {};

    const normalizedSubject = normalizeText(subject);
    const normalizedHeading = normalizeText(heading);
    const normalizedContent = normalizeText(content);
    const normalizedYieldClass = normalizeText(yieldClass);

    if (!normalizedSubject) {
      fieldErrors.subject = "Please select a subject.";
    } else if (!ALLOWED_SUBJECTS.has(normalizedSubject)) {
      fieldErrors.subject = "The selected subject is not supported.";
    }

    if (!normalizedHeading) {
      fieldErrors.heading = "Topic heading is required.";
    } else if (normalizedHeading.length < 3) {
      fieldErrors.heading = "Topic heading must be at least 3 characters.";
    } else if (normalizedHeading.length > 180) {
      fieldErrors.heading = "Topic heading must be 180 characters or less.";
    }

    if (!normalizedContent) {
      fieldErrors.content = "Topic content is required.";
    } else if (normalizedContent.length < 20) {
      fieldErrors.content = "Topic content must be at least 20 characters.";
    }

    if (!["foundational", "high", "low"].includes(normalizedYieldClass)) {
      fieldErrors.yieldClass = "Please choose a valid yield class.";
    }

    const parsedOrder = order === undefined || order === null || order === "" ? 0 : Number(order);
    if (Number.isNaN(parsedOrder) || parsedOrder < 0) {
      fieldErrors.order = "Topic order must be a non-negative number.";
    }

    const parsedCommonTraps = Array.isArray(commonTraps)
      ? commonTraps.map((item) => normalizeText(item)).filter(Boolean)
      : [];

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json(buildTopicErrorResponse(fieldErrors, "Please fix the highlighted topic fields."));
    }

    const subjectDoc = await getOrCreateSubject(normalizedSubject);
    const slug = slugify(normalizedHeading);

    const existingTopic = await Topic.findOne({ subject: subjectDoc._id, slug });
    if (existingTopic) {
      return res.status(409).json(buildTopicErrorResponse({ heading: "A topic with this heading already exists for the selected subject." }, "Topic already exists."));
    }

    const yieldMapping = mapYieldClass(normalizedYieldClass);
    const topicSummary = normalizeText(summary) || normalizedContent.slice(0, 180);

    const topic = await Topic.create({
      subject: subjectDoc._id,
      name: normalizedHeading,
      slug,
      summary: topicSummary,
      content: normalizedContent,
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
