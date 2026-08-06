import { Router, type IRouter } from "express";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import { ListNewsQueryParams, ListNewsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const query = ListNewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { category, trending } = query.data;
  const conditions: SQL[] = [];
  if (category) conditions.push(eq(newsTable.category, category));
  if (trending) conditions.push(eq(newsTable.trending, true));
  const rows = await db
    .select()
    .from(newsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(newsTable.publishedAt))
    .limit(100);
  res.json(ListNewsResponse.parse(rows));
});

export default router;
