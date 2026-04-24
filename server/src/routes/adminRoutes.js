import { Router } from "express";

import {
	listSupportTickets,
	getRevenueSummary,
	uploadPastQuestions,
	parseTopicNoteUploadMiddleware,
	parseTopicNoteFile,
} from "../controllers/adminController.js";
import { createTopic } from "../controllers/topicsController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post("/topics", requireAuth, requireRole(["admin", "super-admin", "support", "analyst"]), createTopic);
router.post(
	"/topics/parse-note",
	requireAuth,
	requireRole(["admin", "super-admin", "support", "analyst"]),
	parseTopicNoteUploadMiddleware,
	parseTopicNoteFile,
);
router.post("/questions/upload", requireAuth, requireRole(["admin", "super-admin", "support", "analyst"]), uploadPastQuestions);
router.get("/support/tickets", requireAuth, requireRole(["admin", "super-admin", "support"]), listSupportTickets);
router.get("/revenue/summary", requireAuth, requireRole(["admin", "super-admin", "analyst"]), getRevenueSummary);

export default router;
