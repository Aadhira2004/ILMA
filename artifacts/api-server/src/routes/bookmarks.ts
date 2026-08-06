import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, bookmarksTable } from "@workspace/db";
import { ListBookmarksResponse, ToggleBookmarkBody, ToggleBookmarkResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/bookmarks", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(bookmarksTable)
    .where(eq(bookmarksTable.userId, req.userId!))
    .orderBy(desc(bookmarksTable.createdAt));
  res.json(ListBookmarksResponse.parse(rows));
});

router.post("/bookmarks", requireAuth, async (req, res): Promise<void> => {
  const parsed = ToggleBookmarkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { itemType, itemId, title } = parsed.data;
  const where = and(
    eq(bookmarksTable.userId, req.userId!),
    eq(bookmarksTable.itemType, itemType),
    eq(bookmarksTable.itemId, itemId),
  );
  const [existing] = await db.select().from(bookmarksTable).where(where);
  if (existing) {
    await db.delete(bookmarksTable).where(where);
    res.json(ToggleBookmarkResponse.parse({ bookmarked: false }));
    return;
  }
  await db.insert(bookmarksTable).values({ userId: req.userId!, itemType, itemId, title }).onConflictDoNothing();
  res.json(ToggleBookmarkResponse.parse({ bookmarked: true }));
});

export default router;
