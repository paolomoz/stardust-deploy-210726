import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — Cority mega footer.
 * Footer fragment sections (authored in /cority-home/footer):
 *   1. promo    — <h2>, <p>, "See it in action" link, banner image, 2 award-mini links
 *   2..5. columns — <h3> heading + <ul> of links
 *   last. legal — links line <p> + copyright <p>
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = [...fragment.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'foot-grid';

  // promo (first section)
  const promo = sections[0];
  if (promo) {
    promo.className = 'foot-promo';
    const see = [...promo.querySelectorAll('a')].find((a) => !a.querySelector('img')
      && !a.closest('.awards-mini'));
    if (see) see.classList.add('see');
    // group the trailing award links into .awards-mini (links that contain an image)
    const awardLinks = [...promo.querySelectorAll('a')].filter((a) => a.querySelector('picture, img'));
    if (awardLinks.length) {
      const mini = document.createElement('div');
      mini.className = 'awards-mini';
      awardLinks.forEach((a) => mini.append(a));
      promo.append(mini);
    }
    grid.append(promo);
  }

  // nav columns
  sections.slice(1, -1).forEach((sec) => {
    const nav = document.createElement('nav');
    while (sec.firstElementChild) nav.append(sec.firstElementChild);
    grid.append(nav);
  });

  wrap.append(grid);

  // legal (last section)
  const legal = sections[sections.length - 1];
  if (legal && legal !== promo) {
    legal.className = 'legal';
    wrap.append(legal);
  }

  const footer = document.createElement('div');
  footer.className = 'mega';
  footer.append(wrap);
  block.append(footer);
}
