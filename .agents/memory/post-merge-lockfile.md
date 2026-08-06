---
name: Post-merge script
description: Post-merge setup conventions for this monorepo.
---
Task-agent merges can add package.json deps without lockfile updates. `scripts/post-merge.sh` must run `pnpm install --no-frozen-lockfile` then `pnpm --filter @workspace/db run push-force`. Timeout is set to 120s.
**Why:** `--frozen-lockfile` caused SETUP_FAILED after a merge added deps.
