# Next.js Frontend Excellence

A centralized, single-mainline repository for the **nextjs-uiux-excellence** system.

## Ownership
This system is owned and built by **Orbixtar Technologies**.

## Branch policy
- This repository is maintained as a **single merged main branch** delivery stream.
- Changes should be integrated as cohesive updates that preserve one canonical source of truth.

## What is included
- Enterprise-grade plugin package under `plugins/nextjs-uiux-excellence/`.
- Multi-agent delivery model for frontend, backend, QA, security, DevOps, architecture, and docs.
- Revamp-from-scratch workflows and strict scope obedience.
- Broader architecture blueprints and design strategies.

## Repository-level documentation
- `INSTALLATION.md`
- `USE_CASES.md`
- `ARCHITECTURE.md`
- `CONTRIBUTING.md`

## Plugin package
Primary package location:
- `plugins/nextjs-uiux-excellence/`


## VS Code professional workspace
- Full workspace configuration is included in `.vscode/`.
- Setup guide: `VSCODE_SETUP.md`.


## Live docs accuracy policy
- See `NEXTJS_LIVE_DOCS_POLICY.md` for mandatory latest-doc verification rules.
- Use `tools/fetch-latest-docs.sh` to quickly inspect current docs endpoints.


## Post-verification toolkit
- `TOOLS.md` documents integrity checks, post-verification, docs fetch, and report generation.
- Preferred command: `bash tools/post-verification-suite.sh`.


## Browser verification and anti-false-claim checks
- `BROWSER_VERIFICATION.md` defines auth-aware browser validation workflow.
- Browser tool: `node tools/browser-verify.mjs browser-verify.config.json`.
- Supports local session cookie and temp-user/migration setup for auth-protected routes.
