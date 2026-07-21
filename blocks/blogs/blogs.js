/**
 * blogs — editorial index: hairline-ruled ledger rows (kicker / title / go
 * arrow), each row a whole-row anchor, plus a "View all" foot text link.
 * Reconstructive tier (#95). Schema: stardust/eds-schema/index.json § blogs.
 * Section head is DEFAULT CONTENT before the block (D1).
 *
 * Authoring: ONE ROW PER POST; parts as flat siblings in one cell:
 *   <p>Kicker</p>
 *   <h3><a href="/flexiloans/blog/…">Post title</a></h3>   (whole-card anchor — plain <a>, D6)
 * A trailing row whose cell holds ONLY a link is the foot ("View all →").
 */

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

export default function decorate(block) {
  const index = document.createElement('div');
  index.className = 'blog-index';
  let foot = null;

  [...block.children].forEach((row) => {
    const nodes = collectNodes(row);
    if (!nodes.length) return;
    const title = nodes.find((el) => el.matches('h3, h4'));

    if (!title) {
      const link = nodes.map((el) => (el.matches('a') ? el : el.querySelector('a'))).find(Boolean);
      if (link) {
        foot = document.createElement('p');
        foot.className = 'blog-foot';
        link.classList.add('text-link');
        arrowize(link);
        foot.append(link);
      }
      return;
    }

    const innerLink = title.querySelector('a');
    const href = innerLink ? innerLink.href
      : (nodes.map((el) => (el.matches('a') ? el : el.querySelector('a'))).find(Boolean) || {}).href;

    const rowLink = document.createElement('a');
    rowLink.className = 'blog-row';
    if (href) rowLink.href = href;

    const kickerP = nodes.find((el) => el.matches('p') && el !== title && el.textContent.trim() && !el.querySelector('a'));
    if (kickerP) {
      kickerP.className = 'kicker';
      rowLink.append(kickerP, ' ');
    }

    const h = document.createElement('h3');
    h.append(...(innerLink || title).childNodes);
    rowLink.append(h, ' ');

    const go = document.createElement('span');
    go.className = 'go';
    go.setAttribute('aria-hidden', 'true');
    go.textContent = '→';
    rowLink.append(go);

    index.append(rowLink);
  });

  block.replaceChildren(index);
  if (foot) block.append(foot);
}
