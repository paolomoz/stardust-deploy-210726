import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.route(/\.(woff2)|nav\.plain\.html|footer\.plain\.html/, async (route) => {
  await new Promise((r) => setTimeout(r, 1800));
  route.continue();
});
await p.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; }))
    .observe({ type: 'layout-shift', buffered: true });
});
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(4000);
const cls = await p.evaluate(() => window.__cls);
console.log(`CLS (mobile, fonts+chrome delayed 1.8s): ${cls.toFixed(4)} ${cls < 0.1 ? 'PASS' : 'FAIL'} (<0.1)`);
await b.close();
