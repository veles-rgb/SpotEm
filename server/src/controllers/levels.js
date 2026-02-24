import { prisma } from "../../lib/prisma.js";

export async function getLevel(req, res, next) {
    try {
        const { levelId } = req.params;

        const level = await prisma.level.findUnique({
            where: { id: levelId },
            include: { targets: true },
        });

        if (!level) return res.status(404).json({ error: "Level not found" });

        res.json(level);
    } catch (err) {
        next(err);
    }
}