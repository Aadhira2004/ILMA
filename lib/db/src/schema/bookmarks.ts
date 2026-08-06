import { pgTable, text, serial, timestamp, unique } from "drizzle-orm/pg-core";

export const bookmarksTable = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    itemType: text("item_type").notNull(), // career | domain | roadmap | exam | resource | news
    itemId: text("item_id").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("bookmarks_user_item_unique").on(t.userId, t.itemType, t.itemId)],
);

export type Bookmark = typeof bookmarksTable.$inferSelect;
