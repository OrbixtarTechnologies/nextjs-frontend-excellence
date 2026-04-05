#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="plugins/nextjs-uiux-excellence"

required_files=(
  "$PLUGIN_DIR/plugin.json"
  "$PLUGIN_DIR/hooks.json"
  "$PLUGIN_DIR/README.md"
  "$PLUGIN_DIR/CHANGELOG.md"
  "$PLUGIN_DIR/docs/INSTALLATION.md"
  "$PLUGIN_DIR/docs/QUICKSTART.md"
  "$PLUGIN_DIR/docs/USE_CASES.md"
  "$PLUGIN_DIR/guides/ARCHITECTURE_BLUEPRINTS.md"
  "$PLUGIN_DIR/guides/DESIGN_STRATEGIES.md"
)

echo "[integrity] Checking required files..."
for f in "${required_files[@]}"; do
  [[ -f "$f" ]] || { echo "Missing required file: $f"; exit 1; }
done

echo "[integrity] Validating JSON files..."
jq . "$PLUGIN_DIR/plugin.json" >/dev/null
jq . "$PLUGIN_DIR/hooks.json" >/dev/null

agent_count=$(find "$PLUGIN_DIR/agents" -maxdepth 1 -name '*.agent.md' | wc -l | tr -d ' ')
skill_count=$(find "$PLUGIN_DIR/skills" -mindepth 2 -maxdepth 2 -name 'SKILL.md' | wc -l | tr -d ' ')

echo "[integrity] Agents: $agent_count"
echo "[integrity] Skills: $skill_count"

[[ "$agent_count" -ge 10 ]] || { echo "Expected at least 10 agents"; exit 1; }
[[ "$skill_count" -ge 6 ]] || { echo "Expected at least 6 skills"; exit 1; }

echo "[integrity] OK"
