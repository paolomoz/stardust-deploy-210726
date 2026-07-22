import { chromium } from 'playwright';
const URL = 'https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
p.on('pageerror', (e) => pageErrors.push(e.message));
await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
const r = await p.evaluate(() => {
  const out = {};
  out.bodyAppear = document.body.classList.contains('appear');
  out.blocks = [...document.querySelectorAll('[data-block-name]')].map((x) => `${x.dataset.blockName}:${x.dataset.blockStatus}`);
  out.h1 = document.querySelectorAll('h1').length;
  out.brokenImgs = [...document.querySelectorAll('img')].filter((i) => i.complete && !i.naturalWidth).length;
  out.layouts = {};
  ['hero', 'cards', 'live-status', 'why-flexiloans', 'testimonials', 'achievements', 'blogs', 'accordion', 'partner-strip'].forEach((n) => {
    const el = document.querySelector(`.${n}.block`);
    if (!el) { out.layouts[n] = 'MISSING'; return; }
    const cand = [el, ...el.querySelectorAll('*')].find((e) => ['grid', 'flex'].includes(getComputedStyle(e).display));
    out.layouts[n] = cand ? getComputedStyle(cand).display : 'block-only';
  });
  // the per-page chrome override: nav must come from /flexiloans/nav (brand text check)
  out.chrome = { header: document.querySelector('header .header')?.dataset.blockStatus, footer: document.querySelector('footer .footer')?.dataset.blockStatus, headerHasFlexiBrand: !!document.querySelector('header a[href*="flexiloans" i], header img[alt*="flexiloans" i]'), footerLinks: document.querySelectorAll('footer a').length };
  return out;
});
console.log(JSON.stringify({ ...r, pageErrors }, null, 1));
// accordion drive
const q = p.locator('.accordion.block summary, .accordion.block [role="button"], .accordion.block button').first();
if (await q.count()) { const before = await p.evaluate(() => document.querySelector('.accordion.block').textContent.length); await q.click(); await p.waitForTimeout(400); console.log('accordion clicked ok'); }
await b.close();
