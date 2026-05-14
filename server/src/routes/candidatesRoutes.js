import { Router } from "express";

import { listCandidates, getCandidateProfile } from "../controllers/candidatesController.js";
import { requireStrictAuth, requireStrictAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireStrictAuth, requireStrictAdmin, listCandidates);
router.get("/:candidateId", requireStrictAuth, requireStrictAdmin, getCandidateProfile);

export default router;
