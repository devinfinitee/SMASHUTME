import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const adminSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    title: { type: String, trim: true, default: "Administrator" },
    role: {
      type: String,
      enum: ["super-admin", "admin", "support", "analyst"],
      default: "admin",
    },
    department: { type: String, trim: true, default: "Operations" },
    phoneNumber: { type: String, trim: true, default: null },
    avatarUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
    },
    permissions: [{ type: String, trim: true }],
    managedModules: [{ type: String, trim: true }],
    assignedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    lastLoginAt: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Admin = models.Admin || model("Admin", adminSchema);
export default Admin;