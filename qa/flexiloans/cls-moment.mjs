import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.addInitScript(() => {
  window.__ev = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => {
    if (e.hadRecentInput) return;
    const hero = document.querySelector('.hero.block');
    const cc = document.querySelector('.cards-container');
    window.__ev.push({
      t: Math.round(e.startTime), v: +e.value.toFixed(4),
      src: e.sources?.map((s) => { const n = s.node; return { node: n ? `${n.tagName}.${(n.className || '').toString().slice(0, 40)}` : 'nil', from: `${s.previousRect.y}h${s.previousRect.height}`, to: `${s.currentRect.y}h${s.currentRect.height}` }; }),
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : -1,
      ccDisplay: cc ? getComputedStyle(cc).display : 'none-yet',
    });
  })).observe({ type: 'layout-shift', buffered: true });
});
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => window.__ev), null, 1));
await b.close();
