/**
 * brand-logos — trusted-partners logo strip (reconstructive, #95).
 * Schema: stardust/eds-schema/home.json → section "brand-logos" (5 images).
 *
 * Authoring: one row per logo, the cell holding an authored <picture>/<img>
 * with alt = partner name (editorial images, alt carries the description only
 * — D13). Also tolerates all logos flattened into one cell (#52). The strip
 * eyebrow ("Trusted Partners") is DEFAULT CONTENT before the block.
 */
export default function decorate(block) {
  const track = document.createElement('div');
  track.className = 'brand-logos-track';
  block.querySelectorAll('picture, img').forEach((el) => {
    if (el.closest('picture') && el.matches('img')) return; // handled via its picture
    const item = document.createElement('div');
    item.className = 'brand-logos-item';
    item.append(el.closest('picture') || el);
    track.append(item);
  });
  block.replaceChildren(track);
}
