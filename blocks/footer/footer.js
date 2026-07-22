import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8h3.4z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.5c2.4 0 2.7 0 3.7.1 .9 0 1.4.2 1.7.3 .4.2.7.4 1 .7 .3.3.5.6.7 1 .1.3.3.8.3 1.7 .1 1 .1 1.3.1 3.7s0 2.7-.1 3.7c0 .9-.2 1.4-.3 1.7-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.8.3-1.7.3-1 .1-1.3.1-3.7.1s-2.7 0-3.7-.1c-.9 0-1.4-.2-1.7-.3a2.9 2.9 0 0 1-1-.7 2.9 2.9 0 0 1-.7-1c-.1-.3-.3-.8-.3-1.7-.1-1-.1-1.3-.1-3.7s0-2.7.1-3.7c0-.9.2-1.4.3-1.7 .2-.4.4-.7.7-1 .3-.3.6-.5 1-.7 .3-.1.8-.3 1.7-.3 1-.1 1.3-.1 3.7-.1z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.9 8.6H3.6V20h3.3V8.6zM5.3 7.2a1.9 1.9 0 1 0 0-3.9 1.9 1.9 0 0 0 0 3.9zM20.4 13.7c0-3-1.6-4.4-3.8-4.4a3.3 3.3 0 0 0-3 1.6V8.6h-3.2V20h3.3v-5.7c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3l-.5-6.3z"/></svg>',
};

function iconFor(href) {
  const key = Object.keys(SOCIAL_ICONS).find((k) => href.includes(k));
  return key ? SOCIAL_ICONS[key] : null;
}

/**
 * loads and decorates the footer. Fragment sections (in order):
 *   link columns … | brand column (logo + address) | footer-bottom (logo + social)
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  if (!fragment) return; // footer fragment unavailable (e.g. local harness) — render nothing
  const footer = document.createElement('div');

  const sections = [...fragment.children];
  const bottomEl = sections.pop(); // last section = footer-bottom band

  // upper bands → footer-grid columns
  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  sections.forEach((sec) => {
    sec.classList.add('footer-col');
    if (sec.querySelector('img')) sec.classList.add('footer-brand');
    if (sec.querySelector('address')) sec.classList.add('footer-brand');
    grid.append(sec);
  });
  footer.append(grid);

  // footer-bottom band — logo + social row
  if (bottomEl) {
    bottomEl.classList.add('footer-bottom');
    const social = document.createElement('div');
    social.className = 'social';
    bottomEl.querySelectorAll('a').forEach((a) => {
      const svg = iconFor(a.getAttribute('href') || '');
      if (svg) { a.innerHTML = svg; social.append(a); }
    });
    // drop now-empty list/paragraph wrappers the social links were pulled out of
    bottomEl.querySelectorAll('ul, ol, p').forEach((el) => { if (!el.textContent.trim() && !el.querySelector('img')) el.remove(); });
    // wrap remaining content (logo) + social into a constrained inner row
    const inner = document.createElement('div');
    inner.className = 'footer-bottom-inner';
    while (bottomEl.firstChild) inner.append(bottomEl.firstChild);
    if (social.children.length) inner.append(social);
    bottomEl.append(inner);
    footer.append(bottomEl);
  }

  block.append(footer);
}
