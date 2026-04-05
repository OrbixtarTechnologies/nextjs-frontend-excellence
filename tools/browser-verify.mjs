#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

function log(msg) {
  process.stdout.write(`[browser-verify] ${msg}\n`);
}

function readConfig(configPath) {
  const resolved = path.resolve(configPath);
  if (!fs.existsSync(resolved)) throw new Error(`Config not found: ${resolved}`);
  return JSON.parse(fs.readFileSync(resolved, 'utf8'));
}

function runCmd(label, cmd) {
  if (!cmd) return;
  log(`Running ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

function sha256(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function maybeLoginAndSaveState(context, page, config, outDir) {
  const auth = config.auth || {};
  if (auth.mode !== 'ui-login') return;

  if (!auth.loginUrl || !auth.usernameSelector || !auth.passwordSelector || !auth.submitSelector) {
    throw new Error('ui-login mode requires loginUrl, usernameSelector, passwordSelector, submitSelector');
  }

  const username = process.env[auth.usernameEnv || 'E2E_USERNAME'];
  const password = process.env[auth.passwordEnv || 'E2E_PASSWORD'];
  if (!username || !password) {
    throw new Error(`Missing credentials env vars (${auth.usernameEnv || 'E2E_USERNAME'}, ${auth.passwordEnv || 'E2E_PASSWORD'})`);
  }

  log(`Performing UI login at ${auth.loginUrl}`);
  await page.goto(auth.loginUrl, { waitUntil: 'networkidle', timeout: config.timeoutMs || 30000 });
  await page.fill(auth.usernameSelector, username);
  await page.fill(auth.passwordSelector, password);
  await page.click(auth.submitSelector);
  await page.waitForLoadState('networkidle');

  const statePath = path.join(outDir, 'storage-state.json');
  await context.storageState({ path: statePath });
  log(`Saved authenticated storage state: ${statePath}`);
}

async function main() {
  const configArg = process.argv[2] || 'browser-verify.config.json';
  const config = readConfig(configArg);

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

  const outDir = path.resolve(config.outputDir || 'artifacts/browser-verification');
  const baselineDir = path.resolve(config.baselineDir || 'artifacts/browser-baseline');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await playwright.chromium.launch({ headless: config.headless !== false });
  const contextOpts = {};
  if (config.storageStatePath) contextOpts.storageState = path.resolve(config.storageStatePath);
  if (config.viewport?.width && config.viewport?.height) contextOpts.viewport = config.viewport;
  const context = await browser.newContext(contextOpts);

  if (config.auth?.mode === 'session-cookie') {
    const cookieValue = process.env[config.auth.cookieEnv || 'LOCAL_SESSION_COOKIE'];
    if (!cookieValue) throw new Error(`Missing env var: ${config.auth.cookieEnv || 'LOCAL_SESSION_COOKIE'}`);
    await context.addCookies([{ name: config.auth.cookieName || 'session', value: cookieValue, domain: config.auth.domain || 'localhost', path: '/', httpOnly: true, secure: false, sameSite: 'Lax' }]);
  }

  const page = await context.newPage();
  await maybeLoginAndSaveState(context, page, config, outDir);

  const results = [];
  for (const route of config.routes) {
    const routeDef = typeof route === 'string' ? { path: route } : route;
    const routePath = routeDef.path;
    const url = `${baseUrl.replace(/\/$/, '')}${routePath.startsWith('/') ? '' : '/'}${routePath}`;
    const result = { url, pass: true, checks: [], artifacts: {} };

    try {
      log(`Opening ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: config.timeoutMs || 30000 });

      if (Array.isArray(routeDef.maskSelectors)) {
        for (const ms of routeDef.maskSelectors) {
          await page.locator(ms).evaluateAll(nodes => nodes.forEach(n => n.setAttribute('data-mask', 'true'))).catch(() => {});
        }
      }

      if (Array.isArray(routeDef.requiredSelectors)) {
        for (const sel of routeDef.requiredSelectors) {
          const visible = await page.locator(sel).first().isVisible({ timeout: config.selectorTimeoutMs || 5000 }).catch(() => false);
          result.checks.push({ type: 'selector', selector: sel, visible });
          if (!visible) result.pass = false;
        }
      }

      if (Array.isArray(routeDef.requiredText)) {
        const body = await page.textContent('body');
        for (const txt of routeDef.requiredText) {
          const found = body?.includes(txt) || false;
          result.checks.push({ type: 'text', text: txt, found });
          if (!found) result.pass = false;
        }
      }

      if (Array.isArray(routeDef.requiredStyles)) {
        for (const rule of routeDef.requiredStyles) {
          const { selector, property, expected } = rule;
          const actual = await page.$eval(selector, (el, prop) => getComputedStyle(el).getPropertyValue(prop), property).catch(() => null);
          const ok = actual !== null && actual.trim() === String(expected).trim();
          result.checks.push({ type: 'style', selector, property, expected, actual, ok });
          if (!ok) result.pass = false;
        }
      }

      const safe = routePath.replace(/[^a-zA-Z0-9-_]/g, '_') || 'root';
      const png = path.join(outDir, `${safe}.png`);
      const html = path.join(outDir, `${safe}.html`);

      await page.screenshot({ path: png, fullPage: true });
      fs.writeFileSync(html, await page.content());
      result.artifacts.screenshot = png;
      result.artifacts.dom = html;

      // Baseline hash comparison (dependency-free)
      if (config.compareWithBaseline) {
        fs.mkdirSync(baselineDir, { recursive: true });
        const baseShot = path.join(baselineDir, `${safe}.png`);
        if (fs.existsSync(baseShot)) {
          const same = sha256(baseShot) === sha256(png);
          result.checks.push({ type: 'baseline-hash', baseline: baseShot, same });
          if (!same && routeDef.failOnVisualChange) result.pass = false;
        } else {
          fs.copyFileSync(png, baseShot);
          result.checks.push({ type: 'baseline-created', baseline: baseShot, created: true });
        }
      }
    } catch (err) {
      result.pass = false;
      result.error = String(err?.message || err);
    }

    results.push(result);
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    total: results.length,
    passed: results.filter(r => r.pass).length,
    failed: results.filter(r => !r.pass).length,
    compareWithBaseline: !!config.compareWithBaseline,
    results
  };

  const reportPath = path.join(outDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  log(`Report: ${reportPath}`);

  if (summary.failed > 0) {
    log(`FAILED ${summary.failed}/${summary.total}`);
    process.exit(2);
  }

  log(`PASS ${summary.passed}/${summary.total}`);
}

main().catch(err => {
  process.stderr.write(`[browser-verify] ERROR: ${err.message}\n`);
  process.exit(1);
});
