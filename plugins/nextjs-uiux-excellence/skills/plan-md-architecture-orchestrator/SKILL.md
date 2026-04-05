---
name: "plan-md-architecture-orchestrator"
description: "Reads PLAN.md and generates full architecture, page structure, and feature decisions with an execution-ready implementation plan."
---

# PLAN.md Architecture Orchestrator

Use this skill when the user asks to plan or architect a system from `PLAN.md`.

## Required inputs
- `PLAN.md` file path (default: repository root).
- Delivery scope (whole app/module/specific routes).
- Non-functional constraints (performance, accessibility, compliance, timeline).

## Workflow
1. Read `PLAN.md` and extract:
   - problem statement and product goals
   - users/personas and roles
   - flows and required capabilities
   - technical constraints and quality bar
2. Build architecture artifacts:
   - route groups and layout topology
   - page inventory with ownership and status (new/keep/replace/deprecate)
   - feature matrix per page
   - shared primitives and state/data boundaries
3. Resolve page-level features:
   - decide required features for each page based on `PLAN.md` priorities
   - map dependencies and API/data contracts needed for each feature
   - mark deferred items explicitly
4. Produce implementation plan:
   - phase sequencing with milestones
   - creator-agent execution order
   - acceptance criteria and verification checks
5. For dashboard plans, enforce shell architecture:
   - auth pages
   - sidebar/header/content app shell
   - responsive and accessibility requirements

## Prompting protocol
Before implementation, ask focused setup questions:
1. Confirm scope coverage (whole plan vs prioritized slice).
2. Confirm primary UI kit (if UI work is included).
3. Confirm theme/system defaults if not specified.

## Deliverables
- Architecture blueprint derived from `PLAN.md`.
- Page-feature decision table.
- Execution phases and risks.
- Test/verification matrix.

## Non-negotiables
- Every architectural decision must trace to `PLAN.md` content or explicit user instruction.
- If `PLAN.md` lacks information, stop and request targeted clarifications.
- Do not invent endpoints, schema fields, or business rules.
