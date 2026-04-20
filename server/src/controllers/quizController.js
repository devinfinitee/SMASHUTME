import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Question from "../models/question.model.js";
import PastQuestion from "../models/pastQuestion.model.js";
import QuizSession from "../models/quizSession.model.js";

function normalizeText(value) {
  return String(value || "").trim();
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mapQuestionDoc(doc, sourceModel) {
  return {
    questionId: String(doc._id),
    sourceModel,
    subject: doc.subject?.name || "General",
    topic: doc.topic?.name || "General Topic",
    content: doc.content,
    options: {
      A: doc.options?.A || "",
      B: doc.options?.B || "",
      C: doc.options?.C || "",
      D: doc.options?.D || "",
    },
    correctOption: doc.correctOption,
    explanation: doc.explanation || null,
  };
}

function buildSyntheticQuestions(subjectLabel, count) {
  const base = [
    {
      topic: "Exam Strategy",
      content: "Which approach is best when you cannot solve a question quickly in a timed CBT?",
      options: {
        A: "Spend all remaining time on that one question",
        B: "Skip, mark it, and return after easier questions",
        C: "End the exam immediately",
        D: "Randomly choose without reading options",
      },
      correctOption: "B",
      explanation: "Skipping and returning later protects your overall score pacing.",
    },
    {
      topic: "Accuracy",
      content: "What most improves CBT accuracy over time?",
      options: {
        A: "Memorizing option letters",
        B: "Post-exam error review and concept correction",
        C: "Ignoring difficult topics",
        D: "Reducing total practice attempts",
      },
      correctOption: "B",
      explanation: "Error analysis helps convert repeated mistakes into strengths.",
    },
    {
      topic: "Time Management",
      content: "A strong timing strategy during CBT is to:",
      options: {
        A: "Use checkpoint-based pacing",
        B: "Spend equal time regardless of difficulty",
        C: "Answer only your favorite subject",
        D: "Avoid reviewing marked questions",
      },
      correctOption: "A",
      explanation: "Checkpoints help you balance speed and accuracy across the full paper.",
    },
  ];

  const result = [];
  for (let i = 0; i < count; i += 1) {
    const item = base[i % base.length];
    result.push({
      questionId: `synthetic-${subjectLabel}-${i + 1}`,
      sourceModel: "Synthetic",
      subject: subjectLabel,
      topic: item.topic,
      content: item.content,
      options: item.options,
      correctOption: item.correctOption,
      explanation: item.explanation,
    });
  }

  return result;
}

async function resolveSubject(subjectSlug, subjectName) {
  const slug = normalizeText(subjectSlug);
  const name = normalizeText(subjectName);

  if (slug) {
    const bySlug = await Subject.findOne({ slug });
    if (bySlug) {
      return bySlug;
    }
  }

  if (name) {
    const byName = await Subject.findOne({ name });
    if (byName) {
      return byName;
    }
  }

  return null;
}

function summarizeBySubject(results) {
  const buckets = new Map();

  results.forEach((item) => {
    const current = buckets.get(item.subject) || { total: 0, correct: 0 };
    current.total += 1;
    if (item.isCorrect) {
      current.correct += 1;
    }
    buckets.set(item.subject, current);
  });

  return Array.from(buckets.entries()).map(([subject, stats]) => ({
    subject,
    total: stats.total,
    correct: stats.correct,
    score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

export const createQuizSession = async (req, res) => {
  try {
    const {
      mode = "drill",
      questionCount = 20,
      durationMinutes = 20,
      subjectSlug,
      subjectName,
      highYieldOnly = false,
    } = req.body || {};

    const fieldErrors = {};
    const normalizedMode = normalizeText(mode);
    const parsedQuestionCount = Number(questionCount);
    const parsedDurationMinutes = Number(durationMinutes);

    if (!["drill", "mock"].includes(normalizedMode)) {
      fieldErrors.mode = "mode must be either drill or mock.";
    }

    if (Number.isNaN(parsedQuestionCount) || parsedQuestionCount < 5 || parsedQuestionCount > 120) {
      fieldErrors.questionCount = "questionCount must be between 5 and 120.";
    }

    if (Number.isNaN(parsedDurationMinutes) || parsedDurationMinutes < 5 || parsedDurationMinutes > 180) {
      fieldErrors.durationMinutes = "durationMinutes must be between 5 and 180.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        error: "Invalid CBT configuration.",
        fieldErrors,
      });
    }

    const subjectDoc = await resolveSubject(subjectSlug, subjectName);
    const isDrill = normalizedMode === "drill";
    const drillSubjectLabel = normalizeText(subjectName) || "Mixed Subjects";

    const topicFilter = {};
    if (subjectDoc?._id) {
      topicFilter.subject = subjectDoc._id;
    }

    if (highYieldOnly) {
      topicFilter.isHighYield = true;
    }

    const topicDocs = await Topic.find(topicFilter).select("_id name");
    const topicIds = topicDocs.map((topic) => topic._id);

    const questionFilter = {
      status: { $ne: "archived" },
    };
    if (subjectDoc?._id) {
      questionFilter.subject = subjectDoc._id;
    }
    if (highYieldOnly) {
      questionFilter.topic = { $in: topicIds.length > 0 ? topicIds : [null] };
    }

    const baseQuestions = await Question.find(questionFilter)
      .populate("subject", "name")
      .populate("topic", "name")
      .select("content options correctOption explanation subject topic")
      .limit(parsedQuestionCount * 4);

    const pastQuestionFilter = {
      status: { $ne: "archived" },
    };
    if (subjectDoc?._id) {
      pastQuestionFilter.subject = subjectDoc._id;
    }
    if (highYieldOnly) {
      pastQuestionFilter.topic = { $in: topicIds.length > 0 ? topicIds : [null] };
    }

    const pastQuestions = await PastQuestion.find(pastQuestionFilter)
      .populate("subject", "name")
      .populate("topic", "name")
      .select("content options correctOption explanation subject topic")
      .limit(parsedQuestionCount * 4);

    const mapped = [
      ...baseQuestions.map((item) => mapQuestionDoc(item, "Question")),
      ...pastQuestions.map((item) => mapQuestionDoc(item, "PastQuestion")),
    ];

    const shuffled = shuffleArray(mapped);
    let selectedQuestions = shuffled.slice(0, parsedQuestionCount);

    if (selectedQuestions.length < parsedQuestionCount) {
      const fallbackSubject = subjectDoc?.name || (isDrill ? drillSubjectLabel : normalizeText(subjectName) || "Mixed Subjects");
      const synthetic = buildSyntheticQuestions(fallbackSubject, parsedQuestionCount - selectedQuestions.length);
      selectedQuestions = [...selectedQuestions, ...synthetic];
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + parsedDurationMinutes * 60 * 1000);
    const subjectLabel = subjectDoc?.name || normalizeText(subjectName) || "Mixed Subjects";

    const session = await QuizSession.create({
      user: req.user._id,
      mode: normalizedMode,
      subject: subjectDoc?._id || null,
      subjectLabel,
      questionCount: parsedQuestionCount,
      durationMinutes: parsedDurationMinutes,
      highYieldOnly: Boolean(highYieldOnly),
      startedAt: now,
      expiresAt,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length,
    });

    return res.status(201).json({
      message: "Quiz session created successfully.",
      sessionId: String(session._id),
      mode: session.mode,
      subjectLabel,
      questionCount: session.questions.length,
      durationMinutes: session.durationMinutes,
      expiresAt: session.expiresAt,
      questions: session.questions.map((question) => ({
        id: question.questionId,
        subject: question.subject,
        topic: question.topic,
        prompt: question.content,
        options: question.options,
        correctOption: question.correctOption,
        explanation: question.explanation,
      })),
    });
  } catch (error) {
    console.error("Create quiz session error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to create quiz session.",
    });
  }
};

export const submitQuizSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers = {}, flaggedQuestionIds = [], timeSpentSeconds = 0 } = req.body || {};

    const session = await QuizSession.findOne({ _id: sessionId, user: req.user._id });

    if (!session) {
      return res.status(404).json({ error: "Quiz session not found." });
    }

    if (session.status === "submitted") {
      return res.status(409).json({ error: "Quiz session already submitted." });
    }

    const normalizedAnswers = typeof answers === "object" && answers !== null ? answers : {};
    const validOptions = new Set(["A", "B", "C", "D"]);

    const results = session.questions.map((question) => {
      const selectedOptionRaw = normalizedAnswers[question.questionId] || null;
      const selectedOption = validOptions.has(selectedOptionRaw) ? selectedOptionRaw : null;
      const isCorrect = selectedOption === question.correctOption;

      return {
        questionId: question.questionId,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
        subject: question.subject,
        topic: question.topic,
      };
    });

    const score = results.filter((item) => item.isCorrect).length;
    const totalQuestions = results.length;
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const subjectBreakdown = summarizeBySubject(results);
    const safeTimeSpent = Math.max(0, Number(timeSpentSeconds) || 0);

    session.answers = normalizedAnswers;
    session.flaggedQuestionIds = Array.isArray(flaggedQuestionIds)
      ? flaggedQuestionIds.map((item) => String(item)).filter(Boolean)
      : [];
    session.score = score;
    session.totalQuestions = totalQuestions;
    session.accuracy = accuracy;
    session.timeSpentSeconds = safeTimeSpent;
    session.status = "submitted";
    session.submittedAt = new Date();
    session.results = results;
    await session.save();

    const paceSeconds = totalQuestions > 0 ? Math.max(20, Math.round(safeTimeSpent / totalQuestions)) : 0;
    const percentileLabel = accuracy >= 85 ? "Top 3%" : accuracy >= 70 ? "Top 8%" : "Top 20%";
    const projectedAggregate = Math.round(220 + (accuracy / 100) * 120);

    return res.json({
      message: "Quiz submitted successfully.",
      sessionId: String(session._id),
      score,
      totalQuestions,
      accuracy,
      paceSeconds,
      percentileLabel,
      projectedAggregate,
      subjectBreakdown,
      questionResults: results,
    });
  } catch (error) {
    console.error("Submit quiz session error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to submit quiz session.",
    });
  }
};
