function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return clamp(Math.round(value), 0, 100);
}

function getWeeklyMinuteTarget(studyTimeBand) {
  const band = String(studyTimeBand || "");
  if (band === "lt-1") return 315;
  if (band === "1-2") return 630;
  if (band === "2-4") return 1260;
  if (band === "4-plus") return 2100;
  return 630;
}

function getWeeklyDrillTarget(studyTimeBand) {
  const band = String(studyTimeBand || "");
  if (band === "lt-1") return 3;
  if (band === "1-2") return 5;
  if (band === "2-4") return 8;
  if (band === "4-plus") return 12;
  return 5;
}

function normalizeDateKey(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function countUniqueStudyDaysInWindow({ subjectProgressEntries, recentSessions, windowDays = 7, now = new Date() }) {
  const nowMs = now.getTime();
  const windowStart = nowMs - windowDays * 24 * 60 * 60 * 1000;
  const dayKeys = new Set();

  (subjectProgressEntries || []).forEach((entry) => {
    const ts = new Date(entry?.lastStudiedAt || 0).getTime();
    if (!Number.isNaN(ts) && ts >= windowStart) {
      const key = normalizeDateKey(entry.lastStudiedAt);
      if (key) dayKeys.add(key);
    }
  });

  (recentSessions || []).forEach((session) => {
    const dateCandidate = session?.submittedAt || session?.createdAt;
    const ts = new Date(dateCandidate || 0).getTime();
    if (!Number.isNaN(ts) && ts >= windowStart) {
      const key = normalizeDateKey(dateCandidate);
      if (key) dayKeys.add(key);
    }
  });

  return dayKeys.size;
}

function calculateAverageAccuracy({ recentSessions, subjectProgressEntries }) {
  const accuracyValues = (recentSessions || [])
    .map((session) => Number(session?.accuracy))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (accuracyValues.length > 0) {
    return toPercent(accuracyValues.reduce((sum, value) => sum + value, 0) / accuracyValues.length);
  }

  const fallbackValues = (subjectProgressEntries || [])
    .map((entry) => Number(entry?.accuracy ?? entry?.proficiency))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (fallbackValues.length === 0) {
    return 0;
  }

  return toPercent(fallbackValues.reduce((sum, value) => sum + value, 0) / fallbackValues.length);
}

export function computeProjectedScoreMetrics({
  subjectProgressEntries = [],
  recentSessions = [],
  totalTopics = 0,
  totalTimeSpentMinutes = 0,
  totalDrillsCompleted = 0,
  studyTimeBand = null,
  now = new Date(),
}) {
  const safeTotalTopics = Math.max(0, Number(totalTopics) || 0);
  const coveredTopics = (subjectProgressEntries || []).reduce(
    (sum, entry) => sum + (Number(entry?.topicsCovered) || 0),
    0,
  );
  const coveragePercent = safeTotalTopics > 0 ? toPercent((coveredTopics / safeTotalTopics) * 100) : 0;

  const averageAccuracyPercent = calculateAverageAccuracy({ recentSessions, subjectProgressEntries });

  const uniqueDays = countUniqueStudyDaysInWindow({
    subjectProgressEntries,
    recentSessions,
    windowDays: 7,
    now,
  });
  const consistencyPercent = toPercent((uniqueDays / 7) * 100);

  const weeklyMinuteTarget = getWeeklyMinuteTarget(studyTimeBand);
  const timeCompletionPercent = toPercent((Math.max(0, Number(totalTimeSpentMinutes) || 0) / weeklyMinuteTarget) * 100);

  const nowMs = now.getTime();
  const weekStart = nowMs - 7 * 24 * 60 * 60 * 1000;
  const weeklyDrills = (recentSessions || []).filter((session) => {
    const sessionTs = new Date(session?.submittedAt || session?.createdAt || 0).getTime();
    return (
      !Number.isNaN(sessionTs)
      && sessionTs >= weekStart
      && String(session?.mode || "").toLowerCase() === "drill"
    );
  }).length;
  const fallbackDrills = Math.max(weeklyDrills, Number(totalDrillsCompleted) || 0);
  const weeklyDrillTarget = getWeeklyDrillTarget(studyTimeBand);
  const drillRatePercent = toPercent((fallbackDrills / weeklyDrillTarget) * 100);

  const readiness =
    0.45 * (averageAccuracyPercent / 100)
    + 0.25 * (coveragePercent / 100)
    + 0.15 * (consistencyPercent / 100)
    + 0.1 * (timeCompletionPercent / 100)
    + 0.05 * (drillRatePercent / 100);

  const readinessPercent = toPercent(readiness * 100);
  const projectedScore = Math.round(120 + 280 * readiness);
  const percentile = toPercent(0.6 * averageAccuracyPercent + 0.4 * readinessPercent);

  return {
    projectedScore,
    percentile,
    readinessPercent,
    averageAccuracyPercent,
    coveragePercent,
    consistencyPercent,
    timeCompletionPercent,
    drillRatePercent,
    totalTimeSpentMinutes: Math.max(0, Number(totalTimeSpentMinutes) || 0),
  };
}
