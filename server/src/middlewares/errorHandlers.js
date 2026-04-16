export const notFoundHandler = (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      error: "API route not found",
    });
  }

  return next();
};

export const errorHandler = (err, _req, res, _next) => {
  console.error("Unhandled server error:", err);

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      error: "Internal server error",
    });
  }

  return res.status(500).json({
    error: err instanceof Error ? err.message : "Internal server error",
  });
};
