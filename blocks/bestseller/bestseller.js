/**
 * bestseller — product card grid (image, badge chip, wishlist, title, price, CTA).
 * Reconstructive. Schema: stardust/eds-schema/index.json → bestseller (uniform:false).
 * The section head (h2 + text-links) is DEFAULT CONTENT above this block.
 *
 * Per-instance variants reproduced (#90):
 *   - badge cell "Bestseller" -> flame chip;  "Vorbestellen" -> purple chip
 *   - CTA emphasis carries the button style: <strong> -> primary (yellow),
 *     <em> -> secondary (outline, e.g. the Vorbestellen card)
 *   - optional struck old-price (<p> containing <s>)
 *   - optional leading "ab" price prefix
 *
 * Authoring: one row per product, 4 cells:
 *   1: product <img>
 *   2: badge word ("Bestseller" | "Vorbestellen" | empty)
 *   3: <h3><a>Title</a></h3>, optional <p>Alter Preis: <s>..</s></p>, <p>price</p>
 *   4: CTA — <p><strong><a>In den Warenkorb</a></strong></p> (or <em> for outline)
 */

const FLAME_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3-1 4.5-2 6-1.1 1.6-1.5 3-1.5 4.5a5.5 5.5 0 0 0 11 0c0-2-1-3.5-2-5-.6 1-.8 1.7-1.8 2.2C15.9 7.6 15 4 12 2zm.5 16.5a2.5 2.5 0 0 1-2.5-2.5c0-1 .5-1.9 1.2-2.8.5.7 1.5 1 1.9 2 .4-.4.6-.8.7-1.4.7.9 1.2 1.6 1.2 2.4a2.5 2.5 0 0 1-2.5 2.3z"/></svg>';
const WISH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 20.7C6.9 16.4 3 13 3 9.2 3 6.3 5.2 4.2 7.9 4.2c1.6 0 3.1.7 4.1 2 1-1.3 2.5-2 4.1-2 2.7 0 4.9 2.1 4.9 5 0 3.8-3.9 7.2-9 11.5zm0-2.6c4.2-3.6 7-6.4 7-8.9 0-1.8-1.3-3-2.9-3-1.2 0-2.3.7-2.9 1.9l-.6 1.1h-1.2l-.6-1.1c-.6-1.2-1.7-1.9-2.9-1.9C6.3 6.2 5 7.4 5 9.2c0 2.5 2.8 5.3 7 8.9z"/></svg>';
const PANGV = '<a class="ds-price-note" href="#pangv" aria-label="Preishinweis: Alle Preise inkl. gesetzlicher USt., zzgl. Versand">*</a>';

function chipFor(badge) {
  const t = badge.toLowerCase();
  if (t.includes('vorbestell')) {
    const s = document.createElement('span');
    s.className = 'ds-chip ds-chip-vorbestellen';
    s.textContent = badge;
    return s;
  }
  if (t.includes('bestseller')) {
    const s = document.createElement('span');
    s.className = 'ds-chip ds-chip-bestseller';
    s.insertAdjacentHTML('beforeend', FLAME_SVG);
    s.append(document.createTextNode(badge));
    return s;
  }
  return null;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'ds-prod-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells.find((c) => c.querySelector('picture, img'));
    const contentCell = cells.find((c) => c.querySelector('h1, h2, h3, h4'));
    const ctaCell = cells.find((c) => c !== contentCell && c.querySelector('a[href]'));
    const badgeCell = cells.find((c) => c !== imgCell && c !== contentCell && c !== ctaCell
      && c.textContent.trim());
    if (!contentCell) return;

    const card = document.createElement('article');
    card.className = 'ds-card ds-prod';

    // media + chip + wishlist
    const mediaBox = document.createElement('div');
    mediaBox.className = 'ds-prod-media';
    const media = imgCell && (imgCell.querySelector('picture') || imgCell.querySelector('img'));
    if (media) mediaBox.append(media);
    if (badgeCell) {
      const chip = chipFor(badgeCell.textContent.trim());
      if (chip) mediaBox.append(chip);
    }
    const wish = document.createElement('button');
    wish.type = 'button';
    wish.className = 'ds-wish';
    wish.setAttribute('aria-label', 'Zur Wunschliste');
    wish.insertAdjacentHTML('beforeend', WISH_SVG);
    mediaBox.append(wish);
    card.append(mediaBox);

    // title
    const heading = contentCell.querySelector('h1, h2, h3, h4');
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      card.append(h3);
    }

    // prices
    const paras = [...contentCell.querySelectorAll('p')];
    const oldP = paras.find((p) => p.querySelector('s, del, strike'));
    const priceP = paras.find((p) => p !== oldP && p.textContent.trim());
    if (oldP) {
      const p = document.createElement('p');
      p.className = 'ds-price-old';
      [...oldP.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      card.append(p);
    }
    if (priceP) {
      const p = document.createElement('p');
      p.className = 'ds-price';
      let html = priceP.innerHTML.trim();
      html = html.replace(/^ab\s+/i, '<span class="ds-price-ab">ab</span> ');
      p.innerHTML = html + PANGV;
      card.append(p);
    }

    // CTA (cloned, already class-decorated by decorateButtons)
    if (ctaCell) {
      const a = ctaCell.querySelector('a[href]');
      if (a) card.append(a.cloneNode(true));
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
