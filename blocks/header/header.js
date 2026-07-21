/**
 * header — Wasatch Back chrome, template-slotted (#95 / anti-pattern 5).
 * The block holds the prototype's chrome DOM (.ds-header) and fills fixed
 * role slots from the authored /nav document's section contract:
 *   section 1 = brand (wordmark link), section 2 = nav link list (<ul>),
 *   section 3 = tools (optional — unused on this site).
 * Interaction machinery kept from the stock block pattern: hamburger with
 * aria-expanded, Escape close, focus-out close, desktop media-query switch
 * (641px — the prototype collapses at 640px). Scroll-stuck state (.is-stuck
 * past 80px) is wired here in block JS, never via lifted inline scripts (D15).
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// prototype collapses the inline nav at 640px
const isDesktop = window.matchMedia('(min-width: 641px)');

const BURGER_SVG = '<svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" stroke-width="2"/></svg>';

function toggleMenu(nav, burger, forceOpen = null) {
  const open = forceOpen !== null ? forceOpen : !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

export default async function decorate(block) {
  // load nav as fragment (path overridable per page via `nav` metadata)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // --- read the authored slots ---
  const sections = fragment ? [...fragment.children] : [];
  const brandLink = sections[0] ? sections[0].querySelector('a[href]') : null;
  const navLinks = sections[1] ? [...sections[1].querySelectorAll('ul a[href], a[href]')] : [];

  // --- build the prototype's chrome DOM (root-class hook #26) ---
  const dsHeader = document.createElement('div');
  dsHeader.className = 'ds-header';

  const inner = document.createElement('div');
  inner.className = 'ds-header-inner';

  const wordmark = document.createElement('a');
  wordmark.className = 'ds-wordmark';
  wordmark.href = brandLink ? brandLink.getAttribute('href') : '/';
  const spike = document.createElement('span');
  spike.className = 'ds-spike';
  spike.setAttribute('aria-hidden', 'true');
  wordmark.append(spike, document.createTextNode(brandLink ? brandLink.textContent.trim() : 'Wasatch Back'));
  inner.append(wordmark);

  const burger = document.createElement('button');
  burger.className = 'ds-nav-burger';
  burger.type = 'button';
  burger.setAttribute('aria-controls', 'primary-nav');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open navigation');
  burger.innerHTML = BURGER_SVG;
  inner.append(burger);

  const nav = document.createElement('nav');
  nav.className = 'ds-nav';
  nav.id = 'primary-nav';
  nav.setAttribute('aria-label', 'Primary');
  navLinks.forEach((a) => {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    try {
      if (new URL(link.href, window.location).pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) {
        link.setAttribute('aria-current', 'page');
      }
    } catch { /* keep plain link */ }
    nav.append(link);
  });
  inner.append(nav);

  dsHeader.append(inner);
  block.textContent = '';
  block.append(dsHeader);

  // --- interaction machinery ---
  burger.addEventListener('click', () => toggleMenu(nav, burger));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.classList.contains('is-open')) {
      toggleMenu(nav, burger, false);
      burger.focus();
    }
  });
  dsHeader.addEventListener('focusout', (e) => {
    if (!isDesktop.matches && !dsHeader.contains(e.relatedTarget)) toggleMenu(nav, burger, false);
  });
  isDesktop.addEventListener('change', () => toggleMenu(nav, burger, false));

  // scroll-stuck chrome state (block JS, not lifted inline script)
  const onScroll = () => {
    dsHeader.classList.toggle('is-stuck', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
