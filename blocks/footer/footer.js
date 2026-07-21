/**
 * footer — Wasatch Back chrome, template-slotted (#95 / anti-pattern 5).
 * Fills the prototype's .ds-footer DOM from the authored /footer document's
 * fixed section contract:
 *   section 1 = brand (wordmark text <p>, tagline <p>, email <p><a>)
 *   section 2 = site links (column title <p>, then a <ul> of links)
 *   section 3 = taprooms (column title <p>, then per-taproom groups —
 *               each opened by a <strong>-led <p>, followed by its lines)
 *   section 4 = colophon (two <p> lines)
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const sections = fragment ? [...fragment.children] : [];
  const [brandSec, linksSec, tapsSec, colophonSec] = sections;

  const dsFooter = el('div', 'ds-footer');
  const inner = el('div', 'ds-footer-inner');

  // slot 1: brand
  const brandCol = document.createElement('div');
  const brandPs = brandSec ? [...brandSec.querySelectorAll('p')] : [];
  const wordmarkText = brandPs[0] ? brandPs[0].textContent.trim() : 'Wasatch Back';
  const wordmark = el('span', 'ds-wordmark-lg');
  const spike = el('span', 'ds-spike');
  spike.setAttribute('aria-hidden', 'true');
  wordmark.append(spike, document.createTextNode(wordmarkText));
  brandCol.append(wordmark);
  if (brandPs[1]) {
    const tagline = el('p', 'ds-tagline');
    tagline.append(...[...brandPs[1].childNodes].map((n) => n.cloneNode(true)));
    brandCol.append(tagline);
  }
  const emailA = brandSec ? brandSec.querySelector('a[href^="mailto:"], a[href]') : null;
  if (emailA) {
    const email = el('p', 'ds-email');
    email.append(emailA.cloneNode(true));
    brandCol.append(email);
  }
  inner.append(brandCol);

  // slot 2: site links
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Footer');
  if (linksSec) {
    const title = linksSec.querySelector('p');
    if (title && !title.querySelector('a')) nav.append(el('p', 'ds-h4', title.textContent.trim()));
    linksSec.querySelectorAll('ul a[href], li a[href]').forEach((a) => nav.append(a.cloneNode(true)));
  }
  inner.append(nav);

  // slot 3: taprooms — groups opened by a <strong>-led <p>
  const tapsCol = document.createElement('div');
  if (tapsSec) {
    const ps = [...tapsSec.querySelectorAll('p')];
    const grid = el('div', 'ds-tap-grid');
    let current = null;
    ps.forEach((p, i) => {
      const strongLed = p.querySelector('strong') && p.textContent.trim() === (p.querySelector('strong').textContent || '').trim();
      if (i === 0 && !strongLed) {
        tapsCol.append(el('p', 'ds-h4', p.textContent.trim()));
        return;
      }
      if (strongLed) {
        current = el('div', 'ds-tap');
        current.append(el('b', '', p.textContent.trim()));
        grid.append(current);
        return;
      }
      if (current) {
        const line = document.createElement('span');
        line.className = 'ds-tap-line';
        line.append(...[...p.childNodes].map((n) => n.cloneNode(true)));
        current.append(line);
      }
    });
    if (grid.children.length) tapsCol.append(grid);
  }
  inner.append(tapsCol);
  dsFooter.append(inner);

  // slot 4: colophon
  if (colophonSec) {
    const colophon = el('div', 'ds-colophon');
    [...colophonSec.querySelectorAll('p')].forEach((p) => {
      const span = document.createElement('span');
      span.append(...[...p.childNodes].map((n) => n.cloneNode(true)));
      colophon.append(span);
    });
    dsFooter.append(colophon);
  }

  block.textContent = '';
  block.append(dsFooter);
}
