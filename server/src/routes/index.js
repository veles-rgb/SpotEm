import express from "express";
import levelRouter from "./levels.js";
import leaderboardRouter from './leaderboard.js';
import run from './run.js';

const router = express.Router();

router.use("/level", levelRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/run", run);

export default router;