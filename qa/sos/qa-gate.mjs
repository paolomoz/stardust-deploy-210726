import { chromium } from 'playwright';

const URL = 'http://localhost:3000/qa/sos/page.html';
const fails = [];
const ok = (cond, msg) => { if (cond) console.log(`  ✓ ${msg}`); else { console.log(`  ✗ ${msg}`); fails.push(msg); } };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
await page.waitForTimeout(800);

console.log('— runtime & structure');
ok(errors.length === 0, `zero pageerror (got ${errors.length}: ${errors.slice(0,2).join(' | ')})`);
ok(await page.evaluate(() => document.body.classList.contains('appear')), 'body.appear (runtime booted)');
const secCount = await page.evaluate(() => document.querySelectorAll('main .section').length);
ok(secCount > 0, `main .section count > 0 (${secCount})`);
const undec = await page.evaluate(() => [...document.querySelectorAll('main .block')].filter((b) => !b.dataset.blockName).length);
ok(undec === 0, 'all blocks carry data-block-name');
const h1s = await page.evaluate(() => document.querySelectorAll('h1').length);
ok(h1s === 1, `exactly one <h1> (${h1s})`);
ok(await page.evaluate(() => { const w = document.querySelector('.hero .hero-inner'); return !!w && w.children.length > 0 && !!w.querySelector('h1'); }), 'hero inner non-empty and holds the <h1>');
ok(await page.evaluate(() => { const i = document.querySelector('.hero img'); return !!i && i.loading === 'eager' && i.getAttribute('fetchpriority') === 'high'; }), 'hero LCP img eager + fetchpriority=high');

console.log('— computed layout (silent-failure guard: grids compute grid/flex, not block)');
for (const [sel, want] of [
  ['.hero', 'flex'],
  ['.columns.event > div', 'grid'],
  ['.columns.about > div', 'grid'],
  ['.cards.talks > ul', 'grid'],
  ['.cards.webinars > ul', 'flex'],
  ['.insights .insights-grid', 'grid'],
  ['.books .books-rail', 'flex'],
  ['.videos .videos-grid', 'grid'],
  ['.video .facade', 'flex'],
]) {
  const d = await page.evaluate((s) => { const el = document.querySelector(s); return el ? getComputedStyle(el).display : 'MISSING'; }, sel);
  ok(d === want, `${sel} computes display:${want} (got ${d})`);
}
const cardsDefault = await page.evaluate(() => [...document.querySelectorAll('.cards:not(.talks):not(.webinars) > ul')].map((u) => getComputedStyle(u).display));
ok(cardsDefault.length === 2 && cardsDefault.every((d) => d === 'grid'), `2 default cards grids compute grid (${cardsDefault.join(',')})`);

console.log('— content counts (rendered == authored, #52/#62)');
for (const [sel, n] of [
  ['.cards.talks li.card', 2],
  ['.cards.webinars a.tile', 3],
  ['.insights .insight-list li', 5],
  ['.insights .card', 1],
  ['.insights blockquote', 1],
  ['.books .books-rail figure', 5],
  ['.videos .videos-grid figure', 3],
  ['.video .facade', 1],
  ['.quote blockquote', 1],
]) {
  const c = await page.evaluate((s) => document.querySelectorAll(s).length, sel);
  ok(c === n, `${sel} count == ${n} (got ${c})`);
}
const defCards = await page.evaluate(() => [...document.querySelectorAll('.cards:not(.talks):not(.webinars)')].map((b) => b.querySelectorAll('li.card').length));
ok(JSON.stringify(defCards) === '[3,3]', `happenings/articles card counts [3,3] (got ${JSON.stringify(defCards)})`);

console.log('— buttons & links');
ok(await page.evaluate(() => document.querySelectorAll('a.button.primary').length) === 2, 'two primary buttons (hero + cta band)');
ok(await page.evaluate(() => document.querySelectorAll('a.button.secondary').length) === 1, 'one secondary button (event Register Now)');
ok(await page.evaluate(() => { const a = document.querySelector('.hero .hero-actions a.text-link'); return !!a && a.textContent.trim() === 'Find a Center'; }), 'hero Find a Center is a text link, not a button');

