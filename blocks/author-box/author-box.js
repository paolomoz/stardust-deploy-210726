/**
 * author-box — article attribution card (logo + author name + bio).
 * Schema: stardust/eds-schema/cority-blog.json (section: article / author-box)
 * Decode tier: reconstructive (2-cell card → grid).
 *
 * Authoring rows (one row, two cells):
 *   cell 1: <picture>/<img> — the author/brand logo (editorial, content.da.live)
 *   cell 2: <p><strong>Name</strong></p> then <p>bio…</p>
 * Media is matched with `picture, img` and classified by content (not index),
 * so an image-less authoring shape still renders the text (#53/#72).
 */

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = block.querySelector('picture, img');
  const textCell = cells.find((c) => !c.querySelector('picture, img'))
    || cells[cells.length - 1];

  const inner = document.createElement('div');
  inner.className = 'author-inner';

  if (media) {
    const logo = document.createElement('div');
    logo.className = 'author-logo';
    logo.append(media.closest('picture') || media);
    inner.append(logo);
  }

  const text = document.createElement('div');
  text.className = 'author-text';
  if (textCell) {
    [...textCell.childNodes].forEach((n) => text.append(n.cloneNode(true)));
  }
  inner.append(text);

  block.replaceChildren(inner);
}
