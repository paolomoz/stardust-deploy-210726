/**
 * partner-strip — centered partner logo row on the lavender veil + "View all
 * Partners" foot text link. Reconstructive tier (#95). Schema:
 * stardust/eds-schema/index.json § partner-strip.
 *
 * Authoring: ONE ROW PER PARTNER LOGO — cell holds the authored
 * content.da.live <img> with the partner name as alt (editorial images, D13).
 * A trailing row whose cell holds ONLY a link is the foot.
 */

function arrowize(a) {
  if (a.querySelector('.arrow')) return;
  if (!/→\s*$/.test(a.textContent)) return;
  const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
  let last = null;
  while (walker.nextNode()) last = walker.currentNode;
  if (!last) return;
  last.textContent = last.textContent.replace(/\s*→\s*$/, '');
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = '→';
  a.append(' ', arrow);
}

export default function decorate(block) {
  const rowEl = document.createElement('div');
  rowEl.className = 'partner-row';
  let foot = null;

  [...block.children].forEach((row) => {
    const media = row.querySelector('picture, img');
    if (media) {
      rowEl.append(media.closest('picture') || media);
      return;
    }
    const link = row.querySelector('a');
    if (link) {
      foot = document.createElement('p');
      foot.className = 'partner-foot';
      link.classList.add('text-link');
      arrowize(link);
      foot.append(link);
    }
  });

  block.replaceChildren(rowEl);
  if (foot) block.append(foot);
}
