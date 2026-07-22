/**
 * toc — "On this page" table of contents for a long-form article.
 * Schema: stardust/eds-schema/cority-blog.json (section: article / toc)
 * Decode tier: reconstructive (generates its list from sibling headings).
 *
 * Authoring: an (optionally labelled) empty block inside the article section.
 *   <div class="toc"><div><div>On this page</div></div></div>
 * It reads every <h2> in the section's article prose (.default-content-wrapper),
 * assigns a stable id when the pipeline hasn't (idempotent — reuses a pipeline id),
 * and builds an ordered list of anchor links. No content is authored in the block.
 */

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'section';
}

export default function decorate(block) {
  const label = block.textContent.trim() || 'On this page';
  const section = block.closest('.section');
  const headings = section
    ? [...section.querySelectorAll('.default-content-wrapper h2')]
    : [];

  const nav = document.createElement('nav');
  nav.className = 'art-toc';
  nav.setAttribute('aria-label', 'On this page');

  const rail = document.createElement('p');
  rail.className = 'meta-rail';
  rail.textContent = label;
  nav.append(rail);

  const ol = document.createElement('ol');
  const used = new Set();
  headings.forEach((h, i) => {
    let { id } = h;
    if (!id) {
      id = slugify(h.textContent);
      while (used.has(id)) id = `${id}-${i}`;
      h.id = id;
    }
    used.add(id);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    li.append(a);
    ol.append(li);
  });
  nav.append(ol);

  block.replaceChildren(nav);
}
