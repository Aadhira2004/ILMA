import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, resourcesTable } from "@workspace/db";
import { ListResourcesQueryParams, ListResourcesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/resources", async (req, res): Promise<void> => {
  const query = ListResourcesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { category, difficulty, topic, search } = query.data;
  const conditions: SQL[] = [];
  if (category) conditions.push(eq(resourcesTable.category, category));
  if (difficulty && difficulty !== "all") conditions.push(eq(resourcesTable.difficulty, difficulty));
  if (topic) conditions.push(eq(resourcesTable.topic, topic));
  if (search) {
    const term = `%${search}%`;
    const searchCond = or(ilike(resourcesTable.title, term), ilike(resourcesTable.description, term));
    if (searchCond) conditions.push(searchCond);
  }
  const rows = await db
    .select()
    .from(resourcesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(resourcesTable.featured), resourcesTable.title);
  res.json(ListResourcesResponse.parse(rows));
});

export default router;
