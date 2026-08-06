---
name: Orval zod import fix
description: Generated api-spec client needs zod/v4 import rewrite.
---
Orval emits zod v4-only APIs (e.g. `zod.int()`), but the root `zod` export in this monorepo resolves to v3 typings. The codegen script in `lib/api-spec/package.json` includes a `sed` step rewriting the generated import to `zod/v4`.
**Why:** Without it, typecheck fails after every codegen run.
**How to apply:** Keep the sed step when touching the codegen script; re-add if regenerating the script.
