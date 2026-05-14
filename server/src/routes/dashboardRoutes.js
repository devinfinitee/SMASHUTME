import { Router } from "express";

import { requireStrictAuth, requireOnboardingComplete } from "../middlewares/auth.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const router = Router();

router.get(
  "/overview",
  requireStrictAuth,
  requireOnboardingComplete,
  getDashboardOverview,
);

export default router;