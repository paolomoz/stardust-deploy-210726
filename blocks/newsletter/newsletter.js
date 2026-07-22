/**
 * newsletter — interactive subscribe form (#28). Template-slotted from authored rows.
 * Schema: stardust/eds-schema/theroadhome.json § newsletter (4× DIV.field).
 * Section head (h2 + deck) is DEFAULT CONTENT (D1).
 *
 * Authoring rows (one cell each):
 *   1..4  field labels — "First Name", "Last Name", "Email", "Mobile Phone (Optional)"
 *   5     consent label — "Sign me up for SMS messages."
 *   6     legal paragraph
 * Input type inferred from the label (email→email, phone→tel, else text). Block wires a
 * real submit handler: validates required fields, then shows a confirmation.
 */
function inferType(label) {
  const l = label.toLowerCase();
  if (l.includes('email')) return 'email';
  if (l.includes('phone')) return 'tel';
  return 'text';
}

export default async function decorate(block) {
  const rows = [...block.children].map((r) => r.textContent.trim()).filter(Boolean);
  const fields = [];
  let consent = '';
  let legal = '';
  rows.forEach((text) => {
    if (/sign me up/i.test(text)) consent = text;
    else if (text.length > 60) legal = text;
    else fields.push(text);
  });

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.setAttribute('novalidate', '');

  fields.forEach((label, i) => {
    const type = inferType(label);
    const required = type !== 'tel';
    const field = document.createElement('div');
    field.className = 'field';
    const id = `nl-${i}`;
    const lab = document.createElement('label');
    lab.setAttribute('for', id);
    lab.textContent = label;
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    if (required) input.required = true;
    field.append(lab, input);
    form.append(field);
  });

  if (consent) {
    const c = document.createElement('div');
    c.className = 'sms-consent';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'nl-sms';
    const lab = document.createElement('label');
    lab.setAttribute('for', 'nl-sms');
    lab.textContent = consent;
    c.append(cb, lab);
    form.append(c);
  }

  const actions = document.createElement('div');
  actions.className = 'form-actions';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'button primary';
  btn.textContent = 'SUBSCRIBE';
  actions.append(btn);
  form.append(actions);

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  status.hidden = true;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll('input[required]')].find((i) => !i.value.trim());
    if (invalid) {
      status.hidden = false;
      status.classList.remove('ok');
      status.textContent = 'Please complete the required fields.';
      invalid.focus();
      return;
    }
    form.querySelectorAll('.field, .sms-consent, .form-actions').forEach((el) => { el.style.display = 'none'; });
    status.hidden = false;
    status.classList.add('ok');
    status.textContent = 'Thank you — you are subscribed to The Road Home updates.';
  });

  block.replaceChildren(form, status);
  if (legal) {
    const p = document.createElement('p');
    p.className = 'legal';
    p.textContent = legal;
    block.append(p);
  }
}
