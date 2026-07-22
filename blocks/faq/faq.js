/**
 * faq — accordion (answer engine + objection handling). Schema → faq. Tier: reconstructive.
 * Authoring:
 *   row 1: <h2> (section head)
 *   rows 2..N: 2 cells — question text | answer (one or more <p>)
 *   last row: single cell — coda prose
 * First item is rendered open (A1 flagged the open-vs-closed variant).
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const rows = [...block.children];
  let qa = 0;

  rows.forEach((r) => {
    const cells = [...r.children];
    const h2 = r.querySelector('h2');
    if (h2 && cells.length === 1) { wrap.append(h2); return; }
    if (cells.length >= 2) {
      const details = document.createElement('details');
      if (qa === 0) details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = cells[0].textContent.trim();
      const answer = document.createElement('div');
      answer.className = 'answer';
      const ps = [...cells[1].querySelectorAll('p')];
      if (ps.length) ps.forEach((p) => answer.append(p));
      else { const p = document.createElement('p'); p.textContent = cells[1].textContent.trim(); answer.append(p); }
      details.append(summary, answer);
      wrap.append(details);
      qa += 1;
    } else if (cells.length === 1 && cells[0].textContent.trim()) {
      const coda = document.createElement('p');
      coda.className = 'coda';
      coda.textContent = cells[0].textContent.trim();
      wrap.append(coda);
    }
  });

  block.replaceChildren(wrap);
}
