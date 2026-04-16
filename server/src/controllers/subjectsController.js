export const listSubjects = (_req, res) => {
  res.json({
    message: "Subjects endpoint ready",
    data: [],
  });
};

export const getSubjectBySlug = (req, res) => {
  res.json({
    message: "Subject detail endpoint ready",
    slug: req.params.slug,
  });
};
