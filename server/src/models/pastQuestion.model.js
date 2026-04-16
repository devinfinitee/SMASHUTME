import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const pastQuestionSchema = new Schema(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
    examBody: { type: String, trim: true, default: "JAMB" },
    examYear: { type: Number, required: true, index: true },
    paper: { type: String, trim: true, default: "UTME" },
    questionNumber: { type: Number, required: true },
    content: { type: String, required: true, trim: true },
    options: {
      A: { type: String, required: true, trim: true },
      B: { type: String, required: true, trim: true },
      C: { type: String, required: true, trim: true },
      D: { type: String, required: true, trim: true },
    },
    correctOption: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    explanation: { type: String, default: null },
    sourceUrl: { type: String, default: null },
    tags: [{ type: String, trim: true }],
    mappedQuestion: { type: Schema.Types.ObjectId, ref: "Question", default: null },
    importedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    status: {
      type: String,
      enum: ["imported", "verified", "published", "archived"],
      default: "imported",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

pastQuestionSchema.index({ subject: 1, topic: 1, examYear: 1, questionNumber: 1 }, { unique: true });

export const PastQuestion = models.PastQuestion || model("PastQuestion", pastQuestionSchema);
export default PastQuestion;