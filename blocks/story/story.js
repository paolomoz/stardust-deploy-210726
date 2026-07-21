/**
 * story — full-bleed cinematic brewery-story band (prototype section
 * `brewery-story`). Decode tier: template-slotted (#95).
 * Schema: stardust/eds-schema/home.json → section "brewery-story".
 *
 * Authoring rows (simple shape):
 *   1. background image — <picture>/<img> (editorial, content.da.live URL)
 *   2. rich cell: eyebrow <p>, section <h2>, N body <p>s, closer <p> (last)
 *
 * Decode contract: eyebrow = link-free <p> before the heading; after the
 * heading the LAST <p> is the display closer line, the rest are body columns.
 */

export default async function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const cell = heading ? heading.closest('div') : (block.querySelector(':scope > div > div') || block);

  const ps = [...cell.querySelectorAll('p')];
  let eyebrow = null;
  const after = [];
  ps.forEach((p) => {
    if (!p.textContent.trim()) return;
    /* eslint-disable no-bitwise */
    if (heading && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      if (!eyebrow) eyebrow = p;
    } else {
      after.push(p);
    }
    /* eslint-enable no-bitwise */
  });
  const closer = after.length > 1 ? after[after.length - 1] : null;
  const body = closer ? after.slice(0, -1) : after;

  // --- build the prototype's DOM (template-slotted) ---
  const wrap = document.createElement('div');
  wrap.className = 'ds-story-cinematic';

  const bg = document.createElement('div');
  bg.className = 'ds-story-bg';
  bg.setAttribute('aria-hidden', 'true');
  if (media) bg.append(media.cloneNode(true));
  wrap.append(bg);

  const inner = document.createElement('div');
  inner.className = 'ds-story-inner';

  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'ds-eyebrow';
    eb.append(...[...eyebrow.childNodes].map((n) => n.cloneNode(true)));
    inner.append(eb);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    const src = heading.querySelector('h1, h2, h3, h4, h5, h6') || heading;
    h2.append(...[...src.childNodes].map((n) => n.cloneNode(true)));
    inner.append(h2);
  }
  if (body.length) {
    const bodyGrid = document.createElement('div');
    bodyGrid.className = 'ds-story-body';
    body.forEach((p) => bodyGrid.append(p.cloneNode(true)));
    inner.append(bodyGrid);
  }
  if (closer) {
    const cl = document.createElement('p');
    cl.className = 'ds-story-closer';
    cl.append(...[...closer.childNodes].map((n) => n.cloneNode(true)));
    inner.append(cl);
  }

  wrap.append(inner);
  block.replaceChildren(wrap);
}
