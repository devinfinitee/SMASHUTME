import { Router } from "express";

import { createQuizSession, submitQuizSession } from "../controllers/quizController.js";
import { requireAuth, requireActiveUser, requireOnboardingComplete } from "../middlewares/auth.js";

const router = Router();

router.post("/sessions", requireAuth, requireActiveUser, requireOnboardingComplete, createQuizSession);
router.post("/sessions/:sessionId/submit", requireAuth, requireActiveUser, requireOnboardingComplete, submitQuizSession);

export default router;
