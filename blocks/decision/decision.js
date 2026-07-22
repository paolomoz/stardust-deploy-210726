/**
 * decision — closing decision point: dark forest chapter, meadow primary
 * action left; ruled tabular trust facts + proof links right (index-B
 * prototype fix #2). Reconstructive (#95), two fixed cells.
 * Schema: stardust/eds-schema/index.json § decision-band.
 *
 * Authoring rows: row 1 = CTA cell (<h2>, lede paragraph, <em><strong><a>
 * accent CTA); row 2 = proof cell (<ul> trust facts + one paragraph per proof
 * link, plain <a> — key facts live in this server-rendered content, #86).
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const cta = document.createElement('div');
  cta.className = 'decision-cta';
  const proof = document.createElement('div');
  proof.className = 'decision-proof';
  const proofLinks = document.createElement('div');
  proofLinks.className = 'proof-links';

  cells.forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.matches('ul, ol')) {
        el.classList.add('trust-rule');
        proof.append(el);
        return;
      }
      const a = el.querySelector('a');
      // CTA: a.button when decorateButtons ran, emphasis-wrapped <a> otherwise
      const isCta = a && (a.classList.contains('button') || a.closest('strong, em'));
      if (el.matches('h2, h3')) {
        cta.append(el);
        return;
      }
      if (isCta) {
        cta.append(el);
        return;
      }
      if (a) {
        proofLinks.append(a);
        return;
      }
      const text = el.textContent.trim();
      if (!text) return;
      el.classList.add('lede');
      cta.append(el);
    });
  });

  if (proofLinks.children.length) proof.append(proofLinks);

  const grid = document.createElement('div');
  grid.className = 'decision-grid';
  grid.append(cta, proof);
  block.replaceChildren(grid);
}
