import { Router } from "express";

import { explainAnswer, getAiReviewQueue } from "../controllers/aiController.js";
import { requireAuth, requireActiveUser } from "../middlewares/auth.js";

const router = Router();

router.get("/review", requireAuth, requireActiveUser, getAiReviewQueue);
router.post("/explain", requireAuth, requireActiveUser, explainAnswer);

export default router;
