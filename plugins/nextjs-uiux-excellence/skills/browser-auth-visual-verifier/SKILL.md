---
name: "browser-auth-visual-verifier"
description: "Runs browser verification for UI/UX claims, including auth-protected flows via local session or temporary user provisioning."
---

# Browser Auth Visual Verifier

Use this skill when UI claims must be proven with real browser checks.

## Workflow
1. Define requested scope routes.
2. Prepare auth access:
   - local session cookie, or
   - temp-user provisioning command + migrations.
3. Run browser verification tool:
   - `node tools/browser-verify.mjs browser-verify.config.json`
4. Review screenshots/report and reject false completion claims.

## Enforcement
- No UI completion claim without evidence artifacts.
- Auth-protected pages must be verified with real authenticated context.
- Missing selectors/content must fail the check.
