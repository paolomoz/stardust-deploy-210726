/**
 * community — "Mehr Informationen" link-card grid (binder-blue band).
 * Reconstructive. Schema: stardust/eds-schema/index.json → community.
 * The section head (h2 + lede) is DEFAULT CONTENT above this block.
 *
 * Authoring: one row per card, 4 cells:
 *   1: <h3>Card title</h3>
 *   2: card icon <img>
 *   3: <p>description</p>
 *   4: <a href>Go label</a>  (supplies the whole-card href + the go-link label)
 */

const GO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'ds-comm-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells.find((c) => c.querySelector('h1, h2, h3, h4'));
    const iconCell = cells.find((c) => c.querySelector('picture, img'));
    const linkEl = row.querySelector('a[href]');
    const descCell = cells.find((c) => c !== titleCell && c !== iconCell
      && !c.querySelector('a[href]') && c.textContent.trim());
    if (!titleCell && !descCell) return;

    const href = linkEl ? linkEl.getAttribute('href') : '#';
    const heading = titleCell && titleCell.querySelector('h1, h2, h3, h4');
    const label = (linkEl && linkEl.textContent.trim())
      || (heading && heading.textContent.trim()) || 'Mehr';

    const card = document.createElement('a');
    card.className = 'ds-card ds-comm-card';
    card.href = href;

    const top = document.createElement('div');
    top.className = 'ds-comm-top';
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      top.append(h3);
    }
    const media = iconCell && (iconCell.querySelector('picture') || iconCell.querySelector('img'));
    if (media) top.append(media);
    card.append(top);

    if (descCell) {
      const p = document.createElement('p');
      [...descCell.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      card.append(p);
    }

    const go = document.createElement('span');
    go.className = 'ds-comm-go';
    go.append(document.createTextNode(label));
    go.insertAdjacentHTML('beforeend', GO_SVG);
    card.append(go);

    grid.append(card);
  });

  block.replaceChildren(grid);
}
