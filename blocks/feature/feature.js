/**
 * feature — split feature band (variants: `cancellation` [signal-orange badge],
 * `recover` [signal-magenta badge, mist band, media left]).
 * Schema: stardust/eds-schema/index.json § feature-cancellation-insights /
 * feature-recover. Decode tier: template-slotted (role-classified slots).
 *
 * Authoring rows (order-tolerant; eyebrow buffered before its heading, #76):
 *   1. badge/eyebrow text (short line before the heading)
 *   2. <h2> feature title
 *   3. lede paragraph
 *   4. CTA cell — <strong><a> primary + plain <a> Learn More
 *   5. customer quote paragraph (starts with a quotation mark)
 *   6. quote attribution — avatar image + "Name, Company" text
 *   7. product screenshot image (descriptive alt)
 */

function nodesOf(block) {
  return [...block.children].flatMap((row) => [...row.children]).flatMap((cell) => {
    const kids = [...cell.children];
    if (kids.length) return kids;
    if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      return [p];
    }
    return [];
  });
}

export default function decorate(block) {
  const variant = block.classList.contains('recover') ? 'recover' : 'cancellation';
  const nodes = nodesOf(block);

  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const headingIdx = nodes.indexOf(heading);
  const isQuote = (t) => /^["“‘']/.test(t.trim());

  let eyebrowText = '';
  let lede = null;
  let quoteP = null;
  let attrib = null;
  let shot = null;
  const ctaPs = [];

  nodes.forEach((n, i) => {
    if (n === heading) return;
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && n.querySelector('a')) { ctaPs.push(n); return; }
    if (pic) {
      /* avatar (small, followed/joined by name text) vs screenshot: the
         attribution image shares its cell with (or precedes) a short name line;
         the LAST picture in authored order is the screenshot */
      if (!shot) { shot = pic; } else { attrib = attrib || { pic }; }
      return;
    }
    if (n.querySelector('a')) { ctaPs.push(n); return; }
    const text = n.textContent.trim();
    if (!text) return;
    if (i < headingIdx) { eyebrowText = eyebrowText || text; return; }
    if (isQuote(text)) { quoteP = n; return; }
    if (!lede) { lede = n; return; }
    /* remaining short text after the quote = attribution line */
    attrib = { ...(attrib || {}), text };
  });

  /* two pictures authored: first non-CTA picture after the quote is the avatar,
     the standalone one is the screenshot. Re-resolve: pick the largest-intent
     image (row of its own, descriptive alt) as the shot. */
  const pics = nodes
    .map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img')))
    .filter(Boolean);
  if (pics.length > 1) {
    shot = pics[pics.length - 1];
    attrib = { ...(attrib || {}), pic: pics[0] };
  }

  const copy = document.createElement('div');
  copy.className = 'split-copy';

  if (eyebrowText) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    const badge = document.createElement('span');
    badge.className = 'ds-badge';
    badge.dataset.feature = variant;
    badge.textContent = eyebrowText;
    p.append(badge);
    copy.append(p);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3');
    h2.append(...(inner || heading).childNodes);
    copy.append(h2);
  }

  if (lede) {
    lede.className = 'section-lede';
    copy.append(lede);
  }

  if (ctaPs.length) {
    const ctas = document.createElement('div');
    ctas.className = 'feature-ctas';
    ctaPs.forEach((p) => ctas.append(p));
    copy.append(ctas);
  }

  if (quoteP) {
    const figure = document.createElement('figure');
    figure.className = 'feature-quote';
    const bq = document.createElement('blockquote');
    bq.append(quoteP);
    figure.append(bq);
    if (attrib && (attrib.pic || attrib.text)) {
      const cap = document.createElement('figcaption');
      cap.className = 'quote-attrib';
      if (attrib.pic) cap.append(attrib.pic.closest('picture') || attrib.pic);
      if (attrib.text) {
        const cite = document.createElement('cite');
        cite.textContent = attrib.text;
        cap.append(cite);
      }
      figure.append(cap);
    }
    copy.append(figure);
  }

  const container = document.createElement('div');
  container.className = 'container split';
  container.append(copy);
  if (shot) {
    const img = shot.matches('img') ? shot : shot.querySelector('img');
    if (img) img.classList.add('split-shot', 'split-media');
    container.append(shot.closest('picture') || shot);
  }
  block.replaceChildren(container);
}
