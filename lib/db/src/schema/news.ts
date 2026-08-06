import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsTable = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(), // ai-healthcare | medical-devices | research | fda | who | healthtech
  sourceUrl: text("source_url"),
  sourceName: text("source_name"),
  trending: boolean("trending").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(newsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type NewsItem = typeof newsTable.$inferSelect;
