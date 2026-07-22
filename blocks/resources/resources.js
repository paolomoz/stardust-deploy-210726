/**
 * resources — 3 icon + title cards (housing-focused resources).
 * Schema: stardust/eds-schema/theroadhome.json § housing-resources (3× DIV.resource-col).
 * The section head (h2 + intro) and outro + PROGRAMS CTA are DEFAULT CONTENT in the
 * section (D1); this block holds only the 3 repeating cards.
 *
 * Authoring: one row per card, cells = [ icon <img> | <h3>TITLE</h3> ].
 */
export default async function decorate(block) {
  const cols = [...block.children].map((row) => {
    const icon = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const col = document.createElement('div');
    col.className = 'resource-col';
    if (icon) col.append(icon.closest('picture') || icon);
    if (heading) col.append(heading);
    return col;
  });

  const grid = document.createElement('div');
  grid.className = 'resources-grid';
  grid.append(...cols);
  block.replaceChildren(grid);
}
