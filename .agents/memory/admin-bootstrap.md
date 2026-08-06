---
name: Admin bootstrap
description: How the admin role is assigned on first login.
---
Admin is granted only to the email `ilmabiomedical@gmail.com` (case-insensitive check in `ensureLocalUser` during JIT provisioning). All other users get the regular User role. The old "first user ever becomes admin" convention was removed at the user's request (Aug 6, 2026); existing DB rows were reconciled via SQL.
**How to apply:** Additional admins can still be promoted manually via SQL (`UPDATE users SET is_admin = true WHERE ...`). Admin routes remain gated by `requireAdmin` server-side.
