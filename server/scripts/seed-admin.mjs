import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDatabase from "../src/config/db.js";
import User from "../src/models/user.model.js";
import Admin from "../src/models/admin.model.js";

dotenv.config();

const email = "victorogunlade47@gmail.com";
const password = "VickeySmart@01";
const fullName = "Victor Ogunlade";
const passwordHash = await bcrypt.hash(password, 12);
const now = new Date();

await connectDatabase();

const userRecord = await User.findOneAndUpdate(
  { email },
  {
    $set: {
      fullName,
      email,
      passwordHash,
      role: "admin",
      status: "active",
      authProvider: "local",
      phoneNumber: null,
      avatarUrl: null,
      onboarding: {
        target: {},
        subjects: {},
        baseline: {},
        completedAt: now,
      },
      acceptedTermsAt: now,
      lastLoginAt: now,
    },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

const adminRecord = await Admin.findOneAndUpdate(
  { email },
  {
    $set: {
      fullName,
      email,
      passwordHash,
      title: "Administrator",
      role: "admin",
      department: "Operations",
      phoneNumber: null,
      avatarUrl: null,
      status: "active",
      permissions: ["dashboard:read", "candidates:read", "content:manage"],
      managedModules: ["dashboard", "candidates", "content-management"],
      notes: "Seeded admin account for SmashUTME admin login.",
      lastLoginAt: now,
    },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

console.log(
  JSON.stringify(
    {
      userId: String(userRecord._id),
      adminId: String(adminRecord._id),
      email,
      role: userRecord.role,
      adminRole: adminRecord.role,
    },
    null,
    2,
  ),
);

await mongoose.disconnect();
