/**
 * affinity — flagship product promo: clinical duotone split (image left, copy
 * right) + full catalogue route as a closing ruled row (index-B prototype).
 * Schema: stardust/eds-schema/index.json § affinity-fullrange. Reconstructive (#95).
 *
 * Authoring rows (classified, not indexed — #48):
 *   - product image
 *   - kicker (leading <strong> tag — meta label)
 *   - <h3> product title, body paragraph, plain arrow link
 *   - <h2> full-range heading + <em><a> secondary CTA (ruled row)
 */

// wrapTextNodes (aem.js) folds a media-led cell (img/picture + siblings) into ONE
// wrapper <p> — expand it back to its element children before classifying.
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].matches('p')
      && kids[0].children.length > 1
      && kids[0].querySelector('h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) {
    kids = [...kids[0].children];
  }
  return kids;
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = cellNodes(cell);
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  let media = null;
  let kicker = null;
  let title = null;
  let body = null;
  let link = null;
  let rangeHeading = null;
  let rangeCta = null;

  nodes.forEach((el) => {
    const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const a = el.matches('a') ? el : el.querySelector('a');
    if (pic && !media) { media = pic; return; }
    if (el.matches('h3, h4') && !title) { title = el; return; }
    if (el.matches('h2') && !rangeHeading) { rangeHeading = el; return; }
    // CTA: a.button when decorateButtons ran, emphasis-wrapped <a> otherwise
    const isCta = a && (a.classList.contains('button') || a.closest('strong, em'));
    if (isCta && !rangeCta) { rangeCta = el.matches('a') ? a : el; return; }
    if (a && !link) { link = a; return; }
    const text = el.textContent.trim();
    if (!text) return;
    if (!kicker && !title && (el.querySelector(':scope > strong') || text.length < 40)) { kicker = el; return; }
    if (!body) body = el;
  });

  const grid = document.createElement('div');
  grid.className = 'affinity-grid';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'affinity-media';
  if (media) mediaWrap.append(media);
  grid.append(mediaWrap);

  const copy = document.createElement('div');
  copy.className = 'affinity-copy';
  if (kicker) {
    const p = document.createElement('p');
    p.className = 'kicker meta-label';
    const strong = kicker.querySelector(':scope > strong');
    p.append(...(strong || kicker).childNodes);
    copy.append(p);
  }
  if (title) copy.append(title);
  if (body) copy.append(body);
  if (link) {
    link.classList.add('arrow-link');
    copy.append(link);
  }
  grid.append(copy);

  const out = [grid];
  if (rangeHeading || rangeCta) {
    const row = document.createElement('div');
    row.className = 'fullrange-row';
    if (rangeHeading) row.append(rangeHeading);
    if (rangeCta) row.append(rangeCta);
    out.push(row);
  }

  block.replaceChildren(...out);
}
