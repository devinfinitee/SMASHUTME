import { Router } from "express";

import { explainAnswer } from "../controllers/aiController.js";
import { requireAuth, requireActiveUser } from "../middlewares/auth.js";

const router = Router();

router.post("/explain", requireAuth, requireActiveUser, explainAnswer);

export default router;
