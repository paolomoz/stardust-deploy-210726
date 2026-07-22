/**
 * categories — Top-Kategorien tile grid (icon + title link + primary CTA).
 * Reconstructive. Schema: stardust/eds-schema/index.json → top-kategorien
 * The section head (h2 + text-link + lede) is DEFAULT CONTENT above this block
 * (styled via .categories-container .default-content-wrapper).
 *
 * Authoring: one row per tile, 2 cells:
 *   cell 1: category icon <img>
 *   cell 2: <h3><a>Title</a></h3> + primary CTA <p><strong><a>Zu den Produkten</a></strong></p>
 */

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'ds-cat-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => c.querySelector('picture, img'));
    const bodyCell = cells.find((c) => c !== iconCell && c.textContent.trim());
    if (!bodyCell) return;

    const tile = document.createElement('article');
    tile.className = 'ds-card ds-cat-tile';

    const icon = document.createElement('div');
    icon.className = 'ds-cat-icon';
    const media = iconCell && (iconCell.querySelector('picture') || iconCell.querySelector('img'));
    if (media) icon.append(media);
    tile.append(icon);

    const body = document.createElement('div');
    body.className = 'ds-cat-body';
    [...bodyCell.childNodes].forEach((n) => body.append(n.cloneNode(true)));
    tile.append(body);

    grid.append(tile);
  });

  block.replaceChildren(grid);
}
