# wheelercat — home-A-rich → EDS conversion log

Scope: ONE page (`/wheelercat/`), subfolder site under `/wheelercat/`. Source prototype:
`/Users/paolo/stardust/uplift-wheelercat/stardust/prototypes/home-A-rich-proposed.html`.
Target: this worktree (branch `wheelercat-e2e`, stock adobe/aem-boilerplate main).
DA org/repo: `paolomoz/stardust-deploy-210726`. Harness-imposed: stop after Local-QA — no git push,
no DA writes, no admin.hlx.page calls.

## Step 2 — triage + names (LOCKED, single-page rule: block name = section class)

| Prototype section | Triage (D1) | Block / treatment | Collection (D11) | Decode tier (#95) |
|---|---|---|---|---|
| utility-strip | chrome | extra section in `/wheelercat/nav` doc; header block slots it | — | template-slotted |
| header (main-header + mega-nav) | chrome | `blocks/header` (stock machinery kept, restyled) + `/wheelercat/nav` | — | template-slotted |
| hero | block (bespoke composition, editorial bg) | `hero` | mirrors Collection `hero` name; content model = picture + default content rows | template-slotted |
| finance | block (3 repeating card units) | `cards` variant `finance` | Collection `cards` (one row per card) | reconstructive |
| services | block (6 repeating tile units) | `services` (invented; no collection match for icon+hover-image whole-tile anchors) | — | reconstructive |
| blog-cards | block (4 repeating image-overlay cards) | `cards` variant `blog` | Collection `cards` (one row per card: image cell + text cell) | reconstructive |
| brand-logos | block (5 repeating logo units) | `brand-logos` (invented; no collection match) | — | reconstructive |
| locations | block (bespoke band + proof + repeating branch list) | `locations` (invented) | — | reconstructive (content-classified rows) |
| footer | chrome | `blocks/footer` + `/wheelercat/footer` doc | — | template-slotted |

- **Same-pattern collapse:** finance + blog grids share ONE `cards` block; skins ride variant
  classes `cards finance` / `cards blog`. JS is generic (classifies cells by content: picture cell →
  media; card whose only link is a button → CTA card; card whose only link is a plain trailing link →
  whole-card anchor). CSS differs per variant.
- **Section heads = DEFAULT CONTENT (D1):** the eyebrow+`<h2>` heads of finance / services /
  blog-cards / brand-logos are authored as default content in the section BEFORE the block, styled in
  place via `.cards-container .default-content-wrapper` etc. — no reabsorption needed (heads sit
  outside the grids in the prototype). The "Browse More Services" primary CTA is default content
  AFTER the `services` block in the same section.
- **No default-content-only sections** on this page → the Step-3 section `style` vocabulary is EMPTY
  (no section-metadata blocks anywhere; anti-pattern 2 avoided by construction).
- **No reserved-name collisions:** hero, cards, services, brand-logos, locations, header, footer.

## Step 2b — schema + deliberate encode decisions

Schema: `stardust/eds-schema/home.json` (from section-schema.mjs against the served prototype).
Fingerprint (#90): NO per-instance variation in any content section (finance/services/blog/logos
branch grids all uniform). Flagged groups are chrome-only (verb dropdown child counts, footer column
child counts) — legitimate structural differences, not flattened variants. The finance `uniform:false`
is the data-flip accent numerals (60/500) in card 1 — carried as `<em>` accents (see below), not flattened.

Encode mappings that must survive DA (semantic inline tags only):
- Hero headline: `<h1><em>REDEFINING</em> COMMITMENT</h1>` — `em` = yellow accent line,
  hero CSS renders `h1 em` as block-level yellow line (prototype's two-line treatment).
- Hero supporting line: yellow accent → `<em>`, italic runs → `<strong>` (hero-scoped CSS:
  `em` = yellow/no-italic, `strong` = italic/weight-inherit; the line is uppercase-bold by block CSS).
  One editorial `<br>` (Shift+Enter equivalent) kept, as in the prototype.
- Finance card accent numerals: `<em>60</em>` / `<em>500</em>` inside the `<h3>` (accent → em; CSS
  targets both `em` and `.em`). The data-flip animation is NOT ported (prototype-script motion).
- Card kicker "Finance": leading `<strong>` paragraph (kicker → strong per ENCODE contract).
- Services tile icon keys: leading `<code>` key per tile row (service / order / calendar / rebuilds / phone)
  (code/flag sub-field → `<code>` leading tag). Block maps key → inline SVG; unknown/absent key
  falls back to the generic service icon.
- Branch list: one cell holding the real `<ul>` (simple inferred list per D5); decode falls back to
  delimiter-split lines if DA flattens.
- CTAs: primary → `<strong><a>` (finance Learn More ×3, services Browse More, hero CTA);
  blog "Read More" links and service tiles are NOT buttons (whole-card/tile anchors — plain `<a>`).
  Hero CTA is `<strong><a>` → `a.button.primary`, hero CSS overrides to the white pill treatment
  (legitimate per-block override, #41).

Deliberate drops (recorded per #93):
- All lenis/scroll motion (data-anim, data-flip, data-countup, data-split, marquee runtime) —
  prototype-script motion does not run in EDS (D15); content renders visible (anti-pattern 16).
  Kept: hero load-only CSS fade-in (pure CSS, reduced-motion honored), service-tile hover
  image fade (CSS + sticky-reveal re-wired in block JS), blog-card hover zoom (CSS).
- locations count-up: plain text "18 branches" etc. (already server-visible facts).
- Skip-link: provided by page structure/runtime, not ported as content.

## Runtime contract

See `stardust/runtime-contract.json` — current boilerplate main: formatted-only buttonization,
`p.button-wrapper`, `.block` + `<name>-wrapper`/`<name>-container`, `main .section:empty` collapse
needed, icons via `/icons/<name>.svg`, chrome fragments `/nav` + `/footer` with per-page metadata
override (`nav: /wheelercat/nav`, `footer: /wheelercat/footer`).

## Fonts (Step 4)

Named families in prototype: Roboto (body 400/700), Roboto Condensed (display 700), Oswald
(hero headline, variable 200–700), icomoon (ICON FONT — banned as content; replaced by inline
SVGs extracted from the captured icomoon.ttf glyph outlines, see icons/).
- Roboto + Roboto Condensed: ALREADY self-hosted by this boilerplate (`fonts/roboto-*.woff2`,
  declared in `styles/fonts.css`, metric fallbacks `roboto-fallback` 99.529% / 
  `roboto-condensed-fallback` 88.82% in `styles.css`). Kept verbatim (stock calibration).
- Oswald: self-hosted from the workspace capture
  (`current/assets/fonts/TK3IWkUHHAIjg75cFRf3bXL8LICs1_Fv40pKlN4NNSeSASz7FmlWHYg.woff2` — the
  variable wght woff2 the prototype itself loads) → `fonts/oswald-variable.woff2`; declared in
  `styles/fonts.css`; metric-matched `oswald-fallback` computed from the woff2 with fontTools,
  sourcing `local("Arial Narrow")` (condensed → condensed fallback, #80); it is the above-fold
  `<h1>` face so it gets its own fallback (#12).
- Licensing: Roboto/Roboto Condensed/Oswald are all Google Fonts (Apache 2.0 / OFL) — NO licensing
  alert needed. icomoon glyphs: icon font captured from wheelercat.com (IcoMoon free set style);
  shipped only as traced inline SVG outlines, not as a font.

## Images

No `_crawl-log.json` dependency needed: every referenced image exists as a locally captured asset
under `stardust/current/assets/` in the uplift workspace — no remote fetches performed. All editorial
images staged to `media-staging/wheelercat/` (lowercased) and authored as
`https://content.da.live/paolomoz/stardust-deploy-210726/media/wheelercat/<file>`.
See `media-manifest-wheelercat.json`. Service-tile hover photos and blog-card backgrounds are
EDITORIAL (authored `<img>` rendered into a background layer by the block); the hero background is
editorial; brand logos and the Wheeler logo are authored content images. No CSS-background
editorial imagery. Favicon: extract captured none → skipped (never invent one).

## Local-QA note (harness-only run)

Authored `content.da.live` media URLs are auth-gated (401 anonymously) and nothing is uploaded in
this run, so the committed harness copies under `qa/` rewrite
`https://content.da.live/paolomoz/stardust-deploy-210726/media/wheelercat/` →
`/media-staging/wheelercat/` (the same class of rewrite build-harness.mjs does for `/img/`, #43).
The dev server runs on port 8700 with `--html-folder qa` so `/wheelercat/nav.plain.html` +
`/wheelercat/footer.plain.html` serve the chrome fragments; harness pages inject
`<meta name="nav">`/`<meta name="footer">` to reproduce the pipeline's metadata override locally.

## Gate results

(appended as run — see bottom)

## Icons — icomoon codepoint correction (deliberate deviation from the prototype)

The prototype's icon-font CSS maps class names to codepoints that DO NOT match the captured
`icomoon.ttf`: rendered against the real font, the prototype shows an Instagram glyph for
"map-pin", a hamburger for "phone", a LinkedIn "in" for "Rent", chevrons/arrows for
Parts/Maintenance, etc. (verified by extracting every glyph e900–e91c and eyeballing).
The conversion ships SEMANTICALLY CORRECT glyphs from the same captured font, traced to pure-vector
inline SVG (never the icon FONT): map-pin=e90a, menu=e90b, phone(mobile)=e90e, facebook=e905,
instagram=e906, linkedin=e909, youtube=e918, twitter=e91a, service(tools)=e914,
equipment(excavator)=e90c, rent(cycle)=e910, order(tray)=e903, rebuilds(gears)=e90d,
calendar=e900. SVG files live in `icons/`; blocks inline the markup (fill=currentColor).

## Other deliberate deviations / notes

- Brand logos render grayscale-with-hover-color (the prototype's own `.logo-track img` rule).
  Under `prefers-reduced-motion` the prototype's blanket `filter: none !important` (aimed at its
  blur() entrance) accidentally un-grayscales the logos; the EDS build keeps the design-intent
  grayscale at all times.
- Dept row (mega-nav) becomes a single scrollable row below 900px (prototype lets it wrap 2–3
  rows) — makes the chrome height deterministic so the `--nav-height` reservation always matches (#81).
- Burger breakpoint extended to 900px (stock isDesktop) vs prototype 768px — avoids the verb-wrap
  zone (#81) and matches the reservation breakpoint.
- Whole-tile/whole-card anchors wrap only the text body; editorial images sit OUTSIDE the anchor
  (an img-bearing link is an image link — the text CTA must stay a text link).
- Harness-only: `qa/wheelercat/home.html` rewrites `content.da.live/...media/wheelercat/` →
  `/media-staging/wheelercat/` and points nav/footer meta at `/qa/wheelercat/...` (the dev server
  serves repo files; authored content is untouched and carries the production values).
- davids-model-lint 🟡 justifications: "hero" = bespoke full-bleed composition with editorial
  background + scrim (D1-legitimate block, template-slotted); "cards"(finance) = 3 repeating card
  units, one row per card (D1-legitimate repeating pattern).
- impeccable design-hook `overused-font` findings on roboto: false positive — Roboto/Roboto
  Condensed/Oswald are the captured wheelercat.com brand faces (prototype `:root` names them);
  brand fidelity governs. Its `broken-image` findings on block JS/CSS were comment-prose matches.

## Gate results (all local — deploy-side gates out of scope this run)

| Gate | Command | Result |
|---|---|---|
| Runtime probe | read scripts/aem.js + scripts.js | `stardust/runtime-contract.json` written |
| Fingerprint (#90) | style-fingerprint.mjs | no per-instance variation in content sections; chrome-only structural variants (false positives) |
| Section schema (#93) | section-schema.mjs → stardust/eds-schema/home.json | 6 sections; repeats 3/6/4 detected |
| Project lint | `npm run lint` | exit 0 (eslint + stylelint clean; 4 justified stylelint-disable-next-line no-descending-specificity) |
| David's Model | `davids-model-lint.mjs content/` | exit 0 — "PASS — 0 🔴, 2 🟡" (justified above) |
| Token completeness (#91) | comm -23 grep | EMPTY (pass) |
| URL gate (#44) | grep localhost/aem.page/img in blocks/ | no matches (pass) |
| Roundtrip hero (#94) | block-roundtrip.mjs --blocks hero | exit 0, 0 🔴 (1 🟡 IMG COUNT — intentional: editorial img vs proto CSS bg) |
| Roundtrip cards | --blocks cards --map "cards=section.finance, section.blog-cards" | exit 0 — cards[0] closed; cards[1] 0 🔴 (1 🟡 IMG COUNT, intentional) |
| Roundtrip services | --blocks services | exit 0, 0 🔴 (1 🟡 IMG COUNT, intentional) |
| Roundtrip brand-logos | --blocks brand-logos | exit 0 — closed |
| Roundtrip locations | --blocks locations | exit 0 — closed |
| Whole-page roundtrip | block-roundtrip.mjs (no --blocks) | exit 0 — "✓ all blocks: round-trip closed (0 structural 🔴)" |
| Sanitise | sanitise.js on 3 content files | index 6 chars encoded, footer 1, nav 0 |
| qa-gate (#101) | qa-gate.mjs vs harness + schema | exit 0 — "QA GATE: PASS — 25 ok, 0 warn, 0 fail" |
| Visual eyeball (#23) | proto vs harness screenshots @1440 + mobile | hero/chrome/bands/footer match; icon + logo-grayscale deviations documented |
| Interactive drives (#28) | playwright | More dropdown 0→1 + aria-expanded=true; verb dropdown 0→1; tile sticky-reveal persists after mouseleave; mobile burger none→block + aria-expanded=true |
| Font width probe (#77) | in-harness measure | oswald 614.5 ≠ absent 844.4 ≠ roboto-condensed 691.3 → Oswald truly rendering |
| Chrome reservation (#81) | header height probe | 1440/900: reserved 173 = actual 173; 899/390: reserved 156 vs actual 154 (2px deliberate over-reserve) |

NOT run locally (deploy-side by the skill's #101 scope boundary): CLS probe, content-diff,
visual-diff (all DEPLOYED-URL-only), per-page nav/footer metadata override through the real
pipeline, delivered .plain.html asserts, key-facts raw-HTML grep, DA media upload + preview/live.
