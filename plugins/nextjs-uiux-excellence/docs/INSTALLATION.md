# Installation Guide

## Prerequisites
- Codex/agent runtime that supports plugins.
- Access to a Next.js repository where this plugin will be used.

## Option A: Marketplace installation
1. Add/enable the marketplace source that contains `nextjs-uiux-excellence`.
2. Search for `nextjs-uiux-excellence`.
3. Install the latest version.
4. Restart or reload your agent runtime if required.

## Option B: Direct/local installation
1. Copy `plugins/nextjs-uiux-excellence/` into your plugin directory.
2. Ensure the directory preserves this structure:
   - `plugin.json`
   - `hooks.json`
   - `agents/`
   - `skills/`
   - `guides/`
   - `docs/`
3. Reload plugin registry/runtime.
4. Verify plugin appears in active plugin list.

## Post-install verification checklist
- `plugin.json` is parseable JSON.
- `hooks.json` is parseable JSON.
- Agents are discoverable under `agents/`.
- Skills are discoverable under `skills/`.
- Guides are readable under `guides/`.

## Troubleshooting
- Plugin not detected: confirm folder name and path.
- Hooks not firing: confirm runtime supports plugin hooks and event names.
- Skills missing: confirm nested skill folders each include `SKILL.md`.
