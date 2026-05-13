import { Router } from "express";
import multer from "multer";
import {
  uploadPastQuestionsPDF,
  getPDFUploadedQuestions,
  updateQuestion,
  publishQuestion,
  deleteQuestion,
} from "../controllers/questionsController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Configure multer for PDF uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * Upload past questions from PDF
 * POST /api/questions/upload-pdf
 * - Requires: authentication, admin role
 * - Body: multipart/form-data with 'file' (PDF), optional 'subjectId'
 * - Returns: upload summary with processed questions and errors
 */
router.post(
  "/upload-pdf",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  uploadPastQuestionsPDF
);

/**
 * Get all PDF-uploaded questions
 * GET /api/questions/pdf-uploads
 * - Requires: authentication, admin role
 * - Returns: list of questions created from PDF uploads
 */
router.get("/pdf-uploads", requireAuth, requireAdmin, getPDFUploadedQuestions);

/**
 * Update question (set options, correct answer, etc.)
 * PUT /api/questions/:id
 * - Requires: authentication, admin role
 * - Body: { options, correctOption, explanation, difficulty, status, sourceMeta }
 * - Returns: updated question
 */
router.put("/:id", requireAuth, requireAdmin, updateQuestion);

/**
 * Publish question (change from draft to published)
 * POST /api/questions/:id/publish
 * - Requires: authentication, admin role
 * - Returns: published question
 */
router.post("/:id/publish", requireAuth, requireAdmin, publishQuestion);

/**
 * Delete question
 * DELETE /api/questions/:id
 * - Requires: authentication, admin role
 * - Returns: success message
 */
router.delete("/:id", requireAuth, requireAdmin, deleteQuestion);

export default router;
