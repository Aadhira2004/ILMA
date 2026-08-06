import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, recentlyViewedTable } from "@workspace/db";
import { ListRecentResponse, RecordViewBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/recent", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(recentlyViewedTable)
    .where(eq(recentlyViewedTable.userId, req.userId!))
    .orderBy(desc(recentlyViewedTable.viewedAt))
    .limit(20);
  res.json(ListRecentResponse.parse(rows));
});

router.post("/recent", requireAuth, async (req, res): Promise<void> => {
  const parsed = RecordViewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { itemType, itemId, title } = parsed.data;
  await db
    .insert(recentlyViewedTable)
    .values({ userId: req.userId!, itemType, itemId, title })
    .onConflictDoUpdate({
      target: [recentlyViewedTable.userId, recentlyViewedTable.itemType, recentlyViewedTable.itemId],
      set: { title, viewedAt: sql`now()` },
    });
  res.sendStatus(204);
});

export default router;
