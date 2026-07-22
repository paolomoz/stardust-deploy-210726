/**
 * academy — education/training routing: asymmetric editorial band, duotone
 * image bleeding to the right viewport edge (index-B prototype).
 * Schema: stardust/eds-schema/index.json § academy. Reconstructive, fixed roles.
 *
 * Authoring rows: <h2> title, body paragraph, plain arrow link, image.
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

  let heading = null;
  let body = null;
  let link = null;
  let media = null;

  nodes.forEach((el) => {
    const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const a = el.matches('a') ? el : el.querySelector('a');
    if (pic && !media) { media = pic; return; }
    if (el.matches('h2, h3') && !heading) { heading = el; return; }
    if (a && !link) { link = a; return; }
    if (el.textContent.trim() && !body) body = el;
  });

  const grid = document.createElement('div');
  grid.className = 'academy-grid';

  const text = document.createElement('div');
  text.className = 'academy-text';
  if (heading) text.append(heading);
  if (body) text.append(body);
  if (link) {
    link.classList.add('arrow-link');
    text.append(link);
  }
  grid.append(text);

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'academy-media';
  if (media) mediaWrap.append(media);
  grid.append(mediaWrap);

  block.replaceChildren(grid);
}
