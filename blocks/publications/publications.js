/**
 * publications — editorial article ledger + subscribe form (anti-template:
 * date+title rows, NOT a card grid).
 * Schema: stardust/eds-schema/index.json § publications.
 * Decode tier: reconstructive rows + slotted form.
 *
 * Authoring:
 *   - The section head (eyebrow "Learn about Business" / h2 / lede) is DEFAULT
 *     CONTENT before the block; it must live INSIDE the pub-head grid next to
 *     the form, so the block REABSORBS it (D1 reabsorb pattern — wrapper is
 *     block.parentElement.previousElementSibling).
 *   - Row 1 (single cell, no link): subscribe-form label text.
 *   - Rows 2..N (two cells): publication date | linked article title.
 * Input placeholder + "Subscribe" button label are chrome copy owned by the
 * block (prototype provenance: direction-authorized-chrome).
 */

function buildForm(labelText) {
  const form = document.createElement('form');
  form.className = 'subscribe-form';
  form.action = '#';
  form.method = 'post';
  const label = document.createElement('label');
  label.className = 'ds-label';
  label.htmlFor = 'subscribe-email';
  label.textContent = labelText;
  const inline = document.createElement('div');
  inline.className = 'inline-form';
  const input = document.createElement('input');
  input.className = 'ds-input';
  input.type = 'email';
  input.id = 'subscribe-email';
  input.name = 'email';
  input.placeholder = 'Enter your email';
  input.autocomplete = 'email';
  input.required = true;
  const button = document.createElement('button');
  button.className = 'button primary';
  button.type = 'submit';
  button.textContent = 'Subscribe';
  inline.append(input, button);
  form.append(label, inline);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const note = document.createElement('p');
    note.className = 'form-note';
    note.setAttribute('role', 'status');
    note.textContent = 'Thanks for subscribing — see you in your inbox.';
    inline.replaceWith(note);
  });
  return form;
}

export default function decorate(block) {
  const rows = [...block.children];

  /* reabsorb the default-content section head into the pub-head grid */
  const copy = document.createElement('div');
  const headWrapper = block.parentElement?.previousElementSibling;
  if (headWrapper && headWrapper.matches('.default-content-wrapper')) {
    const heading = headWrapper.querySelector('h1, h2, h3');
    [...headWrapper.children].forEach((el) => {
      const beforeHeading = heading
        // eslint-disable-next-line no-bitwise
        && (el.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      if (beforeHeading && el.matches('p') && !el.querySelector('a')) {
        el.classList.add('eyebrow'); /* pre-heading short line (#76) */
      } else if (el.matches('p')) {
        el.classList.add('section-lede');
      }
      copy.append(el);
    });
    headWrapper.remove();
  } else {
    /* defensive fallback: leading no-link rows before the label row are the head */
    const headRow = rows.find((r) => r.querySelector('h1, h2, h3'));
    if (headRow) {
      copy.append(...[...headRow.children].flatMap((c) => [...c.children]));
      headRow.remove();
    }
  }

  let labelText = 'Industry insights delivered right to your inbox';
  const ledger = document.createElement('ul');
  ledger.className = 'pub-ledger';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    if (!link) {
      const text = row.textContent.trim();
      if (text) labelText = text;
      return;
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'pub-row';
    a.href = link.href;
    const dateText = (cells.length > 1 ? cells[0].textContent : '').trim();
    if (dateText) {
      const time = document.createElement('time');
      const parsed = new Date(dateText);
      if (!Number.isNaN(parsed.getTime())) {
        time.dateTime = parsed.toISOString().slice(0, 10);
      }
      time.textContent = dateText;
      a.append(time, ' ');
    }
    const title = document.createElement('span');
    title.className = 'pub-title';
    title.textContent = link.textContent.trim();
    a.append(title);
    li.append(a);
    ledger.append(li);
  });

  const head = document.createElement('div');
  head.className = 'pub-head';
  head.append(copy, buildForm(labelText));

  const container = document.createElement('div');
  container.className = 'container';
  container.append(head, ledger);
  block.replaceChildren(container);
}
