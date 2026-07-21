/**
 * taprooms — photographic diptych of taproom panels (prototype section
 * `taproom-pair`). Decode tier: reconstructive (authors may add/edit panels).
 * Schema: stardust/eds-schema/home.json → section "taproom-pair".
 *
 * Authoring shape (container model — one row per taproom, two cells):
 *   cell 1: <picture>/<img> (editorial background, content.da.live URL)
 *   cell 2: <p>Heber Valley</p>                        — eyebrow (place name)
 *           <h3><a href="/taprooms/#heber-valley">The Original</a></h3>
 *           <p>Est. 1996</p>                           — est line
 *           <p>Six taps, a wood stove, …</p>           — blurb
 *           <p>Visit Heber Valley</p>                  — panel CTA label
 * The whole panel is one anchor (from the h3's link) — a whole-card anchor,
 * NOT a button (plain <a>, no emphasis wrap). The section head is DEFAULT
 * CONTENT before the block (D1), styled in place via .taprooms-container.
 *
 * Flattened fallback (#52): a single row/cell with multiple h3s segments on
 * the heading boundary, buffering pre-heading text as the eyebrow (#76).
 */

function slugify(text) {
  return text.toLowerCase().trim().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** classify one panel's sibling nodes (#48 — by content, buffered eyebrow #76) */
function parsePanel(nodes) {
  const panel = {
    media: null, eyebrow: null, title: null, href: null, est: null, blurb: null, cta: null,
  };
  let seenHeading = false;
  const after = [];
  nodes.forEach((el) => {
    const isMedia = el.matches && (el.matches('picture, img') || el.querySelector('picture, img'));
    if (isMedia && !/^h[1-6]$/i.test(el.tagName)) {
      if (!panel.media) panel.media = el.querySelector('picture, img') || el;
      if (el.textContent.trim() === '') return;
    }
    const text = el.textContent.trim();
    if (!text) return;
    if (/^h[1-6]$/i.test(el.tagName)) {
      const a = el.querySelector('a[href]');
      panel.title = text;
      if (a) panel.href = a.getAttribute('href');
      seenHeading = true;
      return;
    }
    if (!seenHeading) {
      // pre-heading text buffers as the eyebrow (#76)
      if (!panel.eyebrow) panel.eyebrow = text;
      return;
    }
    if (!panel.est && /^Est\b/i.test(text)) { panel.est = text; return; }
    after.push(text);
  });
  if (after.length) {
    // longest post-heading run = blurb; the remaining short label = CTA
    const blurb = [...after].sort((a, b) => b.length - a.length)[0];
    panel.blurb = blurb;
    panel.cta = after.find((t) => t !== blurb) || null;
  }
  return panel;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const diptych = document.createElement('div');
  diptych.className = 'ds-taprooms-diptych';

  // one row per panel (#63); flattened single-cell fallback (#52)
  let groups = [];
  const panelRows = rows.filter((r) => r.textContent.trim() || r.querySelector('picture, img'));
  if (panelRows.filter((r) => r.querySelector('h3, h4')).length >= 2) {
    groups = panelRows.map((r) => [...r.querySelectorAll(':scope > div')]
      .flatMap((cell) => (cell.children.length ? [...cell.children] : [cell])));
  } else if (rows.length) {
    const cell = rows[0].firstElementChild || rows[0];
    const nodes = [...cell.children];
    const groupsOut = [];
    let current = [];
    nodes.forEach((n) => {
      const isHeading = /^h[1-6]$/i.test(n.tagName);
      if (isHeading && current.some((c) => /^h[1-6]$/i.test(c.tagName))) {
        // new heading, and the open group already has one: the buffered trailing
        // text (next eyebrow) belongs to THIS group (#76) — split before it
        const idx = current.length - 1;
        const tail = (idx >= 0 && !/^h[1-6]$/i.test(current[idx].tagName)
          && current[idx].textContent.trim().length < 40
          && !current.slice(0, idx).every((c) => !/^h[1-6]$/i.test(c.tagName)))
          ? current.splice(idx, 1) : [];
        groupsOut.push(current);
        current = tail;
      }
      current.push(n);
    });
    if (current.length) groupsOut.push(current);
    groups = groupsOut;
  }

  groups.forEach((nodes) => {
    const panel = parsePanel(nodes);
    if (!panel.title) return;
    // the panel is a positioned <div>; the authored <img> bg layer stays a
    // SIBLING of the whole-panel stretched <a>, so the link remains a text
    // link (accessible name = the panel copy, not an image link)
    const panelEl = document.createElement('div');
    panelEl.className = 'ds-tap-panel';
    panelEl.classList.add(`tap-${slugify(panel.eyebrow || panel.title)}`);

    const bg = document.createElement('span');
    bg.className = 'ds-tap-panel-bg';
    bg.setAttribute('aria-hidden', 'true');
    if (panel.media) bg.append(panel.media.cloneNode(true));
    panelEl.append(bg);

    const a = document.createElement('a');
    a.className = 'ds-tap-link';
    if (panel.href) a.href = panel.href;

    const content = document.createElement('div');
    content.className = 'ds-tap-content';
    if (panel.eyebrow) {
      const eb = document.createElement('p');
      eb.className = 'ds-eyebrow';
      eb.textContent = panel.eyebrow;
      content.append(eb, '\n');
    }
    const h3 = document.createElement('h3');
    h3.textContent = panel.title;
    content.append(h3, '\n');
    if (panel.est) {
      const est = document.createElement('p');
      est.className = 'ds-tap-est';
      est.textContent = panel.est;
      content.append(est, '\n');
    }
    if (panel.blurb) {
      const blurb = document.createElement('p');
      blurb.className = 'ds-tap-blurb';
      blurb.textContent = panel.blurb;
      content.append(blurb, '\n');
    }
    if (panel.cta) {
      const cta = document.createElement('span');
      cta.className = 'ds-tap-cta';
      cta.textContent = panel.cta;
      content.append(cta);
    }
    a.append(content);
    panelEl.append(a);
    diptych.append(panelEl);
  });

  block.replaceChildren(diptych);
}
