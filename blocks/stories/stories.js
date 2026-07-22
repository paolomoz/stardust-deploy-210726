/**
 * stories — 6 housing-story cards (initial-avatar + name + excerpt + read-more).
 * Schema: stardust/eds-schema/theroadhome.json § stories-grid (6× ARTICLE.story-card).
 * Section head (h2 + intro) and the MORE STORIES CTA are DEFAULT CONTENT (D1).
 *
 * Authoring: one row per card, cells = [ <h3>NAME</h3> | <p>excerpt</p> | <p><a href>READ …</a></p> ].
 * Portraits are unsourced placeholders (see conversion log): render a clean initial
 * avatar derived from the name; the "PLACEHOLDER · other" dev label is intentionally dropped.
 */
export default async function decorate(block) {
  const cards = [...block.children].map((row) => {
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const link = row.querySelector('a');
    const excerpt = [...row.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
    const name = heading ? heading.textContent.trim() : '';

    const card = document.createElement('article');
    card.className = 'story-card';

    const head = document.createElement('div');
    head.className = 'story-head';
    const portrait = document.createElement('span');
    portrait.className = 'story-portrait';
    portrait.setAttribute('aria-hidden', 'true');
    portrait.textContent = (name[0] || '').toUpperCase();
    head.append(portrait);
    if (heading) head.append(heading);
    card.append(head);

    if (excerpt) card.append(excerpt);
    if (link) { link.classList.add('story-more'); card.append(link); }
    return card;
  });

  const grid = document.createElement('div');
  grid.className = 'stories-grid-inner';
  grid.append(...cards);
  block.replaceChildren(grid);
}
