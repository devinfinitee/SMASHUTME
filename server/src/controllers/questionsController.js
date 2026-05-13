import { Question } from "../models/question.model.js";
import Topic from "../models/topic.model.js";
import Subject from "../models/subject.model.js";
import { extractQuestionsFromPDF } from "../utils/pdfParser.js";
import {
  classifyQuestionToTopic,
  getConfidenceLevel,
} from "../services/questionClassifier.js";
import {
  generateQuestionExplanation,
  generateExplanationWithFallback,
} from "../services/explanationGenerator.js";

/**
 * Upload and process PDF past questions
 * POST /api/questions/upload-pdf
 */
export const uploadPastQuestionsPDF = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check admin role
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    console.log(`Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    // Extract questions from PDF
    const extractedQuestions = await extractQuestionsFromPDF(req.file.buffer);
    console.log(`✓ Extracted ${extractedQuestions.length} questions from PDF`);

    // Get available topics
    const topics = await Topic.find().select("_id name");
    if (topics.length === 0) {
      return res.status(400).json({
        message:
          "No topics available. Please create topics before uploading questions.",
      });
    }

    // Get subject from request or use first found
    const subjectId = req.body.subjectId || (await Subject.findOne())._id;
    if (!subjectId) {
      return res.status(400).json({
        message: "No subject available. Please create a subject first.",
      });
    }

    // Process each question
    const processedQuestions = [];
    const errors = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < extractedQuestions.length; i++) {
      const extractedQ = extractedQuestions[i];
      const questionIndex = i + 1;

      try {
        console.log(`Processing question ${questionIndex}/${extractedQuestions.length}...`);

        // Classify to topic
        const classification = await classifyQuestionToTopic(extractedQ.text, topics);

        // Find the topic ID
        const topicDoc = topics.find(
          (t) => t.name.toLowerCase() === classification.topic.toLowerCase()
        );

        if (!topicDoc) {
          errors.push({
            questionIndex: questionIndex,
            text: extractedQ.text.substring(0, 100),
            error: `Topic "${classification.topic}" not found in database`,
          });
          failureCount++;
          continue;
        }

        // Generate AI explanation
        const aiExplanation = await generateExplanationWithFallback(
          extractedQ.text,
          classification.topic
        );

        // Create question document
        const newQuestion = new Question({
          subject: subjectId,
          topic: topicDoc._id,
          content: extractedQ.text,
          // Default options and answer for extracted questions
          options: {
            A: "[Not provided in PDF]",
            B: "[Not provided in PDF]",
            C: "[Not provided in PDF]",
            D: "[Not provided in PDF]",
          },
          correctOption: "A", // Default - admin should update
          explanation: null,
          aiExplanation: aiExplanation,
          questionType: "objective",
          sourceType: "past-question",
          status: "draft", // Require review before publishing
          difficulty: "medium",
          classification: {
            topic: classification.topic,
            confidence: classification.confidence,
            reasoning: classification.reasoning,
          },
          sourceFormat: "pdf-upload",
          uploadedBy: req.user._id,
          pdfMetadata: {
            fileName: req.file.originalname,
            uploadDate: new Date(),
            pageNumber: null, // Could be enhanced with PDF parsing
            extractionConfidence: 0.9, // Default extraction confidence
          },
          isPastQuestion: true,
          sourceMeta: {
            examBody: "JAMB",
            paper: "UTME",
            sourceUrl: null,
            examYear: new Date().getFullYear(),
          },
        });

        await newQuestion.save();

        processedQuestions.push({
          questionId: newQuestion._id,
          topic: classification.topic,
          topicId: topicDoc._id,
          text: extractedQ.text.substring(0, 150),
          explanation: aiExplanation.substring(0, 150),
          confidence: classification.confidence,
          confidenceLevel: getConfidenceLevel(classification.confidence),
        });

        successCount++;
        console.log(`✓ Question ${questionIndex} processed successfully`);

        // Add delay to avoid rate limiting (500ms between questions)
        if (i < extractedQuestions.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`✗ Error processing question ${questionIndex}:`, error);
        errors.push({
          questionIndex: questionIndex,
          text: extractedQ.text.substring(0, 100),
          error: error.message,
        });
        failureCount++;
      }
    }

    console.log(
      `PDF processing complete: ${successCount} success, ${failureCount} failed`
    );

    // Return detailed response
    return res.status(201).json({
      success: true,
      message: "PDF questions processed successfully",
      summary: {
        totalExtracted: extractedQuestions.length,
        successfullyProcessed: successCount,
        failed: failureCount,
        successRate:
          extractedQuestions.length > 0
            ? ((successCount / extractedQuestions.length) * 100).toFixed(1)
            : 0,
      },
      processedQuestions: processedQuestions,
      errors: errors.length > 0 ? errors : undefined,
      nextSteps: [
        "Review the processed questions in the dashboard",
        "Update options A, B, C, D for each question",
        "Set correct answer for each question",
        "Publish questions once verified",
      ],
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing PDF",
      error: error.message,
    });
  }
};

/**
 * Get all questions created from PDF uploads
 * GET /api/questions/pdf-uploads
 */
export const getPDFUploadedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ sourceFormat: "pdf-upload" })
      .populate("subject", "name")
      .populate("topic", "name")
      .populate("uploadedBy", "name email")
      .select(
        "content topic subject classification aiExplanation status pdfMetadata uploadedBy createdAt"
      )
      .sort({ createdAt: -1 });

    return res.json({
      total: questions.length,
      questions: questions,
    });
  } catch (error) {
    console.error("Get PDF questions error:", error);
    return res.status(500).json({
      message: "Error retrieving questions",
      error: error.message,
    });
  }
};

/**
 * Update question after PDF upload (set options, correct answer, etc.)
 * PUT /api/questions/:id
 */
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      options,
      correctOption,
      explanation,
      difficulty,
      status,
      sourceMeta,
    } = req.body;

    // Find question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update fields
    if (options) question.options = { ...question.options, ...options };
    if (correctOption) question.correctOption = correctOption;
    if (explanation) question.explanation = explanation;
    if (difficulty) question.difficulty = difficulty;
    if (status) question.status = status;
    if (sourceMeta) question.sourceMeta = { ...question.sourceMeta, ...sourceMeta };

    await question.save();

    return res.json({
      success: true,
      message: "Question updated successfully",
      question: question,
    });
  } catch (error) {
    console.error("Update question error:", error);
    return res.status(500).json({
      message: "Error updating question",
      error: error.message,
    });
  }
};

/**
 * Publish questions (change status from draft to published)
 * POST /api/questions/:id/publish
 */
export const publishQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check required fields for publishing
    if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
      return res.status(400).json({
        message: "Cannot publish: All options (A, B, C, D) are required",
      });
    }

    if (!question.correctOption) {
      return res.status(400).json({
        message: "Cannot publish: Correct option must be set",
      });
    }

    question.status = "published";
    question.publishedBy = req.user._id;
    await question.save();

    return res.json({
      success: true,
      message: "Question published successfully",
      question: question,
    });
  } catch (error) {
    console.error("Publish question error:", error);
    return res.status(500).json({
      message: "Error publishing question",
      error: error.message,
    });
  }
};

/**
 * Delete question
 * DELETE /api/questions/:id
 */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return res.status(500).json({
      message: "Error deleting question",
      error: error.message,
    });
  }
};
