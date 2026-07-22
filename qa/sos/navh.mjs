import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [560, 520, 500, 480, 460, 430, 400, 375, 360]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:3000/qa/sos/page.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const h = await p.evaluate(() => Math.round(document.querySelector('header .nav-chrome')?.getBoundingClientRect().height || -1));
  console.log(w, '→', h);
  await p.close();
}
await b.close();
