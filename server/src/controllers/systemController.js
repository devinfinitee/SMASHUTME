export const getSystemStatus = (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "smashutme-api",
    domain: "utme-exam-prep",
    timestamp: new Date().toISOString(),
  });
};

export const getPlatformMeta = (_req, res) => {
  res.json({
    name: "SmashUTME API",
    version: "v1",
    description: "Backend for UTME exam preparation workflows",
    modules: [
      "auth",
      "subjects",
      "topics",
      "quiz",
      "candidates",
      "admin",
      "ai",
    ],
  });
};
