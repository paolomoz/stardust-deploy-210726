/**
 * control — control ledger (build trust). Schema → control-trio. Tier: reconstructive.
 * Authoring:
 *   row 1: <h2> (section head)
 *   rows 2..N: 3 cells each — <h3> | <p> | image
 *   last row: CTA <p><strong><a>
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const rows = [...block.children];
  rows.forEach((r) => {
    const h2 = r.querySelector('h2');
    const h3 = r.querySelector('h3');
    const link = r.querySelector('a');
    const media = r.querySelector('picture, img');
    if (h2 && !h3) { wrap.append(h2); return; }
    if (h3) {
      const row = document.createElement('div');
      row.className = 'row';
      row.append(h3);
      const p = r.querySelector('p');
      if (p && !p.querySelector('a')) row.append(p);
      if (media) row.append(media);
      wrap.append(row);
      return;
    }
    if (link) {
      const cta = r.querySelector('p') || r.firstElementChild;
      cta.className = 'cta-row';
      wrap.append(cta);
    }
  });
  block.replaceChildren(wrap);
}
