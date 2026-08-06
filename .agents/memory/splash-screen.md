---
name: Splash screen vs screenshots
description: ILMA first-load splash and screenshot verification.
---
ILMA shows a 1.8s "Loading ILMA..." splash on the first load per browser session (sessionStorage key `ilma-splash-shown`). Fresh-session screenshots often capture the splash — not a bug.
**How to apply:** When screenshot-verifying, retry or rely on log/HTTP checks; e2e testers should wait past the splash.
