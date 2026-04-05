#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="plugins/nextjs-uiux-excellence"
OUT="${1:-plugin-system-report.md}"
version=$(jq -r '.version' "$PLUGIN_DIR/plugin.json")
agent_count=$(find "$PLUGIN_DIR/agents" -maxdepth 1 -name '*.agent.md' | wc -l | tr -d ' ')
skill_count=$(find "$PLUGIN_DIR/skills" -mindepth 2 -maxdepth 2 -name 'SKILL.md' | wc -l | tr -d ' ')

cat > "$OUT" <<REPORT
# Plugin System Report

- Version: $version
- Agents: $agent_count
- Skills: $skill_count
- Generated: $(date -u +'%Y-%m-%dT%H:%M:%SZ')

## Core files
- $PLUGIN_DIR/plugin.json
- $PLUGIN_DIR/hooks.json
- $PLUGIN_DIR/README.md
- $PLUGIN_DIR/CHANGELOG.md

## Verification
Run:
\`bash tools/post-verification-suite.sh\`
REPORT

echo "[report] Wrote $OUT"
