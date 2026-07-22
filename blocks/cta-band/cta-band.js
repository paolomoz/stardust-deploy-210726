/**
 * cta-band — drive action, full-bleed orange band with giant "+" watermark.
 * Schema → cta-band. Tier: template-slotted.
 * Authoring: <h2>, <p>, CTA <p><strong><a>. The "+" glyph is block-owned decoration.
 */
export default function decorate(block) {
  const h2 = block.querySelector('h2');
  const ps = [...block.querySelectorAll('p')];
  const ctaP = ps.find((p) => p.querySelector('a'));
  const bodyP = ps.find((p) => p !== ctaP && p.textContent.trim());

  const glyph = document.createElement('span');
  glyph.className = 'plus-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  glyph.textContent = '+';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (h2) wrap.append(h2);
  if (bodyP) wrap.append(bodyP);
  if (ctaP) wrap.append(ctaP);

  block.replaceChildren(glyph, wrap);
}
