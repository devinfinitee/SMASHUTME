import QuizSession from "../models/quizSession.model.js";
import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";

function normalizeText(value) {
  return String(value || "").trim();
}

function formatSeconds(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}s`;
}

function generateWrongPath(selectedOption, correctOption) {
  return `You selected option ${selectedOption || "-"}, but the concept required option ${correctOption}. Re-check the key qualifier in the stem and eliminate distractors before committing.`;
}

function generateFoundation(topic) {
  return `Rebuild from the core idea of ${topic || "this topic"}: identify the governing rule first, then test each option against that rule before deciding.`;
}

function generateMnemonic(topic) {
  const cleaned = normalizeText(topic);
  if (!cleaned) {
    return "Rule first, options second.";
  }

  const letters = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return `${letters || "TOP"}: Think, Observe, Prove.`;
}

function buildReviewQuestion({ question, result, averageQuestionSeconds, questionFailRate }) {
  return {
    id: `${question.questionId}-${result.questionId}`,
    subject: question.subject,
    topic: question.topic,
    prompt: question.content,
    options: Object.entries(question.options || {}).map(([key, text]) => ({ key, text })),
    chosen: result.selectedOption || "-",
    correct: result.correctOption,
    timeSpent: formatSeconds(Math.round(averageQuestionSeconds)),
    difficulty: questionFailRate > 55 ? "Hard" : questionFailRate > 35 ? "Medium" : "Easy",
    failRate: `${questionFailRate}%`,
    wrongPath: generateWrongPath(result.selectedOption, result.correctOption),
    foundation: generateFoundation(question.topic),
    mnemonic: generateMnemonic(question.topic),
  };
}

export const getAiReviewQueue = async (req, res) => {
  try {
    const subjectSlug = normalizeText(req.query.subjectSlug);
    const topicSlug = normalizeText(req.query.topicSlug);

    const sessions = await QuizSession.find({
      user: req.user._id,
      status: "submitted",
    })
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(30)
      .select("questions results timeSpentSeconds totalQuestions submittedAt");

    if (!sessions.length) {
      return res.json({
        message: "No submitted CBT sessions yet.",
        questions: [],
      });
    }

    const allWrongResults = [];

    sessions.forEach((session) => {
      const totalQuestions = Number(session.totalQuestions || session.questions?.length || 1);
      const avgSeconds = Math.max(20, Math.round(Number(session.timeSpentSeconds || 0) / Math.max(1, totalQuestions)));
      const results = Array.isArray(session.results) ? session.results : [];

      results.forEach((result) => {
        if (result.isCorrect) {
          return;
        }

        const matchedQuestion = (session.questions || []).find((q) => q.questionId === result.questionId);
        if (!matchedQuestion) {
          return;
        }

        allWrongResults.push({
          question: matchedQuestion,
          result,
          averageQuestionSeconds: avgSeconds,
          submittedAt: session.submittedAt || session.createdAt,
        });
      });
    });

    if (!allWrongResults.length) {
      return res.json({
        message: "No incorrect questions found in recent sessions.",
        questions: [],
      });
    }

    let subjectNameFilter = "";
    if (subjectSlug) {
      const subjectDoc = await Subject.findOne({ slug: subjectSlug }).select("name");
      subjectNameFilter = subjectDoc?.name || "";
    }

    let topicNameFilter = "";
    if (topicSlug) {
      const topicDoc = await Topic.findOne({ slug: topicSlug }).select("name");
      topicNameFilter = topicDoc?.name || "";
    }

    const filtered = allWrongResults.filter((entry) => {
      const matchesSubject = !subjectNameFilter || normalizeText(entry.question.subject).toLowerCase() === normalizeText(subjectNameFilter).toLowerCase();
      const matchesTopic = !topicNameFilter || normalizeText(entry.question.topic).toLowerCase() === normalizeText(topicNameFilter).toLowerCase();
      return matchesSubject && matchesTopic;
    });

    const pool = filtered.length > 0 ? filtered : allWrongResults;

    const questionAttempts = new Map();
    pool.forEach((entry) => {
      const key = entry.question.questionId;
      const bucket = questionAttempts.get(key) || { total: 0, wrong: 0 };
      bucket.total += 1;
      bucket.wrong += 1;
      questionAttempts.set(key, bucket);
    });

    const questions = pool
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 15)
      .map((entry) => {
        const stats = questionAttempts.get(entry.question.questionId) || { total: 1, wrong: 1 };
        const failRate = Math.max(1, Math.min(99, Math.round((stats.wrong / Math.max(1, stats.total)) * 100)));
        return buildReviewQuestion({
          question: entry.question,
          result: entry.result,
          averageQuestionSeconds: entry.averageQuestionSeconds,
          questionFailRate: failRate,
        });
      });

    return res.json({
      message: "AI review queue generated.",
      questions,
    });
  } catch (error) {
    console.error("AI review queue error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to generate AI review queue.",
    });
  }
};

export const explainAnswer = async (req, res) => {
  try {
    const text = normalizeText(req.body?.text);
    const context = normalizeText(req.body?.context);

    if (!text) {
      return res.status(400).json({
        error: "text is required.",
        fieldErrors: { text: "Please provide a question for AI review." },
      });
    }

    if (text.length < 3) {
      return res.status(400).json({
        error: "text is too short.",
        fieldErrors: { text: "Question must be at least 3 characters." },
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        error: "text is too long.",
        fieldErrors: { text: "Question must be 500 characters or less." },
      });
    }

    const explanationParts = [
      `Here is a focused breakdown of your question: "${text}".`,
      "1) Identify the exact concept being tested before evaluating options.",
      "2) Remove options that violate the core rule or definition.",
      "3) Confirm the remaining option against the question qualifier (always, most likely, except, etc.).",
      "4) After solving, write one memory trigger so the pattern is easier next time.",
    ];

    if (context) {
      explanationParts.push(`Context used: ${context}`);
    }

    return res.json({
      message: "AI explanation generated.",
      input: {
        text,
        context: context || null,
      },
      explanation: explanationParts.join("\n\n"),
    });
  } catch (error) {
    console.error("AI explain error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to generate AI explanation.",
    });
  }
};
