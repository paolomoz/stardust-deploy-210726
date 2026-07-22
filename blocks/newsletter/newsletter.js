/**
 * newsletter — binder-blue signup band (mascot + heading + consent + form).
 * Template-slotted (#95) for the layout; the form + real submit handler are
 * wired in block JS (forms can't ride authored markup, #20/#102).
 *
 * Authoring: 1 row, 2 cells:
 *   cell 1: mascot <img>
 *   cell 2: <h2>Newsletter <em>Abonnieren</em></h2> + <p>consent (with Datenschutz link)</p>
 */

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const mascotCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3')) || cells.find((c) => c !== mascotCell);

  const grid = document.createElement('div');
  grid.className = 'ds-news-grid';

  const intro = document.createElement('div');
  intro.className = 'ds-news-intro';
  const mascot = document.createElement('div');
  mascot.className = 'ds-news-mascot';
  const media = mascotCell && (mascotCell.querySelector('picture') || mascotCell.querySelector('img'));
  if (media) mascot.append(media);
  intro.append(mascot);

  const textWrap = document.createElement('div');
  if (textCell) {
    const heading = textCell.querySelector('h1, h2, h3');
    if (heading) {
      const h2 = document.createElement('h2');
      [...heading.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
      textWrap.append(h2);
    }
    const consent = textCell.querySelector('p');
    if (consent) {
      const p = document.createElement('p');
      p.className = 'ds-news-consent';
      [...consent.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      textWrap.append(p);
    }
  }
  intro.append(textWrap);
  grid.append(intro);

  // form (real submit handler)
  const form = document.createElement('form');
  form.className = 'ds-news-form';
  form.setAttribute('action', 'https://www.card-corner.de/Newsletter');
  form.setAttribute('method', 'get');
  form.innerHTML = `
    <label class="sr-only" for="newsletter-email">E-Mail-Adresse</label>
    <input class="ds-input" type="email" id="newsletter-email" name="email"
      placeholder="E-Mail-Adresse" autocomplete="email" required>
    <button class="button accent" type="submit">Abonnieren</button>`;
  const status = document.createElement('p');
  status.className = 'ds-news-status';
  status.setAttribute('role', 'status');
  status.hidden = true;

  form.addEventListener('submit', (e) => {
    const input = form.querySelector('input[type="email"]');
    if (!input.checkValidity()) return; // let native validation show
    e.preventDefault();
    status.hidden = false;
    status.textContent = `Danke! Wir haben ${input.value} für den Newsletter vorgemerkt.`;
    input.value = '';
  });

  grid.append(form);
  grid.append(status);

  block.replaceChildren(grid);

  // anchor target for the community "Newsletter" card (#newsletter)
  const section = block.closest('.section');
  if (section && !section.id) section.id = 'newsletter';
}
