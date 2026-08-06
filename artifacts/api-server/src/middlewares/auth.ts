import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

type SessionClaims = {
  email?: string;
  fullName?: string;
  imageUrl?: string;
};

/** The only email that is granted the Admin role on first login. */
const ADMIN_EMAIL = "ilmabiomedical@gmail.com";

/** Ensures the Clerk user exists in our local users table (JIT provisioning). Only ADMIN_EMAIL becomes admin. */
export async function ensureLocalUser(
  userId: string,
  claims: SessionClaims,
): Promise<{ id: string; isAdmin: boolean }> {
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (existing) return { id: existing.id, isAdmin: existing.isAdmin };

  const isAdmin = (claims.email ?? "").toLowerCase() === ADMIN_EMAIL;

  const [created] = await db
    .insert(usersTable)
    .values({
      id: userId,
      email: claims.email ?? "",
      name: claims.fullName ?? null,
      imageUrl: claims.imageUrl ?? null,
      isAdmin,
    })
    .onConflictDoNothing()
    .returning();

  if (created) return { id: created.id, isAdmin: created.isAdmin };
  const [row] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return { id: row.id, isAdmin: row.isAdmin };
}

export function sessionClaimsFromReq(req: Request): SessionClaims {
  const auth = getAuth(req);
  const claims = (auth?.sessionClaims ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);
  const composedName =
    [str(claims.firstName), str(claims.lastName)].filter(Boolean).join(" ") || undefined;
  return {
    email: str(claims.email),
    fullName: str(claims.fullName) ?? composedName,
    imageUrl: str(claims.imageUrl) ?? str(claims.image_url),
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await ensureLocalUser(userId, sessionClaimsFromReq(req));
  if (!user.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  req.userId = userId;
  req.isAdmin = true;
  next();
}
