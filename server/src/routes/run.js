import express from "express";
const router = express.Router();

import { startRun, finishRun } from '../controllers/run.js';

router.post('/start/:levelId', startRun);
router.post('/finish/:runId', finishRun);

export default router;