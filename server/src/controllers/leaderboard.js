import { prisma } from "../../lib/prisma.js";

export async function getAllLeaderboards(req, res, next) {
    try {
        const leaderboards = await prisma.level.findMany({
            include: {
                leaderboardEntries: {
                    orderBy: [
                        { timeMs: "asc" },
                        { createdAt: "asc" },
                    ],
                    take: 10
                }
            }
        });

        return res.status(200).json({ leaderboards });
    } catch (err) {
        return next(err);
    }
}

export async function postLeaderboard(req, res, next) {
    const { levelId } = req.params;
    const { name, serverTimeMs } = req.body;

    if (!levelId || !name?.trim() || serverTimeMs == null) return res.status(400).json({ message: "LevelId, name & finalTime are required" });

    try {
        const score = await prisma.leaderboardEntry.create({
            data: {
                levelId,
                playerName: name,
                timeMs: serverTimeMs,
            }
        });

        return res.status(201).json({ score });
    } catch (err) {
        return next(err);
    }
}

export async function getLeaderboard(req, res, next) {
    const { levelId } = req.params;
    if (!levelId) return res.status(400).json({ message: 'LevelId is required' });

    try {
        const leaderboard = await prisma.leaderboardEntry.findMany({
            where: {
                levelId,
            },
            orderBy: [
                { timeMs: "asc" },
                { createdAt: "asc" },
            ],
            take: 10,
        });

        return res.status(200).json(leaderboard);
    } catch (err) {
        return next(err);
    }
}