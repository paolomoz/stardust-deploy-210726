/**
 * insights — bespoke side-rail (prototype section.insights): pull-quote +
 * featured card (left) and a 5-item thumbnail list rail (right).
 * Schema: stardust/eds-schema/index.json → section "spiritual-insights".
 *
 * Authoring rows (classified by content, never index — #48):
 *   - quote row: no image — quotation <p> + attribution <p><em>…</em></p>
 *   - featured row: image cell + body cell with <h3> title, byline <p>,
 *     link <p><a>…</a></p>
 *   - list rows: thumbnail image cell + body cell with <p><a>title</a></p>
 *     + byline <p> (title link is a text link, not a button)
 */

function rowLink(cells) {
  return cells.map((c) => c.querySelector('p > a, a')).find(Boolean);
}

export default function decorate(block) {
  const rows = [...block.children];
  const mediaOf = (el) => el.querySelector('picture, img');

  const left = document.createElement('div');
  const list = document.createElement('ul');
  list.className = 'insight-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const media = cells.map(mediaOf).find(Boolean);
    const hasHeading = row.querySelector('h3, h4');

    if (!media) {
      // quote row
      const bq = document.createElement('blockquote');
      const ps = [...row.querySelectorAll('p')];
      const src = ps.length ? ps : cells;
      src.forEach((p, i) => {
        const isAttribution = (i === src.length - 1 && src.length > 1)
          || p.querySelector(':scope > em:only-child');
        if (isAttribution) {
          const cite = document.createElement('cite');
          cite.className = 'label byline';
          const em = p.querySelector(':scope > em:only-child');
          cite.append(...[...(em || p).childNodes].map((n) => n.cloneNode(true)));
          bq.append(cite);
        } else {
          const q = document.createElement('p');
          q.append(...[...p.childNodes].map((n) => n.cloneNode(true)));
          bq.append(q);
        }
      });
      left.prepend(bq);
      return;
    }

    if (hasHeading) {
      // featured card
      const card = document.createElement('article');
      card.className = 'card';
      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'card-media';
      mediaDiv.append(media);
      const body = document.createElement('div');
      body.className = 'card-body';
      const title = hasHeading;
      title.classList.add('title');
      body.append(title);
      [...row.querySelectorAll('p')].forEach((p) => {
        const a = p.querySelector('a');
        if (a && p.textContent.trim() === a.textContent.trim()) {
          a.classList.add('card-link');
          body.append(a);
        } else if (p.textContent.trim()) {
          p.classList.add('byline');
          body.append(p);
        }
      });
      card.append(mediaDiv, body);
      left.append(card);
      return;
    }

    // list row
    const a = rowLink(cells);
    if (!a) return;
    const li = document.createElement('li');
    const item = document.createElement('a');
    item.href = a.getAttribute('href');
    item.append(media);
    const text = document.createElement('span');
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = a.textContent.trim();
    text.append(title);
    const bylineP = [...row.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
    if (bylineP) {
      const byline = document.createElement('span');
      byline.className = 'byline';
      byline.textContent = bylineP.textContent.trim();
      text.append(byline);
    }
    item.append(text);
    li.append(item);
    list.append(li);
  });

  const grid = document.createElement('div');
  grid.className = 'insights-grid';
  grid.append(left);
  if (list.children.length) grid.append(list);
  block.replaceChildren(grid);
}
