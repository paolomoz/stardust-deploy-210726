/**
 * trust-band — booster-yellow reassurance strip (4 items, check icon per item).
 * Reconstructive. Schema: stardust/eds-schema/index.json → trust-band
 *
 * Authoring: one row per item, single cell holding the item text
 * (item text MAY contain an <a>, e.g. the Trustpilot rating — #90 variant).
 */

const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    if (!cell || !cell.textContent.trim()) return;
    const li = document.createElement('li');
    li.insertAdjacentHTML('beforeend', CHECK_SVG);
    [...cell.childNodes].forEach((n) => li.append(n.cloneNode(true)));
    ul.append(li);
  });
  block.replaceChildren(ul);
}
