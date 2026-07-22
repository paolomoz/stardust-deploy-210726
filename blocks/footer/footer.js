/**
 * footer — Baremetrics chrome. Template-slotted (#95): fetches the authored
 * /baremetrics/footer document (sections contract: N link-column sections
 * [heading + link list; a column may carry TWO heading+list groups, e.g.
 * Support + Legal] + one bottom section [tel link, social link list,
 * "Stripe Verified Partner" badge line]). Social icons + Stripe badge are
 * fixed brand SVGs owned by this block (inline, keyed by href/text).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  dribbble: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.2 9.3c4.3.9 9 .5 13.4-1.6M16.8 20.1c-1-4.8-3.2-9-6.6-13.1M3.2 14.3c4.8-1.5 9.4-1 14.1 1.7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.1" cy="6.9" r="1.3" fill="currentColor"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7C8.5 8.9 5.5 7.3 3.5 4.8c-.4.7-.6 1.4-.6 2.2 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.2-1.1.2l-.8-.1c.5 1.6 2 2.8 3.8 2.9A8.3 8.3 0 0 1 2 18.7a11.7 11.7 0 0 0 6.3 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2.2z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 3h3v3.2h-2c-.7 0-1 .4-1 1.1V9.5h3l-.5 3H14V21h-3.2v-8.5H8v-3h2.8V7c0-2.4 1.4-4 3.2-4z"/></svg>',
};

const STRIPE_BADGE = '<svg viewBox="0 0 42 18" width="42" height="18" aria-hidden="true" focusable="false" class="stripe-wordmark"><text x="0" y="14" font-family="Inter, sans-serif" font-size="15" font-weight="800" fill="currentColor" letter-spacing="-0.4">stripe</text></svg>'
  + '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.6 8.3l2.2 2.2 4.4-4.6" fill="none" stroke="oklch(100% 0 0)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildColumn(wrapper) {
  const col = document.createElement('div');
  col.className = 'footer-col';
  let currentNav = null;
  [...wrapper.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      const h3 = document.createElement('h3');
      h3.textContent = el.textContent.trim();
      col.append(h3);
      currentNav = document.createElement('nav');
      currentNav.setAttribute('aria-label', h3.textContent);
      col.append(currentNav);
    } else if (el.matches('ul, ol')) {
      const target = currentNav || col;
      el.querySelectorAll('a').forEach((a) => target.append(a));
    } else {
      el.querySelectorAll('a').forEach((a) => (currentNav || col).append(a));
    }
  });
  return col;
}

function buildBottom(wrapper) {
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const contact = document.createElement('div');
  contact.className = 'footer-contact';
  const social = document.createElement('div');
  social.className = 'footer-social';

  [...wrapper.querySelectorAll('a')].forEach((a) => {
    const href = a.getAttribute('href') || '';
    const key = Object.keys(SOCIAL_ICONS).find((k) => href.includes(k));
    if (key) {
      const label = a.textContent.trim() || `Baremetrics on ${key}`;
      a.setAttribute('aria-label', label);
      a.innerHTML = SOCIAL_ICONS[key];
      social.append(a);
    } else if (href.startsWith('tel:')) {
      contact.prepend(a);
    }
  });
  contact.append(social);
  bottom.append(contact);

  const badgeLine = [...wrapper.querySelectorAll('p')].find((p) => /stripe/i.test(p.textContent) && !p.querySelector('a'));
  if (badgeLine) {
    const badge = document.createElement('span');
    badge.className = 'stripe-badge';
    badge.setAttribute('role', 'img');
    badge.setAttribute('aria-label', 'Stripe Verified Partner');
    badge.innerHTML = STRIPE_BADGE;
    const text = document.createElement('span');
    text.className = 'stripe-badge-text';
    text.textContent = badgeLine.textContent.replace(/^\s*stripe\s*/i, '').trim() || 'Verified Partner';
    badge.append(text);
    bottom.append(badge);
  }
  return bottom;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment (subfolder-site default)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/baremetrics/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope .section')];
  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  let bottom = null;

  sections.forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper') || section;
    const isBottom = !!wrapper.querySelector('a[href^="tel:"]');
    if (isBottom) {
      bottom = buildBottom(wrapper);
    } else if (wrapper.querySelector('a')) {
      grid.append(buildColumn(wrapper));
    }
  });

  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);
  if (bottom) container.append(bottom);

  block.textContent = '';
  block.append(container);
}
