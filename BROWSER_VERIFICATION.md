# Browser Verification (Auth-Aware, vNext)

This repository supports advanced browser-level verification to ensure UI claims are real, complete, and regression-safe.

## Files
- `tools/browser-verify.mjs` — browser verification runner (Playwright based)
- `browser-verify.config.example.json` — config template for routes/auth/viewports/migrations/baselines
- `browser-verify.config.json` — active config
- `plugins/.../agents/browser-visual-verification-specialist.agent.md`
- `plugins/.../skills/browser-auth-visual-verifier/SKILL.md`

## Advanced checks
- Multi-viewport verification (mobile/tablet/desktop)
- Required selectors and required text assertions
- HTTP status and request-failure checks
- Console-error detection
- Screenshot artifact generation
- Baseline hash comparison and optional strict diff failure

## Supported auth modes
1. Local session cookie (`LOCAL_SESSION_COOKIE` env var)
2. Temp-user provisioning command (e.g., migration + seed)

## Why this exists
To reject false claims and catch missing/incorrect UI even when it superficially looks complete.
