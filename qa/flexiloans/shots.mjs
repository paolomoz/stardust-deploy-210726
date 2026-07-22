import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  for (const [side, url] of [['proto', 'http://localhost:8792/prototypes/index-proposed.html'], ['live', 'https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `qa/flexiloans/parity-${name}-${side}-top.png` });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `qa/flexiloans/parity-${name}-${side}-bottom.png` });
    await p.close();
  }
}
await b.close();
console.log('shots done');
