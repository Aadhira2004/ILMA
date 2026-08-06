import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, progressTable } from "@workspace/db";
import { ListProgressResponse, ToggleProgressBody, ToggleProgressResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/progress", requireAuth, async (req, res): Promise<void> => {
  const rows = await db.select().from(progressTable).where(eq(progressTable.userId, req.userId!));
  res.json(ListProgressResponse.parse(rows));
});

router.post("/progress", requireAuth, async (req, res): Promise<void> => {
  const parsed = ToggleProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { roadmapId, phase, topicIndex } = parsed.data;
  const where = and(
    eq(progressTable.userId, req.userId!),
    eq(progressTable.roadmapId, roadmapId),
    eq(progressTable.phase, phase),
    eq(progressTable.topicIndex, topicIndex),
  );
  const [existing] = await db.select().from(progressTable).where(where);
  if (existing) {
    await db.delete(progressTable).where(where);
    res.json(ToggleProgressResponse.parse({ completed: false }));
    return;
  }
  await db
    .insert(progressTable)
    .values({ userId: req.userId!, roadmapId, phase, topicIndex })
    .onConflictDoNothing();
  res.json(ToggleProgressResponse.parse({ completed: true }));
});

export default router;
