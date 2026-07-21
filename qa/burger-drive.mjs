import { chromium } from 'playwright';
const b = await chromium.launch();
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('https://surly-e2e--stardust-deploy-210726--paolomoz.aem.page/', { waitUntil: 'networkidle', timeout: 60000 });
await m.waitForTimeout(1500);
const burger = m.locator('header button[aria-expanded]').first();
const state = async () => burger.getAttribute('aria-expanded');
const navVisible = async () => m.evaluate(() => {
  const nav = document.querySelector('header nav, header #nav, header [class*="nav"]');
  return nav ? getComputedStyle(nav).visibility + '/' + getComputedStyle(nav).display : 'none-found';
});
console.log('initial:', await state(), '| nav:', await navVisible());
await burger.click(); await m.waitForTimeout(400);
console.log('after click:', await state(), '| nav:', await navVisible());
await m.keyboard.press('Escape'); await m.waitForTimeout(300);
console.log('after escape:', await state());
await b.close();
