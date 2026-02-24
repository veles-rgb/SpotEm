import express from "express";
import { getLevel } from "../controllers/levels.js";

const router = express.Router();

// GET /api/level/:levelId
router.get("/:levelId", getLevel);

export default router;