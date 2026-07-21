import { chromium } from 'playwright';
const URL = 'https://surly-e2e--stardust-deploy-210726--paolomoz.aem.page/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
p.on('pageerror', (e) => pageErrors.push(e.message));
await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
const r = await p.evaluate(() => {
  const out = {};
  out.bodyAppear = document.body.classList.contains('appear');
  out.sections = document.querySelectorAll('main .section').length;
  out.blocksDecorated = [...document.querySelectorAll('[data-block-name]')].map((b) => `${b.dataset.blockName}:${b.dataset.blockStatus}`);
  out.h1 = document.querySelectorAll('h1').length;
  out.brokenImgs = [...document.querySelectorAll('img')].filter((i) => i.complete && !i.naturalWidth).length;
  out.layouts = {};
  ['hero', 'cards', 'taprooms', 'story', 'columns', 'closer'].forEach((n) => {
    const el = document.querySelector(`.${n}`);
    if (!el) { out.layouts[n] = 'MISSING'; return; }
    const cand = [el, ...el.querySelectorAll('*')].find((e) => ['grid', 'flex'].includes(getComputedStyle(e).display));
    out.layouts[n] = cand ? getComputedStyle(cand).display : 'block-only';
  });
  const header = document.querySelector('header .header');
  const footer = document.querySelector('footer .footer');
  out.chrome = { header: header?.dataset.blockStatus, footer: footer?.dataset.blockStatus, navLinks: document.querySelectorAll('header a').length, footerLinks: document.querySelectorAll('footer a').length };
  out.emptyFirstSectionVisible = (() => { const s = document.querySelector('main .section'); return s && !s.textContent.trim() ? getComputedStyle(s).display !== 'none' : false; })();
  return out;
});
console.log(JSON.stringify({ ...r, pageErrors }, null, 1));
// mobile hamburger drive
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await m.waitForTimeout(1500);
const burger = m.locator('header [aria-label*="navigation" i], header .nav-hamburger button, header button').first();
const drive = { found: await burger.count() };
if (drive.found) {
  await burger.click();
  await m.waitForTimeout(400);
  drive.expandedAfterClick = await m.evaluate(() => document.getElementById('nav')?.getAttribute('aria-expanded'));
  await m.keyboard.press('Escape');
  await m.waitForTimeout(300);
  drive.expandedAfterEscape = await m.evaluate(() => document.getElementById('nav')?.getAttribute('aria-expanded'));
}
console.log('hamburger:', JSON.stringify(drive));
await b.close();
