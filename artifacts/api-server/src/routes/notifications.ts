import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, notificationsTable, notificationReadsTable } from "@workspace/db";
import { ListNotificationsResponse, MarkNotificationReadParams } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const notifications = await db
    .select()
    .from(notificationsTable)
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);
  const reads = await db
    .select({ notificationId: notificationReadsTable.notificationId })
    .from(notificationReadsTable)
    .where(eq(notificationReadsTable.userId, req.userId!));
  const readIds = new Set(reads.map((r) => r.notificationId));
  const result = notifications.map((n) => ({ ...n, read: readIds.has(n.id) }));
  res.json(ListNotificationsResponse.parse(result));
});

router.post("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .insert(notificationReadsTable)
    .values({ userId: req.userId!, notificationId: params.data.id })
    .onConflictDoNothing();
  res.sendStatus(204);
});

router.post("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  const notifications = await db.select({ id: notificationsTable.id }).from(notificationsTable);
  if (notifications.length > 0) {
    await db
      .insert(notificationReadsTable)
      .values(notifications.map((n) => ({ userId: req.userId!, notificationId: n.id })))
      .onConflictDoNothing();
  }
  res.sendStatus(204);
});

export default router;
