/**
 * risk — risk spectrum strip (catalog navigation). Schema → risk-spectrum.
 * Tier: reconstructive + 6 per-instance COLOR variants applied BY INDEX.
 * NOTE: A1 style-fingerprint did NOT flag these variants (color is on nested
 * .bar/.kicker, not the .seg top-level) — reproduced here from the prototype CSS.
 * Authoring:
 *   row 1: <h2> (section head)
 *   rows 2..7: 3 cells — <strong>kicker</strong> | <h3> | plain <a>
 */
const KEYS = ['one', 'env', 'health', 'safety', 'quality', 'sus'];

export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const rows = [...block.children];
  const spectrum = document.createElement('div');
  spectrum.className = 'spectrum';
  let i = 0;

  rows.forEach((r) => {
    const h2 = r.querySelector('h2');
    const h3 = r.querySelector('h3');
    if (h2 && !h3) { wrap.append(h2); return; }
    if (!h3) return;
    const key = KEYS[i] || 'one';
    const seg = document.createElement('div');
    seg.className = `seg s-${key}`;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('div');
    inner.className = 'inner';
    const strong = r.querySelector('strong');
    const kicker = document.createElement('span');
    kicker.className = `kicker k-${key}`;
    kicker.textContent = strong ? strong.textContent.trim() : '';
    inner.append(kicker, h3);
    const link = r.querySelector('a');
    if (link) inner.append(link);
    seg.append(bar, inner);
    spectrum.append(seg);
    i += 1;
  });

  wrap.append(spectrum);
  block.replaceChildren(wrap);
}
