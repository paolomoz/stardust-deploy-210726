import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile width (hamburger below this)
const isMobile = window.matchMedia('(max-width: 640px)');

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>',
  account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"/></svg>',
  wishlist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5C7.2 16.3 3.5 13 3.5 9.1 3.5 6.4 5.6 4.5 8 4.5c1.6 0 3 .8 4 2.1 1-1.3 2.4-2.1 4-2.1 2.4 0 4.5 1.9 4.5 4.6 0 3.9-3.7 7.2-8.5 11.4z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3h2l1 3m0 0 2 9h11l2-9zm3 12a1.8 1.8 0 1 0 .01 3.6A1.8 1.8 0 0 0 8.5 15zm9 0a1.8 1.8 0 1 0 .01 3.6 1.8 1.8 0 0 0-.01-3.6z"/></svg>',
};

function iconFor(href) {
  if (/\/search/i.test(href)) return { key: 'search', svg: ICONS.search, label: 'Suche' };
  if (/Registrieren|Konto/i.test(href)) return { key: 'account', svg: ICONS.account, label: 'Konto' };
  if (/Wunschliste/i.test(href)) return { key: 'wishlist', svg: ICONS.wishlist, label: 'Wunschliste' };
  if (/Warenkorb/i.test(href)) return { key: 'cart', svg: ICONS.cart, label: 'Warenkorb' };
  return null;
}

function setExpanded(nav, toggle, expanded) {
  toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  nav.classList.toggle('nav-open', expanded);
}

/**
 * loads and decorates the header (campaign strip + logo + nav + actions).
 * Template-slotted chrome (#95): the /card-corner/nav fragment supplies content
 * in a fixed section contract — 0 campaign, 1 brand, 2 nav links, 3 tools.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/card-corner/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const sections = [...fragment.children];
  const [campaignSec, brandSec, linksSec, toolsSec] = sections;

  const header = document.createElement('div');
  header.className = 'ds-header';

  // campaign strip
  if (campaignSec && campaignSec.textContent.trim()) {
    const strip = document.createElement('div');
    strip.className = 'ds-campaign';
    strip.append(...campaignSec.childNodes);
    header.append(strip);
  }

  const inner = document.createElement('div');
  inner.className = 'ds-container ds-header-inner';

  // hamburger toggle (mobile) — accessible show/hide
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ds-nav-burger';
  toggle.setAttribute('aria-controls', 'site-nav');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menü');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  // brand / logo
  const brandLink = brandSec && brandSec.querySelector('a');
  const logo = document.createElement('a');
  logo.className = 'ds-logo';
  logo.href = (brandLink && brandLink.getAttribute('href')) || '/card-corner/';
  logo.setAttribute('aria-label', 'Card-Corner Startseite');
  const pic = brandSec && brandSec.querySelector('picture, img');
  if (pic) logo.append(pic);

  // nav links
  const nav = document.createElement('nav');
  nav.className = 'ds-nav';
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Hauptnavigation');
  const ul = linksSec && linksSec.querySelector('ul');
  if (ul) nav.append(ul);

  // tools / actions
  const actions = document.createElement('div');
  actions.className = 'ds-actions';
  const toolLinks = toolsSec ? [...toolsSec.querySelectorAll('a')] : [];
  toolLinks.forEach((a) => {
    const href = a.getAttribute('href') || '#';
    const meta = iconFor(href);
    const link = document.createElement('a');
    link.className = 'ds-icon-link';
    if (meta) link.classList.add(`ds-icon-link--${meta.key}`);
    link.href = href;
    link.setAttribute('aria-label', meta ? meta.label : a.textContent.trim());
    link.innerHTML = meta ? meta.svg : '';
    if (meta && meta.key === 'cart') {
      const total = document.createElement('span');
      total.className = 'ds-cart-total';
      total.setAttribute('aria-hidden', 'true');
      total.textContent = '0,00 €';
      link.append(total);
    }
    actions.append(link);
  });

  inner.append(toggle, logo, nav, actions);
  header.append(inner);
  block.append(header);

  // hamburger behavior
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(nav, toggle, !expanded);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setExpanded(nav, toggle, false);
      toggle.focus();
    }
  });
  isMobile.addEventListener('change', () => setExpanded(nav, toggle, false));
}
