import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/* inline social icons (prototype SVGs, keyed by authored link hostname) */
const SOCIAL_ICONS = {
  'facebook.com': '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.12-2.45-.12-2.4 0-4.05 1.46-4.05 4.15v2.27H7.5V13h2.7v8h3.3z"/></svg>',
  'youtube.com': '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8zM10 15.2V8.8L15.6 12 10 15.2z"/></svg>',
  'linkedin.com': '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM3.2 9.3h3.6V21H3.2V9.3zm5.7 0h3.45v1.6h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.3 2.4 4.3 5.5V21h-3.6v-5.8c0-1.38-.02-3.16-1.92-3.16-1.93 0-2.22 1.5-2.22 3.06V21H8.9V9.3z"/></svg>',
};

function socialIconFor(href) {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    const key = Object.keys(SOCIAL_ICONS).find((k) => host.endsWith(k));
    return key ? SOCIAL_ICONS[key] : null;
  } catch {
    return null;
  }
}

/**
 * footer — Interacoustics chrome (template-slotted, #95).
 * Footer document contract (/interacoustics/footer): sections 1–4 = sitemap
 * columns (colhead link/text + list), last section = bottom band (brand logo
 * link, social link list, copyright line, legal links).
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.children];
  const bottomSection = sections.pop();

  const shell = document.createElement('div');
  shell.className = 'shell';

  // sitemap columns
  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  sections.forEach((section) => {
    const col = document.createElement('div');
    col.className = 'footer-col';
    const content = section.querySelector('.default-content-wrapper') || section;
    [...content.children].forEach((el) => {
      if (el.matches('p') && !col.querySelector('.colhead')) {
        const link = el.querySelector('a');
        const head = link || el;
        head.classList.add('colhead');
        col.append(head === link ? link : el);
      } else {
        col.append(el);
      }
    });
    grid.append(col);
  });
  shell.append(grid);

  // bottom band: brand / social / legal
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const content = bottomSection
    ? (bottomSection.querySelector('.default-content-wrapper') || bottomSection) : null;
  if (content) {
    [...content.children].forEach((el) => {
      const img = el.querySelector('img');
      const links = [...el.querySelectorAll('a')];
      if (img && links.length) {
        // brand logo link
        const brand = links[0];
        brand.className = 'brand';
        bottom.append(brand);
      } else if (el.matches('ul') && links.some((a) => socialIconFor(a.href))) {
        // social list → icon row
        const social = document.createElement('div');
        social.className = 'social';
        links.forEach((a) => {
          const icon = socialIconFor(a.href);
          if (icon) {
            a.setAttribute('aria-label', a.textContent.trim());
            a.innerHTML = icon;
          }
          social.append(a);
        });
        bottom.append(social);
      } else {
        // copyright line + legal links share the .legal row
        let legal = bottom.querySelector('.legal');
        if (!legal) {
          legal = document.createElement('div');
          legal.className = 'legal';
          bottom.append(legal);
        }
        if (!links.length) {
          el.classList.add('copyright');
          legal.append(el);
        } else {
          legal.append(...links);
        }
      }
    });
  }
  shell.append(bottom);

  const footer = document.createElement('div');
  footer.append(shell);
  block.append(footer);
}
