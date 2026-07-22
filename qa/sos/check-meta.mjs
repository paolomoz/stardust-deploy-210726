import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000/qa/sos/page.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
console.log('section-metadata divs left:', await p.evaluate(() => document.querySelectorAll('main .section-metadata').length));
console.log('cta section classed:', await p.evaluate(() => !!document.querySelector('main .section.cta')));
console.log('cta section text head:', await p.evaluate(() => document.querySelector('main .section.cta')?.textContent.trim().slice(0, 60)));
await b.close();
