import { Router } from "express";

import systemRoutes from "./systemRoutes.js";
import authRoutes from "./authRoutes.js";
import subjectsRoutes from "./subjectsRoutes.js";
import topicsRoutes from "./topicsRoutes.js";
import quizRoutes from "./quizRoutes.js";
import candidatesRoutes from "./candidatesRoutes.js";
import adminRoutes from "./adminRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = Router();

router.use("/system", systemRoutes);
router.use("/auth", authRoutes);
router.use("/subjects", subjectsRoutes);
router.use("/topics", topicsRoutes);
router.use("/quiz", quizRoutes);
router.use("/candidates", candidatesRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);

export default router;
