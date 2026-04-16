export const explainAnswer = (req, res) => {
  const { text, context } = req.body || {};

  res.json({
    message: "AI explanation endpoint ready",
    input: {
      text: text || null,
      context: context || null,
    },
    explanation: null,
  });
};
