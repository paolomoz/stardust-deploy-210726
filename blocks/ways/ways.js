/**
 * ways — 3-up grid of whole-card photo links (route audiences).
 * Schema: stardust/eds-schema/theroadhome.json § ways-3up (3× A.way-card, 2 imgs each).
 *
 * Authoring: one row per card, cells = [ photo <img> | icon <img> | <p><a href>TITLE</a></p> ].
 * The whole card becomes an <a>; the title link carries the href. Robust to DA
 * cell-flattening — reads imgs and the link by query within the row (#52/#72).
 */
export default async function decorate(block) {
  const cards = [...block.children].map((row) => {
    const imgs = [...row.querySelectorAll('picture, img')];
    const link = row.querySelector('a');
    if (!link) return null;
    const photo = imgs[0] || null;
    const icon = imgs[1] || null;

    const card = document.createElement('a');
    card.className = 'way-card';
    card.href = link.getAttribute('href') || '#';

    const photoWrap = document.createElement('span');
    photoWrap.className = 'way-photo';
    if (photo) photoWrap.append(photo.closest('picture') || photo);

    const scrim = document.createElement('span');
    scrim.className = 'way-scrim';
    scrim.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'way-label';
    if (icon) {
      const ic = icon.closest('picture') || icon;
      ic.classList.add('way-icon');
      label.append(ic);
    }
    const title = document.createElement('span');
    title.className = 'way-title';
    title.textContent = link.textContent.trim();
    const arrow = document.createElement('span');
    arrow.className = 'way-arrow';
    arrow.textContent = 'EXPLORE →';
    label.append(title, arrow);

    card.append(photoWrap, scrim, label);
    return card;
  }).filter(Boolean);

  const grid = document.createElement('div');
  grid.className = 'ways-grid';
  grid.append(...cards);
  block.replaceChildren(grid);
}
