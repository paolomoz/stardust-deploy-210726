/**
 * hero — FlexiLoans split 7/5 hero: eyebrow, single page <h1>, lede, CTA pair,
 * figure image on the plum→navy gradient. Template-slotted (#95) — fixed
 * composition; authored values are slotted into the prototype's DOM by role.
 * Schema: stardust/eds-schema/index.json § hero.
 *
 * Authoring rows (order-tolerant, decoded by QUERY not index — #42/#51):
 *   - eyebrow: short link-free paragraph BEFORE the heading
 *   - heading: <h1> (the page's single h1)
 *   - lede: link-free paragraph AFTER the heading
 *   - CTAs: paragraph-wrapped links — <strong><a> primary, <em><a> secondary
 *     (decorateButtons has already classed them a.button.primary/.secondary)
 *   - figure: <picture>/<img> (authored content.da.live URL; optional)
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture, img');
  // LCP image: the page's first section is the metadata-only (empty) one, so the
  // runtime's waitForFirstImage never eager-izes this img — do it here, and let
  // the figure's reserved min-height (hero.css) hold the box until it loads.
  const lcpImg = media && (media.matches('img') ? media : media.querySelector('img'));
  if (lcpImg) { lcpImg.setAttribute('loading', 'eager'); lcpImg.setAttribute('fetchpriority', 'high'); }
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.closest('picture'));
  const ctaParagraphs = paragraphs.filter((p) => p.querySelector('a'));
  const textParagraphs = paragraphs.filter((p) => !p.querySelector('a') && p.textContent.trim());

  const before = (el) => heading
    // eslint-disable-next-line no-bitwise
    && !!(heading.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
  const eyebrow = textParagraphs.find((p) => before(p)) || null;
  const lede = textParagraphs.find((p) => !before(p) && p !== eyebrow) || null;

  const grid = document.createElement('div');
  grid.className = 'hero-grid';

  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  if (eyebrow) {
    eyebrow.className = 'hero-eyebrow';
    copy.append(eyebrow);
  }
  if (heading) copy.append(heading);
  if (lede) {
    lede.className = 'hero-lede';
    copy.append(lede);
  }
  if (ctaParagraphs.length) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-ctas';
    ctaParagraphs.forEach((p) => ctas.append(p));
    copy.append(ctas);
  }
  grid.append(copy);

  if (media) {
    const figure = document.createElement('div');
    figure.className = 'hero-figure';
    figure.append(media.closest('picture') || media);
    grid.append(figure);
  }

  block.replaceChildren(grid);
}
