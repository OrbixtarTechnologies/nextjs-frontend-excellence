---
name: "nextjs-ui-system-generator"
description: "Inspects a Next.js repository and generates the required repo-level frontend instructions, agents, prompts, and skills for premium truthful UI delivery."
---

# Next.js UI System Generator

Inspect the active repository and generate only the repo-level frontend Copilot assets justified by the repository.

## Required output
- UI kit recommendation (shadcn/MUI/Antd/Chakra/Mantine/NextUI)
- layout archetypes (marketing/app/docs/auth)
- shared primitives and token strategy
- route-level implementation roadmap


## Broader architecture output
For major transformations, include:
- selected blueprint + strategy references
- route-group and module migration map
- design token and component governance plan
- risk register for phased rollout

## Dashboard upgrade behavior (explicit request)
If the request explicitly says to create a dashboard or upgrade existing pages into a proper dashboard from scratch, the generated assets must enforce this workflow:
1. Ask the user to choose one UI kit from supported kits.
2. Ask for theme config for that kit, with sane defaults pre-filled.
3. Install and configure the selected kit for real.
4. Build auth pages + dashboard app shell (sidebar/header/content area).
5. Re-home existing page content into the new dashboard structure while preserving real behavior.
6. Ignore previous visual style choices unless the user explicitly asks to retain them.
