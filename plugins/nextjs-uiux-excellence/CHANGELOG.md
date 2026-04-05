# Changelog

## 7.0.0
- Upgraded browser verification to v2 with style assertions, DOM snapshots, baseline-hash checks, and UI-login auth mode support.
- Added `tools/browser-verify-report.mjs` to generate HTML evidence reports.
- Expanded browser config templates and operations/workflow docs for professional release validation.
- Updated VS Code tasks and hooks for browser verification/report execution.
- Bumped plugin version to 7.0.0 with verification-report keywords.

## 6.0.0
- Added auth-aware browser verification system with `tools/browser-verify.mjs` and configurable routes/auth/migration setup.
- Added browser verifier agent (`browser-visual-verification-specialist`) and skill (`browser-auth-visual-verifier`).
- Added `BROWSER_VERIFICATION.md` and example config template for evidence-driven UI validation.
- Expanded operations/tasks/hooks to include browser verification and anti-false-claim checks.
- Bumped plugin version to 6.0.0 with browser/auth verification keywords.

## 5.0.0
- Added major professional tooling suite: integrity validator, post-verification suite, and report generator scripts.
- Added operations docs (`TOOLS.md`, `plugins/.../docs/OPERATIONS.md`) and VS Code tasks for verification/reporting.
- Updated hooks to include integrity/post-verification commands.
- Bumped plugin version to 5.0.0 with release-tooling keywords.

## 4.0.0
- Added Next.js live docs verification layer with new agent `nextjs-latest-docs-researcher`.
- Added new skill `nextjs-live-docs-verifier` for source-backed API/library checks.
- Added docs sources registry `plugins/nextjs-uiux-excellence/tools/LATEST_DOCS_SOURCES.md`.
- Added repository policy `NEXTJS_LIVE_DOCS_POLICY.md` and helper script `tools/fetch-latest-docs.sh`.
- Updated hooks to enforce latest-doc verification and source-backed output.
- Bumped plugin version to 4.0.0 with docs-accuracy keywords.

## 3.3.0
- Added repository-level VS Code workspace layout: `.vscode/settings.json`, `extensions.json`, `tasks.json`, `launch.json`, and snippets.
- Added `VSCODE_SETUP.md` for workspace usage and conventions.
- Updated root README with VS Code workspace section.
- Bumped plugin version to 3.3.0 and added `vscode` keyword.

## 3.2.0
- Added repository-level documentation files at project root: `README.md`, `INSTALLATION.md`, `USE_CASES.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`.
- Declared single merged main branch policy at repository level.
- Updated plugin ownership metadata to Orbixtar Technologies and bumped version to 3.2.0.

## 3.1.0
- Added detailed documentation set under `docs/`:
  - `INSTALLATION.md`
  - `QUICKSTART.md`
  - `USE_CASES.md`
  - `FILE_STRUCTURE.md`
- Expanded README with documentation index, detailed install flow, and practical use-case references.
- Bumped plugin version to 3.1.0.

## 3.0.0
- Added architecture blueprints and design strategies guides.
- Added broader design + architecture overhaul skill.
- Enforced blueprint/strategy checks in hooks.

## 2.1.0
- Added revamp-from-scratch and strict scope-obedience contracts.

## 2.0.0
- Expanded agents and skills for professional multi-kit delivery.
