/**
 * trust — logo ledger (build trust). Schema → logo-band. Tier: reconstructive.
 * Authoring: 1 label cell (text) + N logo cells (each an <img>).
 * A1 flagged the label-vs-logo instance variation (#90) — reproduced here.
 */
export default function decorate(block) {
  const row = document.createElement('div');
  row.className = 'row';
  [...block.children].forEach((r) => {
    const cell = r.firstElementChild || r;
    const media = cell.querySelector('picture, img');
    const div = document.createElement('div');
    div.className = 'cell';
    if (media) {
      div.append(media);
    } else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      div.append(p);
    }
    row.append(div);
  });
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(row);
  block.replaceChildren(wrap);
}
