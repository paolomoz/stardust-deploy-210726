/**
 * press — press-release list (reconstructive).
 * Schema: stardust/eds-schema/index.json → section "press-releases".
 *
 * Section head ("Press releases") + foot CTA are section DEFAULT CONTENT (D1).
 * Each authored row is ONE press card cell containing:
 *   <picture>/<img>   : thumbnail
 *   <p> (date)        : short date line (link-free, first text run)
 *   <h3>              : title
 *   <a> (plain)       : text link (NOT a button)
 */
function collectCells(cell) {
  let kids = [...cell.children];
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
  const rows = [...block.children];
  const list = document.createElement('div');
  list.className = 'ds-press-list';

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const nodes = collectCells(cell);
    const media = nodes.find((n) => n.matches?.('picture, img') || n.querySelector?.('picture, img'));
    const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
    const link = nodes.find((n) => n.tagName === 'A' || n.querySelector?.('a'));
    const date = nodes.find((n) => n.tagName === 'P' && !n.querySelector('a') && n !== media);

    const card = document.createElement('article');
    card.className = 'ds-press-card';
    if (media) card.append(media.matches?.('picture, img') ? media : media.querySelector('picture, img'));

    const copy = document.createElement('div');
    if (date) { date.classList.add('ds-press-date'); copy.append(date); }
    if (heading) { const h = document.createElement('h3'); h.innerHTML = heading.innerHTML; copy.append(h); }
    if (link) {
      const a = link.tagName === 'A' ? link : link.querySelector('a');
      a.classList.remove('button', 'primary', 'secondary');
      a.classList.add('ds-link');
      copy.append(a);
    }
    card.append(copy);
    list.append(card);
  });

  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';
  wrap.append(list);
  block.replaceChildren(wrap);
}
