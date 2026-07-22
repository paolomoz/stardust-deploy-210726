/**
 * cards — Block Collection cards pattern (D11), one row per card.
 * Variants: `finance` (dark offer cards) / `blog` (image-overlay anchor cards).
 * Schema: stardust/eds-schema/home.json → sections "finance" and "blog-cards".
 *
 * Authoring (one row per card; cells classified by CONTENT, never index — #48):
 *   - optional image cell: <picture>/<img> (blog card background)
 *   - body cell, flat siblings in authored order:
 *       <p><strong>kicker</strong></p>  → card eyebrow (leading preserved tag)
 *       <h3>title</h3> (<em> = accent)  → card title
 *       <p>prose</p>                    → card body
 *       <p><strong><a>CTA</a></strong>  → a.button.primary chip (finance)
 *       <p><a>Read more</a></p>         → plain trailing link = whole-card anchor (blog)
 * Handles both one-row-per-card and the DA-flattened single-cell shape (#52):
 * segments the flat sibling list on the most frequent heading tag.
 * (No module-scope imports: the block must run in the roundtrip harness, #94.
 * The delivery pipeline already emits responsive <picture> for authored imgs.)
 */

function buildCard(nodes) {
  const li = document.createElement('li');
  li.className = 'cards-card';

  const mediaEl = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const rest = nodes.filter((n) => n !== mediaEl);

  if (mediaEl) {
    const media = document.createElement('div');
    media.className = 'cards-card-image';
    media.append(mediaEl.matches('picture, img') ? mediaEl : mediaEl.querySelector('picture, img'));
    li.append(media);
  }

  const body = document.createElement('div');
  body.className = 'cards-card-body';
  // a CTA is a.button (decorateButtons ran) OR an emphasis-wrapped <a>
  // (un-decorated shape — harness/fallback per the runtime contract)
  const isButtonLink = (p) => p.querySelector('a.button, strong a, em a');
  rest.forEach((n) => {
    if (n.matches('h1, h2, h3, h4, h5, h6')) {
      n.classList.add('cards-card-title');
    } else if (n.querySelector('a') && isButtonLink(n)) {
      n.classList.add('cards-card-cta');
    } else if (n.matches('p') && n.children.length === 1 && n.firstElementChild.matches('strong')
      && !n.querySelector('a') && n.textContent.trim() === n.firstElementChild.textContent.trim()) {
      n.classList.add('cards-card-eyebrow');
    } else if (n.matches('p') && n.querySelector('a') && !isButtonLink(n)
      && n.textContent.trim() === n.querySelector('a').textContent.trim()) {
      n.classList.add('cards-card-more');
    }
    body.append(n);
  });
  li.append(body);

  // a card whose only link is a plain (non-button) trailing link is a
  // whole-card anchor (blog pattern); button CTAs stay chips (finance pattern).
  // The anchor wraps the BODY only — the editorial <img> stays outside the
  // link so the CTA remains a text link, not an image link.
  const links = [...li.querySelectorAll('a')];
  const more = li.querySelector('.cards-card-more a');
  if (more && links.length === 1) {
    const a = document.createElement('a');
    a.href = more.getAttribute('href');
    a.className = 'cards-card-link';
    if (more.title) a.title = more.title;
    const moreSpan = document.createElement('span');
    moreSpan.className = 'cards-card-more';
    moreSpan.textContent = more.textContent;
    more.closest('p').remove();
    body.append(' ', moreSpan);
    body.replaceWith(a);
    a.append(body);
  }
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');
  ul.className = 'cards-grid';

  const cardRows = rows.filter((row) => row.querySelector('h1, h2, h3, h4, h5, h6, picture, img, p'));
  const multiHeading = (el) => el.querySelectorAll('h2, h3, h4').length > 1;

  if (cardRows.length === 1 && multiHeading(cardRows[0])) {
    // DA-flattened: one row/cell, N cards as flat siblings — segment on the
    // most frequent heading tag (#52)
    const cells = [...cardRows[0].querySelectorAll(':scope > div')];
    const nodes = cells.flatMap((c) => (c.children.length ? [...c.children] : []));
    const counts = {};
    nodes.filter((n) => n.matches('h2, h3, h4')).forEach((h) => {
      counts[h.tagName] = (counts[h.tagName] || 0) + 1;
    });
    const boundary = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    let group = [];
    const flush = () => { if (group.length) ul.append(buildCard(group)); group = []; };
    nodes.forEach((n) => {
      if (boundary && n.tagName === boundary && group.some((g) => g.tagName === boundary)) flush();
      group.push(n);
    });
    flush();
  } else {
    cardRows.forEach((row) => {
      const nodes = [...row.querySelectorAll(':scope > div')].flatMap((cell) => {
        if (cell.children.length) return [...cell.children];
        if (cell.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          return [p];
        }
        return [];
      });
      if (nodes.length) ul.append(buildCard(nodes));
    });
  }

  block.replaceChildren(ul);
}
