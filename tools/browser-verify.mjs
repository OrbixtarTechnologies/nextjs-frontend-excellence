#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';

const nowIso = () => new Date().toISOString();
const log = (m) => process.stdout.write(`[browser-verify] ${m}\n`);

function readJson(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) throw new Error(`Config not found: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function runCmd(label, cmd) {
  if (!cmd) return;
  log(`Running ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function toSafeName(routePath) {
  return (routePath || 'root').replace(/[^a-zA-Z0-9-_]/g, '_') || 'root';
}

function writeMarkdownReport(reportPath, summary) {
  const lines = [];
  lines.push('# Browser Verification Report', '');
  lines.push(`- Generated: ${summary.generatedAt}`);
  lines.push(`- Base URL: ${summary.baseUrl}`);
  lines.push(`- Total: ${summary.total}`);
  lines.push(`- Passed: ${summary.passed}`);
  lines.push(`- Failed: ${summary.failed}`, '');

  for (const r of summary.results) {
    lines.push(`## ${r.url}`);
    lines.push(`- Status: ${r.pass ? 'PASS' : 'FAIL'}`);
    if (r.error) lines.push(`- Error: ${r.error}`);
    if (r.screenshot) lines.push(`- Screenshot: ${r.screenshot}`);
    if (r.visualDiff) {
      lines.push(`- Visual comparison: ${r.visualDiff.same ? 'same' : 'different'}`);
      lines.push(`- Baseline: ${r.visualDiff.baselinePath}`);
      lines.push(`- Current hash: ${r.visualDiff.currentHash}`);
      lines.push(`- Baseline hash: ${r.visualDiff.baselineHash || 'N/A'}`);
    }
    lines.push('');
  }

  fs.writeFileSync(reportPath, lines.join('\n'));
}

async function main() {
  const configPath = process.argv[2] || 'browser-verify.config.json';
  const config = readJson(configPath);

  runCmd('migration command', config.migrateCommand);
  runCmd('temp-user command', config.tempUserCommand);
  runCmd('pre-auth command', config.preAuthCommand);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    throw new Error('playwright is required. Install with: npm i -D playwright');
  }

  if (!config.baseUrl) throw new Error('baseUrl is required');
  if (!Array.isArray(config.routes) || config.routes.length === 0) {
    throw new Error('routes[] is required');
  }

  const outDir = path.resolve(config.outputDir || 'artifacts/browser-verification');
  ensureDir(outDir);

  const contextOpts = {};
  if (config.auth?.mode === 'storage-state' && config.auth.storageStatePath) {
    contextOpts.storageState = path.resolve(config.auth.storageStatePath);
  } else if (config.storageStatePath) {
    contextOpts.storageState = path.resolve(config.storageStatePath);
  }

  const browser = await playwright.chromium.launch({ headless: config.headless !== false });
  const context = await browser.newContext(contextOpts);

  if (config.auth?.mode === 'session-cookie') {
    const envKey = config.auth.cookieEnv || 'LOCAL_SESSION_COOKIE';
    const cookieValue = process.env[envKey];
    if (!cookieValue) throw new Error(`Missing env var for session cookie: ${envKey}`);

    await context.addCookies([{ 
      name: config.auth.cookieName || 'session',
      value: cookieValue,
      domain: config.auth.domain || 'localhost',
      path: '/',
      httpOnly: true,
      secure: !!config.auth.secure,
      sameSite: config.auth.sameSite || 'Lax'
    }]);
  }

  const page = await context.newPage();
  const results = [];
  const baselineDir = config.baselineDir ? path.resolve(config.baselineDir) : null;
  if (baselineDir) ensureDir(baselineDir);

  for (const routeCfg of config.routes) {
    const routePath = routeCfg.path || routeCfg;
    const url = `${config.baseUrl.replace(/\/$/, '')}${routePath.startsWith('/') ? '' : '/'}${routePath}`;
    const safe = toSafeName(routePath);
    const screenshotPath = path.join(outDir, `${safe}.png`);
    const result = { url, pass: true, checks: [], startedAt: nowIso() };

    try {
      await page.goto(url, { waitUntil: config.waitUntil || 'networkidle', timeout: config.timeoutMs || 30000 });

      if (Array.isArray(routeCfg.requiredSelectors)) {
        for (const sel of routeCfg.requiredSelectors) {
          const visible = await page.locator(sel).first().isVisible({ timeout: config.selectorTimeoutMs || 5000 }).catch(() => false);
          result.checks.push({ type: 'required-selector', selector: sel, pass: visible });
          if (!visible) result.pass = false;
        }
      }

      if (Array.isArray(routeCfg.forbiddenSelectors)) {
        for (const sel of routeCfg.forbiddenSelectors) {
          const visible = await page.locator(sel).first().isVisible({ timeout: 1000 }).catch(() => false);
          const pass = !visible;
          result.checks.push({ type: 'forbidden-selector', selector: sel, pass });
          if (!pass) result.pass = false;
        }
      }

      if (Array.isArray(routeCfg.requiredText)) {
        const bodyText = (await page.textContent('body')) || '';
        for (const txt of routeCfg.requiredText) {
          const found = bodyText.includes(txt);
          result.checks.push({ type: 'required-text', text: txt, pass: found });
          if (!found) result.pass = false;
        }
      }

      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;

      if (baselineDir) {
        const baselinePath = path.join(baselineDir, `${safe}.png`);
        const currentHash = sha256(screenshotPath);
        let baselineHash = null;
        let same = false;

        if (fs.existsSync(baselinePath)) {
          baselineHash = sha256(baselinePath);
          same = currentHash === baselineHash;
        } else if (config.autoApproveNewBaseline) {
          fs.copyFileSync(screenshotPath, baselinePath);
          baselineHash = currentHash;
          same = true;
        }

        result.visualDiff = { baselinePath, currentHash, baselineHash, same };

        if (config.failOnVisualDiff && baselineHash && !same) {
          result.pass = false;
        }
      }
    } catch (err) {
      result.pass = false;
      result.error = String(err?.message || err);
    }

    result.finishedAt = nowIso();
    results.push(result);
  }

  if (config.saveStorageStatePath) {
    await context.storageState({ path: path.resolve(config.saveStorageStatePath) });
  }

  await browser.close();

  runCmd('post-auth command', config.postAuthCommand);

  const summary = {
    generatedAt: nowIso(),
    baseUrl: config.baseUrl,
    total: results.length,
    passed: results.filter(r => r.pass).length,
    failed: results.filter(r => !r.pass).length,
    results
  };

  const jsonReportPath = path.join(outDir, 'report.json');
  const mdReportPath = path.join(outDir, 'report.md');
  fs.writeFileSync(jsonReportPath, JSON.stringify(summary, null, 2));
  writeMarkdownReport(mdReportPath, summary);

  log(`JSON report: ${jsonReportPath}`);
  log(`Markdown report: ${mdReportPath}`);

  if (summary.failed > 0) {
    log(`FAILED: ${summary.failed}/${summary.total} routes failed verification.`);
    process.exit(2);
  }

  log(`PASS: ${summary.passed}/${summary.total} routes passed verification.`);
}

main().catch((err) => {
  process.stderr.write(`[browser-verify] ERROR: ${err.message}\n`);
  process.exit(1);
});
