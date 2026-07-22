/**
 * subscribe — lead-capture band on navy. Schema → subscribe-band. Tier: template-slotted.
 * Authoring: brand logo image, <p> pitch, CTA <p><strong><a>.
 */
export default function decorate(block) {
  const pic = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')];
  const ctaP = ps.find((p) => p.querySelector('a'));
  const bodyP = ps.find((p) => p !== ctaP && p.textContent.trim());

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (pic) wrap.append(pic);
  if (bodyP) wrap.append(bodyP);
  if (ctaP) wrap.append(ctaP);
  block.replaceChildren(wrap);
}
