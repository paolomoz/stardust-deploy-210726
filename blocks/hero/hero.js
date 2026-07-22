/**
 * hero — value proposition + product-as-proof at the fold (split-media).
 * Schema: stardust/eds-schema/index.json § hero. Decode tier: template-slotted (#95).
 *
 * Authoring rows (query-based decode, #42 — order-tolerant):
 *   1. <h1> lead headline (WITHOUT the rotating "+ Chargebee" — the block appends
 *      the integration carousel; a trailing "+ Chargebee" is stripped first, #70)
 *   2. lede paragraph (first link-free <p>)
 *   3. facts paragraph (second link-free <p> — key pricing/integration facts, server-rendered)
 *   4. CTA cell — primary as <strong><a> (decorated to a.button.primary), demo link plain <a>
 *
 * The media half (lottie player + SVG dashboard fallback card, MRR mock figures,
 * carousel item list) is design-system data owned by this block, not authorable —
 * recorded in stardust/eds-conversion-log.md.
 */

const CAROUSEL_ITEMS = ['+ Chargebee', '+ Braintree', '+ Recurly', '+ Shopify', '+ Google Play Store', '+ Apple App Store', '+ Quickbooks', '+ Xero', '+ Stripe'];

const DASH_TEMPLATE = `
  <figure class="hero-dash ds-card" role="img"
          aria-label="Baremetrics dashboard preview: monthly recurring revenue of $365,271, trending upward">
    <div class="dash-head">
      <span class="dash-chip">MRR</span>
      <span class="dash-label">Monthly Recurring Revenue</span>
    </div>
    <p class="dash-value">$365,271</p>
    <svg class="dash-svg" viewBox="0 0 560 220" width="560" height="220" aria-hidden="true" focusable="false">
      <line class="dash-grid-line" x1="8" y1="40" x2="552" y2="40"></line>
      <line class="dash-grid-line" x1="8" y1="90" x2="552" y2="90"></line>
      <line class="dash-grid-line" x1="8" y1="140" x2="552" y2="140"></line>
      <line class="dash-grid-line" x1="8" y1="190" x2="552" y2="190"></line>
      <path class="dash-area" d="M12 186 C70 176 104 170 140 160 C182 148 216 148 254 136 C296 122 324 118 360 106 C398 92 428 84 462 66 C486 54 506 44 524 34 L524 206 L12 206 Z"></path>
      <path class="dash-line" d="M12 186 C70 176 104 170 140 160 C182 148 216 148 254 136 C296 122 324 118 360 106 C398 92 428 84 462 66 C486 54 506 44 524 34"></path>
      <circle class="dash-dot-halo" cx="524" cy="34" r="10"></circle>
      <circle class="dash-dot" cx="524" cy="34" r="5"></circle>
    </svg>
  </figure>`;

function startCarousel(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = CAROUSEL_ITEMS;
  let i = 0;
  el.style.transition = 'transform .5s ease-in-out';
  setInterval(() => {
    el.style.transform = 'translateY(-110%)';
    setTimeout(() => {
      i = (i + 1) % items.length;
      el.style.transition = 'none';
      el.textContent = items[i];
      el.style.transform = 'translateY(110%)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'transform .5s ease-in-out';
        el.style.transform = 'translateY(0)';
      }));
    }, 500);
  }, 3000);
}

/* Live lottie hero (prototype-authorized external module, pinned). The SVG card
   remains the no-JS / reduced-motion / load-failure fallback: the block only
   gains .lottie-ready once the animation data actually loaded. */
function mountLottie(block, media) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const right = document.createElement('div');
  right.className = 'carousel-right';
  media.prepend(right);
  // eslint-disable-next-line import/no-unresolved
  import('https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.20/dist/dotlottie-wc.js').then(() => {
    const wc = document.createElement('dotlottie-wc');
    wc.setAttribute('src', `${window.hlx?.codeBasePath || ''}/blocks/hero/homepage-animation.json`);
    wc.setAttribute('speed', '1');
    wc.setAttribute('mode', 'forward');
    wc.setAttribute('loop', '');
    wc.setAttribute('autoplay', '');
    wc.setAttribute('aria-label', 'Animated Baremetrics dashboard preview');
    wc.className = 'lottie-animation';
    right.append(wc);
    let tries = 0;
    const poll = setInterval(() => {
      const dl = wc.dotLottie;
      const loaded = dl && (dl.isLoaded === true || dl.totalFrames > 0);
      if (loaded) {
        block.classList.add('lottie-ready');
        clearInterval(poll);
      } else if (tries > 100) clearInterval(poll);
      tries += 1;
    }, 200);
  }).catch(() => { /* CDN failure — SVG card fallback stays visible */ });
}

export default async function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const paragraphs = [...block.querySelectorAll('p')];
  const textPs = paragraphs.filter((p) => !p.querySelector('a') && p.textContent.trim());
  const ctaPs = paragraphs.filter((p) => p.querySelector('a'));

  const copy = document.createElement('div');
  copy.className = 'hero-copy';

  if (heading) {
    const h1 = document.createElement('h1');
    h1.append(...heading.childNodes);
    // idempotent carousel injection (#70): strip an already-typed trailing item
    const last = h1.lastChild;
    if (last && last.nodeType === Node.TEXT_NODE) {
      last.textContent = last.textContent.replace(/\s*\+\s*Chargebee\s*$/i, '');
    }
    h1.append(' ');
    const wrapper = document.createElement('span');
    wrapper.className = 'hero-carousel-wrapper';
    const carousel = document.createElement('span');
    carousel.className = 'hero-carousel';
    carousel.textContent = '+ Chargebee';
    wrapper.append(carousel);
    h1.append(wrapper);
    copy.append(h1);
    startCarousel(carousel);
  }

  // eyebrow-less lead: first link-free <p> = lede, second = facts line (#51 order rule)
  if (textPs[0]) {
    textPs[0].className = 'hero-lede';
    copy.append(textPs[0]);
  }
  if (textPs[1]) {
    textPs[1].className = 'hero-facts';
    copy.append(textPs[1]);
  }

  if (ctaPs.length) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-ctas';
    ctaPs.forEach((p) => ctas.append(p));
    copy.append(ctas);
  }

  const media = document.createElement('div');
  media.className = 'hero-media';
  media.innerHTML = DASH_TEMPLATE;

  const grid = document.createElement('div');
  grid.className = 'container hero-grid';
  grid.append(copy, media);
  block.replaceChildren(grid);

  /* defer the lottie module off the eager/LCP path */
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 800));
  idle(() => mountLottie(block, media));
}
