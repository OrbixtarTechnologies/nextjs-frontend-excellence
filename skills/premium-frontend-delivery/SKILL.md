---
name: "premium-frontend-delivery"
description: "Implements premium Next.js UI using the repo design system or top-tier UI kits with truthful product behavior and production-grade quality."
---

# Premium Frontend Delivery

## Use this skill for
- Building or refactoring Next.js pages, layouts, forms, dashboards, and flows
- Converting rough UI into premium production-quality interfaces
- Hardening frontend quality and consistency

## Required standards
- premium visual quality
- strong spacing rhythm
- clean typography hierarchy
- responsive layout discipline
- accessibility by default
- real loading, empty, error, success, unauthorized, not-found states
- truthful actions only
- real data bindings only

## Top UI kit base
Use repo-native UI first.
If introducing or improving, prefer:
- shadcn/ui as the main component layer
- Radix UI primitives underneath where useful
- lucide-react icons
- Tailwind CSS utility styling
- CVA-style component variant management if consistent with repo

## Forbidden behavior
- hardcoded production business records
- fake metrics
- dead buttons
- fake filter bars
- invented tabs
- placeholder forms that submit nowhere
- visually polished but functionally fake pages
- random styling that breaks system coherence

## References
- WORKFLOW.md
- CHECKLIST.md
- ANTI_PATTERNS.md
- OUTPUT_CONTRACT.md
- RUBRIC.md
