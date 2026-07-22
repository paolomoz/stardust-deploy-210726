/**
 * hero — value proposition + primary action (asymmetric 7/5 editorial split).
 * Schema: stardust/eds-schema/cority-home.json → hero. Tier: template-slotted.
 *
 * Authoring rows (each a single cell):
 *   1. <h1> (accent word in <em>), lede <p>, CTA <p><strong><a></strong>
 *   2. dashboard <img> (editorial)
 *   3. capability index: label <p> + <ul> of capability chips
 */
export default function decorate(block) {
  const h1 = block.querySelector('h1');
  const pic = block.querySelector('picture, img');
  const ul = block.querySelector('ul');
  const ps = [...block.querySelectorAll('p')];
  const ctaP = ps.find((p) => p.querySelector('a'));
  const labelP = ul && ul.previousElementSibling?.tagName === 'P'
    ? ul.previousElementSibling
    : ps.find((p) => !p.querySelector('a') && p.nextElementSibling === ul);
  const lede = ps.find((p) => p !== ctaP && p !== labelP && !p.querySelector('a'));

  // LCP: eager-load the first image (metadata-first section defeats waitForFirstImage, #100)
  const img = pic && (pic.tagName === 'IMG' ? pic : pic.querySelector('img'));
  if (img) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';
  const left = document.createElement('div');
  if (h1) left.append(h1);
  if (lede) { lede.className = 'lede'; left.append(lede); }
  if (ctaP) left.append(ctaP);
  grid.append(left);
  const uiCol = document.createElement('div');
  uiCol.className = 'ui-col';
  if (pic) uiCol.append(pic);
  grid.append(uiCol);
  wrap.append(grid);

  if (ul) {
    const capIndex = document.createElement('div');
    capIndex.className = 'cap-index';
    const lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = labelP ? labelP.textContent.trim() : 'The EHS+ platform spans';
    capIndex.append(lbl);
    [...ul.children].forEach((li) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = li.textContent.trim();
      capIndex.append(chip);
    });
    wrap.append(capIndex);
  }

  block.replaceChildren(wrap);
}
