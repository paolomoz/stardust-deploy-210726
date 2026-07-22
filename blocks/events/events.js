/**
 * events — record-sheet ledger of upcoming courses/webinars with tabular dates
 * (index-B prototype, the signature moment). Reconstructive (#95).
 * Schema: stardust/eds-schema/index.json § events.
 *
 * Authoring: the section head (h2 + lede) and the trailing "All upcoming
 * events" link are DEFAULT CONTENT around the block, styled in place via
 * .events-container. Block rows: one per event — cells:
 *   date string ("Jul 14, 2026 - 9:00 am") | <h3> title | <em><a> Sign up CTA
 * The block splits the date at the first ", " into the stacked dd/dm
 * presentation (aria-hidden) and keeps the verbatim string for assistive tech.
 * Column headers ("Date" / "Course or webinar") are structural chrome the
 * block renders itself.
 */

function buildDateCell(text) {
  const cell = document.createElement('div');
  cell.className = 'sheet-date';
  const srOnly = document.createElement('span');
  srOnly.className = 'sr-only';
  srOnly.textContent = text;
  cell.append(srOnly);
  const comma = text.indexOf(', ');
  const dd = comma >= 0 ? text.slice(0, comma) : text;
  const dm = comma >= 0 ? text.slice(comma + 2) : '';
  const ddEl = document.createElement('span');
  ddEl.className = 'dd';
  ddEl.setAttribute('aria-hidden', 'true');
  ddEl.textContent = dd;
  cell.append(ddEl);
  if (dm) {
    const dmEl = document.createElement('span');
    dmEl.className = 'dm';
    dmEl.setAttribute('aria-hidden', 'true');
    dmEl.textContent = dm;
    cell.append(dmEl);
  }
  return cell;
}

export default async function decorate(block) {
  const rows = [...block.children];

  const sheet = document.createElement('div');
  sheet.className = 'sheet';

  // column-header chrome (hidden <=800px, like the prototype)
  const head = document.createElement('div');
  head.className = 'sheet-head';
  const hDate = document.createElement('span');
  hDate.className = 'meta-label sh-date';
  hDate.textContent = 'Date';
  const hTitle = document.createElement('span');
  hTitle.className = 'meta-label';
  hTitle.textContent = 'Course or webinar';
  const hEmpty = document.createElement('span');
  hEmpty.className = 'sh-empty';
  head.append(hDate, hTitle, hEmpty);
  sheet.append(head);

  const list = document.createElement('ul');
  list.className = 'sheet-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    // classify cells by content, not index (#48)
    let dateText = null;
    let title = null;
    let subtitle = null;
    let cta = null;
    cells.forEach((cell) => {
      const h = cell.querySelector('h3, h4, h5');
      const a = cell.querySelector('a');
      if (h && !title) {
        title = h;
        // a trailing paragraph in the title cell is the inline subtitle
        // (e.g. a localized second line — renders inside the heading)
        const extra = [...cell.children].find((el) => el !== h && !el.querySelector('a') && el.textContent.trim());
        if (extra) subtitle = extra.textContent.trim();
        return;
      }
      if (a && !cta) { cta = a; return; }
      const t = cell.textContent.trim();
      if (t && !dateText) dateText = t;
    });
    if (!title && !dateText && !cta) return;

    const li = document.createElement('li');
    const sheetRow = document.createElement('div');
    sheetRow.className = 'sheet-row';
    sheetRow.append(buildDateCell(dateText || ''));
    if (title) {
      const h3 = document.createElement('h3');
      h3.append(...title.childNodes);
      if (subtitle) {
        const sub = document.createElement('span');
        sub.className = 'sheet-sub';
        sub.textContent = ` ${subtitle}`;
        h3.append(sub);
      }
      sheetRow.append(h3);
    }
    if (cta) sheetRow.append(cta);
    li.append(sheetRow);
    list.append(li);
  });

  sheet.append(list);
  block.replaceChildren(sheet);
}
