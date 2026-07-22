/**
 * video — auto-block built by buildVideoAutoBlocks() in scripts/scripts.js
 * (D1: a Vimeo/YouTube URL alone on its line in default content is never
 * authored as a block table). Prototype: section.featured-video facade.
 *
 * Input: one cell holding the original <a href="player URL">Title</a>.
 * Renders the prototype's facade (gradient panel + play glyph + title),
 * navigating to the player URL like the prototype does.
 */

const PLAY_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const title = link.textContent.trim();

  const facade = document.createElement('a');
  facade.className = 'facade';
  facade.href = link.getAttribute('href');
  facade.setAttribute('aria-label', `Play video: ${title}`);

  const play = document.createElement('span');
  play.className = 'facade-play';
  play.setAttribute('aria-hidden', 'true');
  play.innerHTML = PLAY_SVG;

  const label = document.createElement('span');
  label.className = 'facade-title';
  label.textContent = title;

  facade.append(play, label);
  block.replaceChildren(facade);
}
