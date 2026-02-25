import { runs } from '../../lib/runStore.js';
import crypto from 'crypto';

export async function startRun(req, res, next) {
    try {
        const { levelId } = req.params;
        if (!levelId) return res.status(400).json({ message: 'levelId is required' });

        const runId = crypto.randomUUID();
        const startedAt = Date.now();

        runs.set(runId, { levelId, startedAt });

        return res.status(201).json({ runId, startedAt });
    } catch (error) {
        return next(error);
    }
}

export async function finishRun(req, res, next) {
    try {
        const { runId } = req.params;
        const { levelId } = req.body;

        if (!runId) return res.status(400).json({ message: "runId is required" });
        if (!levelId) return res.status(400).json({ message: "levelId is required" });

        const run = runs.get(runId);
        if (!run) return res.status(404).json({ message: "Run was not found" });

        if (run.levelId !== levelId) {
            runs.delete(runId);
            return res.status(400).json({ message: "Level mismatch" });
        }

        const timeMs = Date.now() - run.startedAt;

        if (timeMs < 1000) {
            runs.delete(runId);
            return res.status(400).json({ message: "Time too short" });
        }

        if (timeMs > 60 * 60 * 1000) {
            runs.delete(runId);
            return res.status(400).json({ message: "Run expired" });
        }

        runs.delete(runId);
        return res.status(200).json({ timeMs });
    } catch (error) {
        return next(error);
    }
}