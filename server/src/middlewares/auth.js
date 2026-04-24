import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { AUTH_COOKIE_NAME, getAuthSecret } from "../lib/auth.js";

function extractTokenFromRequest(req) {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

async function loadUserFromSession(req) {
  const sessionUserId = req.session?.userId;
  if (!sessionUserId) {
    return null;
  }

  const user = await User.findById(sessionUserId)
    .populate("selectedSubjects", "name slug code icon")
    .populate("subjectProgress.subject", "name slug code icon")
    .exec();

  if (!user && req.session) {
    req.session.userId = null;
    req.session.userRole = null;
    req.session.userEmail = null;
    req.session.authProvider = null;
  }

  return user;
}

async function loadUserFromToken(req) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return null;
  }

  const payload = jwt.verify(token, getAuthSecret());
  const user = await User.findById(payload.sub)
    .populate("selectedSubjects", "name slug code icon")
    .populate("subjectProgress.subject", "name slug code icon")
    .exec();

  if (user && req.session && !req.session.userId) {
    req.session.userId = String(user._id);
    req.session.userRole = user.role;
    req.session.userEmail = user.email;
    req.session.authProvider = user.authProvider;
    req.session.authenticatedAt = new Date().toISOString();
  }

  return user;
}

function respondUnauthenticated(res) {
  return res.status(401).json({ error: "Not authenticated." });
}

export async function requireAuth(req, res, next) {
  try {
    let user = await loadUserFromSession(req);

    if (!user) {
      user = await loadUserFromToken(req);
    }

    if (!user) {
      return respondUnauthenticated(res);
    }

    req.user = user;
    req.authContext = {
      source: req.session?.userId ? "session" : "jwt",
      userId: String(user._id),
      role: user.role,
    };

    return next();
  } catch (_error) {
    return respondUnauthenticated(res);
  }
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return respondUnauthenticated(res);
    }

    if (!allowedRoles.length) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to access this resource." });
    }

    return next();
  };
}

export function requireOnboardingComplete(req, res, next) {
  if (!req.user) {
    return respondUnauthenticated(res);
  }

  if (!req.user.onboarding?.completedAt) {
    return res.status(403).json({
      error: "Onboarding is not complete.",
      redirectTo: "/onboarding/target",
    });
  }

  return next();
}

export function requireActiveUser(req, res, next) {
  if (!req.user) {
    return respondUnauthenticated(res);
  }

  if (req.user.status !== "active") {
    return res.status(403).json({ error: "Account is not active." });
  }

  return next();
}
