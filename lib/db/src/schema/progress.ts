import { pgTable, text, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const progressTable = pgTable(
  "roadmap_progress",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    roadmapId: text("roadmap_id").notNull(),
    phase: text("phase").notNull(), // beginner | intermediate | advanced
    topicIndex: integer("topic_index").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("progress_user_topic_unique").on(t.userId, t.roadmapId, t.phase, t.topicIndex),
  ],
);

export type ProgressEntry = typeof progressTable.$inferSelect;
