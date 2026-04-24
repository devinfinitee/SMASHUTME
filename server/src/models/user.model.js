import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const onboardingTargetSchema = new Schema(
  {
    institution: { type: String, trim: true, default: null },
    course: { type: String, trim: true, default: null },
    suggestedSubjects: [{ type: String, trim: true }],
    updatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const onboardingSubjectsSchema = new Schema(
  {
    compulsory: { type: String, trim: true, default: "Use of English" },
    selected: [{ type: String, trim: true }],
    selectedLabels: [{ type: String, trim: true }],
    updatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const onboardingBaselineSchema = new Schema(
  {
    confidence: {
      type: String,
      enum: ["low", "medium", "high"],
      default: null,
    },
    scoreBand: {
      type: String,
      enum: ["below-180", "180-220", "220-260", "260-plus"],
      default: null,
    },
    studyTime: {
      type: String,
      enum: ["lt-1", "1-2", "2-4", "4-plus"],
      default: null,
    },
    updatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const subjectProgressSchema = new Schema(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    proficiency: { type: Number, min: 0, max: 100, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    accuracy: { type: Number, min: 0, max: 100, default: 0 },
    topicsCovered: { type: Number, default: 0 },
    status: { type: String, enum: ["weak", "on-track", "mastered"], default: "on-track" },
    timeSpentMinutes: { type: Number, default: 0 },
    lastStudiedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const dashboardSnapshotSchema = new Schema(
  {
    projectedScore: { type: Number, default: null },
    percentile: { type: Number, default: null },
    streakDays: { type: Number, default: 0 },
    totalDrillsCompleted: { type: Number, default: 0 },
    totalTimeSpentMinutes: { type: Number, default: 0 },
    averageAccuracy: { type: Number, min: 0, max: 100, default: 0 },
    highYieldTopicsCount: { type: Number, default: 0 },
    studyMomentumPercent: { type: Number, min: 0, max: 100, default: 0 },
    completedQuestions: { type: Number, default: 0 },
    weakAreas: [{ type: String, trim: true }],
    lastUpdatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: {
      type: String,
      required: function passwordRequired() {
        return this.authProvider === "local";
      },
      select: false,
      default: null,
    },
    phoneNumber: { type: String, trim: true, default: null },
    role: {
      type: String,
      enum: ["candidate", "student", "admin", "super-admin"],
      default: "candidate",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    authProviderId: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    targetInstitution: { type: String, trim: true, default: null },
    targetCourse: { type: String, trim: true, default: null },
    selectedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    selectedSubjectLabels: [{ type: String, trim: true }],
    subjectProgress: [{ type: subjectProgressSchema, default: () => [] }],
    onboarding: {
      target: { type: onboardingTargetSchema, default: () => ({}) },
      subjects: { type: onboardingSubjectsSchema, default: () => ({}) },
      baseline: { type: onboardingBaselineSchema, default: () => ({}) },
      completedAt: { type: Date, default: null },
    },
    dashboard: {
      type: dashboardSnapshotSchema,
      default: () => ({}),
    },
    lastLoginAt: { type: Date, default: null },
    acceptedTermsAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const User = models.User || model("User", userSchema);
export default User;