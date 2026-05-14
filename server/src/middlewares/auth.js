import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { AUTH_COOKIE_NAME, getAuthSecret } from "../lib/auth.js";

const ADMIN_ROLES = ["admin", "super-admin"];
const PROTECTED_ADMIN_ROLES = ["super-admin"];

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

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return respondUnauthenticated(res);
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }

  return next();
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

// ============================================================
// STRICTER AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ============================================================

/**
 * Stricter user authentication with account status & activity validation
 */
export async function requireStrictAuth(req, res, next) {
  try {
    let user = await loadUserFromSession(req);

    if (!user) {
      user = await loadUserFromToken(req);
    }

    if (!user) {
      console.warn("[Auth] Strict auth failed: No user found");
      return respondUnauthenticated(res);
    }

    // ✅ Check account status
    if (user.status !== "active") {
      console.warn(`[Auth] Strict auth failed: User ${user._id} account is ${user.status}`);
      return res.status(403).json({ 
        error: "Your account is not active. Please contact support.",
        code: "ACCOUNT_INACTIVE" 
      });
    }

    // ✅ Verify user still exists and wasn't deleted
    const freshUser = await User.findById(user._id).select("+passwordHash");
    if (!freshUser) {
      console.warn(`[Auth] Strict auth failed: User ${user._id} no longer exists in database`);
      if (req.session) {
        req.session.destroy();
      }
      return respondUnauthenticated(res);
    }

    // ✅ Check for suspicious activity - prevent concurrent sessions
    const existingSession = req.session?.userId === String(user._id);
    if (!existingSession && req.session?.userId) {
      console.warn(`[Auth] Session conflict: Different user already authenticated`);
      return res.status(401).json({ error: "Session conflict. Please log in again." });
    }

    req.user = freshUser;
    req.authContext = {
      source: req.session?.userId ? "session" : "jwt",
      userId: String(user._id),
      role: user.role,
      email: user.email,
      status: user.status,
      timestamp: new Date().toISOString(),
    };

    return next();
  } catch (error) {
    console.error("[Auth] Strict auth error:", error.message);
    return respondUnauthenticated(res);
  }
}

/**
 * SUPER STRICT: Admin-only access with enhanced security checks
 * Requires admin or super-admin role with multiple validations
 */
export async function requireStrictAdmin(req, res, next) {
  try {
    if (!req.user) {
      console.warn("[Admin Auth] Failed: No user object");
      return respondUnauthenticated(res);
    }

    // ✅ 1. Check admin role
    if (!ADMIN_ROLES.includes(req.user.role)) {
      console.warn(`[Admin Auth] Failed: User ${req.user._id} has role '${req.user.role}', not admin`);
      return res.status(403).json({ 
        error: "Admin access required.",
        code: "INSUFFICIENT_ROLE" 
      });
    }

    // ✅ 2. Verify account is active
    if (req.user.status !== "active") {
      console.warn(`[Admin Auth] Failed: Admin ${req.user._id} account is ${req.user.status}`);
      return res.status(403).json({ 
        error: "Admin account is not active.",
        code: "ADMIN_INACTIVE" 
      });
    }

    // ✅ 3. Verify user still exists in database (prevent deleted admin access)
    const adminUser = await User.findById(req.user._id);
    if (!adminUser || !ADMIN_ROLES.includes(adminUser.role)) {
      console.warn(`[Admin Auth] Failed: Admin ${req.user._id} no longer has admin privileges`);
      if (req.session) {
        req.session.destroy();
      }
      return res.status(403).json({ 
        error: "Your admin privileges have been revoked.",
        code: "PRIVILEGES_REVOKED" 
      });
    }

    // ✅ 4. Log admin action for audit trail
    console.log(
      `[Admin Audit] User: ${adminUser.email} | Role: ${adminUser.role} | Action: ${req.method} ${req.path} | IP: ${req.ip}`
    );

    req.user = adminUser;
    req.authContext = {
      source: "admin_session",
      userId: String(adminUser._id),
      role: adminUser.role,
      email: adminUser.email,
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };

    return next();
  } catch (error) {
    console.error("[Admin Auth] Error:", error.message);
    return res.status(500).json({ error: "Authentication error." });
  }
}

/**
 * SUPER-ADMIN ONLY: Most restrictive access
 * Only super-admin role can access sensitive operations
 */
export async function requireSuperAdmin(req, res, next) {
  try {
    if (!req.user) {
      console.warn("[Super-Admin Auth] Failed: No user object");
      return respondUnauthenticated(res);
    }

    // ✅ 1. Check super-admin role specifically
    if (req.user.role !== "super-admin") {
      console.warn(`[Super-Admin Auth] Failed: User ${req.user._id} has role '${req.user.role}', not super-admin`);
      return res.status(403).json({ 
        error: "Super-admin access only.",
        code: "SUPER_ADMIN_ONLY" 
      });
    }

    // ✅ 2. Verify account is active
    if (req.user.status !== "active") {
      console.warn(`[Super-Admin Auth] Failed: Super-admin ${req.user._id} account is ${req.user.status}`);
      return res.status(403).json({ 
        error: "Super-admin account is not active.",
        code: "SUPER_ADMIN_INACTIVE" 
      });
    }

    // ✅ 3. Verify user still exists and is super-admin
    const superAdmin = await User.findById(req.user._id);
    if (!superAdmin || superAdmin.role !== "super-admin") {
      console.warn(`[Super-Admin Auth] Failed: User ${req.user._id} is no longer super-admin`);
      if (req.session) {
        req.session.destroy();
      }
      return res.status(403).json({ 
        error: "Super-admin access required.",
        code: "SUPER_ADMIN_REVOKED" 
      });
    }

    // ✅ 4. Log sensitive super-admin action
    console.log(
      `[SUPER-ADMIN AUDIT] ⚠️ SENSITIVE OPERATION | User: ${superAdmin.email} | Action: ${req.method} ${req.path} | IP: ${req.ip} | Timestamp: ${new Date().toISOString()}`
    );

    req.user = superAdmin;
    req.authContext = {
      source: "super_admin_session",
      userId: String(superAdmin._id),
      role: superAdmin.role,
      email: superAdmin.email,
      timestamp: new Date().toISOString(),
      isSuperAdmin: true,
    };

    return next();
  } catch (error) {
    console.error("[Super-Admin Auth] Error:", error.message);
    return res.status(500).json({ error: "Authentication error." });
  }
}

/**
 * Verify user owns the resource (for user-specific endpoints)
 */
export function requireResourceOwner(paramName = "userId") {
  return (req, res, next) => {
    if (!req.user) {
      return respondUnauthenticated(res);
    }

    const resourceUserId = req.params[paramName];
    const authenticatedUserId = String(req.user._id);

    // Allow admins to access any user's resources, but log it
    if (ADMIN_ROLES.includes(req.user.role)) {
      console.log(`[Admin Access] Admin ${req.user.email} accessing resource of user ${resourceUserId}`);
      return next();
    }

    // Regular users can only access their own resources
    if (resourceUserId !== authenticatedUserId) {
      console.warn(`[Authorization] User ${authenticatedUserId} attempted unauthorized access to resource ${resourceUserId}`);
      return res.status(403).json({ 
        error: "You do not have access to this resource.",
        code: "FORBIDDEN_RESOURCE" 
      });
    }

    return next();
  };
}
