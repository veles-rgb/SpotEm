import express from "express";
const router = express.Router();

import { postLeaderboard, getLeaderboard } from '../controllers/leaderboard.js';


// GET api/leaderboard/:levelId
router.get('/:levelId', getLeaderboard);

// POST api/leaderboard/:levelId
router.post('/:levelId', postLeaderboard);

export default router;