/**
 * products — catalogue ledger: sticky rail head + one ruled row per category
 * with always-visible duotone thumbnail (index-B prototype, Operate anchor).
 * Schema: stardust/eds-schema/index.json § products-ledger. Reconstructive (#95).
 *
 * Authoring: section head (h2 + portfolio lede) is DEFAULT CONTENT before the
 * block and is REABSORBED into the rail (it is a grid cell of the same grid as
 * the ledger). Block rows: one per category — a single cell holding
 * <img> thumbnail, <h3><a href> category link, and the description <p>.
 * Defensive fallback: leading rows carrying an <h2> are treated as the head.
 */

// wrapTextNodes (aem.js) folds a media-led cell (img/picture + siblings) into ONE
// wrapper <p> — expand it back to its element children before classifying.
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].matches('p')
      && kids[0].children.length > 1
      && kids[0].querySelector('h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) {
    kids = [...kids[0].children];
  }
  return kids;
}

function segmentUnits(block) {
  const rows = [...block.children];
  const units = [];
  const headNodes = [];
  const rowHasUnitHeading = (row) => row.querySelector('h3, h4');
  const multiRow = rows.filter(rowHasUnitHeading).length >= 2;
  if (multiRow) {
    rows.forEach((row) => {
      const nodes = [...row.querySelectorAll(':scope > div')].flatMap((c) => cellNodes(c));
      if (rowHasUnitHeading(row)) units.push(nodes);
      else headNodes.push(...nodes); // defensive in-table head fallback
    });
    return { units, headNodes };
  }
  // flattened single-cell shape (#52): segment flat siblings on the unit heading
  const flat = rows.flatMap((row) => [...row.querySelectorAll(':scope > div')].flatMap((c) => cellNodes(c)));
  let current = null;
  flat.forEach((el) => {
    if (el.matches('h3, h4')) {
      current = [];
      units.push(current);
    }
    if (current) current.push(el);
    else headNodes.push(el);
  });
  // a leading picture belongs to the first unit, not the head
  if (units.length && headNodes.length) {
    const media = headNodes.filter((n) => n.matches('picture, img') || n.querySelector('picture, img'));
    if (media.length === 1) units[0].unshift(...media);
  }
  return { units, headNodes };
}

export default async function decorate(block) {
  const { units, headNodes } = segmentUnits(block);

  // rail: reabsorb the section head authored as default content (#D1 section head)
  const rail = document.createElement('div');
  rail.className = 'products-rail';
  const wrapper = block.parentElement && block.parentElement.previousElementSibling;
  if (wrapper && wrapper.matches('.default-content-wrapper')) {
    rail.append(...wrapper.childNodes);
    wrapper.remove();
  } else if (headNodes.length) {
    rail.append(...headNodes);
  }

  const ledger = document.createElement('ul');
  ledger.className = 'ledger';
  units.forEach((unitNodes) => {
    const li = document.createElement('li');
    const heading = unitNodes.find((n) => n.matches('h3, h4'));
    const headingLink = heading && heading.querySelector('a');
    const media = unitNodes
      .map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img')))
      .find(Boolean);
    const desc = unitNodes.find((n) => n !== heading && !n.contains(media) && n.textContent.trim() && !n.querySelector('a'));

    const row = document.createElement('a');
    row.className = 'ledger-row';
    if (headingLink) row.href = headingLink.getAttribute('href');

    const thumb = document.createElement('span');
    thumb.className = 'thumb';
    if (media) thumb.append(media);
    row.append(thumb);

    const body = document.createElement('span');
    body.className = 'ledger-body';
    if (heading) {
      // whole-row anchor: the heading keeps its text, drops its inner link
      const h = document.createElement('h3');
      const inner = headingLink || heading;
      h.append(...inner.childNodes);
      body.append(h);
    }
    if (desc) {
      desc.classList.add('ledger-desc');
      body.append(desc);
    }
    row.append(body);

    const arr = document.createElement('span');
    arr.className = 'ledger-arr';
    arr.setAttribute('aria-hidden', 'true');
    arr.textContent = '→';
    row.append(arr);

    li.append(row);
    ledger.append(li);
  });

  const grid = document.createElement('div');
  grid.className = 'products-grid';
  grid.append(rail, ledger);
  block.replaceChildren(grid);
}
