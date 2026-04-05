# Next.js Architecture Blueprints

Use this document when a user asks for a broader architecture redesign or full-system revamp.

## Blueprint A — Marketing + Product App Monorepo Style
- Route groups: `(marketing)`, `(app)`, `(auth)`, `(docs)`.
- Shared core: `lib/`, `types/`, `config/`, `services/`.
- UI system: `components/ui`, `components/marketing`, `components/app`, `components/docs`.
- Data strategy: server actions/route handlers with typed contracts and zod validation.

## Blueprint B — SaaS Dashboard Heavy Architecture
- Domain-first module structure: `modules/billing`, `modules/users`, `modules/analytics`, `modules/settings`.
- Unified dashboard shell with left nav, command palette, and contextual actions.
- Table/filter/query architecture with reusable list-state primitives.
- Audit logs + role-based permission boundaries.

## Blueprint C — Content + Commerce Hybrid
- CMS-backed content routes with ISR/revalidation strategy.
- Commerce surfaces split by lifecycle: discovery, product detail, cart, checkout, account.
- Shared recommendation and merchandising blocks.
- Error tolerance strategy for partial backend outages.

## Cross-cutting architecture requirements
- Every blueprint must include loading/empty/error/success states.
- Accessibility and keyboard navigation for all shared controls.
- Observability hooks for route performance and error rates.
- Strict boundary between UI composition and domain logic.
