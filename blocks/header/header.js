import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — template-slotted chrome (deploy SKILL Step 6 / #95): the prototype's
 * utility bar + masthead DOM is fixed here; the authored /sos/nav document
 * fills the role slots. Nav document contract (3 sections):
 *   1. brand  — logo link (image)
 *   2. sections — one <ul> of topic/org links (first 3 left of the logo,
 *      rest right of it, per the prototype masthead)
 *   3. tools — two <ul>s: utility-primary and utility-secondary (navy bar)
 * Stock interaction machinery (aria-expanded toggle, Escape close, focusout
 * close, body scroll lock, isDesktop switch) is kept and restyled.
 */

// prototype collapses at <= 900px
const isDesktop = window.matchMedia('(min-width: 901px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (nav && nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
      nav.querySelector('.nav-hamburger button')?.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget) && !isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
  }
}

function toggleMenu(nav, forceExpanded = null) {
  const expand = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expand ? 'true' : 'false');
  document.body.style.overflowY = (expand && !isDesktop.matches) ? 'hidden' : '';
  const button = nav.querySelector('.nav-hamburger button');
  if (button) {
    button.setAttribute('aria-label', expand ? 'Close navigation' : 'Open navigation');
    button.setAttribute('aria-expanded', expand ? 'true' : 'false');
  }
  if (expand && !isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

// #98: on live the pipeline wraps each list item's link in a <p>
const itemLink = (li) => li.querySelector(':scope > a, :scope > p > a');

function cloneList(links, className) {
  const ul = document.createElement('ul');
  if (className) ul.className = className;
  links.forEach((a) => {
    if (!a) return;
    const li = document.createElement('li');
    const clone = a.cloneNode(true);
    clone.classList.remove('button', 'primary', 'secondary', 'accent');
    li.append(clone);
    ul.append(li);
  });
  return ul;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const sections = [...fragment.querySelectorAll(':scope > div')];
  const [brandSec, linksSec, toolsSec] = sections;

  // brand slot
  const brandA = brandSec?.querySelector('a');
  const brandImg = brandSec?.querySelector('picture, img');
  const logoLink = document.createElement('a');
  logoLink.className = 'logo-link';
  logoLink.href = brandA ? brandA.getAttribute('href') : '/';
  if (brandImg) {
    logoLink.append(brandImg);
  } else if (brandA) {
    logoLink.textContent = brandA.textContent.trim();
  }

  // sections slot — first 3 left, rest right
  const navLinks = [...(linksSec?.querySelectorAll('li') || [])].map(itemLink).filter(Boolean);
  const leftLinks = navLinks.slice(0, 3);
  const rightLinks = navLinks.slice(3);

  // tools slot — utility bar lists
  const toolLists = [...(toolsSec?.querySelectorAll('ul') || [])];
  const utilPrimary = [...(toolLists[0]?.querySelectorAll('li') || [])].map(itemLink).filter(Boolean);
  const utilSecondary = [...(toolLists[1]?.querySelectorAll('li') || [])].map(itemLink).filter(Boolean);

  // build the prototype chrome
  const chrome = document.createElement('div');
  chrome.className = 'nav-chrome';

  const utility = document.createElement('div');
  utility.className = 'utility';
  const utilWrap = document.createElement('div');
  utilWrap.className = 'wrap';
  utilWrap.append(cloneList(utilPrimary));
  if (utilSecondary.length) utilWrap.append(cloneList(utilSecondary, 'utility-secondary'));
  utility.append(utilWrap);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.className = 'masthead';
  nav.setAttribute('aria-expanded', 'false');

  const row = document.createElement('div');
  row.className = 'wrap masthead-row';

  const left = document.createElement('div');
  left.className = 'nav-sections nav-left';
  left.setAttribute('aria-label', 'Topics');
  left.append(cloneList(leftLinks));

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  brand.append(logoLink);

  const right = document.createElement('div');
  right.className = 'nav-sections nav-right';
  right.setAttribute('aria-label', 'Organization');
  right.append(cloneList(rightLinks));

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const burgerBtn = document.createElement('button');
  burgerBtn.type = 'button';
  burgerBtn.setAttribute('aria-controls', 'nav');
  burgerBtn.setAttribute('aria-expanded', 'false');
  burgerBtn.setAttribute('aria-label', 'Open navigation');
  burgerBtn.innerHTML = '<span></span><span></span><span></span>';
  burgerBtn.addEventListener('click', () => toggleMenu(nav));
  hamburger.append(burgerBtn);

  row.append(left, brand, right, hamburger);

  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.setAttribute('aria-label', 'Mobile');
  panel.append(cloneList([...navLinks, ...utilPrimary.slice(1), ...utilSecondary]));

  nav.append(row, panel);
  chrome.append(utility, nav);

  isDesktop.addEventListener('change', () => toggleMenu(nav, false));

  block.textContent = '';
  block.append(chrome);
}
