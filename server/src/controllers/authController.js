import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import {
  clearAuthCookie,
  clearSessionAuth,
  setAuthCookie,
  signAuthToken,
  syncSessionWithAuth,
} from "../lib/auth.js";

const ADMIN_ROLES = ["admin", "super-admin", "support", "analyst"];

function buildPublicUser(user) {
  const userId = String(user._id);
  const nameParts = String(user.fullName || "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || user.fullName || "SmashUTME";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const onboardingCompleted = Boolean(user.onboarding?.completedAt);

  return {
    id: userId,
    userId,
    name: user.fullName,
    fullName: user.fullName,
    firstName,
    lastName,
    email: user.email,
    authProvider: user.authProvider,
    role: user.role,
    status: user.status,
    onboardingCompleted,
    avatarUrl: user.avatarUrl || null,
  };
}

function buildErrorResponse(error, fallbackMessage) {
  if (process.env.NODE_ENV === "production") {
    return { error: fallbackMessage };
  }

  return {
    error: error instanceof Error ? error.message : fallbackMessage,
  };
}

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, subjects } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: "fullName, email, and password are required.",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        error: "Email is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      passwordHash,
      phoneNumber: phoneNumber || null,
      authProvider: "local",
      selectedSubjectLabels: Array.isArray(subjects) ? subjects : [],
      acceptedTermsAt: new Date(),
      lastLoginAt: new Date(),
    });

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);
    syncSessionWithAuth(req, user);

    return res.status(201).json(buildPublicUser(user));
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to create account."));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(String(password), user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);
    syncSessionWithAuth(req, user);

    return res.json(buildPublicUser(user));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to login."));
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(String(password), user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!ADMIN_ROLES.includes(user.role)) {
      return res.status(403).json({ error: "Admin access is required." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);
    syncSessionWithAuth(req, user);

    return res.json(buildPublicUser(user));
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to login."));
  }
};

export const logout = async (_req, res) => {
  await clearSessionAuth(_req);
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully." });
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: buildPublicUser(req.user) });
};

export const startGoogleAuth = (req, res, next) => {
  req.authStartMode = "redirect";
  return next();
};

export const handleGoogleCallback = async (req, res) => {
  try {
    const user = req.user;
    const isNewGoogleUser = Boolean(req.authInfo?.isNewUser);

    if (!user) {
      return res.redirect(process.env.GOOGLE_AUTH_FAILURE_REDIRECT || "http://localhost:5173/login?oauth=failed");
    }

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);
    syncSessionWithAuth(req, user);

    const redirectUrl = isNewGoogleUser || !user.onboarding?.completedAt
      ? process.env.GOOGLE_AUTH_NEW_USER_REDIRECT || "http://localhost:5173/onboarding/target"
      : process.env.GOOGLE_AUTH_SUCCESS_REDIRECT || "http://localhost:5173/dashboard";
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(process.env.GOOGLE_AUTH_FAILURE_REDIRECT || "http://localhost:5173/login?oauth=failed");
  }
};

export const updateOnboardingTarget = async (req, res) => {
  try {
    const { institution, course, suggestedSubjects } = req.body || {};

    req.user.targetInstitution = institution || null;
    req.user.targetCourse = course || null;
    req.user.onboarding.target = {
      institution: institution || null,
      course: course || null,
      suggestedSubjects: Array.isArray(suggestedSubjects) ? suggestedSubjects : [],
      updatedAt: new Date(),
    };

    await req.user.save();

    return res.json({
      message: "Target onboarding saved.",
      user: buildPublicUser(req.user),
    });
  } catch (error) {
    console.error("Target onboarding error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to save target onboarding."));
  }
};

export const updateOnboardingSubjects = async (req, res) => {
  try {
    const { compulsory, selected, selectedLabels } = req.body || {};

    req.user.selectedSubjectLabels = Array.isArray(selectedLabels) ? selectedLabels : [];
    req.user.onboarding.subjects = {
      compulsory: compulsory || "Use of English",
      selected: Array.isArray(selected) ? selected : [],
      selectedLabels: Array.isArray(selectedLabels) ? selectedLabels : [],
      updatedAt: new Date(),
    };

    await req.user.save();

    return res.json({
      message: "Subject onboarding saved.",
      user: buildPublicUser(req.user),
    });
  } catch (error) {
    console.error("Subject onboarding error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to save subjects onboarding."));
  }
};

export const updateOnboardingBaseline = async (req, res) => {
  try {
    const { confidence, scoreBand, studyTime } = req.body || {};

    req.user.onboarding.baseline = {
      confidence: confidence || null,
      scoreBand: scoreBand || null,
      studyTime: studyTime || null,
      updatedAt: new Date(),
    };

    await req.user.save();

    return res.json({
      message: "Baseline onboarding saved.",
      user: buildPublicUser(req.user),
    });
  } catch (error) {
    console.error("Baseline onboarding error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to save baseline onboarding."));
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    req.user.onboarding.completedAt = new Date();
    req.user.status = "active";
    await req.user.save();

    return res.json({
      message: "Onboarding completed.",
      user: buildPublicUser(req.user),
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return res.status(500).json(buildErrorResponse(error, "Unable to complete onboarding."));
  }
};
