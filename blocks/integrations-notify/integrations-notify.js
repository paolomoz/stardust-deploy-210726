/**
 * integrations-notify — integration breadth + notify-me lead capture.
 * Schema: stardust/eds-schema/index.json § integrations-notify.
 * Decode tier: template-slotted (fixed split + form composition; the form is
 * BLOCK-rendered behavior — authored content never carries <script>, #20).
 *
 * Authoring rows:
 *   1. <h2> band title
 *   2. body paragraph
 *   3. form label text ("Get notified on new integrations:")
 *   4..N one row per integration logo (<a><img></a>)
 * Input placeholder + button label are chrome copy owned by the block
 * (prototype provenance: direction-authorized-chrome).
 */

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2, h3');
  const textPs = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a, picture, img') && p.textContent.trim());
  const logoAnchors = [...block.querySelectorAll('a')].filter((a) => a.querySelector('picture, img'));
  const bareLogoRows = rows.filter((r) => r.querySelector('picture, img') && !r.querySelector('a'));

  const body = textPs[0] || null;
  const labelText = textPs[1] ? textPs[1].textContent.trim() : 'Get notified on new integrations:';

  /* split: title | body + form */
  const split = document.createElement('div');
  split.className = 'container split';
  const copy = document.createElement('div');
  copy.className = 'split-copy';
  if (heading) {
    const h2 = document.createElement('h2');
    h2.append(...heading.childNodes);
    copy.append(h2);
  }
  const right = document.createElement('div');
  if (body) right.append(body);

  const form = document.createElement('form');
  form.className = 'notify-form';
  form.action = '#';
  form.method = 'post';
  const label = document.createElement('label');
  label.className = 'ds-label';
  label.htmlFor = 'notify-email';
  label.textContent = labelText;
  const inline = document.createElement('div');
  inline.className = 'inline-form';
  const input = document.createElement('input');
  input.className = 'ds-input';
  input.type = 'email';
  input.id = 'notify-email';
  input.name = 'email';
  input.placeholder = 'Enter your email';
  input.autocomplete = 'email';
  input.required = true;
  const button = document.createElement('button');
  button.className = 'button primary';
  button.type = 'submit';
  button.textContent = 'Notify Me';
  inline.append(input, button);
  form.append(label, inline);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const note = document.createElement('p');
    note.className = 'form-note';
    note.setAttribute('role', 'status');
    note.textContent = 'Thanks — we’ll let you know about new integrations.';
    inline.replaceWith(note);
  });
  right.append(form);
  split.append(copy, right);

  /* logo strip */
  const stripWrap = document.createElement('div');
  stripWrap.className = 'container';
  const ul = document.createElement('ul');
  ul.className = 'logo-strip';
  logoAnchors.forEach((a) => {
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  bareLogoRows.forEach((r) => {
    const pic = r.querySelector('picture, img');
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'logo-cell';
    span.append(pic.closest('picture') || pic);
    li.append(span);
    ul.append(li);
  });
  stripWrap.append(ul);

  block.replaceChildren(split, stripWrap);
}
