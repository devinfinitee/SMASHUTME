import Topic from "../models/topic.model.js";
import Subject from "../models/subject.model.js";
import QuizSession from "../models/quizSession.model.js";
import { slugify } from "../models/schemaUtils.js";
import { computeProjectedScoreMetrics } from "../lib/projectedScore.js";

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

function normalizeParagraphArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  const text = normalizeText(value);
  if (!text) return [];

  return text
    .split(/\n{2,}/)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function normalizeSections(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((section, index) => {
      const sectionTitle = normalizeText(section?.sectionTitle || section?.title || section?.heading);
      const sectionSlug = normalizeText(section?.sectionSlug || section?.slug).toLowerCase();
      const explanation = normalizeText(section?.explanation || section?.body || section?.content);
      const definition = normalizeText(section?.definition);
      const jambPoint = normalizeText(section?.jambPoint || section?.jambNote);
      const quickTip = normalizeText(section?.quickTip || section?.tip);
      const illustrationImageUrl = normalizeText(section?.illustrationImageUrl || section?.image || section?.imageUrl);
      const mnemonic = normalizeText(section?.mnemonic);
      const aiExplanationSource = section?.aiExplanation || section?.aiExplanations || {};
      const examples = normalizeStringArray(section?.examples || section?.exampleList);
      const commonMistakes = normalizeStringArray(section?.commonMistakes || section?.mistakes);
      const relatedSections = normalizeStringArray(section?.relatedSections);
      const tags = normalizeStringArray(section?.tags);
      const aiExplanation = {
        whyCorrectIsCorrect: normalizeText(aiExplanationSource?.whyCorrectIsCorrect),
        whyOthersAreWrong: normalizeText(aiExplanationSource?.whyOthersAreWrong),
        simpleBreakdown: normalizeText(aiExplanationSource?.simpleBreakdown),
        paragraphs: normalizeParagraphArray(aiExplanationSource?.paragraphs || section?.aiExplanationParagraphs),
      };

      return {
        sectionTitle,
        sectionSlug: sectionSlug || slugify(sectionTitle || `section-${index + 1}`),
        order: Number(section?.order ?? index),
        definition,
        explanation,
        aiExplanation,
        examples,
        jambPoint,
        commonMistakes,
        quickTip,
        illustrationImageUrl,
        mnemonic,
        relatedSections,
        tags,
      };
    })
    .filter((section) => Boolean(section.sectionTitle));
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

export const getTopicBySlug = async (req, res) => {
  try {
    const slug = normalizeText(req.params.slug).toLowerCase();

    if (!slug) {
      return res.status(400).json({ error: "Topic slug is required." });
    }

    const topic = await Topic.findOne({ slug, status: { $ne: "archived" } })
      .populate("subject", "name slug code icon description examCategory")
      .populate("prerequisiteTopics", "name slug summary");

    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    return res.json({ topic });
  } catch (error) {
    console.error("Get topic by slug error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to fetch topic.",
    });
  }
};

