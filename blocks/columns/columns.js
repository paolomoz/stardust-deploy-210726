/**
 * columns — collection `columns` model: one row, one cell per column.
 * Variants: `open-startups` (eyebrow + copy | rounded image),
 * `closing` (copy + CTA | screenshot card on periwinkle-tint gradient panel).
 * Schema: stardust/eds-schema/index.json § open-startups / closing-cta.
 * Decode tier: reconstructive (collection shape).
 */

export default function decorate(block) {
  const cols = [...(block.firstElementChild?.children || [])];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('container');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic && col.children.length === 1 && !col.textContent.trim()) {
        col.classList.add('columns-img-col');
        const img = pic.matches('img') ? pic : pic.querySelector('img');
        if (img) img.classList.add('split-media');
        return;
      }
      col.classList.add('columns-copy-col');
      /* eyebrow: short link-free <p> BEFORE the heading (#76 buffer rule) */
      const heading = col.querySelector('h1, h2, h3');
      if (heading) {
        let prev = heading.previousElementSibling;
        while (prev) {
          if (prev.matches('p') && !prev.querySelector('a, picture, img') && prev.textContent.trim()) {
            prev.classList.add('eyebrow');
          }
          prev = prev.previousElementSibling;
        }
      }
    });
  });
}
