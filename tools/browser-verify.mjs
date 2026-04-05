#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

function log(msg) {
  process.stdout.write(`[browser-verify] ${msg}\n`);
}

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readConfig(configPath) {
  const resolved = path.resolve(configPath);
  if (!fs.existsSync(resolved)) throw new Error(`Config not found: ${resolved}`);
  return { resolved, config: readJSON(resolved) };
}

function runCmd(label, cmd) {
  if (!cmd) return;
  log(`Running ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

function hashFile(filePath) {
  const buff = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buff).digest('hex');
}

function normalizeRoute(routeItem) {
  if (typeof routeItem === 'string') return { path: routeItem };
  return routeItem;
}

async function verifyRoute(page, route, options) {
  const url = `${options.baseUrl.replace(/\/$/, '')}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
  const result = { url, path: route.path, pass: true, checks: [], screenshots: [] };

  for (const vp of options.viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const suffix = `${vp.name}_${route.path.replace(/[^a-zA-Z0-9-_]/g, '_') || 'root'}`;

    try {
      log(`Opening ${url} @ ${vp.name}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: options.timeoutMs });

      if (Array.isArray(route.requiredSelectors)) {
        for (const sel of route.requiredSelectors) {
          const loc = page.locator(sel).first();
          const visible = await loc.isVisible({ timeout: options.selectorTimeoutMs }).catch(() => false);
          result.checks.push({ viewport: vp.name, type: 'selector', selector: sel, visible });
          if (!visible) result.pass = false;
        }
      }

      if (Array.isArray(route.requiredText)) {
        const body = await page.textContent('body');
        for (const txt of route.requiredText) {
          const found = body?.includes(txt) || false;
          result.checks.push({ viewport: vp.name, type: 'text', text: txt, found });
          if (!found) result.pass = false;
        }
      }

      const shotPath = path.join(options.outputDir, `${suffix}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      const currentHash = hashFile(shotPath);

      const shotResult = { viewport: vp.name, file: shotPath, hash: currentHash };

      if (options.baselineDir) {
        const baselinePath = path.join(options.baselineDir, `${suffix}.png`);
        shotResult.baseline = baselinePath;
        if (fs.existsSync(baselinePath)) {
          const baselineHash = hashFile(baselinePath);
          shotResult.baselineHash = baselineHash;
          shotResult.match = baselineHash === currentHash;
          if (!shotResult.match) {
            result.pass = false;
            result.checks.push({ viewport: vp.name, type: 'baseline-compare', match: false, reason: 'hash-mismatch' });
          }
        } else {
          shotResult.match = null;
          shotResult.reason = 'baseline-missing';
          if (options.requireBaselineMatch) {
            result.pass = false;
            result.checks.push({ viewport: vp.name, type: 'baseline-compare', match: false, reason: 'baseline-missing' });
          }
        }
      }

      result.screenshots.push(shotResult);
    } catch (err) {
      result.pass = false;
      result.checks.push({ viewport: vp.name, type: 'runtime', error: String(err?.message || err) });
    }
  }

  return result;
}

async function main() {
  const configArg = process.argv[2] || 'browser-verify.config.json';
  const { config } = readConfig(configArg);

  runCmd('migration command', config.migrateCommand);
  runCmd('temp-user command', config.tempUserCommand);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    throw new Error('playwright is required. Install with: npm i -D playwright');
  }

  if (!config.baseUrl) throw new Error('baseUrl is required');
  if (!Array.isArray(config.routes) || config.routes.length === 0) throw new Error('routes[] is required');

  const outputDir = path.resolve(config.outputDir || 'artifacts/browser-verification');
  fs.mkdirSync(outputDir, { recursive: true });

  const baselineDir = config.baselineDir ? path.resolve(config.baselineDir) : null;
  if (baselineDir) fs.mkdirSync(baselineDir, { recursive: true });

  const viewports = Array.isArray(config.viewports) && config.viewports.length > 0
    ? config.viewports
    : [
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'tablet', width: 1024, height: 768 },
        { name: 'mobile', width: 390, height: 844 }
      ];

  const browser = await playwright.chromium.launch({ headless: config.headless !== false });
  const contextOpts = {};
  if (config.storageStatePath) contextOpts.storageState = path.resolve(config.storageStatePath);

  const context = await browser.newContext(contextOpts);

  if (config.auth?.mode === 'session-cookie') {
    const envVar = config.auth.cookieEnv || 'LOCAL_SESSION_COOKIE';
    const cookieValue = process.env[envVar];
    if (!cookieValue) throw new Error(`Missing env var for session cookie: ${envVar}`);
    await context.addCookies([
      {
        name: config.auth.cookieName || 'session',
        value: cookieValue,
        domain: config.auth.domain || 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      }
    ]);
  }

  const page = await context.newPage();

  const options = {
    baseUrl: config.baseUrl,
    outputDir,
    baselineDir,
    requireBaselineMatch: Boolean(config.requireBaselineMatch),
    timeoutMs: config.timeoutMs || 30000,
    selectorTimeoutMs: config.selectorTimeoutMs || 5000,
    viewports
  };

  const results = [];
  for (const raw of config.routes) {
    const route = normalizeRoute(raw);
    if (!route.path) throw new Error('Each route must include path');
    const result = await verifyRoute(page, route, options);
    results.push(result);
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: config.baseUrl,
    totalRoutes: results.length,
    totalViewports: viewports.length,
    passedRoutes: results.filter(r => r.pass).length,
    failedRoutes: results.filter(r => !r.pass).length,
    results
  };

  const reportPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  log(`Report: ${reportPath}`);

  if (summary.failedRoutes > 0) {
    log(`FAILED: ${summary.failedRoutes}/${summary.totalRoutes} routes failed checks.`);
    process.exit(2);
  }

  log(`PASS: ${summary.passedRoutes}/${summary.totalRoutes} routes passed across ${summary.totalViewports} viewports.`);
}

main().catch(err => {
  process.stderr.write(`[browser-verify] ERROR: ${err.message}\n`);
  process.exit(1);
});
