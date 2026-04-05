---
name: "broader-design-architecture-overhaul"
description: "Runs full-spectrum design and architecture overhauls for Next.js apps, including strategy reset, blueprint selection, and scoped migration planning."
---

# Broader Design + Architecture Overhaul

Use this skill when the request is to broadly upgrade, transform, or re-architect a Next.js app/plugin.

## Required inputs
- Scope: whole app / module / route set / percentage.
- Product type: marketing, SaaS dashboard, commerce, docs, hybrid.
- Constraint profile: time, risk tolerance, compatibility requirements.

## Workflow
1. Parse scope literally from user wording.
2. Select a design strategy from `guides/DESIGN_STRATEGIES.md`.
3. Select an architecture blueprint from `guides/ARCHITECTURE_BLUEPRINTS.md`.
4. Produce a migration map:
   - keep
   - replace
   - deprecate
   - new foundations
5. Execute implementation in prioritized phases with explicit state coverage.
6. Report delivered scope vs requested scope.

## Non-negotiables
- No silent downscoping.
- No fake completion claims.
- No inconsistent layout paradigms across major surfaces.
