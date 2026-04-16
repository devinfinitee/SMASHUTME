export const createQuizSession = (req, res) => {
  const { topicSlug } = req.body || {};

  res.status(201).json({
    message: "Quiz session endpoint ready",
    topicSlug: topicSlug || null,
    sessionId: null,
  });
};

export const submitQuizSession = (req, res) => {
  const { score, totalQuestions } = req.body || {};

  res.json({
    message: "Quiz submission endpoint ready",
    sessionId: req.params.sessionId,
    score: score ?? null,
    totalQuestions: totalQuestions ?? null,
  });
};
