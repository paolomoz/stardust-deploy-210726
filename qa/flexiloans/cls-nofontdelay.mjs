import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.route(/NOMATCH_DISABLED/, async (route) => { await new Promise((r) => setTimeout(r, 1800)); route.continue(); });
await p.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => {
    if (e.hadRecentInput) return;
    window.__shifts.push({ value: e.value, nodes: e.sources?.map((s) => { const n = s.node; return n ? `${n.tagName}.${(n.className || '').toString().slice(0, 60)}` : 'nil'; }) });
  })).observe({ type: 'layout-shift', buffered: true });
});
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(4000);
console.log(JSON.stringify(await p.evaluate(() => window.__shifts), null, 1));
await b.close();
