/**
 * quote-spread — full-bleed testimony split. Schema → customer-quote. Tier: template-slotted.
 * Authoring:
 *   cell 1: photo image
 *   cell 2: <blockquote>, cite <p>, logo image
 */
export default function decorate(block) {
  const imgs = [...block.querySelectorAll('picture, img')];
  const blockquote = block.querySelector('blockquote');
  const citeP = [...block.querySelectorAll('p, cite')]
    .find((p) => p.textContent.trim() && !p.querySelector('a'));

  const photo = document.createElement('div');
  photo.className = 'photo';
  if (imgs[0]) photo.append(imgs[0]);

  const panel = document.createElement('figure');
  panel.className = 'panel';
  if (blockquote) panel.append(blockquote);
  const cap = document.createElement('figcaption');
  if (citeP) {
    const cite = document.createElement('cite');
    cite.textContent = citeP.textContent.trim();
    cap.append(cite);
  }
  if (imgs[1]) {
    const logo = imgs[1].tagName === 'IMG' ? imgs[1] : imgs[1].querySelector('img') || imgs[1];
    logo.classList?.add('q-logo');
    if (imgs[1].tagName === 'PICTURE') imgs[1].classList.add('q-logo');
    cap.append(imgs[1]);
  }
  panel.append(cap);

  block.replaceChildren(photo, panel);
}
