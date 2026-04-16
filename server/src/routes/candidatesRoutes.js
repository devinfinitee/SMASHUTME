import { Router } from "express";

import { listCandidates, getCandidateProfile } from "../controllers/candidatesController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, requireRole(["admin", "super-admin", "support", "analyst"]), listCandidates);
router.get("/:candidateId", requireAuth, requireRole(["admin", "super-admin", "support", "analyst"]), getCandidateProfile);

export default router;