export const createTopic = async (req, res) => {
  try {
    const {
      subject,
      topicName,
      heading,
      referenceBook,
      jambFocus,
      overview,
      highYieldSummary,
      keyDefinitions,
      simpleExplanation,
      importantFormulasFacts,
      aiExplanations,
      sections,
      learningGoals,
      prerequisites,
      relatedTopics,
      revisionPriority,
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
    const normalizedReferenceBook = normalizeText(referenceBook);
    const parsedJambFocus = normalizeStringArray(jambFocus);
    const normalizedOverview = normalizeText(overview);
    const normalizedHighYieldSummary = normalizeText(highYieldSummary || summary);
    const normalizedSimpleExplanation = normalizeText(simpleExplanation || content);
    const normalizedYieldClass = normalizeText(yieldClass);
    const parsedKeyDefinitions = normalizeStringArray(keyDefinitions);
    const parsedImportantFormulasFacts = normalizeStringArray(importantFormulasFacts);
    const parsedLearningGoals = normalizeStringArray(learningGoals);
    const parsedPrerequisites = normalizeStringArray(prerequisites);
    const parsedRelatedTopics = normalizeStringArray(relatedTopics);
    const normalizedRevisionPriority = normalizeText(revisionPriority).toLowerCase();
    const parsedSections = normalizeSections(sections);
    const parsedAiExplanations = {
      whyCorrectIsCorrect: normalizeText(aiExplanations?.whyCorrectIsCorrect),
      whyOthersAreWrong: normalizeText(aiExplanations?.whyOthersAreWrong),
      simpleBreakdown: normalizeText(aiExplanations?.simpleBreakdown),
      paragraphs: normalizeParagraphArray(aiExplanations?.paragraphs),
    };
    const isStructuredNote = parsedSections.length > 0;

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

    if (isStructuredNote) {
      if (parsedSections.length === 0) {
        fieldErrors.sections = "Add at least one section.";
      }

      parsedSections.forEach((section, index) => {
        if (!section.explanation && !section.definition) {
          fieldErrors[`sections.${index}.explanation`] = "Each section needs a definition or explanation.";
        }

        if (section.aiExplanation?.paragraphs?.length === 0) {
          fieldErrors[`sections.${index}.aiExplanation`] = "Each section needs at least one AI explanation paragraph.";
        }
      });
    } else {
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
    }

    if (!["foundational", "high", "low"].includes(normalizedYieldClass)) {
      fieldErrors.yieldClass = "Please choose a valid yield class.";
    }

    if (normalizedRevisionPriority && !["low", "medium", "high", "critical"].includes(normalizedRevisionPriority)) {
      fieldErrors.revisionPriority = "Please choose a valid revision priority.";
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
    const topicSummary = normalizedHighYieldSummary || normalizedOverview || normalizedSimpleExplanation.slice(0, 180) || parsedSections[0]?.explanation?.slice(0, 180) || null;
    const topicContent = normalizedSimpleExplanation || normalizedOverview || parsedSections[0]?.explanation || null;
    const topicAiExplanations = {
      ...parsedAiExplanations,
      paragraphs: parsedAiExplanations.paragraphs.length > 0
        ? parsedAiExplanations.paragraphs
        : parsedSections.flatMap((section) => section.aiExplanation?.paragraphs || []),
    };

    const topic = await Topic.create({
      subject: subjectDoc._id,
      name: normalizedTopicName,
      slug,
      referenceBook: normalizedReferenceBook || null,
      jambFocus: parsedJambFocus,
      overview: normalizedOverview || null,
      learningGoals: parsedLearningGoals,
      prerequisites: parsedPrerequisites,
      relatedTopics: parsedRelatedTopics,
      revisionPriority: normalizedRevisionPriority || "medium",
      sections: parsedSections,
      summary: topicSummary,
      content: topicContent,
      highYieldSummary: normalizedHighYieldSummary,
      keyDefinitions: parsedKeyDefinitions,
      simpleExplanation: normalizedSimpleExplanation,
      importantFormulasFacts: parsedImportantFormulasFacts,
      aiExplanations: topicAiExplanations,
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

export const updateTopicProgress = async (req, res) => {
  try {
    const { status } = req.body || {};
    const normalizedStatus = typeof status === "string" ? status.trim() : "";

    const topic = await Topic.findOne({ slug: req.params.slug }).populate("subject", "name slug code icon");

    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const subjectId = String(topic.subject?._id || topic.subject);
    const currentProgress = Array.isArray(req.user.subjectProgress) ? [...req.user.subjectProgress] : [];
    const existingIndex = currentProgress.findIndex((entry) => String(entry.subject?._id || entry.subject) === subjectId);
    const existingEntry = existingIndex >= 0 ? currentProgress[existingIndex] : null;
    const now = new Date();

    const updatedEntry = {
      subject: topic.subject?._id || topic.subject,
      proficiency: existingEntry?.proficiency || 0,
      questionsAnswered: Number(existingEntry?.questionsAnswered) || 0,
      questionsCorrect: Number(existingEntry?.questionsCorrect) || 0,
      accuracy: Number(existingEntry?.accuracy) || 0,
      topicsCovered: Number(existingEntry?.topicsCovered) || 0,
      status: existingEntry?.status || "on-track",
      timeSpentMinutes: Number(existingEntry?.timeSpentMinutes) || 0,
      lastStudiedAt: now,
      updatedAt: now,
    };

    if (normalizedStatus === "completed") {
      updatedEntry.topicsCovered += 1;
      updatedEntry.proficiency = Math.min(100, Math.max(updatedEntry.proficiency, 70));
      updatedEntry.status = "mastered";
      updatedEntry.questionsAnswered += 1;
      updatedEntry.questionsCorrect += 1;
    } else if (normalizedStatus === "in_progress") {
      updatedEntry.proficiency = Math.min(100, Math.max(updatedEntry.proficiency, 15));
      updatedEntry.status = updatedEntry.proficiency >= 80 ? "mastered" : updatedEntry.proficiency <= 40 ? "weak" : "on-track";
      updatedEntry.questionsAnswered += 1;
    } else if (normalizedStatus === "not_started") {
      updatedEntry.status = updatedEntry.proficiency >= 80 ? "mastered" : updatedEntry.proficiency <= 40 ? "weak" : "on-track";
    } else {
      return res.status(400).json({ error: "status must be not_started, in_progress, or completed." });
    }

    if (existingIndex >= 0) {
      currentProgress[existingIndex] = updatedEntry;
    } else {
      currentProgress.push(updatedEntry);
    }

    req.user.subjectProgress = currentProgress;
    req.user.dashboard = req.user.dashboard || {};
    req.user.dashboard.lastUpdatedAt = now;
    req.user.dashboard.completedQuestions = Number(req.user.dashboard.completedQuestions || 0) + (normalizedStatus === "completed" ? 1 : 0);
    req.user.dashboard.highYieldTopicsCount = Number(req.user.dashboard.highYieldTopicsCount || 0);

    const subjectIdsFromSelection = Array.isArray(req.user.selectedSubjects)
      ? req.user.selectedSubjects.map((item) => item?._id || item).filter(Boolean)
      : [];
    const subjectIdsFromProgress = Array.isArray(req.user.subjectProgress)
      ? req.user.subjectProgress.map((entry) => entry?.subject?._id || entry?.subject).filter(Boolean)
      : [];
    const uniqueSubjectIds = Array.from(
      new Set([...subjectIdsFromSelection, ...subjectIdsFromProgress].map((item) => String(item))),
    );

    const [recentSubmittedSessions, totalTopics] = await Promise.all([
      QuizSession.find({ user: req.user._id, status: "submitted" })
        .sort({ submittedAt: -1, createdAt: -1 })
        .limit(12)
        .select("mode accuracy submittedAt createdAt")
        .lean(),
      uniqueSubjectIds.length > 0
        ? Topic.countDocuments({ subject: { $in: uniqueSubjectIds } })
        : Promise.resolve(0),
    ]);

    const metrics = computeProjectedScoreMetrics({
      subjectProgressEntries: req.user.subjectProgress || [],
      recentSessions: recentSubmittedSessions,
      totalTopics,
      totalTimeSpentMinutes: req.user.dashboard.totalTimeSpentMinutes || 0,
      totalDrillsCompleted: req.user.dashboard.totalDrillsCompleted || 0,
      studyTimeBand: req.user.onboarding?.baseline?.studyTime || null,
    });

    req.user.dashboard.averageAccuracy = metrics.averageAccuracyPercent;
    req.user.dashboard.projectedScore = metrics.projectedScore;
    req.user.dashboard.percentile = metrics.percentile;
    req.user.dashboard.studyMomentumPercent = metrics.readinessPercent;

    await req.user.save();

    return res.json({
      message: "Topic progress updated.",
      slug: req.params.slug,
      status: normalizedStatus,
      subject: topic.subject,
      subjectProgress: updatedEntry,
    });
  } catch (error) {
    console.error("Update topic progress error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to update topic progress.",
    });
  }
};
