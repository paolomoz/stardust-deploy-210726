import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width (prototype burger takes over ≤800px)
const isDesktop = window.matchMedia('(min-width: 801px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
      nav.querySelector('.nav-hamburger button').focus();
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

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  // enable menu collapse on escape keypress / focus lost
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * header — Interacoustics chrome (template-slotted, #95).
 * Nav document contract (/interacoustics/nav): section 1 = brand (logo link),
 * section 2 = nav link list, section 3 = tools (Find a distributor CTA),
 * section 4 = utility strip links (SELECT LANGUAGE / EXTRANET).
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools', 'utility'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // #98: the pipeline wraps list-item links in <p> on live — unwrap
  nav.querySelectorAll('.nav-sections li > p').forEach((p) => p.replaceWith(...p.childNodes));

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand && navBrand.querySelector('a');
  if (brandLink) {
    brandLink.className = 'brand';
    const bw = brandLink.closest('.button-wrapper');
    if (bw) bw.className = '';
  }

  // tools CTA: design-system variant applied by the block (#25), not authored emphasis
  const cta = nav.querySelector('.nav-tools a');
  if (cta) cta.className = 'header-cta';

  // utility strip renders above the nav row
  const navUtility = nav.querySelector('.nav-utility');
  let utility = null;
  if (navUtility) {
    utility = document.createElement('div');
    utility.className = 'utility';
    const row = document.createElement('div');
    row.className = 'utility-row';
    row.append(...navUtility.querySelectorAll('a'));
    utility.append(row);
    navUtility.remove();
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'nav');
  button.setAttribute('aria-label', 'Open navigation');
  button.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'nav-hamburger-icon';
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'nav-hamburger-label';
  label.textContent = 'Menu';
  button.append(icon, label);
  hamburger.append(button);
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  if (utility) navWrapper.append(utility);
  navWrapper.append(nav);
  block.append(navWrapper);
}
