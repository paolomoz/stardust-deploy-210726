import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — template-slotted chrome (deploy SKILL Step 6): the prototype's
 * navy footer (4 link columns + legal row) is fixed here; the authored
 * /sos/footer document fills the slots. Footer document contract:
 *   sections 1..N-1 — link columns (h3 heading + <ul> of links)
 *   last section    — legal row (<ul> of legal links + brand line <p>)
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const sections = [...fragment.querySelectorAll(':scope > div')];
  const bottomSec = sections.length > 1 ? sections.pop() : null;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  sections.forEach((sec) => {
    const col = document.createElement('div');
    const content = sec.querySelector('.default-content-wrapper') || sec;
    col.append(...content.children);
    grid.append(col);
  });
  wrap.append(grid);

  if (bottomSec) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-bottom';
    const content = bottomSec.querySelector('.default-content-wrapper') || bottomSec;
    [...content.children].forEach((el) => {
      if (el.matches('p') && !el.querySelector('a')) {
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = el.textContent.trim();
        bottom.append(label);
      } else {
        bottom.append(el);
      }
    });
    wrap.append(bottom);
  }

  block.textContent = '';
  block.append(wrap);
}
