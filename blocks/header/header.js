/**
 * header — FlexiLoans chrome: fixed transparent bar over the hero that
 * solidifies on scroll (CSS scroll-driven animation, solid navy fallback),
 * brand logo, mega-menu nav, language switch + Login + Apply Now CTA.
 * Template-slotted (anti-pattern 5): consumes the authored nav document's
 * fixed 3-section contract (brand / sections / tools) from
 * /flexiloans/nav (per-page `nav` metadata override — subfolder site).
 * The stock hamburger/aria/escape/focus-out machinery is KEPT and restyled.
 * Mega groups: inside a top-level item's nested <ul>, an <li> holding only a
 * <strong> label opens a new group (leading preserved tag, no invented syntax).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

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
  const isNavDrop = focused.classList.contains('nav-drop');
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
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Restructure a nav-drop's nested list into the prototype's mega panel:
 * groups split on <li><strong>Label</strong></li> boundaries.
 * @param {Element} navSection the top-level <li>
 */
function buildMega(navSection) {
  const submenu = navSection.querySelector(':scope > ul');
  if (!submenu) return;

  const groups = [];
  let current = null;
  [...submenu.children].forEach((li) => {
    const strong = li.querySelector(':scope > strong');
    if (strong && !li.querySelector('a')) {
      current = { label: strong.textContent.trim(), items: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { label: '', items: [] };
        groups.push(current);
      }
      current.items.push(li);
    }
  });

  const mega = document.createElement('div');
  mega.className = 'mega';
  const cols = document.createElement('div');
  cols.className = 'mega-cols';
  groups.forEach((g) => {
    const group = document.createElement('div');
    group.className = 'mega-group';
    if (g.label) {
      const label = document.createElement('p');
      label.className = 'mega-label';
      label.textContent = g.label;
      group.append(label);
    }
    const ul = document.createElement('ul');
    g.items.forEach((li) => ul.append(li));
    group.append(ul);
    cols.append(group);
  });
  mega.append(cols);
  submenu.replaceWith(mega);

  // caret on the trigger link — the pipeline wraps the authored trigger in a
  // <p> (<li><p><a>…), so match both shapes (#79); unwrap so CSS keyed to
  // `li > a` applies on live exactly as in the harness
  const trigger = navSection.querySelector(':scope > a, :scope > p > a');
  if (trigger && !trigger.querySelector('.caret')) {
    const wrapper = trigger.parentElement;
    if (wrapper.tagName === 'P') wrapper.replaceWith(trigger);
    trigger.setAttribute('aria-haspopup', 'true');
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.textContent = '▾';
    trigger.append(' ', caret);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment (per-page override → /flexiloans/nav on this site)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = 'nav-logo';
      const wrapper = brandLink.closest('p');
      if (wrapper) wrapper.className = '';
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const list = navSections.querySelector('.default-content-wrapper > ul');
    if (list) list.classList.add('nav-links');
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      // the pipeline wraps each item's trigger link in a <p> (<li><p><a>…) on
      // live while the raw authored shape is <li><a> (#79) — unwrap so the
      // `.nav-links > li > a` CSS applies in both environments
      const pWrapped = navSection.querySelector(':scope > p > a');
      if (pWrapped) pWrapped.parentElement.replaceWith(pWrapped);
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        buildMega(navSection);
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // tools: language switch (aria-current on the active language), login, Apply CTA
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const toolParagraphs = [...navTools.querySelectorAll(':scope > .default-content-wrapper > p')];
    toolParagraphs.forEach((p) => {
      const links = [...p.querySelectorAll('a')];
      if (links.length > 1 && links.every((a) => !a.classList.contains('button'))) {
        p.className = 'lang-switch';
        const onHindi = window.location.pathname.startsWith('/flexiloans/hi');
        links.forEach((a) => {
          const isHindi = new URL(a.href, window.location).pathname.includes('/hi');
          a.setAttribute('aria-current', String(isHindi === onHindi));
        });
      } else if (links.length === 1 && !links[0].classList.contains('button')) {
        p.className = 'nav-login-wrapper';
        links[0].className = 'nav-login';
      } else if (links[0] && links[0].classList.contains('button')) {
        links[0].classList.add('nav-apply');
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
