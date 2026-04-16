export const listSupportTickets = (_req, res) => {
  res.json({
    message: "Support tickets endpoint ready",
    data: [],
  });
};

export const getRevenueSummary = (_req, res) => {
  res.json({
    message: "Revenue summary endpoint ready",
    data: {
      grossRevenue: 0,
      activeSubscribers: 0,
    },
  });
};
