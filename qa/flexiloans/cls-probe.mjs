/* CLS probe (#81) — delays woff2 + nav/footer fragment fetches by 1.5s to
   reproduce the slow-network swap PSI measures. Header is overlay chrome
   (height 0 reserved) so the target is CLS < 0.1. */
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route('**/*.woff2', async (route) => {
  await new Promise((r) => { setTimeout(r, 1500); });
  route.continue();
});
await page.route('**/*.plain.html', async (route) => {
  await new Promise((r) => { setTimeout(r, 1500); });
  route.continue();
});
await page.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver((list) => {
    list.getEntries().forEach((e) => {
      if (!e.hadRecentInput) window.__cls += e.value;
    });
  }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto('http://localhost:3000/qa/flexiloans/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const cls = await page.evaluate(() => window.__cls);
console.log(`CLS (fonts+chrome delayed 1.5s): ${cls.toFixed(4)} — ${cls < 0.1 ? 'PASS (<0.1)' : 'FAIL (>=0.1)'}`);
await browser.close();
process.exit(cls < 0.1 ? 0 : 1);
