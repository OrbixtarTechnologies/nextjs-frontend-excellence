# Browser Verification (Auth-Aware)

This repository supports browser-level verification to ensure UI claims are real and complete.

## Files
- `tools/browser-verify.mjs` — browser verification runner (Playwright based)
- `browser-verify.config.example.json` — config template for routes/auth/migration/temp-user setup
- `plugins/.../agents/browser-visual-verification-specialist.agent.md`
- `plugins/.../skills/browser-auth-visual-verifier/SKILL.md`

## Supported auth modes
1. Local session cookie (`LOCAL_SESSION_COOKIE` env var)
2. Temp-user provisioning command (e.g., migration + seed)

## Why this exists
To reject false claims and catch missing/incorrect UI even when it superficially looks complete.


## Next-version design verification upgrades
- Multi-viewport checks (desktop/tablet/mobile) from a single run.
- Baseline hashing support for design regression guardrails.
- Strict optional mode: `requireBaselineMatch=true` to fail when baseline mismatches or is missing.

## Commands
- Generate baseline: `node tools/browser-baseline.mjs browser-verify.config.json`
- Verify against baseline: `node tools/browser-verify.mjs browser-verify.config.json`
