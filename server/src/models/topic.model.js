import mongoose from "mongoose";

import { slugify } from "./schemaUtils.js";

const { Schema, model, models } = mongoose;

const topicSchema = new Schema(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    summary: { type: String, default: null },
    content: { type: String, default: null },
    isHighYield: { type: Boolean, default: false },
    commonTraps: [{ type: String, trim: true }],
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    order: { type: Number, default: 0 },
    estimatedQuestionsPerYear: { type: Number, default: null },
    prerequisiteTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

topicSchema.index({ subject: 1, slug: 1 }, { unique: true });

topicSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "topic",
});

topicSchema.virtual("pastQuestions", {
  ref: "PastQuestion",
  localField: "_id",
  foreignField: "topic",
});

topicSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  next();
});

export const Topic = models.Topic || model("Topic", topicSchema);
export default Topic;