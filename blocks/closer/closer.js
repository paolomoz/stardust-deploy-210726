/**
 * closer — cinematic atmospheric closing band (prototype section `closer`).
 * Decode tier: template-slotted (#95).
 * Schema: stardust/eds-schema/home.json → section "closer".
 *
 * Authoring rows (simple shape):
 *   1. background image — <picture>/<img> (editorial, content.da.live URL)
 *   2. rich cell: eyebrow <p>, <h2> (biggest type on the page), signature <p>
 *
 * Decode contract: eyebrow = <p> before the heading; signature = <p> after it.
 */

export default async function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const cell = heading ? heading.closest('div') : (block.querySelector(':scope > div > div') || block);

  let eyebrow = null;
  let sig = null;
  [...cell.querySelectorAll('p')].forEach((p) => {
    if (!p.textContent.trim()) return;
    /* eslint-disable no-bitwise */
    if (heading && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      if (!eyebrow) eyebrow = p;
    } else if (!sig) {
      sig = p;
    }
    /* eslint-enable no-bitwise */
  });

  const wrap = document.createElement('div');
  wrap.className = 'ds-closer-band';

  const bg = document.createElement('div');
  bg.className = 'ds-closer-bg';
  bg.setAttribute('aria-hidden', 'true');
  if (media) bg.append(media.cloneNode(true));
  wrap.append(bg);

  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'ds-eyebrow';
    eb.append(...[...eyebrow.childNodes].map((n) => n.cloneNode(true)));
    wrap.append(eb);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    const src = heading.querySelector('h1, h2, h3, h4, h5, h6') || heading;
    h2.append(...[...src.childNodes].map((n) => n.cloneNode(true)));
    wrap.append(h2);
  }
  if (sig) {
    const s = document.createElement('span');
    s.className = 'ds-closer-sig';
    s.append(...[...sig.childNodes].map((n) => n.cloneNode(true)));
    wrap.append(s);
  }

  block.replaceChildren(wrap);
}