console.log('— chrome');
ok(await page.evaluate(() => !!document.querySelector('header .utility ul li a')), 'header utility bar slotted');
ok(await page.evaluate(() => document.querySelectorAll('header .masthead .nav-left li').length === 3 && document.querySelectorAll('header .masthead .nav-right li').length === 3), 'masthead 3+3 nav links');
ok(await page.evaluate(() => { const i = document.querySelector('header .logo-link img'); return !!i && i.naturalWidth > 0; }), 'logo image loaded');
ok(await page.evaluate(() => getComputedStyle(document.querySelector('header .masthead .masthead-row')).display === 'grid'), 'masthead row computes grid');
ok(await page.evaluate(() => document.querySelectorAll('footer .footer-grid > div').length === 4), 'footer 4 columns');
ok(await page.evaluate(() => !!document.querySelector('footer .footer-bottom .label')), 'footer brand label present');
const navH = await page.evaluate(() => Math.round(document.querySelector('header .nav-chrome').getBoundingClientRect().height));
const navVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim());
console.log(`  ℹ chrome real height ${navH}px vs --nav-height ${navVar}`);

console.log('— images');
const broken = await page.evaluate(() => [...document.querySelectorAll('img')].filter((i) => i.naturalWidth === 0).map((i) => i.src));
ok(broken.length === 0, `zero broken images (got ${broken.length}: ${broken.slice(0,3).join(', ')})`);
const imgCount = await page.evaluate(() => document.querySelectorAll('main img').length);
console.log(`  ℹ main <img> count: ${imgCount} (authored 24)`);

console.log('— section paints');
for (const [sel, rgb] of [
  ['.cards.talks', 'rgb(255, 255, 255)'],
  ['.insights', 'rgb(255, 255, 255)'],
  ['.videos', 'rgb(255, 255, 255)'],
  ['.columns.about', 'rgb(4, 58, 91)'],
]) {
  const bg = await page.evaluate((s) => { const el = document.querySelector(s)?.closest('.section'); return el ? getComputedStyle(el).backgroundColor : 'MISSING'; }, sel);
  ok(bg === rgb, `${sel} section bg ${rgb} (got ${bg})`);
}

// screenshots per section
await page.setViewportSize({ width: 1440, height: 900 });
let shot = 0;
for (const sel of ['.hero', '.columns.event', '.quote', '.cards.talks', '.video', '.cards.webinars', '.insights', '.books', '.videos', '.columns.about', '.section.cta', 'footer']) {
  const el = await page.$(sel);
  if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(250); await el.screenshot({ path: `qa/sos/shot-${String(shot).padStart(2,'0')}-${sel.replace(/[^a-z]+/g,'-')}.png` }).catch(() => {}); shot += 1; }
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'qa/sos/full-1440.png', fullPage: true });

console.log('— wide viewport (#13) 1600px');
await page.setViewportSize({ width: 1600, height: 900 });
await page.waitForTimeout(500);
for (const sel of ['.columns.event > div', '.cards.talks > ul', '.insights .insights-grid', '.videos .videos-grid', '.columns.about > div', '.books .books-rail']) {
  const w = await page.evaluate((s) => { const el = document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().width) : -1; }, sel);
  ok(w > 0 && w <= 1340, `${sel} content width constrained (${w}px <= 1340)`);
}
const heroW = await page.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().width));
ok(heroW === 1600, `hero full-bleed at 1600 (${heroW})`);

console.log('— mobile 375px: hamburger drive (#28)');
await page.setViewportSize({ width: 375, height: 800 });
await page.waitForTimeout(600);
ok(await page.evaluate(() => getComputedStyle(document.querySelector('header .nav-hamburger')).display !== 'none'), 'hamburger visible at 375');
ok(await page.evaluate(() => getComputedStyle(document.querySelector('header .nav-panel')).display === 'none'), 'panel closed initially');
await page.click('header .nav-hamburger button');
await page.waitForTimeout(300);
ok(await page.evaluate(() => document.getElementById('nav').getAttribute('aria-expanded') === 'true'), 'click → nav aria-expanded=true');
ok(await page.evaluate(() => getComputedStyle(document.querySelector('header .nav-panel')).display === 'block'), 'panel opens');
const panelLinks = await page.evaluate(() => document.querySelectorAll('header .nav-panel li').length);
ok(panelLinks >= 9, `panel holds all links (${panelLinks})`);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok(await page.evaluate(() => document.getElementById('nav').getAttribute('aria-expanded') === 'false'), 'Escape closes panel');
await page.screenshot({ path: 'qa/sos/mobile-375.png', fullPage: false });

await browser.close();
console.log(fails.length ? `\nQA GATE: FAIL (${fails.length})` : '\nQA GATE: PASS (0 failures)');
process.exit(fails.length ? 2 : 0);
