import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "smashutme_token";
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "smashutme_session";

export function getAuthSecret() {
	return (
		process.env.JWT_SECRET ||
		process.env.SESSION_SECRET ||
		process.env.CLIENT_SECRET ||
		process.env.CLIENTSECRET ||
		"smashutme-dev-auth-secret"
	);
}

export function signAuthToken(userId) {
	return jwt.sign({ sub: String(userId) }, getAuthSecret(), {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
}

export function setAuthCookie(res, token) {
	const isProduction = process.env.NODE_ENV === "production";

	res.cookie(AUTH_COOKIE_NAME, token, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
}

export function clearAuthCookie(res) {
	const isProduction = process.env.NODE_ENV === "production";

	res.clearCookie(AUTH_COOKIE_NAME, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});
}

export function syncSessionWithAuth(req, user) {
	if (!req?.session) {
		return;
	}

	req.session.authenticatedAt = new Date().toISOString();
	req.session.userId = String(user._id);
	req.session.userRole = user.role;
	req.session.userEmail = user.email;
	req.session.authProvider = user.authProvider;
}

export function clearSessionAuth(req) {
	if (!req?.session) {
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		req.session.destroy(() => resolve());
	});
}

export function buildAuthCookieOptions() {
	const isProduction = process.env.NODE_ENV === "production";

	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	};
}