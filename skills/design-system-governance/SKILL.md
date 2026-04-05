---
name: "design-system-governance"
description: "Standardizes and governs Next.js design-system usage, UI kit decisions, tokens, components, and visual consistency."
---

# Design System Governance

## Use this skill for
- standardizing fragmented frontend UI
- choosing a sustainable component foundation
- reducing design drift
- improving token and component consistency

## Design-system principles
- reuse before reinventing
- standardize before scaling
- keep visual language coherent
- avoid mixing multiple design languages
- isolate exceptions deliberately

## Preferred stack
1. existing repo design system if already strong
2. shadcn/ui for app-level components
3. Radix UI primitives for behavior foundations
4. Tailwind tokens/utilities for consistency
5. custom components only for real product-specific needs

## Must inspect first
- current component library usage
- duplicated primitives
- inconsistent spacing/radius/shadow patterns
- typography inconsistency
- token sprawl
- accessibility gaps
- theme/dark-mode behavior if present

## References
- WORKFLOW.md
- CHECKLIST.md
- ANTI_PATTERNS.md
- OUTPUT_CONTRACT.md
- RUBRIC.md
