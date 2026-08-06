---
name: Express req augmentation
description: How to extend Express.Request in this monorepo.
---
Extend `Express.Request` (e.g. `userId`, `isAdmin`) via a `src/types.d.ts` using the global namespace form (`declare global { namespace Express { interface Request {...} } }` or plain `namespace Express`), not `declare module 'express'`.
**Why:** The `declare module` form failed typecheck under this monorepo's TS setup.
