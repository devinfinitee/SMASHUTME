import { Router } from "express";

import { getTopicBySlug, updateTopicProgress } from "../controllers/topicsController.js";
import { requireAuth, requireActiveUser, requireOnboardingComplete } from "../middlewares/auth.js";

const router = Router();

router.get("/:slug", getTopicBySlug);
router.patch("/:slug/progress", requireAuth, requireActiveUser, requireOnboardingComplete, updateTopicProgress);

export default router;
