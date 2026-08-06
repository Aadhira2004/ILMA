import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { GetMeResponse } from "@workspace/api-zod";
import { requireAuth, ensureLocalUser, sessionClaimsFromReq } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  await ensureLocalUser(req.userId!, sessionClaimsFromReq(req));
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  res.json(GetMeResponse.parse(user));
});

export default router;
