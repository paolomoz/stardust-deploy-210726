import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(() => {
  const out = { heroImgs: [], firstSection: '' };
  document.querySelectorAll('.hero img').forEach((i) => out.heroImgs.push({ w: i.getAttribute('width'), h: i.getAttribute('height'), cssH: getComputedStyle(i).height, aspectRatio: getComputedStyle(i).aspectRatio, loading: i.getAttribute('loading') }));
  const s = document.querySelector('main .section');
  out.firstSection = `${s.className} | empty=${!s.textContent.trim()} | display=${getComputedStyle(s).display}`;
  const hero = document.querySelector('.hero.block');
  out.heroH = hero.getBoundingClientRect().height;
  return out;
})));
await b.close();
