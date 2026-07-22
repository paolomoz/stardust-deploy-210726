/**
 * hero — full-bleed navy-scrim hero (prototype section.hero).
 * Schema: stardust/eds-schema/index.json → section "hero".
 *
 * Authoring rows (tolerates rich multi-row AND DA-flattened single-cell shapes):
 *   - optional <img>/<picture> — editorial background image (rides behind the scrim)
 *   - short eyebrow line (link-free, BEFORE the heading)
 *   - the page's single <h1>
 *   - lede paragraph(s) (link-free, AFTER the heading)
 *   - CTA paragraphs — primary wrapped <strong><a> (decorateButtons already
 *     classed it a.button.primary before this runs); a plain <a> is a text
 *     link, NOT a button (do not emphasis-wrap it)
 *
 * Decode: query/role-based (#42), cell cascade collector (#62); eyebrow vs
 * lede disambiguated by position relative to the heading (#51).
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  const mediaOf = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
  const media = nodes.map(mediaOf).find(Boolean);
  const headingSrc = nodes.find((n) => n.matches('h1, h2, h3'));

  // heading renders as the page's single <h1>; unwrap an inner heading (#55)
  const h1 = document.createElement('h1');
  if (headingSrc) {
    const inner = headingSrc.matches('h1, h2, h3') ? headingSrc : (headingSrc.querySelector('h1, h2, h3') || headingSrc);
    h1.append(...[...inner.childNodes].map((n) => n.cloneNode(true)));
  }

  const isHeadingNode = (n) => !!headingSrc && (n === headingSrc || n.contains(headingSrc));
  const textNodes = nodes.filter((n) => !isHeadingNode(n) && !mediaOf(n) && n.textContent.trim());
  const hasLink = (n) => !!n.querySelector('a');
  const before = (n) => !!(headingSrc
    // eslint-disable-next-line no-bitwise
    && (headingSrc.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING));

  const eyebrows = textNodes.filter((n) => !hasLink(n) && before(n));
  const ledes = textNodes.filter((n) => !hasLink(n) && !before(n));
  const ctas = textNodes.filter(hasLink);

  const content = document.createElement('div');
  content.className = 'hero-content';
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  content.append(inner);

  eyebrows.forEach((n) => {
    const label = document.createElement('p');
    label.className = 'label';
    label.append(...[...n.childNodes].map((c) => c.cloneNode(true)));
    inner.append(label);
  });
  if (headingSrc) inner.append(h1);
  ledes.forEach((n) => inner.append(n.cloneNode(true)));

  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    ctas.forEach((n) => {
      const clone = n.cloneNode(true);
      clone.querySelectorAll('a:not(.button)').forEach((a) => a.classList.add('text-link'));
      actions.append(clone);
    });
    inner.append(actions);
  }

  const children = [];
  if (media) {
    const bg = document.createElement('div');
    bg.className = 'hero-media';
    bg.setAttribute('aria-hidden', 'true');
    const clone = media.cloneNode(true);
    // LCP: the empty metadata-first section defeats waitForFirstImage (#100)
    const img = clone.matches('img') ? clone : clone.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    }
    bg.append(clone);
    children.push(bg);
  }
  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  children.push(scrim, content);

  block.replaceChildren(...children);
}
