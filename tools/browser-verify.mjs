#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

function log(msg) {
  process.stdout.write(`[browser-verify] ${msg}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function runCmd(label, cmd) {
  if (!cmd) return;
  log(`Running ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

function normalizePath(routePath, viewportName) {
  const safeRoute = (routePath || 'root').replace(/[^a-zA-Z0-9-_]/g, '_') || 'root';
  return `${safeRoute}__${viewportName}`;
}

async function main() {
  const configArg = process.argv[2] || 'browser-verify.config.json';
  const configPath = path.resolve(configArg);
  if (!fs.existsSync(configPath)) throw new Error(`Config not found: ${configPath}`);
  const config = readJson(configPath);

  runCmd('migration command', config.migrateCommand);
  runCmd('temp-user command', config.tempUserCommand);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    throw new Error('playwright is required. Install with: npm i -D playwright');
  }

  const baseUrl = config.baseUrl;
  if (!baseUrl) throw new Error('baseUrl is required');
  if (!Array.isArray(config.routes) || config.routes.length === 0) throw new Error('routes[] is required');

  const outputDir = path.resolve(config.outputDir || 'artifacts/browser-verification');
  fs.mkdirSync(outputDir, { recursive: true });
  const baselinesDir = path.resolve(config.baselinesDir || 'artifacts/browser-baselines');
  fs.mkdirSync(baselinesDir, { recursive: true });

  const browser = await playwright.chromium.launch({ headless: config.headless !== false });
  const contextOptions = {};
  if (config.storageStatePath) contextOptions.storageState = path.resolve(config.storageStatePath);
  const context = await browser.newContext(contextOptions);

  if (config.auth?.mode === 'session-cookie') {
    const cookieEnv = config.auth.cookieEnv || 'LOCAL_SESSION_COOKIE';
    const cookieValue = process.env[cookieEnv];
    if (!cookieValue) throw new Error(`Missing env var for session cookie: ${cookieEnv}`);
    await context.addCookies([{ name: config.auth.cookieName || 'session', value: cookieValue, domain: config.auth.domain || 'localhost', path: '/', httpOnly: true, secure: false, sameSite: 'Lax' }]);
  }

  const page = await context.newPage();
  const viewports = config.viewports?.length ? config.viewports : [{ name: 'desktop', width: 1440, height: 900 }];
  const failOnConsoleErrors = config.failOnConsoleErrors !== false;
  const failOnRequestFailures = config.failOnRequestFailures !== false;

  const baselineManifestPath = path.join(baselinesDir, 'manifest.json');
  const baselineManifest = fs.existsSync(baselineManifestPath) ? readJson(baselineManifestPath) : {};
  const newManifest = { ...baselineManifest };

  const results = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of config.routes) {
      const routePath = route.path || route;
      const url = `${baseUrl.replace(/\/$/, '')}${routePath.startsWith('/') ? '' : '/'}${routePath}`;
      const routeKey = normalizePath(routePath, vp.name || `${vp.width}x${vp.height}`);

      const consoleErrors = [];
      const requestFailures = [];
      const onConsole = msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      const onReqFail = req => requestFailures.push(req.url());
      page.on('console', onConsole);
      page.on('requestfailed', onReqFail);

      const result = { route: routePath, url, viewport: vp, pass: true, checks: [], consoleErrors: [], requestFailures: [] };
      log(`Opening ${url} @ ${vp.width}x${vp.height}`);

      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: config.timeoutMs || 30000 });
        result.status = response?.status?.() ?? null;
        if (config.failOnHttpErrors !== false && result.status && result.status >= 400) {
          result.pass = false;
          result.checks.push({ type: 'http-status', status: result.status, ok: false });
        }

        if (Array.isArray(route.requiredSelectors)) {
          for (const sel of route.requiredSelectors) {
            const visible = await page.locator(sel).first().isVisible({ timeout: config.selectorTimeoutMs || 5000 }).catch(() => false);
            result.checks.push({ type: 'selector', selector: sel, visible });
            if (!visible) result.pass = false;
          }
        }

        if (Array.isArray(route.requiredText)) {
          const bodyText = await page.textContent('body');
          for (const text of route.requiredText) {
            const found = bodyText?.includes(text) || false;
            result.checks.push({ type: 'text', text, found });
            if (!found) result.pass = false;
          }
        }

        const perf = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          return nav ? { domContentLoaded: nav.domContentLoadedEventEnd, loadEvent: nav.loadEventEnd } : {};
        });
        result.performance = perf;

        const screenshotPath = path.join(outputDir, `${routeKey}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        result.screenshot = screenshotPath;

        const hash = sha256File(screenshotPath);
        result.screenshotHash = hash;
        const baselineHash = baselineManifest[routeKey];
        if (baselineHash) {
          const matchesBaseline = baselineHash === hash;
          result.checks.push({ type: 'baseline-hash', routeKey, matchesBaseline });
          if (config.failOnBaselineDiff === true && !matchesBaseline) result.pass = false;
        }

        if (config.updateBaselines === true) newManifest[routeKey] = hash;
      } catch (err) {
        result.pass = false;
        result.error = String(err?.message || err);
      } finally {
        page.off('console', onConsole);
        page.off('requestfailed', onReqFail);
      }

      result.consoleErrors = consoleErrors;
      result.requestFailures = requestFailures;
      if (failOnConsoleErrors && consoleErrors.length) result.pass = false;
      if (failOnRequestFailures && requestFailures.length) result.pass = false;

      results.push(result);
    }
  }

  await browser.close();

  if (config.updateBaselines === true) {
    writeJson(baselineManifestPath, newManifest);
    log(`Updated baseline manifest: ${baselineManifestPath}`);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    total: results.length,
    passed: results.filter(r => r.pass).length,
    failed: results.filter(r => !r.pass).length,
    results
  };

  const reportPath = path.join(outputDir, 'report.json');
  writeJson(reportPath, summary);
  log(`Report: ${reportPath}`);

  if (summary.failed > 0) {
    log(`FAILED: ${summary.failed}/${summary.total}`);
    process.exit(2);
  }
  log(`PASS: ${summary.passed}/${summary.total}`);
}

main().catch(err => {
  process.stderr.write(`[browser-verify] ERROR: ${err.message}\n`);
  process.exit(1);
});
