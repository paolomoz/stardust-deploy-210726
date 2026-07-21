/**
 * why-flexiloans — composite trust band on the lavender veil: 4 icon chip rows,
 * full-width campaign figure, and the asymmetric stat ledger (one display-scale
 * lead figure + three ruled secondaries). Reconstructive tier (#95), rows
 * classified by content (#48). Schema: stardust/eds-schema/index.json
 * § why-flexiloans. The section head (h2 + intro) is DEFAULT CONTENT before
 * this block (D1).
 *
 * Authoring rows (one row per unit; parts as flat siblings in one cell):
 *   - chip row:   <p>:icon-name:</p> <h3>Title</h3> <p>description</p>
 *   - figure row: <picture>/<img> (campaign visual)
 *   - stat row:   <p>number</p> <p>label</p>  (first stat row = the lead figure)
 */

/* unwrap the runtime's wrapTextNodes artifact: decorateBlock wraps a cell whose
   FIRST element is a bare <img>/<span>/... in ONE <p> holding the whole cell —
   detect a <p> with block-level element children and expand it (runtime contract) */
function expandWrapper(el, out) {
  const isWrapper = el.matches('p')
    && [...el.children].some((c) => c.matches('img, picture, h1, h2, h3, h4, h5, h6, p, ul, ol'));
  if (!isWrapper) {
    out.push(el);
    return;
  }
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) out.push(n);
    else if (n.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = n.textContent.trim();
      out.push(p);
    }
  });
}

function collectNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) kids.forEach((k) => expandWrapper(k, out));
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

function decodeIcon(el) {
  const span = el.matches('span.icon') ? el : el.querySelector('span.icon');
  if (span) return span;
  const m = el.textContent.trim().match(/^:([a-z0-9-]+):$/);
  if (!m) return null;
  const s = document.createElement('span');
  s.className = `icon icon-${m[1]}`;
  const img = document.createElement('img');
  img.src = `/icons/${m[1]}.svg`;
  img.alt = '';
  img.loading = 'lazy';
  s.append(img);
  return s;
}

export default function decorate(block) {
  const chips = document.createElement('div');
  chips.className = 'chips-grid';
  let figure = null;
  const stats = [];

  [...block.children].forEach((row) => {
    const nodes = collectNodes(row);
    if (!nodes.length) return;
    const media = nodes.find((el) => el.matches('picture, img') || el.querySelector('picture, img'));
    const heading = nodes.find((el) => el.matches('h3, h4'));

    if (heading) {
      // chip row
      const chip = document.createElement('div');
      chip.className = 'chip-row';
      const iconEl = nodes.find((el) => decodeIcon(el) && el !== heading);
      const holder = document.createElement('span');
      holder.className = 'icon-chip on-tint';
      holder.setAttribute('aria-hidden', 'true');
      if (iconEl) holder.append(decodeIcon(iconEl));
      chip.append(holder);
      const body = document.createElement('div');
      body.append(heading);
      nodes.filter((el) => el.matches('p') && !decodeIcon(el)).forEach((p) => body.append(p));
      chip.append(body);
      chips.append(chip);
      return;
    }

    if (media) {
      figure = document.createElement('figure');
      figure.className = 'campaign-figure';
      const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
      figure.append(pic.closest('picture') || pic);
      return;
    }

    // stat row: number paragraph + label paragraph
    const ps = nodes.filter((el) => el.matches('p') && el.textContent.trim());
    if (ps.length >= 2 && /^[₹0-9]/.test(ps[0].textContent.trim())) {
      stats.push({ num: ps[0], label: ps[1] });
    }
  });

  const out = [];
  if (chips.children.length) out.push(chips);
  if (figure) out.push(figure);

  if (stats.length) {
    const band = document.createElement('div');
    band.className = 'stat-band';
    const [lead, ...rest] = stats;
    const leadDiv = document.createElement('div');
    leadDiv.className = 'stat-lead';
    lead.num.className = 'num';
    lead.label.className = 'label';
    leadDiv.append(lead.num, lead.label);
    band.append(leadDiv);
    if (rest.length) {
      const restDiv = document.createElement('div');
      restDiv.className = 'stat-rest';
      rest.forEach(({ num, label }) => {
        const stat = document.createElement('div');
        stat.className = 'stat';
        num.className = 'num';
        label.className = 'label';
        stat.append(num, label);
        restDiv.append(stat);
      });
      band.append(restDiv);
    }
    out.push(band);
  }

  block.replaceChildren(...out);
}
