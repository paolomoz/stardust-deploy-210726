import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 901px)');

const CHEVRON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

function closeAllDropdowns(scope) {
  scope.querySelectorAll('.ds-nav-sub-toggle[aria-expanded="true"]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
}

/**
 * header — Riverview two-row chrome (template-slotted).
 * /nav (or the `nav` metadata override) supplies three sections:
 *   1. brand  — logo link
 *   2. sections — main nav <ul> with nested <ul> submenus
 *   3. tools  — utility links + Schedule CTA
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const sections = [...fragment.children];
  const brandSrc = sections[0];
  const navSrc = sections[1];
  const toolsSrc = sections[2];

  // ---- utility top bar ----
  const util = document.createElement('div');
  util.className = 'ds-util';
  if (toolsSrc) {
    const uWrap = document.createElement('div');
    uWrap.className = 'ds-wrap';
    // #98: pipeline may wrap trigger links in <p>; unwrap
    toolsSrc.querySelectorAll('p').forEach((p) => { if (p.children.length === 1 && p.firstElementChild.tagName === 'A') p.replaceWith(p.firstElementChild); });
    while (toolsSrc.firstChild) uWrap.append(toolsSrc.firstChild);
    util.append(uWrap);
  }

  // ---- main bar ----
  const bar = document.createElement('div');
  bar.className = 'ds-wrap ds-header-bar';

  const brand = document.createElement('a');
  brand.className = 'ds-logo';
  brand.href = `${new URL(navPath, window.location).pathname.replace(/nav$/, '') || '/'}`;
  brand.setAttribute('aria-label', 'Riverview Health — home');
  const brandImg = brandSrc && brandSrc.querySelector('picture, img');
  if (brandImg) brand.append(brandImg);

  const nav = document.createElement('nav');
  nav.className = 'ds-nav';
  nav.setAttribute('aria-label', 'Main');
  if (navSrc) {
    const list = navSrc.querySelector('ul');
    if (list) {
      list.classList.add('ds-nav-list');
      list.querySelectorAll(':scope > li').forEach((li) => {
        li.classList.add('ds-nav-item');
        const top = li.querySelector(':scope > a, :scope > p > a');
        if (top) { top.classList.add('ds-nav-top'); if (top.parentElement.tagName === 'P') top.parentElement.replaceWith(top); }
        const sub = li.querySelector(':scope > ul');
        if (sub) {
          sub.classList.add('ds-nav-sub');
          const toggle = document.createElement('button');
          toggle.className = 'ds-nav-sub-toggle';
          toggle.type = 'button';
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', `${top ? top.textContent : ''} submenu`);
          toggle.innerHTML = CHEVRON;
          toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            closeAllDropdowns(nav);
            toggle.setAttribute('aria-expanded', String(!open));
          });
          sub.before(toggle);
        }
      });
      nav.append(list);
    }
  }

  const burger = document.createElement('button');
  burger.className = 'ds-nav-burger';
  burger.type = 'button';
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'mobile-nav');
  burger.setAttribute('aria-label', 'Open menu');
  burger.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

  bar.append(brand, nav, burger);

  // ---- mobile panel ----
  const panel = document.createElement('div');
  panel.className = 'ds-mobile-panel';
  panel.id = 'mobile-nav';
  const pnav = document.createElement('nav');
  pnav.setAttribute('aria-label', 'Mobile');
  const pWrap = document.createElement('div');
  pWrap.className = 'ds-wrap';
  if (navSrc) {
    const topList = document.createElement('ul');
    nav.querySelectorAll('.ds-nav-top').forEach((a) => {
      const li = document.createElement('li');
      const c = a.cloneNode(true); c.className = '';
      li.append(c); topList.append(li);
    });
    pWrap.append(topList);
  }
  pnav.append(pWrap);
  panel.append(pnav);

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('is-open', !open);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAllDropdowns(nav);
    if (burger.getAttribute('aria-expanded') === 'true') { burger.setAttribute('aria-expanded', 'false'); panel.classList.remove('is-open'); burger.focus(); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.ds-nav-item')) closeAllDropdowns(nav); });
  isDesktop.addEventListener('change', () => { closeAllDropdowns(nav); burger.setAttribute('aria-expanded', 'false'); panel.classList.remove('is-open'); });

  const headerEl = document.createElement('div');
  headerEl.className = 'ds-header';
  headerEl.append(util, bar, panel);
  block.append(headerEl);
}
