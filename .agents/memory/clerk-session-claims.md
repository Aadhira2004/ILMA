---
name: Clerk session claims
description: What Replit-managed Clerk puts in sessionClaims and how to JIT-provision users from them.
---
Replit-managed Clerk session tokens include `email`, `firstName`, `lastName`, `username`, and `userId` (legacy bridge) in `sessionClaims`. `fullName`/`imageUrl` are NOT guaranteed — compose name from firstName+lastName.
**Why:** Assuming fullName/imageUrl leads to empty/failed JIT inserts; clerkClient calls in the request path are disallowed by the clerk-auth skill.
**How to apply:** In auth middleware, read claims defensively (string+nonempty guard), compose fallbacks, and never call the Clerk API for identity display.
