---
name: Clerk session claims
description: What Replit-managed Clerk puts in sessionClaims and how to JIT-provision users from them.
---
Replit-managed Clerk session tokens are NOT guaranteed to include `email`, `firstName`, or `lastName` — in this project a real Google-OAuth login arrived with no email claim at all, producing an empty-email user row.
**Why:** Any logic keyed on email (e.g. admin allowlist) silently fails when the claim is absent.
**How to apply:** Read claims defensively; during first-time JIT provisioning ONLY, if email is missing, fall back to `clerkClient.users.getUser(userId)` to fetch email/name/image. Never call the Clerk API on the hot request path for already-provisioned users.
