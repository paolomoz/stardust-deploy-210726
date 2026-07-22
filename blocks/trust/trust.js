/**
 * trust — "Accredited by" logo strip (reconstructive).
 * Schema: stardust/eds-schema/index.json → section "trust-strip".
 *
 * Authored: a leading label <p> ("Accredited by"), then one row per logo image.
 * A visually-hidden <h2> may lead the section as default content.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  let label = 'Accredited by';
  const logos = [];

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const media = cell.querySelector('picture, img');
    if (media) {
      logos.push(media);
    } else if (cell.textContent.trim()) {
      label = cell.textContent.trim();
    }
  });

  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';

  // visually-hidden section heading for a11y + crawlers (parity with prototype)
  const srHeading = document.createElement('h2');
  srHeading.className = 'ds-sr-only';
  srHeading.textContent = 'Accredited by leading regulatory agencies';
  wrap.append(srHeading);

  const labelEl = document.createElement('p');
  labelEl.className = 'ds-trust-label';
  labelEl.textContent = label;

  const list = document.createElement('ul');
  list.className = 'ds-trust-logos';
  logos.forEach((m) => {
    const li = document.createElement('li');
    li.append(m);
    list.append(li);
  });

  wrap.append(labelEl, list);
  block.replaceChildren(wrap);
}
