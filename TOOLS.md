# Professional Tooling Suite

This repository includes a professional verification and reporting toolkit for the `nextjs-uiux-excellence` system.

## Verification tools
- `tools/validate-plugin-integrity.sh` — checks required files, JSON validity, and minimum agent/skill counts.
- `tools/post-verification-suite.sh` — runs full post-verification checks including changelog/version sync and VS Code config validation.
- `tools/fetch-latest-docs.sh` — inspects official docs endpoints for live-docs workflows.

## Browser/visual tools
- `tools/browser-verify.mjs [config.json]` — verifies routes in real browser context, including auth-protected pages and baseline checks.
- `tools/browser-baseline.mjs [config.json]` — generates design baselines from configured routes/viewports.

## Reporting tools
- `tools/generate-plugin-report.sh [output.md]` — generates a system summary report.

## Recommended sequence
1. `bash tools/validate-plugin-integrity.sh`
2. `bash tools/post-verification-suite.sh`
3. `bash tools/generate-plugin-report.sh`
