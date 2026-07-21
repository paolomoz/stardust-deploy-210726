/**
 * achievements — trophy shelf: all awards on one continuous hairline shelf,
 * ruled into plaque cells (year / title / category under each award image).
 * Reconstructive tier (#95). Schema: stardust/eds-schema/index.json
 * § achievements. Section head is DEFAULT CONTENT before the block (D1).
 *
 * Authoring: ONE ROW PER AWARD; parts as flat siblings in one cell:
 *   <picture>/<img> (award badge — authored content.da.live URL, alt required)
 *   <p>2019</p>            (year — leading digits classify it, #48)
 *   <h3>Award title</h3>
 *   <p>Category line</p>
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

export default function decorate(block) {
  const shelf = document.createElement('div');
  shelf.className = 'awards-shelf';
  shelf.setAttribute('role', 'list');

  [...block.children].forEach((row) => {
    const nodes = collectNodes(row);
    if (!nodes.length) return;

    const media = nodes
      .map((el) => (el.matches('picture, img') ? el : el.querySelector('picture, img')))
      .find(Boolean);
    const title = nodes.find((el) => el.matches('h3, h4'));
    const paragraphs = nodes.filter((el) => el.matches('p') && !el.querySelector('picture, img') && el.textContent.trim());
    const year = paragraphs.find((el) => /^\d{4}/.test(el.textContent.trim()));
    const category = paragraphs.find((el) => el !== year);

    const award = document.createElement('div');
    award.className = 'award';
    award.setAttribute('role', 'listitem');

    const stand = document.createElement('div');
    stand.className = 'award-stand';
    if (media) stand.append(media.closest('picture') || media);
    award.append(stand);

    const plaque = document.createElement('div');
    plaque.className = 'award-plaque';
    if (year) {
      year.className = 'year';
      plaque.append(year);
    }
    if (title) {
      const t = document.createElement('p');
      t.className = 'title';
      t.append(...title.childNodes);
      plaque.append(t);
    }
    if (category) {
      category.className = 'category';
      plaque.append(category);
    }
    award.append(plaque);

    shelf.append(award);
  });

  block.replaceChildren(shelf);
}
