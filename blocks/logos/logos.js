/**
 * logos — logo strip (payment-providers ×11, customer-logos ×8).
 * Schema: stardust/eds-schema/index.json § payment-providers / customer-logos.
 * Decode tier: reconstructive.
 *
 * Authoring: the section heading is DEFAULT CONTENT before the block (D1);
 * the block holds ONE ROW PER LOGO — the cell is either a linked image
 * (<a><img></a>) or a bare image. Flattened single-cell shape (#52) is
 * segmented per anchor/picture.
 */

function logoUnits(block) {
  const rows = [...block.children];
  const cells = rows.flatMap((row) => [...row.children]);
  const units = [];
  cells.forEach((cell) => {
    const anchors = [...cell.querySelectorAll('a')].filter((a) => a.querySelector('picture, img'));
    if (anchors.length) {
      units.push(...anchors);
      return;
    }
    // images not wrapped in links — one unit per picture/img
    const pics = [...cell.querySelectorAll('picture, img')].map((el) => (el.closest('picture') || el));
    units.push(...new Set(pics));
  });
  return units;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'logo-strip';
  logoUnits(block).forEach((unit) => {
    const li = document.createElement('li');
    if (unit.matches('a')) {
      li.append(unit);
    } else {
      const span = document.createElement('span');
      span.className = 'logo-cell';
      span.append(unit);
      li.append(span);
    }
    ul.append(li);
  });

  const container = document.createElement('div');
  container.className = 'container';
  container.append(ul);
  block.replaceChildren(container);
}
