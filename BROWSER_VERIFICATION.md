# Browser Verification (Auth-Aware) v2

This repository includes a next-version browser verifier focused on **evidence-based UI quality** and rejection of false claims.

## Core capabilities
- Auth-aware route verification (session cookie or UI login flow).
- Optional migration + temp-user provisioning hooks.
- Required selector/text/style checks per route.
- Full-page screenshot capture and DOM snapshot artifacts.
- Optional baseline-hash comparison for visual change detection.
- Structured JSON report + optional HTML report generation.

## Files
- `tools/browser-verify.mjs`
- `tools/browser-verify-report.mjs`
- `browser-verify.config.json`
- `browser-verify.config.example.json`
- `plugins/.../agents/browser-visual-verification-specialist.agent.md`
- `plugins/.../skills/browser-auth-visual-verifier/SKILL.md`

## Typical flow
1. Configure routes/auth in `browser-verify.config.json`.
2. Run `node tools/browser-verify.mjs browser-verify.config.json`.
3. Generate readable report: `node tools/browser-verify-report.mjs`.
4. Fail completion if required checks fail.
