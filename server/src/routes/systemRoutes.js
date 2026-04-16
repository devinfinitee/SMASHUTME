import { Router } from "express";

import { getSystemStatus, getPlatformMeta } from "../controllers/systemController.js";

const router = Router();

router.get("/status", getSystemStatus);
router.get("/", getPlatformMeta);

export default router;
