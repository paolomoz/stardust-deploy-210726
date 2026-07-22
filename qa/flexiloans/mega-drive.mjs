import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://flexiloans-e2e--stardust-deploy-210726--paolomoz.aem.page/flexiloans/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2000);
const drop = p.locator('header .nav-drop').first();
await drop.hover(); await p.waitForTimeout(500);
const open = await p.evaluate(() => {
  const d = document.querySelector('header .nav-drop');
  const mega = d.querySelector('.mega');
  return { expanded: d.getAttribute('aria-expanded'), megaVisible: mega ? getComputedStyle(mega).visibility + '/' + getComputedStyle(mega).opacity : 'missing', groups: d.querySelectorAll('.mega-group').length };
});
console.log('mega:', JSON.stringify(open));
await b.close();
