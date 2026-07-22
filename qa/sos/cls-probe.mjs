import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [375, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  // reproduce slow-network swap: delay fonts + chrome fragment fetches
  await p.route(/(\.woff2|nav\.plain\.html|footer\.plain\.html|fonts\.css)/, async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    route.continue();
  });
  await p.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; });
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto('http://localhost:3000/qa/sos/page.html');
  await p.waitForTimeout(4500);
  const cls = await p.evaluate(() => window.__cls);
  console.log(`${w}x${h} CLS = ${cls.toFixed(4)} ${cls < 0.1 ? 'PASS' : 'FAIL'}`);
  await p.close();
}
await b.close();
