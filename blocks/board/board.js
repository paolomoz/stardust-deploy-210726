/**
 * board — industries index board (audience routing). Schema → industries. Tier: reconstructive.
 * Authoring:
 *   row 1: <h2> (section head)
 *   rows 2..N: 2 cells — image | <a href>Industry name</a>
 * The trailing ➜ glyph is block-owned presentation.
 */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const ol = document.createElement('ol');
  const rows = [...block.children];

  rows.forEach((r) => {
    const h2 = r.querySelector('h2');
    const link = r.querySelector('a');
    const media = r.querySelector('picture, img');
    if (h2 && !link) { wrap.append(h2); return; }
    if (!link) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    if (media) a.append(media);
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = link.textContent.trim();
    const go = document.createElement('span');
    go.className = 'go';
    go.setAttribute('aria-hidden', 'true');
    go.textContent = '➜';
    a.append(name, go);
    li.append(a);
    ol.append(li);
  });

  wrap.append(ol);
  block.replaceChildren(wrap);
}
