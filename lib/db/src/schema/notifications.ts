import { pgTable, text, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(), // roadmap | job | exam | news | general
  link: text("link"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notificationReadsTable = pgTable(
  "notification_reads",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    notificationId: integer("notification_id").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("notification_reads_unique").on(t.userId, t.notificationId)],
);

export type Notification = typeof notificationsTable.$inferSelect;
