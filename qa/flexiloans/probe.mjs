/* Local-QA probe for the flexiloans harness (skill: Local QA before deploy).
   Run from repo root: node qa/flexiloans/probe.mjs */
import { chromium } from 'playwright';

const URL = 'http://localhost:3000/qa/flexiloans/index.html';
const out = [];
const fail = [];
const ok = (name, cond, detail = '') => {
  out.push(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!cond) fail.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

ok('zero pageerror', pageErrors.length === 0, pageErrors.join(' | '));
ok('body.appear', await page.evaluate(() => document.body.classList.contains('appear')));
const sectionCount = await page.evaluate(() => document.querySelectorAll('main .section').length);
ok('main .section count > 0', sectionCount > 0, `${sectionCount} sections`);
const blockNames = await page.evaluate(() => [...document.querySelectorAll('[data-block-name]')].map((b) => b.dataset.blockName));
ok('blocks decorated (data-block-name)', blockNames.length >= 11, blockNames.join(','));

// exactly one h1, non-empty, inside the hero
const h1s = await page.evaluate(() => [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()));
ok('exactly one <h1>', h1s.length === 1, JSON.stringify(h1s));
ok('h1 inside hero and non-empty', await page.evaluate(() => {
  const h = document.querySelector('.hero h1');
  return !!h && h.textContent.trim().length > 0 && h.querySelectorAll('h1,h2,h3,h4,h5,h6').length === 0;
}));

// computed-layout gate: every declared grid/flex computes grid/flex (the blockWrapperClass assertion)
const layouts = [
  ['.hero .hero-grid', 'grid'],
  ['.cards.eligibility .cards-grid', 'grid'],
  ['.cards.products .cards-grid', 'grid'],
  ['.cards.security .cards-grid', 'grid'],
  ['.live-status .live-grid', 'grid'],
  ['.why-flexiloans .chips-grid', 'grid'],
  ['.why-flexiloans .stat-band', 'grid'],
  ['.why-flexiloans .stat-rest', 'grid'],
  ['.testimonials .testi-grid', 'grid'],
  ['.achievements .awards-shelf', 'grid'],
  ['.blogs .blog-row', 'grid'],
  ['.partner-strip .partner-row', 'flex'],
  ['header nav', 'flex'],
  ['footer .footer-main', 'grid'],
  ['footer .footer-meta', 'grid'],
];
for (const [sel, want] of layouts) {
  // eslint-disable-next-line no-await-in-loop
  const got = await page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).display : 'MISSING';
  }, sel);
  ok(`layout ${sel} computes ${want}`, got === want, `got ${got}`);
}

// unit counts (rendered == authored)
const counts = [
  ['.cards.eligibility .card', 2],
  ['.cards.products .card', 2],
  ['.cards.security .card', 3],
  ['.why-flexiloans .chip-row', 4],
  ['.why-flexiloans .stat-rest .stat', 3],
  ['.testimonials .testi-card', 3],
  ['.achievements .award', 4],
  ['.blogs .blog-row', 3],
  ['.partner-strip .partner-row img', 5],
  ['.accordion details', 3],
  ['.hero .hero-ctas a.button', 2],
];
for (const [sel, want] of counts) {
  // eslint-disable-next-line no-await-in-loop
  const got = await page.evaluate((s) => document.querySelectorAll(s).length, sel);
  ok(`count ${sel} == ${want}`, got === want, `got ${got}`);
}

// no literal :icon: tokens left; every block's primary container non-empty
ok('no literal :icon: tokens', await page.evaluate(() => !/:(?:[a-z0-9-]+):/.test(document.querySelector('main').textContent)));
ok('all blocks non-empty post-decorate', await page.evaluate(() => [...document.querySelectorAll('main [data-block-name]')]
  .every((b) => b.dataset.blockName === 'metadata' || (b.children.length > 0 && b.getBoundingClientRect().height > 0))));

// buttons decorated per runtime contract
const btn = await page.evaluate(() => ({
  primary: document.querySelectorAll('main a.button.primary').length,
  secondary: document.querySelectorAll('main a.button.secondary').length,
  wrappers: document.querySelectorAll('main p.button-wrapper').length,
}));
ok('buttons: 3 primary (hero+2 products), 2 secondary (hero+faq)', btn.primary === 3 && btn.secondary === 2, JSON.stringify(btn));

// hero secondary CTA is ghost-inverse on the dark hero (#41)
const ghost = await page.evaluate(() => {
  const a = document.querySelector('main .hero a.button.secondary');
  const cs = getComputedStyle(a);
  return { color: cs.color, borderColor: cs.borderTopColor };
});
ok('hero secondary CTA is light-on-dark', ghost.color === 'rgb(255, 255, 255)', JSON.stringify(ghost));

// interactive: accordion toggles
await page.locator('.accordion details >> nth=0 >> summary').click();
ok('accordion opens on click', await page.evaluate(() => document.querySelector('.accordion details').open));
await page.keyboard.press('Escape');

