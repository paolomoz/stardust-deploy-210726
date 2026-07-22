/**
 * hero — dark statement chapter over the signature background video, with the
 * Equinox Evo launch as a bottom announcement rail (index-B prototype).
 * Schema: stardust/eds-schema/index.json § hero. Template-slotted (#95).
 *
 * Authoring rows (decoded by QUERY, not index — #42/#62):
 *   - <img> poster (LCP — eager, also the mobile/no-motion background)
 *   - .mp4 URL link (background video; gated playback, zero bytes <=800px)
 *   - <h1> headline (single page <h1>; <em> renders italic meadow)
 *   - lede paragraph (link-free, no interpunct)
 *   - facts line "A · B · C" (interpunct-separated, wraps in nowrap fact spans)
 *   - primary CTA (<strong><a> → a.button.primary before this runs)
 *   - announcement rail: pill text, <h2> title, rail lede, plain rail link
 */

// wrapTextNodes (aem.js) folds a media-led cell (img/picture + siblings) into ONE
// wrapper <p> — expand it back to its element children before classifying.
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].matches('p')
      && kids[0].children.length > 1
      && kids[0].querySelector('h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) {
    kids = [...kids[0].children];
  }
  return kids;
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = cellNodes(cell);
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

function buildFacts(text) {
  const facts = document.createElement('p');
  facts.className = 'hero-facts';
  const parts = text.split('·').map((s) => s.trim()).filter(Boolean);
  parts.forEach((part, i) => {
    const fact = document.createElement('span');
    fact.className = 'fact';
    const t = document.createElement('span');
    t.textContent = part;
    fact.append(t);
    if (i < parts.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '·';
      fact.append(sep);
    }
    facts.append(fact);
  });
  return facts;
}

function wireVideo(block, video, toggle) {
  const wide = window.matchMedia('(min-width: 801px)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userTouched = false;
  const setState = (playing) => toggle.setAttribute('aria-pressed', String(playing));
  setState(false);
  const autoStart = () => {
    if (userTouched || !wide.matches || still.matches || !video.paused) return;
    video.play().then(() => setState(true)).catch(() => setState(false));
  };
  const whenIdle = (fn) => {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 2000);
  };
  if (wide.matches && !still.matches) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          whenIdle(autoStart);
        }
      });
      io.observe(block);
    } else {
      whenIdle(autoStart);
    }
  }
  toggle.addEventListener('click', () => {
    if (!wide.matches) return;
    userTouched = true;
    if (video.paused) {
      video.play();
      setState(true);
    } else {
      video.pause();
      setState(false);
    }
  });
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  let poster = null;
  let videoHref = null;
  let headline = null;
  let lede = null;
  let factsText = null;
  const actions = [];
  let railTitle = null;
  let railLede = null;
  let railLink = null;
  let pendingText = null; // #76: rail pill precedes its heading
  let inRail = false;

  nodes.forEach((el) => {
    const media = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const link = el.matches('a') ? el : el.querySelector('a');
    if (media && !poster) { poster = media; return; }
    if (link && /\.mp4($|\?)/i.test(link.href) && !videoHref) { videoHref = link.href; return; }
    if (el.matches('h1') && !headline) { headline = el; return; }
    if (el.matches('h2, h3') && !railTitle) { railTitle = el; inRail = true; return; }
    // CTA: a.button when decorateButtons ran, emphasis-wrapped <a> otherwise
    const isCta = link && (link.classList.contains('button') || link.closest('strong, em'));
    if (isCta && !inRail) { actions.push(el); return; }
    if (!inRail) {
      const text = el.textContent.trim();
      if (text.includes('·') && !factsText) { factsText = text; return; }
      if (!link && text.length > 60 && !lede) { lede = el; return; }
      if (!link && text) pendingText = text; // short pre-heading text buffers as the rail pill
      return;
    }
    // rail group
    if (link && !railLink) { railLink = link; return; }
    if (!link && el.textContent.trim() && !railLede) railLede = el;
  });

  const stage = document.createElement('div');
  stage.className = 'hero-stage';

  // media layers: poster picture (always) + gated background video
  if (poster) {
    const img = poster.matches('img') ? poster : poster.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    const posterWrap = document.createElement('div');
    posterWrap.className = 'hero-poster';
    posterWrap.setAttribute('aria-hidden', 'true');
    posterWrap.append(poster);
    stage.append(posterWrap);
  }
  let video = null;
  let toggle = null;
  if (videoHref) {
    video = document.createElement('video');
    video.className = 'hero-video';
    video.preload = 'none';
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    const posterImg = poster && (poster.matches('img') ? poster : poster.querySelector('img'));
    if (posterImg) video.poster = posterImg.currentSrc || posterImg.src;
    const source = document.createElement('source');
    source.src = videoHref;
    source.type = 'video/mp4';
    video.append(source);
    stage.append(video);

    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'video-toggle';
    toggle.setAttribute('aria-pressed', 'false');
    const label = document.createElement('span');
    label.className = 'vt-label';
    label.textContent = 'Play video';
    toggle.append(label);
  }

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  stage.append(scrim);

  // main copy
  const main = document.createElement('div');
  main.className = 'hero-main';
  const shell = document.createElement('div');
  shell.className = 'shell';
  if (headline) shell.append(headline);
  if (lede) {
    lede.classList.add('lede');
    shell.append(lede);
  }
  if (factsText) shell.append(buildFacts(factsText));
  if (actions.length) {
    const act = document.createElement('div');
    act.className = 'actions';
    actions.forEach((a) => act.append(a));
    shell.append(act);
  }
  main.append(shell);
  stage.append(main);

  if (toggle) stage.append(toggle);

  // announcement rail
  if (railTitle) {
    const rail = document.createElement('aside');
    rail.className = 'hero-rail';
    rail.setAttribute('aria-label', 'Product launch');
    const railShell = document.createElement('div');
    railShell.className = 'shell';
    if (pendingText) {
      const pill = document.createElement('p');
      pill.className = 'rail-pill';
      pill.textContent = pendingText;
      railShell.append(pill);
    }
    railTitle.classList.add('rail-title');
    railShell.append(railTitle);
    if (railLede) {
      railLede.classList.add('rail-lede');
      railShell.append(railLede);
    }
    if (railLink) {
      railLink.classList.add('arrow-link');
      railShell.append(railLink);
    }
    rail.append(railShell);
    stage.append(rail);
  }

  block.replaceChildren(stage);
  if (video && toggle) wireVideo(block, video, toggle);
}
