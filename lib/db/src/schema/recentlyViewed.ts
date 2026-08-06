import { pgTable, text, serial, timestamp, unique } from "drizzle-orm/pg-core";

export const recentlyViewedTable = pgTable(
  "recently_viewed",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    itemType: text("item_type").notNull(),
    itemId: text("item_id").notNull(),
    title: text("title").notNull(),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("recent_user_item_unique").on(t.userId, t.itemType, t.itemId)],
);

export type RecentlyViewed = typeof recentlyViewedTable.$inferSelect;
