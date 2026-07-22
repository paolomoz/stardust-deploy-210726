/**
 * story — Jason's Story cinematic split (bespoke, template-slotted).
 * Schema: stardust/eds-schema/index.json → section "jasons-story".
 *
 * Authored (query, do not hard-index):
 *   <h2>             : title
 *   <p> (link-free)  : quote
 *   <p> (link)       : CTAs — <em><a> secondary (outline-light); a plain <a>
 *                      alone in its own <p> stays a text link
 *   <picture>/<img>  : editorial portrait
 */
function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export default async function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const quote = ps.find((p) => !p.querySelector('a'));
  const ctaPs = ps.filter((p) => p.querySelector('a'));
  const img = block.querySelector('picture, img');

  const copy = document.createElement('div');
  copy.className = 'ds-story-copy';
  if (heading) { const h = document.createElement('h2'); h.innerHTML = heading.innerHTML; copy.append(h); }
  if (quote) { quote.classList.add('ds-story-quote'); copy.append(quote); }
  if (ctaPs.length) {
    const actions = document.createElement('div');
    actions.className = 'ds-story-ctas actions';
    ctaPs.forEach((p) => {
      const a = p.querySelector('a');
      if (a && !a.classList.contains('button')) a.classList.add('ds-link');
      actions.append(p);
    });
    copy.append(actions);
  }

  const frame = document.createElement('div');
  frame.className = 'ds-story-frame';
  if (img) frame.append(img.matches('picture, img') ? img : img.querySelector('picture, img'));

  const split = document.createElement('div');
  split.className = 'ds-split';
  split.append(copy, frame);

  const inner = document.createElement('div');
  inner.className = 'ds-story-inner';
  inner.append(split);

  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';
  wrap.append(inner);

  const waveTop = svg('<svg class="ds-wave-top" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path fill="#ffffff" d="M0,44 C190,84 380,20 590,36 C800,52 960,96 1150,70 C1290,52 1385,26 1440,40 L1440,100 L0,100 Z"/></svg>');
  const topo = svg('<svg class="ds-topo" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1.5"><path d="M-60 90 C 220 30, 460 150, 740 100 S 1230 40, 1500 110"/><path d="M-60 190 C 240 130, 480 250, 760 200 S 1250 140, 1500 210"/><path d="M-60 290 C 200 230, 440 350, 720 300 S 1210 240, 1500 310"/><path d="M-60 390 C 260 330, 500 450, 780 400 S 1270 340, 1500 410"/><path d="M-60 490 C 220 430, 460 550, 740 500 S 1230 440, 1500 510"/></g></svg>');

  block.replaceChildren(waveTop, topo, wrap);
}
