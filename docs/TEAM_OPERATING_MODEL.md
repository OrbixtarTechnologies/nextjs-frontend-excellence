# Team Operating Model

This system uses a layered model:

1. **Global plugin layer**
   - reusable across repositories
   - ships agents, skills, hooks, and governance

2. **Repo bootstrap layer**
   - inspects the active repository
   - creates the minimum strong set of repo-local instructions, prompts, agents, and skills only when justified

3. **Execution layer**
   - specialist agents perform work within clear boundaries
   - skills provide deeper workflow discipline for recurring high-risk domains

## Core rules
- inspect first, then decide
- never invent repo facts
- never present fake implementation as complete
- keep roles separate
- use explicit handoffs
- produce honest output contracts
