export const listCandidates = (_req, res) => {
  res.json({
    message: "Candidates endpoint ready",
    data: [],
  });
};

export const getCandidateProfile = (req, res) => {
  res.json({
    message: "Candidate profile endpoint ready",
    candidateId: req.params.candidateId,
  });
};
