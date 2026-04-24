import { Router } from "express";

import { requireAuth, requireActiveUser, requireOnboardingComplete } from "../middlewares/auth.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const router = Router();

router.get(
  "/overview",
  requireAuth,
  requireActiveUser,
  requireOnboardingComplete,
  getDashboardOverview,
);

export default router;