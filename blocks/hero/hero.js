/**
 * hero — Riverview Health welcome hero (bespoke, template-slotted).
 * Schema: stardust/eds-schema/index.json → section "hero".
 *
 * Authored content (query, do not hard-index — #42):
 *   - <picture>/<img>  : editorial poster (LCP image; also the video poster)
 *   - <h1>             : headline; a leading <em> word renders mint
 *   - <p> (link-free)  : lede
 *   - <p> (link)       : CTAs — <strong><a> primary (mint), <em><a> secondary (outline-light)
 *
 * A decorative background video (/video/rv_video_mrq.mp4) is enhanced-in from
 * the code origin (#103: never content.da.live for video); poster always shows.
 */

const VIDEO_SRC = '/video/rv_video_mrq.mp4';

function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export default async function decorate(block) {
  const img = block.querySelector('picture, img');
  const h1 = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const lede = ps.find((p) => !p.querySelector('a'));
  const ctaPs = ps.filter((p) => p.querySelector('a'));

  // media layer
  const media = document.createElement('div');
  media.className = 'ds-hero-media-layer';
  if (img) {
    const realImg = img.tagName === 'IMG' ? img : img.querySelector('img');
    if (realImg) {
      realImg.setAttribute('loading', 'eager');
      realImg.setAttribute('fetchpriority', 'high');
    }
    img.classList.add('ds-hero-media');
    media.append(img);
  }

  const scrim = document.createElement('div');
  scrim.className = 'ds-hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  // content
  const content = document.createElement('div');
  content.className = 'ds-hero-content';
  if (h1) {
    const head = document.createElement('h1');
    head.innerHTML = h1.innerHTML;
    content.append(head);
  }
  if (lede) {
    lede.classList.add('ds-hero-lede');
    content.append(lede);
  }
  if (ctaPs.length) {
    const actions = document.createElement('div');
    actions.className = 'ds-hero-ctas actions';
    ctaPs.forEach((p) => actions.append(p));
    content.append(actions);
  }
  const wrap = document.createElement('div');
  wrap.className = 'ds-wrap';
  wrap.append(content);

  const wave = svg('<svg class="ds-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path fill="#ffffff" d="M0,58 C170,94 350,16 560,32 C780,49 930,98 1130,74 C1275,57 1375,24 1440,38 L1440,100 L0,100 Z"/></svg>');

  block.replaceChildren(media, scrim, wrap, wave);

  // enhance with the signature background video (desktop, motion-ok only)
  const small = window.matchMedia('(max-width: 767px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (small.matches || reduced.matches) return;

  const posterImg = block.querySelector('.ds-hero-media img');
  const video = document.createElement('video');
  video.className = 'ds-hero-video';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('preload', 'metadata');
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  if (posterImg) video.poster = posterImg.currentSrc || posterImg.src;
  const source = document.createElement('source');
  source.src = VIDEO_SRC;
  source.type = 'video/mp4';
  video.append(source);
  media.append(video);

  const pause = document.createElement('button');
  pause.className = 'ds-hero-pause';
  pause.type = 'button';
  pause.setAttribute('aria-label', 'Pause background video');
  pause.setAttribute('aria-pressed', 'false');
  pause.innerHTML = '<svg class="ds-ic-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="ds-ic-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.2-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z"/></svg>';
  block.append(pause);

  let userPaused = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !userPaused) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.2 });
  io.observe(video);
  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    pause.setAttribute('aria-pressed', String(userPaused));
    if (userPaused) video.pause();
    else video.play().catch(() => {});
  });
}
