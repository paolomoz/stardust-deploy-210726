import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.addInitScript(() => {
  window.__log = [];
  const snap = () => {
    const cc = document.querySelector('.cards-container');
    if (!cc) return;
    const secs = [...document.querySelectorAll('main .section')].slice(0, 5).map((s, i) => `${i}:${s.dataset.sectionStatus || '-'}:${getComputedStyle(s).display}:${Math.round(s.getBoundingClientRect().height)}`);
    window.__log.push({ t: Math.round(performance.now()), ccTop: Math.round(cc.getBoundingClientRect().top), secs: secs.join(' ') });
  };
  setInterval(snap, 80);
});
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(3500);
const log = await p.evaluate(() => window.__log);
let prev = null;
for (const e of log) { if (!prev || e.ccTop !== prev.ccTop) console.log(JSON.stringify(e)); prev = e; }
await b.close();
