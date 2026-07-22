/**
 * mychart — split media/copy feature (bespoke, template-slotted).
 * Schema: stardust/eds-schema/index.json → section "mychart".
 *
 * Authored (query, do not hard-index):
 *   <picture>/<img>  : editorial image (plinth frame)
 *   <h2>             : title
 *   <p> (link-free)  : intro + body paragraphs
 *   <p> (link)       : CTAs — <strong><a> primary, <em><a> secondary (outline)
 */
export default async function decorate(block) {
  const img = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const copyPs = ps.filter((p) => !p.querySelector('a'));
  const ctaPs = ps.filter((p) => p.querySelector('a'));

  const frame = document.createElement('div');
  frame.className = 'ds-plinth-frame';
  if (img) frame.append(img.matches('picture, img') ? img : img.querySelector('picture, img'));

  const copy = document.createElement('div');
  copy.className = 'ds-split-copy';
  if (heading) { const h = document.createElement('h2'); h.innerHTML = heading.innerHTML; copy.append(h); }
  copyPs.forEach((p, i) => { if (i === 0) p.classList.add('ds-intro'); copy.append(p); });
  if (ctaPs.length) {
    const actions = document.createElement('div');
    actions.className = 'ds-split-ctas actions';
    ctaPs.forEach((p) => actions.append(p));
    copy.append(actions);
  }

  const split = document.createElement('div');
  split.className = 'ds-split';
  split.append(frame, copy);

  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';
  wrap.append(split);
  block.replaceChildren(wrap);
}
