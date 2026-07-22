/**
 * awards-shelf — recognition band (build trust). Schema → awards-band. Tier: template-slotted.
 * Authoring:
 *   cell 1: <h2>, rating <p> (e.g. "4.3"), CTA <p><strong><a>
 *   cell 2: award images (4)
 * Stars glyphs are block-owned presentation (DA strips the authored span, #39).
 */
export default function decorate(block) {
  const h2 = block.querySelector('h2');
  const imgs = [...block.querySelectorAll('picture, img')]
    .filter((el) => el.tagName === 'PICTURE' || !el.closest('picture')); // top-level media only (#72)
  const ps = [...block.querySelectorAll('p')];
  const ctaP = ps.find((p) => p.querySelector('a'));
  const ratingP = ps.find((p) => p !== ctaP && !p.querySelector('a') && p.textContent.trim());

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';

  const left = document.createElement('div');
  if (h2) left.append(h2);
  if (ratingP) {
    ratingP.className = 'rating';
    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.setAttribute('aria-hidden', 'true');
    stars.textContent = '★★★★☆';
    ratingP.prepend(stars, ' ');
    left.append(ratingP);
  }
  if (ctaP) { ctaP.className = 'cta-row'; left.append(ctaP); }
  grid.append(left);

  const shelf = document.createElement('div');
  shelf.className = 'shelf';
  imgs.forEach((im) => shelf.append(im));
  grid.append(shelf);

  wrap.append(grid);
  block.replaceChildren(wrap);
}
