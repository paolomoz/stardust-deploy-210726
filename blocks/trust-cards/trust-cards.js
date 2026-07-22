/**
 * trust-cards — the 8-card "why us" detail grid. No section head (deliberate:
 * card titles are styled paragraphs, NOT headings, to keep the outline clean).
 * Reconstructive. Schema: stardust/eds-schema/index.json → trust-cards (uniform:false).
 *
 * Icons are a FIXED decorative set, inline by card index (aria-hidden).
 *
 * Authoring: one row per card, cells:
 *   1: title (plain text -> rendered as p.ds-card-title)
 *   2: body — one or more <p> (may contain an inline <a>)
 *   3: optional CTA — <p><strong><a>Label</a></strong></p>
 */

const ICONS = [
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="23 12 18.47 14.68 19.78 19.78 14.68 18.47 12 23 9.32 18.47 4.22 19.78 5.53 14.68 1 12 5.53 9.32 4.22 4.22 9.32 5.53 12 1 14.68 5.53 19.78 4.22 18.47 9.32"/><path fill="#fff" d="M10.9 15.6l-3-3 1.6-1.6 1.4 1.4 4-4 1.6 1.6z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="1.6" y="6.6" width="7" height="11" rx="1.4" transform="rotate(-18 5.1 12.1)"/><rect x="15.4" y="6.6" width="7" height="11" rx="1.4" transform="rotate(18 18.9 12.1)"/><path fill-rule="evenodd" d="M9.4 4h5.2c.77 0 1.4.63 1.4 1.4v11.2c0 .77-.63 1.4-1.4 1.4H9.4c-.77 0-1.4-.63-1.4-1.4V5.4C8 4.63 8.63 4 9.4 4zm.6 2v10h4V6z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.6l3 6.5 7.1.8-5.3 4.9 1.4 7-6.2-3.5-6.2 3.5 1.4-7L1.9 8.9 9 8.1z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1 5h13v11H1z"/><path d="M15 8h4.2L22.6 12v4H15z"/><circle cx="6" cy="18.3" r="2.4"/><circle cx="17.8" cy="18.3" r="2.4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.5 8.5h19V21h-19z"/><path d="M1.5 3h21v4h-21z"/><path fill="#fff" d="M11 8.5h2V13l-1-.8-1 .8z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.55 19.2L2.4 12.05l2.9-2.9 4.25 4.25L18.7 4.25l2.9 2.9z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-7.5L8 21v-4.5H4c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2z"/><circle fill="#fff" cx="8" cy="9.5" r="1.4"/><circle fill="#fff" cx="12" cy="9.5" r="1.4"/><circle fill="#fff" cx="16" cy="9.5" r="1.4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 1.5h2.5V22.5H5z"/><path d="M9 3h12.5l-3.2 4.75 3.2 4.75H9z"/></svg>',
];

function isCtaCell(c) {
  const a = c.querySelector('a[href]');
  if (!a) return false;
  if (a.classList.contains('button')) return true;
  if (a.closest('strong, em')) return true;
  return c.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'ds-why-grid';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const ctaCell = cells.find(isCtaCell);
    const rest = cells.filter((c) => c !== ctaCell && c.textContent.trim());
    const titleCell = rest[0];
    const bodyCells = rest.slice(1);

    const card = document.createElement('article');
    card.className = 'ds-card ds-why-card';

    const icon = document.createElement('div');
    icon.className = 'ds-why-icon';
    icon.insertAdjacentHTML('beforeend', ICONS[i % ICONS.length]);
    card.append(icon);

    if (titleCell) {
      const title = document.createElement('p');
      title.className = 'ds-card-title';
      title.textContent = titleCell.textContent.trim();
      card.append(title);
    }

    bodyCells.forEach((bc) => {
      const ps = [...bc.querySelectorAll('p')];
      if (ps.length) {
        ps.forEach((p) => {
          const np = document.createElement('p');
          [...p.childNodes].forEach((n) => np.append(n.cloneNode(true)));
          card.append(np);
        });
      } else if (bc.textContent.trim()) {
        const np = document.createElement('p');
        [...bc.childNodes].forEach((n) => np.append(n.cloneNode(true)));
        card.append(np);
      }
    });

    if (ctaCell) {
      const a = ctaCell.querySelector('a[href]');
      if (a) card.append(a.cloneNode(true));
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
