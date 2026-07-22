/**
 * sustainability — dark statement chapter over an editorial photo (captured
 * motif). Template-slotted (#95). Schema: stardust/eds-schema/index.json § sustainability.
 *
 * Authoring rows: background image (editorial, authorable), <h2>, body
 * paragraph, plain arrow link. The image renders as a background LAYER with a
 * scrim gradient over it; solid forest is the no-image fallback.
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
  let heading = null;
  let body = null;
  let link = null;

  nodes.forEach((el) => {
    const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const a = el.matches('a') ? el : el.querySelector('a');
    if (pic && !media) { media = pic; return; }
    if (el.matches('h2, h3') && !heading) { heading = el; return; }
    if (a && !link) { link = a; return; }
    if (el.textContent.trim() && !body) body = el;
  });

  const stage = document.createElement('div');
  stage.className = 'sustainability-stage';

  if (media) {
    const bg = document.createElement('div');
    bg.className = 'sustainability-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.append(media);
    stage.append(bg);
  }

  const scrim = document.createElement('div');
  scrim.className = 'sustainability-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  stage.append(scrim);

  const shell = document.createElement('div');
  shell.className = 'shell';
  if (heading) shell.append(heading);
  if (body) shell.append(body);
  if (link) {
    link.classList.add('arrow-link');
    shell.append(link);
  }
  stage.append(shell);

  block.replaceChildren(stage);
}
