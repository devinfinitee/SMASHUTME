import { Router } from "express";

import {
	listSupportTickets,
	getRevenueSummary,
	uploadPastQuestions,
	parseTopicNoteUploadMiddleware,
	parseTopicNoteFile,
	parseTopicNoteText,
	autoSolveQuestion,
} from "../controllers/adminController.js";
import { createTopic } from "../controllers/topicsController.js";
import { requireStrictAuth, requireStrictAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/topics", requireStrictAuth, requireStrictAdmin, createTopic);
router.post(
	"/topics/parse-note",
	requireStrictAuth,
	requireStrictAdmin,
	parseTopicNoteUploadMiddleware,
	parseTopicNoteFile,
);
router.post(
	"/topics/parse-text",
	requireStrictAuth,
	requireStrictAdmin,
	parseTopicNoteText,
);
router.post("/questions/upload", requireStrictAuth, requireStrictAdmin, uploadPastQuestions);
router.post("/questions/auto-solve", requireStrictAuth, requireStrictAdmin, autoSolveQuestion);
router.get("/support/tickets", requireStrictAuth, requireStrictAdmin, listSupportTickets);
router.get("/revenue/summary", requireStrictAuth, requireStrictAdmin, getRevenueSummary);

export default router;
