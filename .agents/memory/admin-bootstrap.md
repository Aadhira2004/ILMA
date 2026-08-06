---
name: Admin bootstrap
description: How the first admin is designated.
---
The first user row ever JIT-provisioned in `users` gets `is_admin=true` (deliberate convention chosen with the user). Additional admins are promoted via SQL (`UPDATE users SET is_admin = true WHERE ...`). Admin routes are gated by `requireAdmin` on the server.
**Why:** Whitelabel Clerk setup has no dashboard role management here.
