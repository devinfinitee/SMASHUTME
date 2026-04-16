import { Router } from "express";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.js";

import {
	signUp,
	login,
	adminLogin,
	logout,
	getCurrentUser,
	startGoogleAuth,
	handleGoogleCallback,
	updateOnboardingTarget,
	updateOnboardingSubjects,
	updateOnboardingBaseline,
	completeOnboarding,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getCurrentUser);
router.patch("/onboarding/target", requireAuth, updateOnboardingTarget);
router.patch("/onboarding/subjects", requireAuth, updateOnboardingSubjects);
router.patch("/onboarding/baseline", requireAuth, updateOnboardingBaseline);
router.post("/onboarding/complete", requireAuth, completeOnboarding);

router.get(
	"/google",
	startGoogleAuth,
	passport.authenticate("google", {
		scope: ["openid", "email", "profile"],
		session: false,
		prompt: "select_account",
	}),
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: process.env.GOOGLE_AUTH_FAILURE_REDIRECT || "http://localhost:5173/login?oauth=failed",
	}),
	handleGoogleCallback,
);

export default router;
