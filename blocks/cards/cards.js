/**
 * cards — feature-card grid (dashboard-proof [variant "proof"], growth-drivers,
 * data-decisions). Schema: stardust/eds-schema/index.json § dashboard-proof /
 * growth-drivers / data-decisions. Decode tier: reconstructive.
 *
 * Authoring (collection `cards` shape — one ROW per card, ≤4 cells):
 *   cell 1: icon image (small svg, empty alt)
 *   cell 2: <h3> card title (optionally linked — growth-drivers card 1 is linked,
 *           cards 2–3 are not; both survive, #90 fingerprint) + body <p>
 *   cell 3: product screenshot image (descriptive alt)
 * The section eyebrow/heading/lede is DEFAULT CONTENT before the block (D1),
 * styled in place via .cards-container .default-content-wrapper.
 * Flattened single-cell decode fallback: segment on h3 boundaries (#52),
 * leading picture attaches to the open card.
 */

function classify(el, sel) {
  return el.matches(sel) || el.querySelector(sel); /* #53 */
}

function buildCard(nodes, proof) {
  const card = document.createElement('article');
  card.className = 'ds-card feature-card';
  const media = nodes.filter((n) => classify(n, 'picture, img') && !n.querySelector('h1, h2, h3, h4'));
  const heading = nodes.find((n) => classify(n, 'h3, h4, h2'));
  const texts = nodes.filter((n) => n.matches('p') && !classify(n, 'picture, img') && n.textContent.trim());

  const pick = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
  let iconEl = null;
  let shotEl = null;
  if (media.length > 1) {
    iconEl = pick(media[0]);
    shotEl = pick(media[media.length - 1]);
  } else if (media.length === 1) {
    /* single image: before the heading = icon, after = screenshot */
    const afterHeading = heading && nodes.indexOf(media[0]) > nodes.indexOf(heading);
    if (afterHeading) shotEl = pick(media[0]);
    else iconEl = pick(media[0]);
  }

  if (iconEl) {
    const img = iconEl.matches('img') ? iconEl : iconEl.querySelector('img');
    if (img) img.classList.add('card-icon');
    (img?.closest('picture') || img || iconEl).classList.add('card-icon-slot');
  }

  let h3;
  if (heading) {
    h3 = document.createElement('h3');
    const inner = heading.matches('h2, h3, h4') ? heading : heading.querySelector('h2, h3, h4');
    h3.append(...(inner || heading).childNodes); /* keeps linked titles linked (#55 unwrap) */
  }

  if (proof && iconEl) {
    const head = document.createElement('div');
    head.className = 'card-head';
    head.append(iconEl.closest('picture') || iconEl);
    if (h3) head.append(h3);
    card.append(head);
  } else {
    if (iconEl) card.append(iconEl.closest('picture') || iconEl);
    if (h3) card.append(h3);
  }

  texts.forEach((p) => card.append(p));

  if (shotEl) {
    const img = shotEl.matches('img') ? shotEl : shotEl.querySelector('img');
    if (img) img.classList.add('card-shot');
    card.append(shotEl.closest('picture') || shotEl);
  }
  return card;
}

export default function decorate(block) {
  const proof = block.classList.contains('proof');
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  const cardRows = rows.filter((row) => row.querySelector('h2, h3, h4'));
  if (cardRows.length >= 2) {
    /* one card per row (#63 tier 0), fields in authored order */
    cardRows.forEach((row) => {
      const nodes = [...row.children].flatMap((cell) => {
        const kids = [...cell.children];
        if (kids.length) return kids;
        if (cell.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = cell.textContent.trim();
          return [p];
        }
        return [];
      });
      grid.append(buildCard(nodes, proof));
    });
  } else {
    /* flattened single-cell shape: segment on card-heading boundary (#52) */
    const nodes = rows.flatMap((row) => [...row.children]).flatMap((cell) => [...cell.children]);
    const groups = [];
    let current = [];
    nodes.forEach((n) => {
      if (classify(n, 'h3, h4') && current.some((m) => classify(m, 'h3, h4'))) {
        groups.push(current);
        current = [];
      }
      current.push(n);
    });
    if (current.length) groups.push(current);
    groups.forEach((g) => grid.append(buildCard(g, proof)));
  }

  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);
  block.replaceChildren(container);
}
