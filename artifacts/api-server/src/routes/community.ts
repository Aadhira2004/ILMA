import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribersTable, contactMessagesTable, analyticsEventsTable } from "@workspace/db";
import { SubscribeNewsletterBody, SubmitContactBody, TrackEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

// naive in-memory rate limiter: max N events per IP per minute
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(key: string, max: number): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateBuckets) if (now > v.resetAt) rateBuckets.delete(k);
}, 300_000).unref();

router.post("/newsletter", async (req, res): Promise<void> => {
  if (!rateLimit(`nl:${req.ip}`, 5)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const email = parsed.data.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Already subscribed" });
    return;
  }
  await db.insert(newsletterSubscribersTable).values({ email }).onConflictDoNothing();
  res.sendStatus(201);
});

router.post("/contact", async (req, res): Promise<void> => {
  if (!rateLimit(`ct:${req.ip}`, 5)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(contactMessagesTable).values(parsed.data);
  res.sendStatus(201);
});

router.post("/track", async (req, res): Promise<void> => {
  if (!rateLimit(`tr:${req.ip}`, 60)) {
    res.sendStatus(204);
    return;
  }
  const parsed = TrackEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.sendStatus(204); // tracking is best-effort; never error the client
    return;
  }
  await db.insert(analyticsEventsTable).values(parsed.data);
  res.sendStatus(204);
});

export default router;
