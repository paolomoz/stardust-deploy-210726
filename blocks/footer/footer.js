/**
 * footer — FlexiLoans mega footer on the plum anchor: four link columns,
 * meta band (contact + social / addresses / badges), and the legal strip on
 * the deep plum. Template-slotted (anti-pattern 5): consumes the authored
 * footer document's fixed section contract from /flexiloans/footer (per-page
 * `footer` metadata override — subfolder site):
 *   1. link columns — repeating [<p><strong>Title</strong></p> <ul>links</ul>]
 *   2. contact — <p><strong>Contact us</strong></p>, contact lines, social
 *      links paragraph (plain <a> per network; JS renders /icons/<net>.svg)
 *   3. addresses — <p><strong>Label</strong></p> + address paragraphs (×2)
 *   4. badges — authored content.da.live images (UFF badge, Google Play link)
 *   5. legal — paragraphs rendered on the deep-plum strip
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_HOSTS = [
  ['linkedin', 'linkedin.com'],
  ['twitter', 'twitter.com'],
  ['twitter', 'x.com'],
  ['facebook', 'facebook.com'],
  ['instagram', 'instagram.com'],
];

function socialIconName(href) {
  try {
    const { hostname } = new URL(href);
    const hit = SOCIAL_HOSTS.find(([, host]) => hostname === host || hostname.endsWith(`.${host}`));
    return hit ? hit[0] : null;
  } catch {
    return null;
  }
}

/* split a section's default content into columns on <strong>-titled paragraphs */
function buildColumns(section, columnClass, titleClass) {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  const cols = [];
  let current = null;
  [...wrapper.children].forEach((el) => {
    const isTitle = el.matches('p') && el.querySelector('strong')
      && el.textContent.trim() === (el.querySelector('strong').textContent || '').trim();
    if (isTitle || !current) {
      if (!isTitle && !current) {
        current = document.createElement('div');
        current.className = columnClass;
        cols.push(current);
      } else if (isTitle) {
        current = document.createElement('div');
        current.className = columnClass;
        cols.push(current);
        el.className = titleClass;
      }
    }
    current.append(el);
  });
  return cols;
}

export default async function decorate(block) {
  // load footer as fragment (per-page override → /flexiloans/footer on this site)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = [...fragment.children].filter((s) => s.textContent.trim() || s.querySelector('img'));
  const [colsSection, contactSection, addressSection, badgesSection, legalSection] = sections;

  const container = document.createElement('div');
  container.className = 'footer-inner';

  // 1. link columns
  if (colsSection) {
    const main = document.createElement('div');
    main.className = 'footer-main';
    buildColumns(colsSection, 'footer-col', 'col-title').forEach((col) => {
      const nav = document.createElement('nav');
      nav.className = 'footer-col';
      const title = col.querySelector('.col-title');
      if (title) nav.setAttribute('aria-label', title.textContent.trim());
      nav.append(...col.childNodes);
      main.append(nav);
    });
    container.append(main);
  }

  // 2–4. meta band
  const meta = document.createElement('div');
  meta.className = 'footer-meta';

  if (contactSection) {
    const cell = document.createElement('div');
    const wrapper = contactSection.querySelector('.default-content-wrapper') || contactSection;
    [...wrapper.children].forEach((el) => {
      const links = [...el.querySelectorAll('a')];
      const socials = links.filter((a) => socialIconName(a.href));
      if (links.length > 1 && socials.length === links.length) {
        const social = document.createElement('div');
        social.className = 'footer-social';
        socials.forEach((a) => {
          const name = socialIconName(a.href);
          const label = a.textContent.trim();
          a.textContent = '';
          a.setAttribute('aria-label', `FlexiLoans on ${label}`);
          const img = document.createElement('img');
          img.src = `/icons/${name}.svg`;
          img.alt = '';
          img.loading = 'lazy';
          img.width = 28;
          img.height = 28;
          a.append(img);
          social.append(a);
        });
        cell.append(social);
        return;
      }
      const strong = el.querySelector('strong');
      if (strong && el.textContent.trim() === strong.textContent.trim()) el.className = 'meta-title';
      cell.append(el);
    });
    meta.append(cell);
  }

  if (addressSection) {
    const cell = document.createElement('div');
    const wrapper = addressSection.querySelector('.default-content-wrapper') || addressSection;
    [...wrapper.children].forEach((el) => {
      const strong = el.querySelector('strong');
      if (strong && el.textContent.trim() === strong.textContent.trim()) el.className = 'meta-title';
      cell.append(el);
    });
    meta.append(cell);
  }

  if (badgesSection) {
    const cell = document.createElement('div');
    cell.className = 'footer-badges';
    const wrapper = badgesSection.querySelector('.default-content-wrapper') || badgesSection;
    [...wrapper.children].forEach((el) => cell.append(el));
    meta.append(cell);
  }

  if (meta.children.length) container.append(meta);
  block.append(container);

  // 5. legal strip (full-bleed on the deep plum)
  if (legalSection) {
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    const wrapper = legalSection.querySelector('.default-content-wrapper') || legalSection;
    [...wrapper.children].forEach((el) => legal.append(el));
    block.append(legal);
  }
}
