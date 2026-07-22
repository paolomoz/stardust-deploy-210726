/**
 * resources — feature + list (cross-promo). Schema → resources. Tier: reconstructive.
 * Authoring:
 *   row 1: <h2> (section head)
 *   row 2: FEATURE — image | <strong>kicker</strong> + <h3> | <a>
 *   rows 3..N: res-row — image | <strong>kicker</strong> + <h3> | <a>
 * Kicker category colour reuses the shared chip palette (DA strips the authored span).
 */
function kickerKey(t) {
  const s = t.toLowerCase();
  if (s.includes('ebook')) return 'health';
  if (s.includes('blog')) return 'one';
  if (s.includes('report')) return 'quality';
  return 'one';
}

export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const rows = [...block.children];
  let contentIndex = 0;

  rows.forEach((r) => {
    const h2 = r.querySelector('h2');
    const h3 = r.querySelector('h3');
    if (h2 && !h3) { wrap.append(h2); return; }
    if (!h3) return;

    const media = r.querySelector('picture, img');
    const strong = r.querySelector('strong');
    const link = r.querySelector('a');
    const isFeature = contentIndex === 0;
    contentIndex += 1;

    const kicker = document.createElement('span');
    const key = strong ? kickerKey(strong.textContent) : 'one';
    kicker.className = `kicker k-${key}`;
    kicker.textContent = strong ? strong.textContent.trim() : '';

    if (isFeature) {
      const art = document.createElement('article');
      art.className = 'feature';
      if (media) art.append(media);
      const div = document.createElement('div');
      div.append(kicker, h3);
      if (link) div.append(link);
      art.append(div);
      wrap.append(art);
    } else {
      const art = document.createElement('article');
      art.className = 'res-row';
      const isBadge = key === 'quality'; // Reports row uses the contained award badge
      if (media) {
        const imgEl = media.tagName === 'IMG' ? media : media.querySelector('img');
        if (isBadge && imgEl) imgEl.classList.add('badge');
        if (isBadge && media.tagName === 'PICTURE') media.classList.add('badge');
        art.append(media);
      }
      const div = document.createElement('div');
      div.append(kicker, h3);
      art.append(div);
      if (link) art.append(link);
      wrap.append(art);
    }
  });

  block.replaceChildren(wrap);
}
