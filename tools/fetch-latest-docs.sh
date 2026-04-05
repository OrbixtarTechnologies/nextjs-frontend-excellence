#!/usr/bin/env bash
set -euo pipefail

echo "[docs-sync] Fetching headers from official docs sources..."

sources=(
  "https://nextjs.org/docs"
  "https://react.dev"
  "https://nodejs.org/docs"
  "https://ui.shadcn.com"
  "https://mui.com"
  "https://ant.design"
  "https://chakra-ui.com"
  "https://mantine.dev"
  "https://www.heroui.com"
  "https://typescriptlang.org/docs"
  "https://eslint.org/docs/latest"
  "https://prettier.io/docs"
  "https://tailwindcss.com/docs"
)

for url in "${sources[@]}"; do
  echo "\n==> $url"
  curl -sI "$url" | head -n 6 || true
done

echo "\n[docs-sync] Completed at $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
