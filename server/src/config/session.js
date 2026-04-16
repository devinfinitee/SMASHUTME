import session from "express-session";
import MongoStore from "connect-mongo";

import { SESSION_COOKIE_NAME } from "../lib/auth.js";

export function createSessionMiddleware() {
	const mongoUri = process.env.MONGODB_URI || process.env.MONGODB || process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error("MongoDB URI is not set. Use MONGODB_URI (or MONGODB/MONGO_URI).");
	}

	return session({
		name: SESSION_COOKIE_NAME,
		secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "smashutme-dev-session-secret",
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			maxAge: Number(process.env.SESSION_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
		},
		store: MongoStore.create({
			mongoUrl: mongoUri,
			dbName: process.env.MONGODB_DB_NAME || undefined,
			collectionName: process.env.SESSION_COLLECTION_NAME || "sessions",
			ttl: Math.floor((Number(process.env.SESSION_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000) / 1000),
			stringify: false,
		}),
	});
}