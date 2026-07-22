/**
 * hero — card-corner landing hero (binder-blue, split 7/5).
 * Template-slotted (#95): fixed composition, values slotted by role.
 * Schema: stardust/eds-schema/index.json → hero
 *
 * Authoring rows (1 row, 2 cells):
 *   cell 1: <h1> (accent word in <em>), lede <p>, primary CTA <p><strong><a></strong></p>
 *   cell 2: up to 3 product images (the fanned hand)
 */

const EARS_SVG = '<svg class="ds-hero-ears" viewBox="0 0 48 40" fill="currentColor" aria-hidden="true"><path d="M16.5 40C11 30 8.5 19.5 11.5 10.5 12.9 6.3 16.3 5 18.6 8.2 21.5 12.3 22.5 22 22 32z"/><path d="M31.5 40c5.5-10 8-20.5 5-29.5C35.1 6.3 31.7 5 29.4 8.2 26.5 12.3 25.5 22 26 32z"/></svg>';

const HAND_CLASSES = ['ds-hand-card-l', 'ds-hand-card-c', 'ds-hand-card-r'];

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const textCell = cells[0];
  const h1 = textCell ? textCell.querySelector('h1, h2, h3') : null;
  const paras = textCell ? [...textCell.querySelectorAll('p')] : [];
  const ctaP = paras.find((p) => p.querySelector('a'));
  const lede = paras.find((p) => p !== ctaP && p.textContent.trim());
  const media = [...block.querySelectorAll('picture, img')];

  const grid = document.createElement('div');
  grid.className = 'ds-hero-grid';

  const left = document.createElement('div');
  if (h1) left.append(h1);
  if (lede) { lede.classList.add('ds-hero-lede'); left.append(lede); }
  if (ctaP) { ctaP.classList.add('ds-hero-cta'); left.append(ctaP); }
  grid.append(left);

  const tile = document.createElement('div');
  tile.className = 'ds-hero-tile';
  tile.insertAdjacentHTML('beforeend', EARS_SVG);
  const hand = document.createElement('div');
  hand.className = 'ds-hero-hand';
  media.forEach((m, i) => {
    const el = m.closest('picture') || m;
    el.classList.add('ds-hand-card');
    if (HAND_CLASSES[i]) el.classList.add(HAND_CLASSES[i]);
    hand.append(el);
  });
  // eager-load the LCP image (empty metadata-first section defeats waitForFirstImage, #100)
  const firstImg = media[0]
    ? (media[0].closest('picture') || media[0]).querySelector('img') || media[0]
    : null;
  if (firstImg && firstImg.tagName === 'IMG') {
    firstImg.setAttribute('loading', 'eager');
    firstImg.setAttribute('fetchpriority', 'high');
  }
  if (media.length) tile.append(hand);
  grid.append(tile);

  block.replaceChildren(grid);
}
