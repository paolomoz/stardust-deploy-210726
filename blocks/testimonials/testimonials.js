/**
 * testimonials — 3-up lavender quote cards: decorative quote mark (block-owned,
 * inline SVG), blockquote, avatar + name + role attribution. Reconstructive
 * tier (#95). Schema: stardust/eds-schema/index.json § testimonials. Section
 * head is DEFAULT CONTENT before the block (D1).
 *
 * Authoring: ONE ROW PER TESTIMONIAL; parts as flat siblings in one cell:
 *   <p>quote text</p>
 *   <picture>/<img> (avatar — authored content.da.live URL)
 *   <p><strong>Name</strong></p>      (leading preserved tag = the name field)
 *   <p>Role, City</p>
 */

/* decorative quote mark (prototype quote1.svg) — fixed brand asset, inline (D15/#3) */
const QUOTE_MARK = `<svg class="quote-mark" width="61" height="46" viewBox="0 0 61 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M38.1299 16.5684C39.4779 15.9437 40.7601 15.4834 41.9766 15.1875C43.2259 14.8916 44.3931 14.7437 45.478 14.7437C49.8179 14.7437 53.4673 16.2396 56.4263 19.2314C59.4181 22.2233 60.9141 25.8727 60.9141 30.1797C60.9141 32.251 60.5195 34.2236 59.7305 36.0977C58.9743 37.9717 57.8564 39.632 56.377 41.0786C54.9303 42.5581 53.2536 43.6924 51.3467 44.4814C49.4727 45.2376 47.5164 45.6157 45.478 45.6157C42.1245 45.6157 39.2642 44.7609 36.897 43.0513C34.5627 41.3088 32.5736 38.5964 30.9297 34.9141C29.1872 38.6292 27.1323 41.3416 24.7651 43.0513C22.3979 44.7609 19.5376 45.6157 16.1841 45.6157C11.5812 45.6157 7.81673 44.0047 4.89062 40.7827C1.9974 37.5607 0.550781 33.3524 0.550781 28.1577C0.550781 23.522 1.53711 19.2314 3.50977 15.2861C5.5153 11.3079 8.32633 8.02018 11.9429 5.42285C14.0142 3.97624 16.3649 2.8584 18.9951 2.06934C21.6582 1.28027 24.387 0.885742 27.1816 0.885742H28.9077L30.9297 3.20361C24.946 3.72965 20.1623 5.07764 16.5786 7.24756C13.0278 9.3846 10.4469 12.4915 8.83594 16.5684C10.2497 15.9437 11.5648 15.4834 12.7812 15.1875C13.9977 14.8916 15.132 14.7437 16.1841 14.7437C19.1431 14.7437 21.7404 15.467 23.9761 16.9136C26.2446 18.3273 28.3324 20.563 30.2393 23.6206C32.2448 16.1245 35.4504 10.4696 39.856 6.65576C44.2944 2.80908 49.8343 0.885742 56.4756 0.885742H58.2017L60.2236 3.20361C54.2399 3.72965 49.4562 5.07764 45.8726 7.24756C42.2889 9.41748 39.708 12.5244 38.1299 16.5684Z" fill="#2B5582" fill-opacity="0.1"/>
</svg>`;

/* unwrap the runtime's wrapTextNodes artifact: decorateBlock wraps a cell whose
   FIRST element is a bare <img>/<span>/... in ONE <p> holding the whole cell —
   detect a <p> with block-level element children and expand it (runtime contract) */
function expandWrapper(el, out) {
  const isWrapper = el.matches('p')
    && [...el.children].some((c) => c.matches('img, picture, h1, h2, h3, h4, h5, h6, p, ul, ol'));
  if (!isWrapper) {
    out.push(el);
    return;
  }
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) out.push(n);
    else if (n.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = n.textContent.trim();
      out.push(p);
    }
  });
}

function collectNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) kids.forEach((k) => expandWrapper(k, out));
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'testi-grid';

  [...block.children].forEach((row) => {
    const nodes = collectNodes(row);
    if (!nodes.length) return;

    const media = nodes
      .map((el) => (el.matches('picture, img') ? el : el.querySelector('picture, img')))
      .find(Boolean);
    const nameP = nodes.find((el) => el.matches('p') && el.querySelector('strong'));
    const paragraphs = nodes.filter((el) => el.matches('p') && !el.querySelector('picture, img') && el.textContent.trim());
    const quoteP = paragraphs.find((el) => el !== nameP && !el.querySelector('strong'));
    const roleP = paragraphs.find((el) => el !== nameP && el !== quoteP);

    const card = document.createElement('figure');
    card.className = 'testi-card';
    card.insertAdjacentHTML('afterbegin', QUOTE_MARK);

    if (quoteP) {
      const quote = document.createElement('blockquote');
      quote.append(...quoteP.childNodes);
      card.append(quote);
    }

    const person = document.createElement('figcaption');
    person.className = 'testi-person';
    if (media) person.append(media.closest('picture') || media);
    const who = document.createElement('div');
    if (nameP) {
      const name = document.createElement('p');
      name.className = 'name';
      const strong = nameP.querySelector('strong');
      name.append(...(strong || nameP).childNodes);
      who.append(name);
    }
    if (roleP) {
      roleP.className = 'role';
      who.append(roleP);
    }
    person.append(who);
    card.append(person);

    grid.append(card);
  });

  block.replaceChildren(grid);
}
