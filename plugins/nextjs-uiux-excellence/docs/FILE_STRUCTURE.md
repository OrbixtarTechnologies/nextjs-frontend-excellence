# File Structure

## Root files
- `README.md` — high-level overview, quality bar, and operating contracts.
- `plugin.json` — plugin manifest, metadata, and versioning.
- `hooks.json` — pre/post-task governance hooks.
- `.mcp.json` — MCP server placeholder/config scaffold.

## Directories
- `agents/` — role-based agent instructions.
- `skills/` — reusable workflows and execution systems.
- `guides/` — architecture and design references.
- `docs/` — installation, quickstart, use-cases, and structure docs.

## How to extend
1. Add/modify agent under `agents/`.
2. Add/modify skill under `skills/<skill-name>/SKILL.md`.
3. Reference strategy/blueprint additions from `guides/`.
4. Update `README.md` + `docs/` + version in `plugin.json`.
