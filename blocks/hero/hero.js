/**
 * hero — cinematic full-bleed founding hero (prototype section `founding-hero`).
 * Decode tier: template-slotted (#95) — the block builds the prototype section's
 * DOM and slots the authored values in by role.
 * Schema: stardust/eds-schema/home.json → section "founding-hero".
 *
 * Authoring rows (simple shape, one property per row; decode QUERIES roles,
 * never hard row indexes — tolerates the DA-flattened single-cell shape too):
 *   1. background image — <picture>/<img> (editorial, content.da.live URL);
 *      optional: ink-ground CSS fallback when absent
 *   2. monogram — a short year mark ("'96")
 *   3. monogram meta — one short line under the goldspike rule
 *   4. eyebrow <p> + the page's single <h1> + lede <p>
 *   5. meta stats — one <p> per stat, label led by <strong>
 *      ("<strong>EST.</strong> 1996")
 *
 * The "Drink in" scroll cue is presentation (aria-hidden in the prototype) and
 * lives in the template, not in authored content (deliberate — conversion log).
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;

  // media: anywhere in the block (#72 — picture OR bare img)
  const media = block.querySelector('picture, img');

  // the copy cell holds the heading; read roles by query (#42)
  const heading = block.querySelector('h1, h2, h3');
  const copyCell = heading ? heading.closest('div') : null;
  let eyebrow = null;
  let lede = null;
  if (heading && copyCell) {
    const ps = [...copyCell.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
    // canonical lead order: eyebrow BEFORE heading, lede AFTER (#51)
    /* eslint-disable no-bitwise */
    eyebrow = ps.find(
      (p) => p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
    ) || null;
    lede = ps.find((p) => p !== eyebrow
      && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING)) || null;
    /* eslint-enable no-bitwise */
  }

  // classify remaining text cells by content, not index (#48): stats cell has
  // <strong>-led runs; monogram is the very short year mark; meta is what's left
  const rest = cells.filter((c) => c !== copyCell && !c.querySelector('picture, img'));
  const statsCell = rest.find((c) => c.querySelector('strong') || /EST\.?\s/i.test(c.textContent)) || null;
  const textCells = rest.filter((c) => c !== statsCell && c.textContent.trim());
  const monogramCell = textCells.find((c) => c.textContent.trim().length <= 5) || null;
  const metaCell = textCells.find((c) => c !== monogramCell) || null;

  // --- build the prototype's DOM (template-slotted) ---
  const wrap = document.createElement('div');
  wrap.className = 'ds-hero-cinematic';

  const bg = document.createElement('div');
  bg.className = 'ds-hero-bg';
  bg.setAttribute('aria-hidden', 'true');
  if (media) bg.append(media.cloneNode(true));
  wrap.append(bg);

  const inner = document.createElement('div');
  inner.className = 'ds-hero-inner';

  const bugCol = document.createElement('div');
  bugCol.className = 'ds-hero-bug-col';
  if (monogramCell) {
    const bug = document.createElement('p');
    bug.className = 'ds-bug';
    bug.setAttribute('aria-hidden', 'true');
    bug.textContent = monogramCell.textContent.trim();
    bugCol.append(bug);
  }
  const rule = document.createElement('div');
  rule.className = 'ds-bug-rule';
  rule.setAttribute('aria-hidden', 'true');
  bugCol.append(rule);
  if (metaCell) {
    const bugMeta = document.createElement('p');
    bugMeta.className = 'ds-bug-meta';
    bugMeta.textContent = metaCell.textContent.trim();
    bugCol.append(bugMeta);
  }
  inner.append(bugCol);

  const copy = document.createElement('div');
  copy.className = 'ds-hero-copy';
  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'ds-hero-eyebrow';
    eb.append(...[...eyebrow.childNodes].map((n) => n.cloneNode(true)));
    copy.append(eb);
  }
  if (heading) {
    // the page's single <h1>; unwrap any inner heading when cloning (#55)
    const h1 = document.createElement('h1');
    const src = heading.querySelector('h1, h2, h3, h4, h5, h6') || heading;
    h1.append(...[...src.childNodes].map((n) => n.cloneNode(true)));
    copy.append(h1);
  }
  if (lede) {
    const ld = document.createElement('p');
    ld.className = 'ds-hero-lede';
    ld.append(...[...lede.childNodes].map((n) => n.cloneNode(true)));
    copy.append(ld);
  }
  if (statsCell) {
    const meta = document.createElement('div');
    meta.className = 'ds-hero-meta';
    const stats = [...statsCell.querySelectorAll('p')];
    (stats.length ? stats : [statsCell]).forEach((p) => {
      if (!p.textContent.trim()) return;
      const span = document.createElement('span');
      span.append(...[...p.childNodes].map((n) => n.cloneNode(true)));
      meta.append(span);
    });
    copy.append(meta);
  }
  inner.append(copy);
  wrap.append(inner);

  const scroll = document.createElement('div');
  scroll.className = 'ds-hero-scroll';
  scroll.setAttribute('aria-hidden', 'true');
  scroll.textContent = 'Drink in';
  wrap.append(scroll);

  block.replaceChildren(wrap);
}
