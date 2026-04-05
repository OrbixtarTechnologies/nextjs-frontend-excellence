# Next.js UI/UX Excellence Copilot Plugin

A production-grade GitHub Copilot CLI plugin for **elite Next.js UI/UX delivery**.

This plugin packages:
- **Custom agents** for frontend architecture, delivery, and design-system governance
- **Multi-file skills** for repo bootstrapping, premium frontend execution, design-system governance, and UX state integrity
- **Hooks** to remind Copilot to verify truthfulness, states, accessibility, and system coherence
- **MCP placeholder config** for future repo-specific design/documentation integrations

## What this plugin is designed to enforce
- Truthfulness over appearance
- No fake pages, fake data, or fake dashboards
- No hallucinated APIs, schemas, fields, or product behavior
- Premium launch-ready UI quality
- Strong spacing, hierarchy, typography, responsiveness, and accessibility
- Reuse of existing project design systems where strong
- Standardization around top-tier UI foundations when a repo is weak or fragmented

## Preferred UI foundation
When a repo needs a stronger UI base, this plugin biases toward:
1. **shadcn/ui**
2. **Radix UI primitives**
3. **Tailwind CSS**
4. **lucide-react**
5. Carefully selected custom primitives only when justified

## Included agents
- `nextjs-ui-architect`
- `nextjs-ui-builder`
- `nextjs-design-system-curator`

## Included skills
- `nextjs-ui-system-generator`
- `premium-frontend-delivery`
- `design-system-governance`
- `ux-state-integrity`

## Install
Install with Copilot CLI from a local path or repository, according to your Copilot CLI setup.

## Core usage pattern
Inside a Next.js repository, ask Copilot to:
- inspect the repository
- determine the minimum justified repo-local frontend Copilot assets
- generate those repo-level instructions, agents, prompts, and skills only where justified

Example request:

```text
Use the nextjs-ui-architect agent and the nextjs-ui-system-generator skill.
Inspect this repository and generate the minimum strong set of repo-local frontend Copilot assets required for premium, truthful, production-grade UI delivery.
Do not invent repo facts. Generate only what the repository justifies.
```

## Expected outcomes
This plugin is intended to help Copilot behave more like:
- a principal frontend architect
- a staff-plus UI engineer
- a senior UX systems thinker

rather than a generic code assistant.
