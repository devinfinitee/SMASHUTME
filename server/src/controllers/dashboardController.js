import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import QuizSession from "../models/quizSession.model.js";
import { computeProjectedScoreMetrics } from "../lib/projectedScore.js";

function clampPercentage(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getDashboardSnapshot(user) {
  return user?.dashboard || {};
}

function buildSubjectProgressMap(user) {
  const progressEntries = Array.isArray(user?.subjectProgress) ? user.subjectProgress : [];
  return new Map(progressEntries.map((entry) => [String(entry.subject?._id || entry.subject), entry]));
}

function buildRecentActivity(session) {
  const accuracy = Number(session.accuracy) || 0;
  const score = Number(session.score) || 0;
  const totalQuestions = Number(session.totalQuestions) || 0;
  const subjectLabel = session.subjectLabel || "Mixed Subjects";
  const modeLabel = session.mode === "mock" ? "Mock Exam" : "Drill";

  return {
    id: String(session._id),
    type: session.mode,
    title: `${subjectLabel} ${modeLabel}`,
    description: session.status === "submitted"
      ? `Completed • ${score}/${totalQuestions} correct • ${accuracy}% accuracy`
      : `In progress • ${totalQuestions} questions queued`,
    actionLabel: session.status === "submitted" ? "Review Errors" : "Resume",
    iconKey: session.mode === "mock" ? "mock" : "drill",
    createdAt: session.createdAt,
  };
}

function normalizeDateLabel(dateValue) {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const user = await req.user.constructor
      .findById(userId)
      .populate("selectedSubjects", "name slug code icon metadata")
      .populate("subjectProgress.subject", "name slug code icon metadata")
      .populate("subjectProgress.subject")
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const subjects = Array.isArray(user.selectedSubjects) && user.selectedSubjects.length > 0
      ? user.selectedSubjects
      : [];
    const subjectProgressMap = buildSubjectProgressMap(user);
    const snapshot = getDashboardSnapshot(user);

    const subjectCards = subjects.map((subjectDoc, index) => {
      const progressEntry = subjectProgressMap.get(String(subjectDoc._id)) || {};
      const proficiency = clampPercentage(progressEntry.proficiency ?? progressEntry.accuracy ?? 0);
      const colorVariants = [
        { color: "text-brand-blue", bgColor: "bg-brand-blue/10" },
        { color: "text-purple-600", bgColor: "bg-purple-600/10" },
        { color: "text-red-600", bgColor: "bg-red-600/10" },
        { color: "text-amber-600", bgColor: "bg-amber-600/10" },
      ];

      return {
        id: String(subjectDoc._id),
        name: subjectDoc.name,
        slug: subjectDoc.slug,
        icon: subjectDoc.icon || "BookOpen",
        proficiency,
        status: progressEntry.status || (proficiency >= 80 ? "mastered" : proficiency <= 40 ? "weak" : "on-track"),
        color: colorVariants[index % colorVariants.length].color,
        bgColor: colorVariants[index % colorVariants.length].bgColor,
        questionsAnswered: Number(progressEntry.questionsAnswered) || 0,
        questionsCorrect: Number(progressEntry.questionsCorrect) || 0,
        topicsCovered: Number(progressEntry.topicsCovered) || 0,
        accuracy: clampPercentage(progressEntry.accuracy ?? 0),
        timeSpentMinutes: Number(progressEntry.timeSpentMinutes) || 0,
        lastStudiedAt: normalizeDateLabel(progressEntry.lastStudiedAt),
      };
    });

    const weakAreas = Array.isArray(snapshot.weakAreas) && snapshot.weakAreas.length > 0
      ? snapshot.weakAreas
      : subjectCards.filter((card) => card.proficiency <= 45).map((card) => card.name);

    const recentSessions = await QuizSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("mode subjectLabel score totalQuestions accuracy status createdAt")
      .lean();

    const recentActivities = recentSessions.map(buildRecentActivity);

    const metricSessions = await QuizSession.find({ user: userId, status: "submitted" })
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(12)
      .select("mode accuracy submittedAt createdAt")
      .lean();

    const subjectCount = subjectCards.length;
    const totalProgress = subjectCards.reduce((sum, card) => sum + card.proficiency, 0);
    const averageProficiency = subjectCount > 0 ? Math.round(totalProgress / subjectCount) : 0;

    const totalTopics = subjects.length > 0
      ? await Topic.countDocuments({ subject: { $in: subjects.map((subjectDoc) => subjectDoc._id) } })
      : 0;

    const highYieldTopicsCount = Number(snapshot.highYieldTopicsCount) || await Topic.countDocuments({
      subject: { $in: subjects.map((subjectDoc) => subjectDoc._id) },
      isHighYield: true,
    });

    const totalDrillsCompleted = Number(snapshot.totalDrillsCompleted) || await QuizSession.countDocuments({
      user: userId,
      status: "submitted",
      mode: "drill",
    });

    const totalTimeSpentMinutes = Number(snapshot.totalTimeSpentMinutes)
      || subjectCards.reduce((sum, card) => sum + (Number(card.timeSpentMinutes) || 0), 0);

    const metrics = computeProjectedScoreMetrics({
      subjectProgressEntries: user.subjectProgress || [],
      recentSessions: metricSessions,
      totalTopics,
      totalTimeSpentMinutes,
      totalDrillsCompleted,
      studyTimeBand: user.onboarding?.baseline?.studyTime || null,
    });

    const averageAccuracy = metrics.averageAccuracyPercent || averageProficiency;
    const studyMomentumPercent = metrics.readinessPercent;
    const projectedScore = metrics.projectedScore;
    const percentile = metrics.percentile;

    return res.json({
      message: "Dashboard overview loaded.",
      data: {
        profile: {
          id: String(user._id),
          name: user.fullName,
          fullName: user.fullName,
          targetInstitution: user.targetInstitution || user.onboarding?.target?.institution || null,
          targetCourse: user.targetCourse || user.onboarding?.target?.course || null,
          studyTime: user.onboarding?.baseline?.studyTime || null,
          onboardingCompleted: Boolean(user.onboarding?.completedAt),
          avatarUrl: user.avatarUrl || null,
        },
        dashboard: {
          projectedScore,
          percentile,
          streakDays: Number(snapshot.streakDays) || 0,
          totalDrillsCompleted,
          totalTimeSpentMinutes,
          averageAccuracy,
          highYieldTopicsCount,
          studyMomentumPercent,
          completedQuestions: Number(snapshot.completedQuestions) || 0,
          weakAreas,
          lastUpdatedAt: snapshot.lastUpdatedAt || null,
        },
        subjectCards,
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to load dashboard overview.",
    });
  }
};