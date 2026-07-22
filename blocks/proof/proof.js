/**
 * proof — harbor trust band: head (heading + intro + trust marks) + 3 stat units.
 * Schema: stardust/eds-schema/theroadhome.json § proof-band (3× DIV.stat, imgCount 5).
 *
 * Authoring rows:
 *   head  : [ <h2> + <p> intro | mark <img> mark <img> ]        (2 cells)
 *   stat  : [ icon <img> | <p>NUMBER</p> | <p>description</p> ] (3 cells) ×3
 * Numbers stay non-heading (span) so the classifier keeps them `body` (no ROLE SWAP).
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const stats = document.createElement('div');
  stats.className = 'stats';

  rows.forEach((row) => {
    const cells = [...row.children];
    const h = row.querySelector('h1, h2, h3, h4');
    if (h) {
      // head row
      const head = document.createElement('div');
      head.className = 'proof-head';
      const copy = document.createElement('div');
      copy.className = 'proof-copy';
      copy.append(...cells[0] ? [...cells[0].childNodes] : [h]);
      const marks = document.createElement('div');
      marks.className = 'proof-marks';
      const markImgs = cells[1] ? [...cells[1].querySelectorAll('picture, img')] : [];
      markImgs.forEach((m) => marks.append(m.closest('picture') || m));
      head.append(copy, marks);
      wrap.append(head);
    } else {
      // stat row
      const imgs = [...row.querySelectorAll('picture, img')];
      const texts = [...row.querySelectorAll('p')].filter((p) => p.textContent.trim());
      const stat = document.createElement('div');
      stat.className = 'stat';
      if (imgs[0]) stat.append(imgs[0].closest('picture') || imgs[0]);
      if (texts[0]) { const n = document.createElement('span'); n.className = 'stat-number'; n.textContent = texts[0].textContent.trim(); stat.append(n); }
      if (texts[1]) { const p = document.createElement('p'); p.textContent = texts[1].textContent.trim(); stat.append(p); }
      stats.append(stat);
    }
  });

  wrap.append(stats);
  block.replaceChildren(wrap);
}
