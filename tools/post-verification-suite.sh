#!/usr/bin/env bash
set -euo pipefail

echo "[post-verify] Running professional post-verification suite..."

bash tools/validate-plugin-integrity.sh

# Ensure latest-doc artifacts exist
[[ -f NEXTJS_LIVE_DOCS_POLICY.md ]] || { echo "Missing NEXTJS_LIVE_DOCS_POLICY.md"; exit 1; }
[[ -f plugins/nextjs-uiux-excellence/tools/LATEST_DOCS_SOURCES.md ]] || { echo "Missing docs source registry"; exit 1; }
[[ -x tools/fetch-latest-docs.sh ]] || { echo "fetch-latest-docs.sh must be executable"; exit 1; }

# Verify version is referenced in changelog
version=$(jq -r '.version' plugins/nextjs-uiux-excellence/plugin.json)
grep -q "## ${version}" plugins/nextjs-uiux-excellence/CHANGELOG.md || {
  echo "Changelog missing heading for version ${version}"
  exit 1
}

# Verify VS Code workspace configs parse
jq . .vscode/settings.json >/dev/null
jq . .vscode/extensions.json >/dev/null
jq . .vscode/tasks.json >/dev/null
jq . .vscode/launch.json >/dev/null

echo "[post-verify] All verification checks passed for version ${version}."
