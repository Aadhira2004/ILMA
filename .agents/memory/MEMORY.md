# Memory Index

- [Clerk session claims](clerk-session-claims.md) — Replit-managed Clerk exposes email/firstName/lastName in sessionClaims; never assume fullName/imageUrl; JIT-provision from claims only, no clerkClient calls in request path.
- [Orval zod import fix](orval-zod-v4.md) — orval emits zod v4 APIs; codegen script must sed the generated import to 'zod/v4' or typecheck breaks.
- [Express req augmentation](express-req-augmentation.md) — extend Express.Request via a global-namespace d.ts; the `declare module 'express'` form fails typecheck in this monorepo.
- [Post-merge script](post-merge-lockfile.md) — task merges add deps without lockfile updates; post-merge must use `pnpm install --no-frozen-lockfile` and drizzle `push-force` (timeout 120s).
- [Splash screen vs screenshots](splash-screen.md) — ILMA shows a 1.8s splash on first load per session (sessionStorage-gated); screenshots of fresh sessions often capture it, not a bug.
- [Admin bootstrap](admin-bootstrap.md) — first user row ever provisioned becomes admin (deliberate convention); promote others via SQL is_admin=true.
