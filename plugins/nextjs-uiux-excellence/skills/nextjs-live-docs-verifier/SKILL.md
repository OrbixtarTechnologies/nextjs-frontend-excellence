---
name: "nextjs-live-docs-verifier"
description: "Enforces live verification against latest official docs for Next.js, UI kits, and critical Node libraries before implementation."
---

# Next.js Live Docs Verifier

Use this skill whenever requests involve Next.js APIs, framework configuration, dependency choices, UI-kit integrations, or version-sensitive implementation details.

## Workflow
1. Identify version-sensitive topics from the request.
2. Fetch latest official docs from approved sources.
3. Compare planned implementation against current docs.
4. Record incompatibilities, deprecations, and required updates.
5. Produce citation-backed implementation guidance.

## Approved sources
- Next.js docs: `https://nextjs.org/docs`
- React docs: `https://react.dev`
- Node.js docs: `https://nodejs.org/docs`
- UI kit official docs (shadcn/ui, MUI, Antd, Chakra, Mantine, NextUI/HeroUI)
- Official package docs/repos for dependencies in scope

## Enforcement rules
- No guessed API usage.
- No stale examples from outdated versions.
- No merge recommendation without source-backed confirmation for changed APIs.
