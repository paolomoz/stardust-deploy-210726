/**
 * cards — Block Collection card grid (D11) with FlexiLoans variants:
 *   .cards.eligibility — 2-up bordered icon cards with a per-card text link
 *   .cards.products    — 2-up shadow cards with a primary CTA button
 *   .cards.security    — 3-up borderless icon items on the ice band + section foot link
 * Reconstructive tier (#95). Schema: stardust/eds-schema/index.json
 * § eligibility-cards / products / security.
 *
 * Authoring: ONE ROW PER CARD; the card's parts as flat siblings in one cell:
 *   [<p>:icon-name:</p>] <h3>Title</h3> <p>body</p>
 *   [<p><a>text link →</a></p> | <p><strong><a>CTA</a></strong></p>]
 * A trailing row whose cell holds ONLY a link (no heading, no icon) is the
 * section foot link. Decode also tolerates the DA-flattened single-row shape
 * (#62): one cell holding every card's elements is segmented on the repeating
 * <h3> boundary, with a pre-heading icon buffered to the card it opens (#76).
 */

/* cell-level cascade collector (#62/#68/#71) — never drops bare-text cells */
/* unwrap the runtime's wrapTextNodes artifact: decorateBlock wraps a cell whose
   FIRST element is a bare <img>/<span>/... in ONE <p> holding the whole cell —
   detect a <p> with block-level element children and expand it (runtime contract) */
function expandWrapper(el, out) {
  const isWrapper = el.matches('p')
    && [...el.children].some((c) => c.matches('img, picture, h1, h2, h3, h4, h5, h6, p, ul, ol'));
  if (!isWrapper) {
    out.push(el);
    return;
  }
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) out.push(n);
    else if (n.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = n.textContent.trim();
      out.push(p);
    }
  });
}

function collectNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) kids.forEach((k) => expandWrapper(k, out));
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

/* icon decode — pipeline shape (span.icon, decorateIcons already filled the img)
   OR literal :name: text (harness / un-pipelined content) */
function decodeIcon(el) {
  const span = el.matches('span.icon') ? el : el.querySelector('span.icon');
  if (span) return span;
  const m = el.textContent.trim().match(/^:([a-z0-9-]+):$/);
  if (!m) return null;
  const s = document.createElement('span');
  s.className = `icon icon-${m[1]}`;
  const img = document.createElement('img');
  img.src = `/icons/${m[1]}.svg`;
  img.alt = '';
  img.loading = 'lazy';
  s.append(img);
  return s;
}

const isHeading = (el) => el.matches('h1, h2, h3, h4') || !!el.querySelector('h1, h2, h3, h4');
const isIconOnly = (el) => !isHeading(el) && !!decodeIcon(el);

/* re-create the prototype's span.arrow on a trailing → (idempotent, #39/#70) */
function arrowize(a) {
  if (a.querySelector('.arrow')) return;
  if (!/→\s*$/.test(a.textContent)) return;
  const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
  let last = null;
  while (walker.nextNode()) last = walker.currentNode;
  if (!last) return;
  last.textContent = last.textContent.replace(/\s*→\s*$/, '');
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = '→';
  a.append(' ', arrow);
}

function buildCard(nodes) {
  const card = document.createElement('article');
  card.className = 'card';
  const content = document.createElement('div');
  content.className = 'card-content';
  nodes.forEach((el) => {
    if (isIconOnly(el)) {
      const chip = document.createElement('span');
      chip.className = 'icon-chip';
      chip.setAttribute('aria-hidden', 'true');
      chip.append(decodeIcon(el));
      card.append(chip);
      return;
    }
    const link = el.querySelector('a');
    if (link && !link.classList.contains('button') && el.textContent.trim() === link.textContent.trim()) {
      link.classList.add('text-link');
      arrowize(link);
      el.classList.add('card-link');
    }
    content.append(el);
  });
  card.append(content);
  return card;
}

/* segment a flat sibling list into one group per card heading, buffering
   pre-heading icons to the card they open (#52/#76) */
function segmentFlat(nodes) {
  const groups = [];
  let pending = [];
  let current = null;
  nodes.forEach((el) => {
    if (isHeading(el)) {
      if (current) groups.push(current);
      current = [...pending, el];
      pending = [];
    } else if (isIconOnly(el) && current) {
      groups.push(current);
      current = null;
      pending = [el];
    } else if (current) {
      current.push(el);
    } else {
      pending.push(el);
    }
  });
  if (current) groups.push(current);
  else if (pending.length) groups.push(pending);
  return groups;
}

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  let foot = null;
  const cardRows = [];

  [...block.children].forEach((row) => {
    const nodes = collectNodes(row);
    if (!nodes.length) return;
    const links = nodes.flatMap((el) => (el.matches('a') ? [el] : [...el.querySelectorAll('a')]));
    if (links.length && !nodes.some(isHeading) && !nodes.some(isIconOnly)) {
      // link-only row = section foot
      foot = document.createElement('p');
      foot.className = 'cards-foot';
      links.forEach((a) => {
        if (!a.classList.contains('button')) {
          a.classList.add('text-link');
          arrowize(a);
        }
        foot.append(a);
      });
      return;
    }
    cardRows.push(nodes);
  });

  if (cardRows.length === 1
    && cardRows[0].filter((el) => el.matches('h3, h4')).length > 1) {
    segmentFlat(cardRows[0]).forEach((g) => grid.append(buildCard(g)));
  } else {
    cardRows.forEach((nodes) => grid.append(buildCard(nodes)));
  }

  block.replaceChildren(grid);
  if (foot) block.append(foot);
}
