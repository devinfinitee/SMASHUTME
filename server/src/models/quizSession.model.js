import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const sessionQuestionSchema = new Schema(
  {
    questionId: { type: String, required: true, trim: true },
    sourceModel: { type: String, enum: ["Question", "PastQuestion", "Synthetic"], default: "Question" },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    options: {
      A: { type: String, required: true, trim: true },
      B: { type: String, required: true, trim: true },
      C: { type: String, required: true, trim: true },
      D: { type: String, required: true, trim: true },
    },
    correctOption: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    explanation: { type: String, default: null },
  },
  { _id: false },
);

const submissionResultSchema = new Schema(
  {
    questionId: { type: String, required: true, trim: true },
    selectedOption: { type: String, enum: ["A", "B", "C", "D", null], default: null },
    correctOption: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    isCorrect: { type: Boolean, required: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const quizSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, enum: ["drill", "mock"], required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", default: null },
    subjectLabel: { type: String, required: true, trim: true },
    questionCount: { type: Number, required: true, min: 1, max: 120 },
    durationMinutes: { type: Number, required: true, min: 1, max: 180 },
    highYieldOnly: { type: Boolean, default: false },
    status: { type: String, enum: ["in-progress", "submitted", "expired"], default: "in-progress", index: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    questions: { type: [sessionQuestionSchema], default: [] },
    flaggedQuestionIds: [{ type: String, trim: true }],
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeSpentSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date, default: null },
    results: { type: [submissionResultSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

quizSessionSchema.index({ user: 1, createdAt: -1 });

export const QuizSession = models.QuizSession || model("QuizSession", quizSessionSchema);
export default QuizSession;
