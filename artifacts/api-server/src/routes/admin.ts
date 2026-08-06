import { Router, type IRouter } from "express";
import { count, desc, eq, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  bookmarksTable,
  newsletterSubscribersTable,
  contactMessagesTable,
  analyticsEventsTable,
  resourcesTable,
  newsTable,
  notificationsTable,
} from "@workspace/db";
import {
  GetAdminStatsResponse,
  CreateResourceBody,
  CreateResourceResponse,
  UpdateResourceParams,
  UpdateResourceBody,
  UpdateResourceResponse,
  DeleteResourceParams,
  CreateNewsBody,
  CreateNewsResponse,
  UpdateNewsParams,
  UpdateNewsBody,
  UpdateNewsResponse,
  DeleteNewsParams,
  CreateNotificationBody,
  CreateNotificationResponse,
  ListSubscribersResponse,
  ListMessagesResponse,
  MarkMessageReadParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [users] = await db.select({ n: count() }).from(usersTable);
  const [bookmarks] = await db.select({ n: count() }).from(bookmarksTable);
  const [subs] = await db.select({ n: count() }).from(newsletterSubscribersTable);
  const [unread] = await db
    .select({ n: count() })
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.read, false));
  const [views] = await db.select({ n: count() }).from(analyticsEventsTable);
  const popular = await db
    .select({
      itemType: analyticsEventsTable.itemType,
      itemId: analyticsEventsTable.itemId,
      views: count(),
    })
    .from(analyticsEventsTable)
    .where(sql`${analyticsEventsTable.itemType} IS NOT NULL AND ${analyticsEventsTable.itemId} IS NOT NULL`)
    .groupBy(analyticsEventsTable.itemType, analyticsEventsTable.itemId)
    .orderBy(desc(count()))
    .limit(20);
  res.json(
    GetAdminStatsResponse.parse({
      totalUsers: users.n,
      totalBookmarks: bookmarks.n,
      subscriberCount: subs.n,
      unreadMessages: unread.n,
      pageViews: views.n,
      popularItems: popular,
    }),
  );
});

router.post("/admin/resources", async (req, res): Promise<void> => {
  const parsed = CreateResourceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(resourcesTable).values(parsed.data).returning();
  res.status(201).json(CreateResourceResponse.parse(row));
});

router.patch("/admin/resources/:id", async (req, res): Promise<void> => {
  const params = UpdateResourceParams.safeParse(req.params);
  const body = UpdateResourceBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db
    .update(resourcesTable)
    .set(body.data)
    .where(eq(resourcesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateResourceResponse.parse(row));
});

router.delete("/admin/resources/:id", async (req, res): Promise<void> => {
  const params = DeleteResourceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(resourcesTable).where(eq(resourcesTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/admin/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json(CreateNewsResponse.parse(row));
});

router.patch("/admin/news/:id", async (req, res): Promise<void> => {
  const params = UpdateNewsParams.safeParse(req.params);
  const body = UpdateNewsBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db.update(newsTable).set(body.data).where(eq(newsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateNewsResponse.parse(row));
});

router.delete("/admin/news/:id", async (req, res): Promise<void> => {
  const params = DeleteNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/admin/notifications", async (req, res): Promise<void> => {
  const parsed = CreateNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(notificationsTable).values(parsed.data).returning();
  res.status(201).json(CreateNotificationResponse.parse({ ...row, read: false }));
});

router.get("/admin/subscribers", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(desc(newsletterSubscribersTable.createdAt));
  res.json(ListSubscribersResponse.parse(rows));
});

router.get("/admin/messages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
  res.json(ListMessagesResponse.parse(rows));
});

router.post("/admin/messages/:id/read", async (req, res): Promise<void> => {
  const params = MarkMessageReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.update(contactMessagesTable).set({ read: true }).where(eq(contactMessagesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
