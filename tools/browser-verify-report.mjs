#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const reportPath = process.argv[2] || 'artifacts/browser-verification/report.json';
const outPath = process.argv[3] || 'artifacts/browser-verification/report.html';

if (!fs.existsSync(reportPath)) {
  console.error(`[browser-report] Missing report: ${reportPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const rows = data.results.map(r => {
  const status = r.pass ? 'PASS' : 'FAIL';
  const checks = (r.checks || []).map(c => `<li><code>${c.type}</code> ${JSON.stringify(c)}</li>`).join('');
  const shot = r.artifacts?.screenshot ? `<a href="${path.basename(r.artifacts.screenshot)}">screenshot</a>` : '-';
  return `<tr><td>${status}</td><td>${r.url}</td><td>${shot}</td><td><ul>${checks}</ul></td><td>${r.error || ''}</td></tr>`;
}).join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<title>Browser Verification Report</title>
<style>
body{font-family:Inter,Arial,sans-serif;margin:24px;background:#0b0f17;color:#e6edf3}
table{width:100%;border-collapse:collapse}td,th{border:1px solid #2b3442;padding:8px;vertical-align:top}
th{background:#151b23}code{background:#111827;padding:2px 4px;border-radius:4px}
a{color:#7cc4ff}
.pass{color:#2ecc71}.fail{color:#ff6b6b}
</style></head><body>
<h1>Browser Verification Report</h1>
<p>Generated: ${data.generatedAt}</p>
<p>Total: ${data.total} | Passed: <span class="pass">${data.passed}</span> | Failed: <span class="fail">${data.failed}</span></p>
<table><thead><tr><th>Status</th><th>URL</th><th>Artifacts</th><th>Checks</th><th>Error</th></tr></thead><tbody>${rows}</tbody></table>
</body></html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log(`[browser-report] Wrote ${outPath}`);
