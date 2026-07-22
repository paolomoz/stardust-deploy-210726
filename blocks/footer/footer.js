import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = {
  twitter: '<path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7Zm-1.3 19.4h2L6.6 3.3h-2.2l13.2 17.3Z"/>',
  x: '<path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7Zm-1.3 19.4h2L6.6 3.3h-2.2l13.2 17.3Z"/>',
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/>',
  youtube: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.5 15.6V8.4L15.8 12l-6.3 3.6Z"/>',
  instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.4 6.6h.01"/>',
  linkedin: '<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5Z"/>',
};

function socialIcon(href) {
  const key = Object.keys(SOCIAL).find((k) => href.includes(k));
  const stroke = ['instagram'].includes(key);
  return `<svg width="18" height="18" viewBox="0 0 24 24" ${stroke ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : 'fill="currentColor"'} aria-hidden="true">${SOCIAL[key] || ''}</svg>`;
}

/**
 * footer — Riverview footer (template-slotted).
 * /footer (or the `footer` metadata override) supplies, in order:
 *   1. brand column — logo, address, Contact CTA, a social-links list
 *   2..N link columns
 *   last: a copyright line ("© …") → bottom bar
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const cols = [...fragment.children];

  // detect copyright bottom column (a section whose only text starts with ©)
  let bottomCol = null;
  if (cols.length && /©|all rights reserved/i.test(cols[cols.length - 1].textContent) && !cols[cols.length - 1].querySelector('img, ul')) {
    bottomCol = cols.pop();
  }

  const grid = document.createElement('div');
  grid.className = 'ds-footer-grid';

  cols.forEach((col, i) => {
    const div = document.createElement('div');
    if (i === 0) {
      div.className = 'ds-footer-brand';
      const img = col.querySelector('picture, img');
      if (img) {
        const logo = document.createElement('a');
        logo.className = 'ds-footer-logo ds-logo';
        logo.href = footerPath.replace(/footer$/, '') || '/';
        logo.append(img.matches('picture, img') ? img : img.querySelector('picture, img'));
        div.append(logo);
      }
      // social list = last <ul> whose items are external links
      const lists = [...col.querySelectorAll('ul')];
      const socialList = lists.find((ul) => [...ul.querySelectorAll('a')].some((a) => Object.keys(SOCIAL).some((k) => a.href.includes(k))));
      // contact CTA (author as <em><a> → a.button.secondary)
      const contactWrapper = col.querySelector('p.button-wrapper');
      const contact = contactWrapper ? contactWrapper.querySelector('a') : null;
      const addr = document.createElement('address');
      addr.className = 'ds-footer-address';
      col.querySelectorAll(':scope > p').forEach((p) => {
        if (p.querySelector('img') || p.classList.contains('button-wrapper')) return;
        const a = p.querySelector('a[href^="tel:"]');
        if (a) { a.classList.add('ds-footer-phone'); addr.append(a); }
        else addr.append(p);
      });
      if (addr.childNodes.length) div.append(addr);
      if (contact) { contact.className = 'button secondary ds-footer-contact'; div.append(contact); }
      if (socialList) {
        socialList.className = 'ds-footer-social';
        socialList.querySelectorAll('a').forEach((a) => { a.innerHTML = socialIcon(a.href); });
        div.append(socialList);
      }
    } else {
      div.className = 'ds-footer-links';
      while (col.firstChild) div.append(col.firstChild);
      div.querySelectorAll('a').forEach((a) => { if (a.classList.contains('button')) a.className = 'button secondary'; });
    }
    grid.append(div);
  });

  const inner = document.createElement('div');
  inner.className = 'ds-footer-inner';
  inner.append(grid);

  if (bottomCol) {
    const bottom = document.createElement('div');
    bottom.className = 'ds-footer-bottom';
    while (bottomCol.firstChild) bottom.append(bottomCol.firstChild);
    inner.append(bottom);
  }

  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';
  wrap.append(inner);

  const footerEl = document.createElement('div');
  footerEl.className = 'ds-footer';
  footerEl.append(wrap);
  block.append(footerEl);
}
