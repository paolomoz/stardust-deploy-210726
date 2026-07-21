/**
 * live-status — split proof band on the ice wash: state map image left, live
 * chip + state heading + two live counter lines right. Template-slotted (#95)
 * — fixed composition; authored values slotted by role.
 * Schema: stardust/eds-schema/index.json § live-status.
 *
 * Authoring rows (order-tolerant, decoded by query/classification):
 *   - map: <picture>/<img>
 *   - chip: short link-free paragraph WITHOUT <strong> ("Live status")
 *   - heading: <h2> (state name)
 *   - live lines: paragraphs carrying their number in <strong> (preserved tag)
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.closest('picture') && p.textContent.trim());
  const lines = paragraphs.filter((p) => p.querySelector('strong'));
  const chip = paragraphs.find((p) => !p.querySelector('strong') && !p.querySelector('a'));

  const grid = document.createElement('div');
  grid.className = 'live-grid';

  if (media) {
    const map = document.createElement('div');
    map.className = 'live-map';
    map.append(media.closest('picture') || media);
    grid.append(map);
  }

  const copy = document.createElement('div');
  copy.className = 'live-copy';
  if (chip) {
    const span = document.createElement('span');
    span.className = 'live-chip';
    span.textContent = chip.textContent.trim();
    copy.append(span);
  }
  if (heading) copy.append(heading);
  lines.forEach((p) => {
    p.className = 'live-line';
    copy.append(p);
  });
  grid.append(copy);

  block.replaceChildren(grid);
}
