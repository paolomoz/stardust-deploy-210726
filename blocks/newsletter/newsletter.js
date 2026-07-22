/**
 * newsletter — email capture on a quiet mist panel with real labels and
 * consent smallprint (index-B prototype). Template-slotted form (#95): the
 * field composition is structural chrome rendered here; the smallprint
 * paragraphs (incl. the privacy-notice link) are authored block rows. The
 * section head (h2 + lede) is DEFAULT CONTENT before the block.
 * Schema: stardust/eds-schema/index.json § newsletter.
 */

const FIELDS = [
  {
    id: 'nl-first-name', name: 'first-name', label: 'First name', type: 'text', autocomplete: 'given-name',
  },
  {
    id: 'nl-last-name', name: 'last-name', label: 'Last name', type: 'text', autocomplete: 'family-name',
  },
  {
    id: 'nl-email', name: 'email', label: 'Email', type: 'email', autocomplete: 'email',
  },
];

export default async function decorate(block) {
  // authored smallprint rows
  const smallprint = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children])
    .filter((el) => el.textContent.trim());
  smallprint.forEach((el) => el.classList.add('smallprint'));

  // template-slotted form
  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = false;
  FIELDS.forEach((f) => {
    const field = document.createElement('div');
    field.className = 'field';
    const label = document.createElement('label');
    label.setAttribute('for', f.id);
    label.textContent = f.label;
    const input = document.createElement('input');
    input.type = f.type;
    input.id = f.id;
    input.name = f.name;
    input.autocomplete = f.autocomplete;
    input.required = true;
    field.append(label, input);
    form.append(field);
  });
  const submit = document.createElement('button');
  submit.className = 'button primary';
  submit.type = 'submit';
  submit.textContent = 'Sign up';
  form.append(submit);

  const confirmation = document.createElement('p');
  confirmation.className = 'newsletter-confirmation';
  confirmation.setAttribute('role', 'status');
  confirmation.hidden = true;
  confirmation.textContent = 'Thank you for signing up! Please check your inbox to confirm your subscription.';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    confirmation.hidden = false;
  });

  block.replaceChildren(form, confirmation, ...smallprint);
}
