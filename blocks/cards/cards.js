/**
 * cards — Block Collection cards. One row per card: image cell + body cell.
 * Variants (skin only, D9): `talks` (2-up editorial cards on a white band,
 * prototype section.talks), `webinars` (circular whole-tile anchors, prototype
 * section.webinars), default (auto-fit grid — prototype "happenings" and
 * "articles" sections).
 * Schema: stardust/eds-schema/index.json → sections "recent-talks",
 * "webinars", "happenings", "articles".
 *
 * Body cell fields (classified by content, never by index — #48):
 *   - kicker/date: <p><strong>…</strong></p> (leading preserved tag) → .label
 *   - title: <h3> (a whole-tile link may ride the title: <h3><a>…</a></h3>)
 *   - excerpt: plain <p>
 *   - card link: <p><a>…</a></p> (plain anchor — a text link, NOT a button)
 * Decode tolerates the DA-flattened single-cell shape by segmenting on the
 * most frequent heading tag (#52), media buffered to its OWN card (#73).
 */

function classifyBody(nodes, card) {
  nodes.forEach((n) => {
    if (n.matches('h1, h2, h3, h4, h5, h6')) {
      card.title = n;
      return;
    }
    const strongOnly = n.matches('p') && n.children.length === 1
      && n.firstElementChild.matches('strong') && !n.querySelector('a');
    if (strongOnly) {
      card.label = n;
      return;
    }
    const a = n.querySelector?.('a');
    if (n.matches('p') && a && n.textContent.trim() === a.textContent.trim()) {
      card.link = a;
      return;
    }
    if (n.textContent.trim()) card.excerpts.push(n);
  });
}

function collectCards(block) {
  const rows = [...block.children];
  const mediaOf = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

  // shape A: one row per card
  if (rows.length >= 2 || (rows.length === 1 && rows[0].children.length > 1)) {
    return rows.map((row) => {
      const card = {
        media: null, label: null, title: null, link: null, excerpts: [],
      };
      const cells = [...row.children];
      const mediaCell = cells.find((c) => mediaOf(c) && c.textContent.trim() === '');
      card.media = mediaCell ? mediaOf(mediaCell) : null;
      const bodyCells = cells.filter((c) => c !== mediaCell);
      bodyCells.forEach((c) => classifyBody([...c.children].length ? [...c.children] : [c], card));
      if (!card.media) {
        const stray = cells.map(mediaOf).find(Boolean);
        if (stray) card.media = stray;
      }
      return card;
    });
  }

  // shape B: DA-flattened single cell — segment on the most frequent heading tag (#52)
  const cell = rows[0]?.firstElementChild || rows[0];
  if (!cell) return [];
  const kids = [...cell.children];
  const counts = {};
  kids.filter((k) => k.matches('h1, h2, h3, h4, h5, h6'))
    .forEach((k) => { counts[k.tagName] = (counts[k.tagName] || 0) + 1; });
  const boundary = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const cards = [];
  let cur = null;
  let pendingMedia = null;
  kids.forEach((k) => {
    const isMedia = k.matches('picture, img') || (!k.textContent.trim() && k.querySelector('picture, img'));
    if (boundary && k.tagName === boundary) {
      cur = {
        media: pendingMedia, label: null, title: null, link: null, excerpts: [],
      };
      pendingMedia = null;
      classifyBody([k], cur);
      cards.push(cur);
    } else if (isMedia) {
      const m = k.matches('picture, img') ? k : k.querySelector('picture, img');
      if (cur && !cur.media && !cur.link) cur.media = m;
      else pendingMedia = m;
    } else if (cur) {
      classifyBody([k], cur);
    }
  });
  return cards;
}

function renderTile(card) {
  // webinars variant: the whole tile is the click target (not a button)
  const li = document.createElement('li');
  const linkEl = card.title?.querySelector('a') || card.link;
  const tile = document.createElement('a');
  tile.className = 'tile';
  if (linkEl) tile.href = linkEl.getAttribute('href');
  if (card.media) tile.append(card.media);
  if (card.label) {
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = card.label.textContent.trim();
    tile.append(label);
  }
  if (card.title) {
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = card.title.textContent.trim();
    tile.append(title);
  }
  li.append(tile);
  return li;
}

function renderCard(card) {
  const li = document.createElement('li');
  li.className = 'card';
  if (card.media) {
    const media = document.createElement('div');
    media.className = 'card-media';
    media.append(card.media);
    li.append(media);
  }
  const body = document.createElement('div');
  body.className = 'card-body';
  if (card.label) {
    card.label.classList.add('label');
    body.append(card.label);
  }
  if (card.title) body.append(card.title);
  card.excerpts.forEach((p) => body.append(p));
  if (card.link) {
    card.link.classList.add('card-link');
    body.append(card.link);
  }
  li.append(body);
  return li;
}

export default function decorate(block) {
  const cards = collectCards(block)
    .filter((c) => c.media || c.title || c.excerpts.length || c.link);
  const ul = document.createElement('ul');
  const isTileVariant = block.classList.contains('webinars');
  cards.forEach((card) => ul.append(isTileVariant ? renderTile(card) : renderCard(card)));
  block.replaceChildren(ul);
}
