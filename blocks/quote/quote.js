/**
 * quote — customer testimonial (collection `quote` model: quote row +
 * attribution row, extended with a third review-badge row).
 * Schema: stardust/eds-schema/index.json § testimonial. Decode tier: reconstructive.
 *
 * Authoring rows:
 *   1. quote paragraph (plain text, quotation marks authored)
 *   2. attribution — avatar image + a <p> leading with <strong>Name</strong>
 *      followed by the role text (leading-tag sub-field rule, no delimiters)
 *   3. (optional) review badge — linked image (G2)
 */

export default function decorate(block) {
  const rows = [...block.children];
  const inner = document.createElement('div');
  inner.className = 'container testimonial-inner';

  const quoteRow = rows.find((r) => !r.querySelector('picture, img') && r.textContent.trim());
  const attribRow = rows.find((r) => r.querySelector('picture, img') && !r.querySelector('a'));
  const badgeRow = rows.find((r) => r.querySelector('a picture, a img'));

  if (quoteRow) {
    const bq = document.createElement('blockquote');
    const p = quoteRow.querySelector('p') || quoteRow.firstElementChild;
    bq.append(p || document.createTextNode(quoteRow.textContent.trim()));
    inner.append(bq);
  }

  if (attribRow) {
    const attrib = document.createElement('div');
    attrib.className = 'testimonial-attrib';
    const pic = attribRow.querySelector('picture, img');
    if (pic) attrib.append(pic.closest('picture') || pic);
    const cite = document.createElement('cite');
    const name = attribRow.querySelector('strong');
    let role = '';
    if (name) {
      const holder = name.closest('p') || attribRow;
      role = holder.textContent.replace(name.textContent, '').trim();
      cite.append(name.textContent.trim());
    } else {
      /* fallback: "Name, role" single line */
      const text = attribRow.textContent.trim();
      const [n, ...rest] = text.split(',');
      cite.append(n.trim());
      role = rest.join(',').trim();
    }
    if (role) {
      const span = document.createElement('span');
      span.textContent = role;
      cite.append(' ', span);
    }
    attrib.append(cite);
    inner.append(attrib);
  }

  if (badgeRow) {
    const wrap = document.createElement('div');
    const a = badgeRow.querySelector('a');
    a.className = 'testimonial-g2';
    wrap.append(a);
    inner.append(wrap);
  }

  block.replaceChildren(inner);
}
