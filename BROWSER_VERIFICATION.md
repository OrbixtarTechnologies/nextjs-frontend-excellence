# Browser Verification (Auth-Aware, Design-Grade)

This repository includes a next-version browser verification system to validate UI/UX claims with real rendered evidence.

## Core tool
- `tools/browser-verify.mjs`

## What it verifies
- Route reachability and render status.
- Required selectors and required text.
- Forbidden selectors (negative checks).
- Auth-protected pages using local session cookie or storage state.
- Screenshot capture per route.
- Baseline hash comparison for visual drift detection.

## Auth support
1. `session-cookie` mode using `LOCAL_SESSION_COOKIE` (or custom env key)
2. `storage-state` mode using existing Playwright storage state file
3. Temp-user/migration setup via commands in config

## Artifacts
- `artifacts/browser-verification/*.png`
- `artifacts/browser-verification/report.json`
- `artifacts/browser-verification/report.md`
- optional baseline images in `artifacts/browser-baseline/`

## Usage
1. Copy `browser-verify.config.example.json` to `browser-verify.config.json`.
2. Set auth/migration commands and routes for your app.
3. Run: `node tools/browser-verify.mjs browser-verify.config.json`.

## Anti-false-claim rule
UI tasks are not complete unless browser verification artifacts prove requested public/auth routes and checks pass.
