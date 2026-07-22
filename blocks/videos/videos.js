/**
 * videos — video facade grid (prototype section.videos "Featured Videos").
 * Schema: stardust/eds-schema/index.json → section "featured-videos".
 *
 * Authoring: one row per video, one cell holding:
 *   <h3> title, description <p>, and a watch link <p><a href="player URL">…</a></p>
 * (the player link is consumed into the facade — a link, not a button; the
 * lone-URL auto-block rule D1 applies only to default content, not here where
 * each unit carries structured fields).
 * The facade navigates to the player URL, exactly like the prototype.
 */

const PLAY_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';

function buildFacade(href, label) {
  const facade = document.createElement('a');
  facade.className = 'facade';
  facade.href = href;
  facade.setAttribute('aria-label', `Play video: ${label}`);
  const play = document.createElement('span');
  play.className = 'facade-play';
  play.setAttribute('aria-hidden', 'true');
  play.innerHTML = PLAY_SVG;
  facade.append(play);
  return facade;
}

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'videos-grid';

  [...block.children].forEach((row) => {
    const title = row.querySelector('h3, h4');
    const link = [...row.querySelectorAll('a')].pop();
    if (!link) return;
    const fig = document.createElement('figure');
    fig.append(buildFacade(link.getAttribute('href'), title ? title.textContent.trim() : link.textContent.trim()));
    const cap = document.createElement('figcaption');
    if (title) {
      title.classList.add('title');
      cap.append(title);
    }
    [...row.querySelectorAll('p')].forEach((p) => {
      if (!p.querySelector('a') && p.textContent.trim()) cap.append(p);
    });
    fig.append(cap);
    grid.append(fig);
  });

  block.replaceChildren(grid);
}
