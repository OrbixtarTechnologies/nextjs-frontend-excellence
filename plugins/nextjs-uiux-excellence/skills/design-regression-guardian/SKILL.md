---
name: "design-regression-guardian"
description: "Protects UI quality via multi-viewport browser verification, baseline comparisons, and evidence-backed rejection of false completion claims."
---

# Design Regression Guardian

Use this skill for high-importance UI/UX delivery where visual fidelity and consistency must be proven.

## Workflow
1. Generate/update baseline intentionally:
   - `node tools/browser-baseline.mjs browser-verify.config.json`
2. Run verification against current build:
   - `node tools/browser-verify.mjs browser-verify.config.json`
3. Review report and screenshot evidence.
4. Reject completion when baseline mismatch or required checks fail.

## Required quality checks
- desktop/tablet/mobile coverage
- required selectors and text checks
- auth-protected route checks when applicable
