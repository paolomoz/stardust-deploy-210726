import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the mega footer.
 * Fragment section contract (default content per section):
 *   1. promo   — <h2>CorityOne</h2>, promo copy + link, banner <img>, award links
 *   2..N-1     — link columns (<h3> + <ul>)
 *   N          — legal line (contact/privacy/legal links + copyright)
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'foot-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const cols = [...footer.children];
  if (cols.length > 1) {
    const legal = cols.pop();
    legal.classList.add('foot-legal');
    cols[0].classList.add('foot-promo');
    const grid = document.createElement('div');
    grid.className = 'foot-grid';
    cols.forEach((c) => {
      c.classList.add('foot-col');
      grid.append(c);
    });
    footer.replaceChildren(grid, legal);
  }

  block.append(footer);
}
