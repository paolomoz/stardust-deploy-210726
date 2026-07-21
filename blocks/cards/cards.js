/**
 * cards — repeating card grid (Block Collection model: one row per card).
 * Variant `beers` (prototype section `beer-six`): six substrate-ground beer
 * cards, whole-card anchors. Decode tier: reconstructive.
 * Schema: stardust/eds-schema/home.json → section "beer-six".
 *
 * Authoring shape (container model — one row per card, one cell, parts as
 * flat siblings):
 *   <p>No. 01</p>
 *   <p><em>vernacular line</em></p>
 *   <h3><a href="/beers/#tabernacle">Tabernacle</a></h3>
 *   <p>Imperial Stout · 6.5% ABV</p>
 *   <p>Year-round</p>
 * The section head (eyebrow / h2 / "See all six" link) is DEFAULT CONTENT in
 * the section before this block (D1) and is styled in place — never a row here.
 *
 * Per-instance variation (#90): each card's substrate ground is keyed by the
 * beer-name slug (`beer-<slug>` class); the six substrate rules + a neutral
 * default live in cards.css. The key is a design-system decision, not authored.
 */

function slugify(text) {
  return text.toLowerCase().trim().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** classify one card's sibling elements into named parts (#48 — by content) */
function parseCard(nodes) {
  const card = {
    num: null, vernacular: null, name: null, href: null, spec: null, badge: null,
  };
  let seenHeading = false;
  nodes.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    if (/^h[1-6]$/i.test(el.tagName)) {
      const a = el.querySelector('a[href]');
      card.name = text;
      if (a) card.href = a.getAttribute('href');
      seenHeading = true;
      return;
    }
    if (!card.num && /^No\.?\s*\d+/i.test(text)) { card.num = text; return; }
    if (!card.spec && /%\s*ABV/i.test(text)) { card.spec = text; return; }
    if (!card.vernacular && (el.matches('em') || el.querySelector('em') || !seenHeading)) {
      card.vernacular = text;
      return;
    }
    if (!card.badge) card.badge = text;
  });
  return card;
}

/** segment a flat sibling list into one group per repeating heading (#52) */
function segmentByHeading(nodes) {
  const headings = nodes.filter((n) => /^h[1-6]$/i.test(n.tagName));
  if (!headings.length) return [nodes];
  const tag = headings[0].tagName;
  const groups = [];
  let current = [];
  nodes.forEach((n) => {
    // a heading OPENS a new group only after the first group has a heading;
    // pre-heading text (num, vernacular) belongs to the group its heading opens,
    // so groups split AFTER the trailing badge/spec of the previous card: use
    // the num line (or the heading, when no num precedes) as the boundary.
    const isNum = /^No\.?\s*\d+/i.test(n.textContent.trim());
    const isHeading = n.tagName === tag;
    const currentHasHeading = current.some((c) => c.tagName === tag);
    if (current.length && ((isNum && currentHasHeading) || (isHeading && currentHasHeading))) {
      groups.push(current);
      current = [];
    }
    current.push(n);
  });
  if (current.length) groups.push(current);
  return groups;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'ds-beer-grid';
  grid.setAttribute('role', 'list');

  // one-row-per-card first (#63); flattened single-cell fallback (#52)
  let groups = [];
  const cardRows = rows.filter((r) => r.querySelector('h3, h4'));
  if (cardRows.length >= 2) {
    groups = cardRows.map((r) => [...r.querySelectorAll(':scope > div')]
      .flatMap((cell) => (cell.children.length ? [...cell.children] : [cell])));
  } else if (rows.length) {
    const cell = rows[0].firstElementChild || rows[0];
    groups = segmentByHeading([...cell.children]);
  }

  groups.forEach((nodes, i) => {
    const card = parseCard(nodes);
    if (!card.name) return;
    const slug = slugify(card.name);
    const a = document.createElement('a');
    a.className = `ds-beer beer-${slug}`;
    a.setAttribute('role', 'listitem');
    if (card.href) a.href = card.href;

    // whitespace text nodes between children keep the anchor's accessible
    // name / textContent word-separated (as in the prototype markup)
    const num = document.createElement('span');
    num.className = 'ds-beer-num';
    num.textContent = card.num || `No. ${String(i + 1).padStart(2, '0')}`;
    a.append(num, '\n');

    if (card.vernacular) {
      const v = document.createElement('p');
      v.className = 'ds-beer-vernacular';
      v.textContent = card.vernacular;
      a.append(v, '\n');
    }

    const h3 = document.createElement('h3');
    h3.className = 'ds-beer-name';
    h3.textContent = card.name;
    a.append(h3, '\n');

    if (card.spec) {
      const row = document.createElement('div');
      row.className = 'ds-beer-row';
      card.spec.split('·').forEach((part) => {
        const span = document.createElement('span');
        span.textContent = part.trim();
        row.append(span);
      });
      a.append(row, '\n');
    }

    if (card.badge) {
      const badge = document.createElement('span');
      badge.className = 'ds-badge';
      badge.textContent = card.badge;
      a.append(badge);
    }

    grid.append(a);
  });

  block.replaceChildren(grid);
}
