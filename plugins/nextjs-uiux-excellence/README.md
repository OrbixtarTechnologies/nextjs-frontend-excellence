# Next.js UI/UX Excellence Plugin

A production-grade plugin for building **outstanding, broad, and fully professional Next.js applications** with premium UI kits, scalable layout systems, and truthful product behavior.

## What this plugin now enforces
- Multi-agent execution model for frontend, backend, QA, security, DevOps, architecture, and documentation.
- Premium UI implementation guidance for leading ecosystems:
  - **shadcn/ui + Radix UI + Tailwind CSS**
  - **MUI (Material UI)**
  - **Ant Design**
  - **Chakra UI**
  - **Mantine**
  - **NextUI / HeroUI**
- Layout architecture standards for:
  - marketing websites
  - SaaS dashboards
  - e-commerce storefronts
  - B2B portals/admin tools
  - docs/knowledge base products
- Truthful delivery standards (no fake actions, no fake data, complete loading/empty/error states).

## Includes
- 10 specialized professional agents.
- 5 operational skills for system generation, delivery, audit, backend rigor, and team bootstrap.
- Pre-task and post-task quality hooks.
- MCP placeholder for future integrations.

## Installation
For full instructions see `docs/INSTALLATION.md`.

### Marketplace install
1. Add/enable marketplace source.
2. Install `nextjs-uiux-excellence`.
3. Reload runtime if needed.

### Direct/local install
1. Copy plugin folder to your local plugins directory.
2. Preserve folder structure (`agents/`, `skills/`, `guides/`, `docs/`, `plugin.json`, `hooks.json`).
3. Reload plugin registry/runtime.
4. Verify plugin discovery.

## Recommended usage sequence
1. Run **product-requirements-owner** to refine scope.
2. Run **nextjs-ui-architect** for stack + layout strategy.
3. Run **nextjs-design-system-curator** for token + component governance.
4. Run **nextjs-ui-builder** for implementation.
5. Run **qa-test-architect** and **principal-code-reviewer** before merge.

## Professional quality bar
- Accessibility (WCAG-conscious structure, keyboard support, visible focus states).
- Responsive behavior from mobile through 2xl desktop.
- Predictable interaction states and optimistic UI only when safe.
- Strong hierarchy, spacing rhythm, typography discipline, and reduced visual noise.
- Performance-aware rendering and route-level loading strategies.


## Revamp mode (0 → 100 redesign)
When the user says **"revamp"**, treat it as authorization to redesign from scratch with a different strategy, not incremental polishing.

### Revamp execution contract
1. Re-evaluate the problem from zero assumptions.
2. Propose a new UX strategy, IA, component system, and layout architecture.
3. Replace existing structure where needed (while preserving required business functionality).
4. Present clear before/after scope and migration impact.

### Scope obedience contract
Always take user wording literally for scope:
- **"whole app"** = all routes/surfaces impacted, including shared layouts/components.
- **"entire module/feature"** = all screens and flows in that module.
- **"this page/section/component"** = only that bounded scope unless dependencies must change.
- If percent/portion is given (e.g., 30%, 70%), implement only that requested coverage and report what is intentionally out of scope.

Never downscope silently. If scope is ambiguous, force explicit interpretation before implementation.


## Broader design + architecture layer (v3)
This plugin now includes an explicit architecture-and-strategy layer for large redesigns:
- `guides/ARCHITECTURE_BLUEPRINTS.md` for system-level structure patterns.
- `guides/DESIGN_STRATEGIES.md` for visual/product strategy selection.
- `skills/broader-design-architecture-overhaul/SKILL.md` for full-spectrum transformation workflow.

### Expected behavior on broad upgrade requests
- pick one design strategy deliberately
- pick one architecture blueprint deliberately
- produce migration map (keep/replace/deprecate/new)
- execute by priority slices while preserving truthful status reporting


## Documentation index
- `docs/INSTALLATION.md` — full setup and verification steps.
- `docs/QUICKSTART.md` — fastest activation workflow.
- `docs/USE_CASES.md` — common real-world implementation scenarios.
- `docs/FILE_STRUCTURE.md` — maintainers guide to plugin layout.
- `CHANGELOG.md` — version history and release highlights.

## Practical use cases
- Whole-app revamp with new design strategy and architecture blueprint.
- Enterprise dashboard modernization and consistency hardening.
- Marketing/product UI unification with shared design tokens.
- Partial-scope redesign with strict boundaries and out-of-scope reporting.


## Ownership and repository mode
- Built and maintained by **Orbixtar Technologies**.
- Repository distribution follows a single merged main branch model with root-level documentation.


## Live latest-docs enforcement
- Agent: `agents/nextjs-latest-docs-researcher.agent.md`
- Skill: `skills/nextjs-live-docs-verifier/SKILL.md`
- Sources registry: `tools/LATEST_DOCS_SOURCES.md`
- Repository policy: `NEXTJS_LIVE_DOCS_POLICY.md`


## Post verification and release tooling
- Integrity: `bash tools/validate-plugin-integrity.sh`
- Full suite: `bash tools/post-verification-suite.sh`
- Report: `bash tools/generate-plugin-report.sh`
- Operations doc: `docs/OPERATIONS.md`


## Browser visual verifier (auth-aware)
- Agent: `agents/browser-visual-verification-specialist.agent.md`
- Skill: `skills/browser-auth-visual-verifier/SKILL.md`
- Tool: `node tools/browser-verify.mjs browser-verify.config.json`
- Policy: reject false claims using screenshot + selector/text evidence for both public and auth-protected pages.


### Browser verifier v2 features
- selector/text/style assertions
- screenshot + DOM snapshot artifacts
- baseline-hash comparison mode
- JSON + HTML verification reports
