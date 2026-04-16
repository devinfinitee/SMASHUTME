import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import passport from "passport";

import "./config/passport.js";
import { createSessionMiddleware } from "./config/session.js";

import apiRoutes from "./routes/apiRoutes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandlers.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const corsOrigin = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
	: true;

const apiLimiter = rateLimit({
	windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
	max: Number(process.env.RATE_LIMIT_MAX) || 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Too many requests from this IP. Please try again shortly.",
	},
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
	}),
);

app.use(
	cors({
		origin: corsOrigin,
		credentials: true,
	}),
);
app.use(compression());
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(createSessionMiddleware());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(passport.initialize());

app.use("/api", apiLimiter);

app.use("/api/v1", apiRoutes);
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
