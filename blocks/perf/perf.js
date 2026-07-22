/**
 * perf — performance editorial spread. Schema → performance-bento. Tier: template-slotted.
 * Authoring:
 *   cell 1: <h2>, then 3× (<h3> + <p>) entries, then CTA <p><strong><a>
 *   cell 2: 3 collage images, then headshot image + <blockquote> + cite <p>
 */
export default function decorate(block) {
  const h2 = block.querySelector('h2');
  const h3s = [...block.querySelectorAll('h3')];
  const ctaP = [...block.querySelectorAll('p')].find((p) => p.querySelector('a'));
  const imgs = [...block.querySelectorAll('picture, img')]
    .filter((el) => el.tagName === 'PICTURE' || !el.closest('picture')); // top-level media only (#72)
  const blockquote = block.querySelector('blockquote');
  const citeP = blockquote
    ? [...block.querySelectorAll('p, cite')].find((p) => !p.querySelector('a')
        && blockquote.compareDocumentPosition(p) === Node.DOCUMENT_POSITION_FOLLOWING)
    : null;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';

  const left = document.createElement('div');
  if (h2) left.append(h2);
  h3s.forEach((h3) => {
    const entry = document.createElement('div');
    entry.className = 'entry';
    const p = h3.nextElementSibling; // read BEFORE moving h3 (append detaches it)
    entry.append(h3);
    if (p && p.tagName === 'P' && !p.querySelector('a')) entry.append(p);
    left.append(entry);
  });
  if (ctaP) { ctaP.className = 'cta-row'; left.append(ctaP); }
  grid.append(left);

  const collage = document.createElement('div');
  collage.className = 'collage';
  imgs.slice(0, 3).forEach((im, i) => {
    const el = im.tagName === 'IMG' ? im : im.querySelector('img') || im;
    el.classList?.add(`c${i + 1}`);
    if (im.tagName === 'PICTURE') im.classList.add(`c${i + 1}`);
    collage.append(im);
  });
  const fig = document.createElement('figure');
  fig.className = 'marginalia';
  if (imgs[3]) fig.append(imgs[3]);
  if (blockquote) fig.append(blockquote);
  if (citeP) {
    const cap = document.createElement('figcaption');
    const cite = document.createElement('cite');
    cite.textContent = citeP.textContent.trim();
    cap.append(cite);
    fig.append(cap);
  }
  collage.append(fig);
  grid.append(collage);

  wrap.append(grid);
  block.replaceChildren(wrap);
}
