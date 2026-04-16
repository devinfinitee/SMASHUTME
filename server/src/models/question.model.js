import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const questionSchema = new Schema(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
    questionType: {
      type: String,
      enum: ["objective", "multiple-choice"],
      default: "objective",
    },
    sourceType: {
      type: String,
      enum: ["practice", "past-question", "mock", "admin-upload"],
      default: "practice",
    },
    content: { type: String, required: true, trim: true },
    options: {
      A: { type: String, required: true, trim: true },
      B: { type: String, required: true, trim: true },
      C: { type: String, required: true, trim: true },
      D: { type: String, required: true, trim: true },
    },
    correctOption: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    explanation: { type: String, default: null },
    solutionSteps: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    marks: { type: Number, default: 1 },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "review", "published", "archived"],
      default: "published",
    },
    publishedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    sourceMeta: {
      examBody: { type: String, trim: true, default: "JAMB" },
      examYear: { type: Number, default: null },
      paper: { type: String, trim: true, default: "UTME" },
      questionNumber: { type: Number, default: null },
      reference: { type: String, default: null },
      sourceUrl: { type: String, default: null },
    },
    isPastQuestion: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

questionSchema.index({ subject: 1, topic: 1, sourceType: 1 });

export const Question = models.Question || model("Question", questionSchema);
export default Question;