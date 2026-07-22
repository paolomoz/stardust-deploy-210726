import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = [
  { test: /discord/i, svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5.5v7L12 21l-9-5.5v-7z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { test: /instagram/i, svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>' },
];

/**
 * loads and decorates the footer (4 link columns + PAngV fineprint).
 * Template-slotted chrome (#95): /card-corner/footer supplies one section per
 * column, plus a trailing fineprint section.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/card-corner/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = [...fragment.children];
  // last section = fineprint (contains the PAngV line, no heading)
  const fineprint = sections.find((s) => !s.querySelector('h1, h2, h3') && s.textContent.trim());
  const columns = sections.filter((s) => s !== fineprint);

  const footer = document.createElement('div');

  const container = document.createElement('div');
  container.className = 'ds-container ds-section';

  const grid = document.createElement('div');
  grid.className = 'ds-footer-grid';
  columns.forEach((col) => {
    const wrap = document.createElement('div');
    // detect social column (has social hrefs)
    const links = [...col.querySelectorAll('a')];
    const isSocial = links.some((a) => SOCIAL_ICONS.some((s) => s.test.test(a.href)));
    [...col.childNodes].forEach((n) => wrap.append(n.cloneNode(true)));
    if (isSocial) {
      // rebuild social links with icons in a .ds-social row
      const socialRow = document.createElement('div');
      socialRow.className = 'ds-social';
      links.forEach((a) => {
        const link = document.createElement('a');
        link.href = a.href;
        const match = SOCIAL_ICONS.find((s) => s.test.test(a.href));
        if (match) link.insertAdjacentHTML('beforeend', match.svg);
        link.append(document.createTextNode(a.textContent.trim()));
        socialRow.append(link);
      });
      // remove the raw ul (keep the heading), append the styled social row
      const rawList = wrap.querySelector('ul');
      if (rawList) rawList.replaceWith(socialRow);
      else wrap.append(socialRow);
    }
    grid.append(wrap);
  });
  container.append(grid);

  if (fineprint) {
    const fp = document.createElement('p');
    fp.className = 'ds-fineprint';
    fp.id = 'pangv';
    fp.textContent = fineprint.textContent.trim();
    container.append(fp);
  }

  footer.append(container);
  block.append(footer);
}
