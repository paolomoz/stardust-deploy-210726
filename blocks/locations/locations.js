/**
 * locations — yellow eyebrow ribbon + narrative proof + branch grid
 * (reconstructive, content-classified rows — #48; never index-based).
 * Schema: stardust/eds-schema/home.json → section "locations-proof".
 *
 * Authoring rows (one cell each), classified by content:
 *   - band: short uppercase line, no links, no <strong>
 *   - proof: sentence-length paragraph carrying <strong> facts
 *     (server-visible key facts stay in page content, #86)
 *   - branches: a cell holding a real <ul> (simple inferred list, D5);
 *     decode falls back to middle-dot-delimited lines if DA flattens (#50)
 *   - more: paragraph containing a link
 */

const PIN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M512 960Q432 960 362 930Q292 899 240.0 847.0Q188 795 158 725Q128 656 128 576Q128 473 184 362Q240 252 308.5 160.0Q377 68 436 7Q495 -54 501 -60Q503 -62 505.5 -63.0Q508 -64 512 -64Q515 -64 518.0 -63.0Q521 -62 523 -60Q528 -54 587 7Q646 68 714.5 160.0Q783 252 839 362Q896 473 896 576Q896 655 865 725Q835 795 783.0 847.0Q731 899 661 930Q591 960 512 960ZM512 400Q439 400 387.5 451.5Q336 503 336 576Q336 649 387.5 700.5Q439 752 512 752Q585 752 636.5 700.5Q688 649 688 576Q688 503 636.5 451.5Q585 400 512 400Z"/></svg>';

export default function decorate(block) {
  let band = null;
  let proof = null;
  let list = null;
  let more = null;
  const looseLines = [];

  const classify = (el) => {
    const text = el.textContent.trim();
    if (!text) return;
    const innerList = el.matches('ul, ol') ? el : el.querySelector('ul, ol');
    if (innerList) { if (!list) list = innerList; return; }
    if (el.querySelector('a')) { if (!more) more = el; return; }
    if (!band && text.length < 60 && !el.querySelector('strong')) { band = el; return; }
    if (!proof && (el.querySelector('strong') || text.length >= 60)) { proof = el; return; }
    looseLines.push(el); // possibly flattened branch lines (#50)
  };

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.children.length) [...cell.children].forEach(classify);
    else classify(cell);
  });

  const frag = document.createDocumentFragment();

  if (band) {
    const bandEl = document.createElement('div');
    bandEl.className = 'locations-band';
    bandEl.append(...band.childNodes);
    frag.append(bandEl);
  }

  const inner = document.createElement('div');
  inner.className = 'locations-inner';

  if (proof) {
    proof.classList.add('locations-proof');
    inner.append(proof);
  }

  let names = [];
  if (list) {
    names = [...list.querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean);
  } else if (looseLines.length) {
    names = looseLines
      .flatMap((el) => el.textContent.split('\u00b7').map((s) => s.trim()))
      .filter(Boolean);
  }
  if (names.length) {
    const grid = document.createElement('ul');
    grid.className = 'locations-grid';
    grid.setAttribute('aria-label', 'Branch locations');
    names.forEach((name) => {
      const li = document.createElement('li');
      const icon = document.createElement('span');
      icon.className = 'locations-pin';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = PIN_ICON;
      li.append(icon, document.createTextNode(name));
      grid.append(li);
    });
    inner.append(grid);
  }

  if (more) {
    more.classList.add('locations-more');
    inner.append(more);
  }

  frag.append(inner);
  block.replaceChildren(frag);
}
