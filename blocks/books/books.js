/**
 * books — book-cover rail (prototype section.books).
 * Schema: stardust/eds-schema/index.json → section "books".
 *
 * Authoring: one row per book, one cell holding the cover <img> (alt carries
 * the "Book cover: …" description, D13). Decode collects every authored
 * picture/img regardless of row/cell shape (#52/#72).
 */
export default function decorate(block) {
  const covers = [...block.querySelectorAll('picture, img')]
    .filter((el) => !(el.matches('img') && el.closest('picture')));
  const rail = document.createElement('div');
  rail.className = 'books-rail';
  covers.forEach((cover) => {
    const fig = document.createElement('figure');
    fig.append(cover);
    rail.append(fig);
  });
  block.replaceChildren(rail);
}
