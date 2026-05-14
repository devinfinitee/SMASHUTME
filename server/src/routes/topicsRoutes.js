import { Router } from "express";

import { getTopicBySlug, updateTopicProgress } from "../controllers/topicsController.js";
import { requireStrictAuth, requireOnboardingComplete } from "../middlewares/auth.js";

const router = Router();

router.get("/:slug", getTopicBySlug);
router.patch("/:slug/progress", requireStrictAuth, requireOnboardingComplete, updateTopicProgress);

export default router;
