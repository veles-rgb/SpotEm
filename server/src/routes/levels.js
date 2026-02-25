import express from "express";
import { getLevel, getAllLevels } from "../controllers/levels.js";

const router = express.Router();

// GET /api/level
router.get("/", getAllLevels);
// GET /api/level/:levelId
router.get("/:levelId", getLevel);

export default router;