// interactive: mega menu appears on hover (desktop)
await page.hover('header nav .nav-links > li.nav-drop >> nth=0');
await page.waitForTimeout(400);
const megaVisible = await page.evaluate(() => {
  const m = document.querySelector('header nav .nav-drop .mega');
  const cs = getComputedStyle(m);
  return cs.visibility === 'visible' && Number(cs.opacity) > 0.9;
});
ok('mega menu visible on hover', megaVisible);

// lang switch current
ok('lang switch aria-current=EN', await page.evaluate(() => {
  const a = document.querySelector('header nav .lang-switch a[aria-current="true"]');
  return !!a && a.textContent.trim() === 'English';
}));

// section grounds painted by block CSS
const grounds = await page.evaluate(() => {
  const bg = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).backgroundColor : 'MISSING';
  };
  return {
    hero: getComputedStyle(document.querySelector('main .section:has(> .hero-wrapper)')).backgroundImage.includes('linear-gradient'),
    live: bg('main .section:has(> .live-status-wrapper)'),
    why: bg('main .section:has(> .why-flexiloans-wrapper)'),
    security: bg('main .section:has(> .cards-wrapper > .cards.security)'),
    blogs: bg('main .section:has(> .blogs-wrapper)'),
    partner: bg('main .section:has(> .partner-strip-wrapper)'),
    footer: bg('footer'),
    legal: bg('footer .footer-legal'),
  };
});
ok('hero gradient ground', grounds.hero === true);
ok('live-status ice ground', grounds.live === 'rgb(233, 243, 255)', grounds.live);
ok('why lavender ground', grounds.why === 'rgb(243, 239, 249)', grounds.why);
ok('security ice ground', grounds.security === 'rgb(233, 243, 255)', grounds.security);
ok('blogs lavender ground', grounds.blogs === 'rgb(243, 239, 249)', grounds.blogs);
ok('partner lavender ground', grounds.partner === 'rgb(243, 239, 249)', grounds.partner);
ok('footer plum ground', grounds.footer === 'rgb(73, 57, 97)', grounds.footer);
ok('legal deep-plum ground', grounds.legal === 'rgb(45, 34, 61)', grounds.legal);

// screenshots per section at 1440
const shots = [
  ['hero', '.hero'], ['eligibility', '.cards.eligibility'], ['live-status', '.live-status'],
  ['why', '.why-flexiloans'], ['products', '.cards.products'], ['security', '.cards.security'],
  ['testimonials', '.testimonials'], ['achievements', '.achievements'], ['blogs', '.blogs'],
  ['faq', '.accordion'], ['partners', '.partner-strip'],
];
for (const [name, sel] of shots) {
  // eslint-disable-next-line no-await-in-loop
  await page.locator(sel).scrollIntoViewIfNeeded();
  // eslint-disable-next-line no-await-in-loop
  await page.waitForTimeout(250);
  // eslint-disable-next-line no-await-in-loop
  await page.locator(sel).screenshot({ path: `qa/flexiloans/shot-eds-${name}.png` }).catch(() => {});
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'qa/flexiloans/shot-eds-footer.png', clip: undefined });

// broken images — AFTER the full-page scroll so lazy images have loaded
const broken = await page.evaluate(async () => {
  await Promise.all([...document.images].map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; setTimeout(r, 3000); }))));
  return [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src);
});
ok('zero broken images', broken.length === 0, broken.join(' '));

// wide viewport (#13): content constrained to --container (1240)
await page.setViewportSize({ width: 1600, height: 900 });
await page.waitForTimeout(500);
const widths = await page.evaluate(() => {
  const res = {};
  document.querySelectorAll('main > .section > div:not(.default-content-wrapper)').forEach((w) => {
    const name = w.className || 'wrapper';
    res[name.split(' ')[0]] = Math.round(w.getBoundingClientRect().width);
  });
  return res;
});
const wide = Object.entries(widths).filter(([, w]) => w > 1260);
ok('no unintended full-width wrappers @1600', wide.length === 0, JSON.stringify(widths));

// mobile: hamburger drives the menu
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(700);
const hamburgerVisible = await page.evaluate(() => {
  const b = document.querySelector('header nav .nav-hamburger');
  return b && getComputedStyle(b).display !== 'none';
});
ok('hamburger visible on mobile', hamburgerVisible);
await page.click('header nav .nav-hamburger button');
await page.waitForTimeout(300);
ok('mobile menu expands', await page.evaluate(() => document.querySelector('header nav').getAttribute('aria-expanded') === 'true'
  && getComputedStyle(document.querySelector('header nav .nav-sections')).display !== 'none'));
await page.screenshot({ path: 'qa/flexiloans/shot-eds-mobile-menu.png' });

console.log(out.join('\n'));
console.log(`\nSUMMARY: ${out.length - fail.length}/${out.length} checks passed${fail.length ? ` — FAILURES: ${fail.join('; ')}` : ''}`);
await browser.close();
process.exit(fail.length ? 1 : 0);
