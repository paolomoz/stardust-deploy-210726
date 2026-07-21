/**
 * accordion — Block Collection accordion (D11): one row per Q/A pair
 * (question cell + answer cell), rendered as native <details>/<summary>
 * (collapsed by default, per the prototype). Reconstructive tier (#95).
 * Schema: stardust/eds-schema/index.json § faq. Section head is DEFAULT
 * CONTENT before the block (D1).
 *
 * Authoring rows:
 *   - Q/A row: cell 1 = question text; cell 2 = answer (paragraphs, lists,
 *     inline links — links inside answers are text links, not buttons)
 *   - a trailing single-cell row holding only a CTA (<em><a>View all FAQs</a></em>
 *     → a.button.secondary, the prototype's ghost button) is the section foot
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
  const list = document.createElement('div');
  list.className = 'faq-list';
  let foot = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    if (cells.length >= 2) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = cells[0].textContent.trim();
      details.append(summary);
      const answer = document.createElement('div');
      answer.className = 'faq-answer';
      answer.append(...cells[1].childNodes);
      answer.querySelectorAll('a:not(.button)').forEach((a) => {
        a.classList.add('text-link');
        arrowize(a);
      });
      details.append(answer);
      list.append(details);
      return;
    }

    // single-cell row = section foot CTA
    const link = cells[0] && cells[0].querySelector('a');
    if (link) {
      foot = document.createElement('p');
      foot.className = 'faq-foot';
      const wrapper = link.closest('p.button-wrapper');
      foot.append(wrapper || link);
    }
  });

  block.replaceChildren(list);
  if (foot) block.append(foot);
}
