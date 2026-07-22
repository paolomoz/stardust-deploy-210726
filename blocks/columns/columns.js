/**
 * columns — Block Collection columns (one row, N cells), variants `event`
 * (split-media promo, prototype section.event) and `about` (navy 2-col prose
 * band, prototype section.about).
 * Schema: stardust/eds-schema/index.json → sections "event-promo" / "about".
 *
 * Authoring: one row, up to 4 cells (D10). A cell whose only content is an
 * image becomes an image column. A kicker authored as <p><strong>…</strong></p>
 * (leading preserved tag, no link) is re-classed as .label (#39 — spans/classes
 * do not survive DA; the leading tag does).
 */
export default function decorate(block) {
  const cols = [...(block.firstElementChild?.children || [])];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic && col.textContent.trim() === '') {
        col.classList.add('columns-img-col');
      }
      // kicker: <p><strong>text</strong></p> (no link) → .label
      col.querySelectorAll('p > strong:only-child').forEach((s) => {
        if (s.querySelector('a')) return;
        const p = s.closest('p');
        p.classList.add('label');
        p.replaceChildren(...s.childNodes);
      });
    });
  });
}
