# Operations & Post-Verification

## Objective
Guarantee each release is professional, verifiable, and aligned with policy.

## Required checks
1. Plugin integrity: `bash tools/validate-plugin-integrity.sh`
2. Full post-verification: `bash tools/post-verification-suite.sh`
3. Optional report: `bash tools/generate-plugin-report.sh`
4. Browser auth/visual verification: `node tools/browser-verify.mjs browser-verify.config.json`

## Release gate
A release should not be marked complete unless post-verification passes and version/changelog are synchronized.

Use browser verification for UI-heavy tasks to reject false positives and validate auth-protected surfaces.
