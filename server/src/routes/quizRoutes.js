import { Router } from "express";

import { createQuizSession, submitQuizSession } from "../controllers/quizController.js";
import { requireStrictAuth, requireOnboardingComplete } from "../middlewares/auth.js";

const router = Router();

router.post("/sessions", requireStrictAuth, requireOnboardingComplete, createQuizSession);
router.post("/sessions/:sessionId/submit", requireStrictAuth, requireOnboardingComplete, submitQuizSession);

export default router;
