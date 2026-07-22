/**
 * cards — variant-driven card grid (reconstructive).
 * Schema: stardust/eds-schema/index.json → sections compassionate-care,
 * featured-classes, screenings.
 *
 * Variants (block class): quick-links | classes | screenings.
 * Section head (eyebrow/h2/intro) + any foot/lead CTA are authored as SECTION
 * DEFAULT CONTENT (D1), styled in place via .cards-container — not block rows.
 *
 * Each authored row is ONE card cell. Cells are classified by content (#48/#52):
 *   media  = <picture>/<img>          (optional)
 *   title  = <h3> (optional trailing <strong> → price sub-field, #39)
 *   body   = link-free <p>
 *   cta    = <a> (a.button when authored <em><a>; plain <a> = text link)
 * quick-links has no authored media — a decorative diamond icon is injected by
 * index (presentation, not authorable content).
 */

const QUICK_ICONS = [
  '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 8v6"/><path d="M9 11h6"/><path d="M10 21v-4h4v4"/>',
];

function iconEl(i) {
  const span = document.createElement('span');
  span.className = 'ds-quick-icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${QUICK_ICONS[i % QUICK_ICONS.length]}</svg>`;
  return span;
}

function collectCells(cell) {
  let kids = [...cell.children];
  // #104: media-led/mixed cells arrive folded into one <p> — expand it
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      if (n.textContent.trim()) { const p = document.createElement('p'); p.textContent = n.textContent.trim(); return p; }
      return null;
    }).filter(Boolean);
  }
  return kids;
}

export default async function decorate(block) {
  const variant = ['quick-links', 'classes', 'screenings'].find((v) => block.classList.contains(v)) || 'classes';
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'ds-grid';

  rows.forEach((row, i) => {
    const cell = row.firstElementChild || row;
    const nodes = collectCells(cell);
    const card = document.createElement('article');
    card.className = 'ds-card';

    const media = nodes.find((n) => n.matches?.('picture, img') || n.querySelector?.('picture, img'));
    const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
    const bodies = nodes.filter((n) => n.tagName === 'P' && !n.querySelector('a') && n !== media);
    const ctas = nodes.filter((n) => n.tagName === 'A' || n.querySelector?.('a'));

    if (variant === 'quick-links') {
      card.append(iconEl(i));
    } else if (media) {
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'ds-card-media';
      mediaWrap.append(media.matches?.('picture, img') ? media : media.querySelector('picture, img'));
      card.append(mediaWrap);
    } else if (variant === 'screenings') {
      card.classList.add('ds-card--mint'); // per-instance variant: no image → mint (#90)
    }

    const body = document.createElement('div');
    body.className = 'ds-card-body';
    if (heading) {
      const h = document.createElement('h3');
      const price = heading.querySelector('strong');
      if (price) { price.classList.add('ds-price'); }
      h.innerHTML = heading.innerHTML;
      body.append(h);
    }
    bodies.forEach((p) => body.append(p));
    ctas.forEach((n) => {
      const a = n.tagName === 'A' ? n : n.querySelector('a');
      if (!a) return;
      if (!a.classList.contains('button')) a.classList.add('ds-link');
      body.append(a);
    });
    card.append(body);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
