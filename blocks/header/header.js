/**
 * header — wheelercat chrome (template-slotted, #95; anti-pattern 5 honored:
 * fixed section contract, no open-ended parsing).
 * Fetches the authored nav document (default /nav, overridden per page via
 * `nav` metadata — this site authors /wheelercat/nav) and slots its FIVE
 * sections into the prototype's chrome DOM:
 *   1. brand        — logo link
 *   2. sections     — primary verb list: <li><code>icon-key</code> <a>Verb</a>
 *                     <em>sub-label</em> + nested <ul> dropdown
 *   3. tools        — phone CTA link
 *   4. utility      — utility link list (first 2 inline, rest fold into "More")
 *   5. departments  — department link row
 * Stock interaction machinery (hamburger toggle, escape/focus-out close,
 * isDesktop switch) is kept and restyled. Nav decode matches BOTH
 * `:scope > a` and `:scope > p > a` — the pipeline wraps li triggers in <p>
 * on live (#98) — and unwraps the <p>.
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICONS = {
  equipment: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M418 681 353 577Q350 572 348.5 567.0Q347 562 347 556Q347 556 347.0 556.0Q347 556 347 556V347Q347 347 347.0 347.0Q347 347 347 347Q347 331 358.0 319.5Q369 308 385 308Q385 308 385.0 308.0Q385 308 385 308H909Q909 308 909.0 308.0Q909 308 909 308Q925 308 936.5 319.5Q948 331 948 347Q948 347 948.0 347.0Q948 347 948 347V514Q948 514 948.0 514.0Q948 514 948 514Q948 528 938.5 539.0Q929 550 915 552L708 583V718Q708 734 697.0 745.0Q686 756 670 756H486Q476 756 467.5 751.0Q459 746 454 738H453L435 708L267 832Q267 832 267.0 832.5Q267 833 267 833Q267 833 267.0 833.0Q267 833 267 833Q267 851 254.5 863.5Q242 876 224 876Q206 876 193.5 863.5Q181 851 181 833Q181 824 184.5 816.5Q188 809 193 804L121 594Q104 593 92.5 580.5Q81 568 81 552Q81 548 81.5 544.0Q82 540 84 537H83L17 480Q9 474 4.5 464.5Q0 455 0 444V355Q0 355 0.0 355.0Q0 355 0 355Q0 339 9.5 327.0Q19 315 33 311L34 310Q36 310 104.5 292.0Q173 274 175 274Q180 274 183.5 276.0Q187 278 189 281Q190 283 191.0 285.5Q192 288 192 290Q192 293 191.0 295.5Q190 298 188 301Q168 325 156.0 355.5Q144 386 144 420L142 513Q153 518 159.5 528.5Q166 539 166 551Q166 561 162.0 569.5Q158 578 152 583H151L223 790Q223 790 223.5 790.0Q224 790 224 790Q233 790 240.5 793.0Q248 796 253 802ZM797 508H869Q876 508 880.5 503.5Q885 499 885 492Q885 485 880.5 480.5Q876 476 869 476H797Q790 476 785.5 480.5Q781 485 781 492Q781 499 785.5 503.5Q790 508 797 508ZM797 450H869Q876 450 880.5 445.5Q885 441 885 434Q885 427 880.5 422.5Q876 418 869 418H797Q790 418 785.5 422.5Q781 427 781 434Q781 441 785.5 445.5Q790 450 797 450ZM797 392H869Q876 392 880.5 387.5Q885 383 885 376Q885 369 880.5 364.5Q876 360 869 360H797Q790 360 785.5 364.5Q781 369 781 376Q781 383 785.5 387.5Q790 392 797 392ZM642 403Q642 403 642.0 403.0Q642 403 642 403Q642 396 637.0 391.0Q632 386 625 386Q625 386 625.0 386.0Q625 386 625 386H584Q577 386 572.5 391.0Q568 396 568 403Q568 409 572.5 414.0Q577 419 584 419H625Q625 419 625.0 419.0Q625 419 625 419Q632 419 637.0 414.0Q642 409 642 403Q642 403 642.0 403.0Q642 403 642 403ZM420 541Q420 541 420.0 541.0Q420 541 420 541Q420 544 421.0 546.5Q422 549 423 552L499 673Q502 678 506.5 680.5Q511 683 517 683Q517 683 517.0 683.0Q517 683 517 683H615Q623 683 629.0 677.0Q635 671 635 662V488Q635 488 635.0 488.0Q635 488 635 488Q635 479 629.0 473.0Q623 467 615 467H440Q432 467 426.0 473.0Q420 479 420 488Q420 488 420.0 488.0Q420 488 420 488ZM915 214H858V276H436V214H357Q312 214 280.0 181.5Q248 149 248 104Q248 59 280.0 27.0Q312 -5 357 -5H915Q960 -5 992.0 27.0Q1024 59 1024 104Q1024 149 992.0 181.5Q960 214 915 214ZM360 57Q340 57 326.0 71.0Q312 85 312 104Q312 124 326.0 138.0Q340 152 360 152Q379 152 393.0 138.0Q407 124 407 104Q407 85 393.0 71.0Q379 57 360 57ZM543 57Q543 57 543.0 57.0Q543 57 543 57Q523 57 509.0 71.0Q495 85 495 104Q495 124 509.0 138.0Q523 152 543 152Q562 152 576.0 138.0Q590 124 590 104Q590 104 590.0 104.0Q590 104 590 104Q590 104 590.0 104.0Q590 104 590 104Q590 85 576.0 71.0Q562 57 543 57ZM726 57Q706 57 692.0 71.0Q678 85 678 104Q678 124 692.0 138.0Q706 152 726 152Q745 152 759.0 138.0Q773 124 773 104Q773 104 773.0 104.0Q773 104 773 104Q773 85 759.0 71.0Q745 57 726 57Q726 57 726.0 57.0Q726 57 726 57ZM909 57Q889 57 875.0 71.0Q861 85 861 104Q861 124 875.0 138.0Q889 152 909 152Q928 152 942.0 138.0Q956 124 956 104Q956 104 956.0 104.0Q956 104 956 104Q956 85 942.0 71.0Q928 57 909 57Q909 57 909.0 57.0Q909 57 909 57Z"/></svg>',
  rent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M514 863Q578 862 636 844Q694 825 743.5 792.0Q793 759 831 713Q870 667 893 612L894 609L934 626Q908 688 865 739Q823 791 768.5 828.0Q714 865 649 885Q585 906 514 906V887V960L383 884L514 809ZM97 450Q98 514 116 572Q135 630 168.0 679.5Q201 729 247 767Q293 806 348 829L351 830L334 870Q272 844 221 801Q169 759 132.0 704.5Q95 650 75 585Q54 521 54 450H73H0L76 319L151 450ZM510 33Q446 34 388 52Q330 71 280.5 104.0Q231 137 193 183Q154 229 131 284L130 287L89 270Q116 208 159 157Q201 105 255.5 68.0Q310 31 375 11Q439 -10 510 -10V9V-64L641 12L510 87ZM1024 446 948 577 873 446H927Q926 382 908 324Q889 266 856.0 216.5Q823 167 777 129Q731 90 676 67L673 66L690 26Q752 52 803 95Q855 137 892.0 191.5Q929 246 949 311Q970 375 970 446H951Z"/></svg>',
  service: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M130 777Q132 776 134.5 775.0Q137 774 138 772L399 511L446 559L186 819Q184 821 182.5 823.0Q181 825 181 828L164 893L56 955L2 902L64 793ZM362 182 775 596Q778 598 781.5 599.5Q785 601 788 601Q790 601 791.0 601.0Q792 601 793 601Q803 598 814.5 596.5Q826 595 838 595Q913 595 966.0 648.0Q1019 701 1019 777Q1019 777 1019.0 777.0Q1019 777 1019 778Q1019 780 1019.0 782.5Q1019 785 1019 788L923 692Q920 689 917.0 687.5Q914 686 910 686Q908 686 906.5 686.5Q905 687 904 687L795 724Q791 725 787.5 728.0Q784 731 783 735L747 845Q746 846 746.0 847.5Q746 849 746 851Q746 854 747.5 857.5Q749 861 751 863L847 960Q845 960 842.0 960.0Q839 960 836 960Q761 960 707.5 907.0Q654 854 654 779Q654 767 655.5 755.0Q657 743 660 732V733Q660 732 660.5 731.0Q661 730 661 729Q661 725 659.5 722.0Q658 719 655 716L242 302Q239 300 235.5 298.5Q232 297 229 297Q228 297 226.5 297.0Q225 297 224 298Q214 300 203.0 301.5Q192 303 180 303Q180 303 179.5 303.0Q179 303 179 303Q103 303 49.0 249.5Q-5 196 -5 120Q-5 44 49.0 -10.0Q103 -64 179 -64Q255 -64 309.0 -10.0Q363 44 363 120Q363 132 361.5 143.5Q360 155 357 166V165Q357 166 356.5 167.0Q356 168 356 169Q356 173 357.5 176.5Q359 180 362 182ZM225 48H136L92 121L136 194H225L268 121ZM295 261 696 663 722 637 321 236ZM870 -54Q878 -58 888.0 -60.0Q898 -62 909 -62Q954 -62 986.5 -29.5Q1019 3 1019 49Q1019 60 1017.0 69.5Q1015 79 1012 89V88ZM987 127 782 332Q775 326 765.5 322.5Q756 319 745 319Q722 319 705.0 335.5Q688 352 688 376Q688 387 692.0 396.0Q696 405 702 413L673 442L516 285L545 256Q553 262 562.0 265.5Q571 269 582 269Q605 269 622.0 252.5Q639 236 639 212Q639 202 635.5 192.5Q632 183 625 176L830 -29Q832 -31 833.5 -32.5Q835 -34 837 -35L993 121Q992 122 990.5 124.0Q989 126 987 127ZM879 53 696 236 722 261 905 79Z"/></svg>',
  order: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M432 960H592Q592 960 592.0 960.0Q592 960 592 960Q612 960 626.0 946.0Q640 932 640 912Q640 912 640.0 912.0Q640 912 640 912V576H815Q832 576 843.5 564.5Q855 553 855 536Q855 528 852.0 520.5Q849 513 844 508L539 203Q534 198 527.0 195.0Q520 192 512 192Q504 192 497.0 195.0Q490 198 485 203L180 508Q175 513 172.0 520.5Q169 528 169 536Q169 553 180.5 564.5Q192 576 208 576H384V912Q384 912 384.0 912.0Q384 912 384 912Q384 932 398.0 946.0Q412 960 432 960Q432 960 432.0 960.0Q432 960 432 960ZM1024 208V-16Q1024 -16 1024.0 -16.0Q1024 -16 1024 -16Q1024 -36 1010.0 -50.0Q996 -64 976 -64Q976 -64 976.0 -64.0Q976 -64 976 -64H48Q48 -64 48.0 -64.0Q48 -64 48 -64Q28 -64 14.0 -50.0Q0 -36 0 -16Q0 -16 0.0 -16.0Q0 -16 0 -16V208Q0 208 0.0 208.0Q0 208 0 208Q0 228 14.0 242.0Q28 256 48 256Q48 256 48.0 256.0Q48 256 48 256H341L439 158Q453 144 472.0 136.0Q491 128 512 128Q533 128 552.0 136.0Q571 144 585 158L683 256H976Q976 256 976.0 256.0Q976 256 976 256Q996 256 1010.0 242.0Q1024 228 1024 208Q1024 208 1024.0 208.0Q1024 208 1024 208ZM776 32Q776 49 764.5 60.5Q753 72 736 72Q719 72 707.5 60.5Q696 49 696 32Q696 15 707.5 3.5Q719 -8 736 -8Q753 -8 764.5 3.5Q776 15 776 32ZM904 32Q904 49 892.5 60.5Q881 72 864 72Q847 72 835.5 60.5Q824 49 824 32Q824 15 835.5 3.5Q847 -8 864 -8Q881 -8 892.5 3.5Q904 15 904 32Z"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M728 960H298Q267 960 245.0 938.0Q223 916 223 885Q223 885 223.0 885.0Q223 885 223 885V11Q223 -20 245.0 -42.0Q267 -64 298 -64H728Q759 -64 781.0 -42.0Q803 -20 803 11V885Q803 916 781.0 938.0Q759 960 728 960ZM747 130H279V834H747ZM613 884H413V906H613V884ZM698 894Q698 894 698.0 894.0Q698 894 698 894Q698 886 692.5 880.5Q687 875 679 875Q671 875 665.5 880.5Q660 886 660 894Q660 902 665.5 907.5Q671 913 679 913Q687 913 692.5 907.5Q698 902 698 894ZM604 16H422V71H604Z"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M925 805H99Q58 805 29.0 783.0Q0 761 0 729Q0 698 29.0 676.0Q58 654 99 654H925Q966 654 995.0 676.0Q1024 698 1024 729Q1024 761 995.0 783.0Q966 805 925 805ZM925 527H99Q58 527 29.0 505.0Q0 483 0 451Q0 420 29.0 397.5Q58 375 99 375H925Q966 375 995.0 397.5Q1024 420 1024 451Q1024 483 995.0 505.0Q966 527 925 527ZM925 249H99Q58 249 29.0 226.5Q0 204 0 173Q0 142 29.0 119.5Q58 97 99 97H925Q966 97 995.0 119.5Q1024 142 1024 173Q1024 204 995.0 226.5Q966 249 925 249Z"/></svg>',
};

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget) && !isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, nav.querySelector('.nav-sections'), false);
  }
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
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

// #98: the pipeline wraps a li's trigger content in a <p> on live — normalize
function unwrapLi(li) {
  const p = li.querySelector(':scope > p');
  if (p) {
    while (p.firstChild) li.insertBefore(p.firstChild, p);
    p.remove();
  }
}

function buildVerb(li) {
  unwrapLi(li);
  const item = document.createElement('li');
  item.className = 'nav-verb';
  const trigger = li.querySelector(':scope > a, :scope > p > a');
  const codeEl = li.querySelector('code');
  const subEl = li.querySelector(':scope > em');
  const dropdown = li.querySelector(':scope > ul');

  const a = document.createElement('a');
  a.className = 'nav-verb-link';
  if (trigger) {
    a.href = trigger.getAttribute('href');
    const icon = document.createElement('span');
    icon.className = 'nav-verb-icon';
    icon.setAttribute('aria-hidden', 'true');
    const key = codeEl ? codeEl.textContent.trim().toLowerCase() : '';
    if (ICONS[key]) icon.innerHTML = ICONS[key];
    a.append(icon, document.createTextNode(trigger.textContent.trim()));
    if (subEl) {
      const sub = document.createElement('span');
      sub.className = 'nav-verb-sub';
      sub.textContent = subEl.textContent.trim();
      a.append(sub);
    }
  }
  item.append(a);

  if (dropdown) {
    dropdown.className = 'nav-verb-dropdown';
    dropdown.querySelectorAll('li').forEach(unwrapLi);
    item.append(dropdown);
    item.classList.add('nav-drop');
  }
  return item;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools', 'utility', 'departments'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // ── utility strip (yellow): first 2 links inline, rest fold into "More"
  const utility = nav.querySelector('.nav-utility');
  if (utility) {
    const links = [...utility.querySelectorAll('a')];
    const list = document.createElement('ul');
    list.className = 'nav-utility-list';
    links.slice(0, 2).forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      list.append(li);
    });
    if (links.length > 2) {
      const moreLi = document.createElement('li');
      moreLi.className = 'nav-utility-more';
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'nav-utility-more-trigger';
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = 'More';
      const menu = document.createElement('ul');
      menu.className = 'nav-utility-more-menu';
      menu.setAttribute('role', 'menu');
      links.slice(2).forEach((a) => {
        const li = document.createElement('li');
        a.setAttribute('role', 'menuitem');
        li.append(a);
        menu.append(li);
      });
      const setExpanded = (open) => trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      moreLi.addEventListener('mouseenter', () => setExpanded(true));
      moreLi.addEventListener('mouseleave', () => setExpanded(false));
      moreLi.addEventListener('focusin', () => setExpanded(true));
      moreLi.addEventListener('focusout', (e) => {
        if (!moreLi.contains(e.relatedTarget)) setExpanded(false);
      });
      moreLi.append(trigger, menu);
      list.append(moreLi);
    }
    utility.replaceChildren(list);
  }

  // ── brand: unwrap any buttonized logo link, keep <picture>
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = 'nav-brand-link';
      const wrapper = brandLink.closest('.button-wrapper, .button-container');
      if (wrapper) wrapper.className = '';
    }
  }

  // ── primary verbs
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const sourceList = navSections.querySelector('ul');
    if (sourceList) {
      const verbs = document.createElement('ul');
      verbs.className = 'nav-verbs';
      [...sourceList.children].forEach((li) => verbs.append(buildVerb(li)));
      navSections.replaceChildren(verbs);
    }
  }

  // ── tools: phone CTA
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const phone = navTools.querySelector('a');
    if (phone) {
      phone.className = 'nav-phone';
      const icon = document.createElement('span');
      icon.className = 'nav-phone-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = ICONS.phone;
      phone.prepend(icon);
      navTools.replaceChildren(phone);
    }
  }

  // ── departments row
  const departments = nav.querySelector('.nav-departments');
  if (departments) {
    const links = [...departments.querySelectorAll('a')];
    const row = document.createElement('div');
    row.className = 'nav-departments-row';
    links.forEach((a) => row.append(a));
    departments.replaceChildren(row);
  }

  // ── main row assembly: brand + hamburger + sections + tools
  const main = document.createElement('div');
  main.className = 'nav-main';
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const burgerBtn = document.createElement('button');
  burgerBtn.type = 'button';
  burgerBtn.setAttribute('aria-controls', 'nav');
  burgerBtn.setAttribute('aria-label', 'Open navigation');
  burgerBtn.setAttribute('aria-expanded', 'false');
  burgerBtn.innerHTML = ICONS.menu;
  hamburger.append(burgerBtn);
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  if (navBrand) main.append(navBrand);
  if (navSections) main.append(navSections);
  if (navTools) main.append(navTools);
  main.append(hamburger);

  const ordered = document.createDocumentFragment();
  if (utility) ordered.append(utility);
  ordered.append(main);
  if (departments) ordered.append(departments);
  nav.replaceChildren(ordered);

  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
