/**
 * header — Baremetrics chrome. Template-slotted (#95): fetches the authored
 * /baremetrics/nav document (3-section contract: brand / links / tools) and
 * slots it into the prototype's header-bar. Stock hamburger/aria machinery
 * kept and restyled; collapse breakpoint 1081px (prototype adapt P1: the
 * inline nav needs ~1130px, so 769–1080px must be collapsed).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1081px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/* prototype locale switcher: <details> dropdown built from the authored
   locale link list (tools section, first <ul>) */
function buildLocale(list) {
  const links = [...list.querySelectorAll('a')];
  if (!links.length) return null;
  const details = document.createElement('details');
  details.className = 'locale';
  const summary = document.createElement('summary');
  summary.setAttribute('aria-label', 'Change language');
  const current = links.find((a) => a.hasAttribute('aria-current')) || links[0];
  summary.textContent = current.textContent.trim();
  const menu = document.createElement('div');
  menu.className = 'locale-menu';
  links.forEach((a) => menu.append(a));
  details.append(summary, menu);
  return details;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment (subfolder-site default)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/baremetrics/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand ? navBrand.querySelector('.button') : null;
  if (brandLink) {
    brandLink.className = '';
    const wrapper = brandLink.closest('.button-wrapper');
    if (wrapper) wrapper.removeAttribute('class');
  }
  const brandAnchor = navBrand ? navBrand.querySelector('a') : null;
  if (brandAnchor) brandAnchor.classList.add('brand-link');

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      // the pipeline may wrap the trigger link in a <p> on live (#98) — unwrap
      const wrapped = navSection.querySelector(':scope > p > a');
      if (wrapped) wrapped.closest('p').replaceWith(wrapped);
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // tools: locale dropdown + sign-in + trial CTA (prototype header-utility)
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const utility = document.createElement('div');
    utility.className = 'header-utility';
    const localeList = navTools.querySelector('ul');
    let localeLinks = [];
    if (localeList) {
      localeLinks = [...localeList.querySelectorAll('a')].map((a) => a.cloneNode(true));
      const details = buildLocale(localeList);
      localeList.remove();
      if (details) utility.append(details);
    }
    let signIn = null;
    let cta = null;
    [...navTools.querySelectorAll('a')].forEach((a) => {
      if (a.classList.contains('button')) {
        a.className = 'button secondary nav-cta';
        cta = a;
      } else {
        a.classList.add('nav-signin');
        signIn = a;
      }
    });
    if (signIn) utility.append(signIn);
    if (cta) utility.append(cta);
    navTools.replaceChildren(utility);

    // collapsed panel gets sign-in + locale entries (prototype ≤1080 behavior)
    const panelList = navSections ? navSections.querySelector('.default-content-wrapper > ul') : null;
    if (panelList) {
      if (signIn) {
        const li = document.createElement('li');
        li.className = 'nav-signin-mobile';
        const clone = signIn.cloneNode(true);
        clone.className = '';
        li.append(clone);
        panelList.append(li);
      }
      localeLinks.forEach((a) => {
        const li = document.createElement('li');
        li.className = 'nav-locale';
        a.className = '';
        li.append(a);
        panelList.append(li);
      });
    }
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span><span class="nav-hamburger-label">Menu</span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
