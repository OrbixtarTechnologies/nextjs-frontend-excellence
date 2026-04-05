# Operations & Post-Verification

## Objective
Guarantee each release is professional, verifiable, and aligned with policy.

## Required checks
1. Plugin integrity: `bash tools/validate-plugin-integrity.sh`
2. Full post-verification: `bash tools/post-verification-suite.sh`
3. Optional report: `bash tools/generate-plugin-report.sh`

## Release gate
A release should not be marked complete unless post-verification passes and version/changelog are synchronized.
