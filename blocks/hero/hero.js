/**
 * hero — full-bleed photo + scrim + h1 + deck + CTAs (template-slotted, #95).
 * Schema: stardust/eds-schema/theroadhome.json § hero.
 *
 * Authoring rows (positional, tolerant — queried not indexed, #42):
 *   1. <picture>/<img>  hero background photo (editorial)
 *   2. <h1>             page headline (the single <h1>)
 *   3. <p>              deck / lede
 *   4. <p>              CTAs — <strong><a> primary, <em><a> secondary
 * decorateButtons() classes the CTAs before this runs on the live pipeline; on the
 * off-pipeline harness they remain <strong>/<em> — either way we clone the cell.
 */
export default async function decorate(block) {
  const pic = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const paras = [...block.querySelectorAll('p')];
  const ctaP = paras.find((p) => p.querySelector('a'));
  const deck = paras.find((p) => p !== ctaP && p.textContent.trim());

  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
    bg.append(pic.closest('picture') || pic);
  }

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'hero-content';
  if (heading) content.append(heading);
  if (deck) { deck.classList.add('hero-deck'); content.append(deck); }
  if (ctaP) { ctaP.classList.add('hero-ctas'); content.append(ctaP); }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(content);

  block.replaceChildren(bg, scrim, wrap);
}
