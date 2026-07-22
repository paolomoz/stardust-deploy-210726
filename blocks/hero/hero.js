/**
 * hero — full-bleed services-commitment hero (template-slotted, #95).
 * Schema: stardust/eds-schema/home.json → section "hero".
 *
 * Authoring rows (queried by role, never by index — #42):
 *   - optional <picture>/<img>: the editorial background image
 *   - eyebrow: short link-free paragraph BEFORE the <h1>
 *   - <h1>: the page headline; <em> = accent (yellow) line
 *   - supporting: link-free paragraph AFTER the <h1>
 *     (<em> = accent, <strong> = italic run — see block CSS)
 *   - CTA: paragraph-wrapped <strong><a> → a.button.primary
 *     (decorateButtons already classed it; the block only clones)
 */
export default async function decorate(block) {
  const heading = block.querySelector('h1, h2');
  const media = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctaPs = ps.filter((p) => p.querySelector('a'));
  const textPs = ps.filter((p) => !p.querySelector('a') && p.textContent.trim());

  // eyebrow precedes the heading; supporting copy follows it (#51)
  let eyebrow = null;
  let supporting = null;
  textPs.forEach((p) => {
    // eslint-disable-next-line no-bitwise
    const precedes = heading && (heading.compareDocumentPosition(p)
      & Node.DOCUMENT_POSITION_PRECEDING);
    if (precedes) {
      if (!eyebrow) eyebrow = p;
    } else if (!supporting) {
      supporting = p;
    }
  });

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  if (eyebrow) {
    eyebrow.classList.add('hero-eyebrow');
    inner.append(eyebrow);
  }
  if (heading) {
    heading.classList.add('hero-headline');
    // each headline line renders as its own block-level line (the prototype's
    // two-tone treatment): <em> = accent line; bare text wraps in a line span
    [...heading.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const line = document.createElement('span');
        line.className = 'hero-headline-line';
        n.replaceWith(line);
        line.append(n);
      }
    });
    inner.append(heading);
  }
  if (supporting) {
    supporting.classList.add('hero-supporting');
    inner.append(supporting);
  }
  if (ctaPs.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    actions.append(...ctaPs);
    inner.append(actions);
  }

  const frag = document.createDocumentFragment();
  if (media) {
    const bg = document.createElement('div');
    bg.className = 'hero-bg';
    bg.setAttribute('aria-hidden', 'true');
    const pic = media.closest('picture') || media;
    bg.append(pic);
    // LCP: the empty metadata-first section defeats waitForFirstImage (#100)
    const img = bg.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    frag.append(bg);
  }
  frag.append(inner);
  block.replaceChildren(frag);
}
