#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const configPath = process.argv[2] || 'browser-verify.config.json';
if (!fs.existsSync(configPath)) {
  console.error(`[browser-baseline] Missing config: ${configPath}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.baselineDir = config.baselineDir || 'artifacts/browser-baseline';
config.outputDir = config.baselineDir;
config.requireBaselineMatch = false;

const tmp = path.resolve('.browser-baseline.tmp.json');
fs.writeFileSync(tmp, JSON.stringify(config, null, 2));
console.log(`[browser-baseline] Generating baselines to ${config.baselineDir}`);

const { spawnSync } = await import('node:child_process');
const run = spawnSync(process.execPath, ['tools/browser-verify.mjs', tmp], { stdio: 'inherit' });
try { fs.unlinkSync(tmp); } catch {}
process.exit(run.status ?? 1);
