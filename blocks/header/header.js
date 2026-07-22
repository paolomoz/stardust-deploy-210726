import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — Cority chrome (utility bar + logo + primary nav + Get a Demo).
 * Nav fragment sections (authored in /cority-home/nav):
 *   1. utility  — announcement <p> (with link) + <ul> language list
 *   2. brand    — logo link (image)
 *   3. sections — <ul> of primary nav links
 *   4. tools    — Get a Demo CTA
 * Keeps an accessible hamburger toggle (real JS) for <=768px.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const sections = [...fragment.children];

  const root = document.createElement('div');
  root.className = 'site-chrome';

  // 1. utility bar
  const utility = sections[0];
  if (utility) {
    const bar = document.createElement('div');
    bar.className = 'utility';
    const w = document.createElement('div');
    w.className = 'wrap';
    while (utility.firstElementChild) w.append(utility.firstElementChild);
    const ul = w.querySelector('ul');
    if (ul) ul.classList.add('langs');
    bar.append(w);
    root.append(bar);
  }

  // 2-4. header row
  const header = document.createElement('div');
  header.className = 'site';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const brand = sections[1];
  if (brand) {
    const link = brand.querySelector('a') || brand;
    link.classList.add('logo');
    wrap.append(link);
  }

  const burger = document.createElement('button');
  burger.className = 'burger-btn';
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'primary-nav');
  burger.setAttribute('aria-label', 'Menu');
  burger.textContent = '☰';
  wrap.append(burger);

  const nav = document.createElement('nav');
  nav.className = 'primary';
  nav.id = 'primary-nav';
  nav.setAttribute('aria-label', 'Primary');
  const links = sections[2];
  if (links) { const ul = links.querySelector('ul'); if (ul) nav.append(ul); }
  wrap.append(nav);

  const tools = sections[3];
  if (tools) {
    const cta = tools.querySelector('a');
    if (cta) { cta.className = 'btn btn-primary header-cta'; wrap.append(cta); }
  }

  header.append(wrap);
  root.append(header);
  block.append(root);

  // hamburger toggle (accessible)
  let open = false;
  const setOpen = (v) => {
    open = v;
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { setOpen(false); burger.focus(); }
  });
}
