import { Router } from "express";

import { listSubjects, getSubjectBySlug } from "../controllers/subjectsController.js";

const router = Router();

router.get("/", listSubjects);
router.get("/:slug", getSubjectBySlug);

export default router;
