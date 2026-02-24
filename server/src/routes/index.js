import express from "express";
import levelRouter from "./levels.js";
import leaderboardRouter from './leaderboard.js';

const router = express.Router();

router.use("/level", levelRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;