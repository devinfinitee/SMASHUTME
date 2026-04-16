import mongoose from "mongoose";

import { slugify } from "./schemaUtils.js";

const { Schema, model, models } = mongoose;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    code: { type: String, trim: true, default: null },
    icon: { type: String, trim: true, default: null },
    description: { type: String, default: null },
    examCategory: { type: String, trim: true, default: "UTME" },
    isCore: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    metadata: {
      questionCount: { type: Number, default: 0 },
      topicCount: { type: Number, default: 0 },
      totalPastQuestions: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

subjectSchema.virtual("topics", {
  ref: "Topic",
  localField: "_id",
  foreignField: "subject",
});

subjectSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  next();
});

export const Subject = models.Subject || model("Subject", subjectSchema);
export default Subject;