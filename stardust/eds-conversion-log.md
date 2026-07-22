# EDS conversion log — interacoustics index-B (subfolder site `/interacoustics/`)

Source prototype: `/Users/paolo/stardust/semrush/interacoustics/stardust/prototypes/index-B-proposed.html` (variant B "record sheet").
Target: stock adobe/aem-boilerplate main, branch `interacoustics-e2e`. DA org/repo: `paolomoz/stardust-deploy-210726`.
Scope: ONE page (`content/interacoustics/index.html`), chrome docs, no deploy (harness-imposed — stop after Local QA).

## Runtime contract
See `stardust/runtime-contract.json` — current boilerplate main vintage: `p.button-wrapper`, formatted-only buttonization,
`.block` + `.<name>-wrapper`/`.<name>-container`, empty metadata section needs `main .section:empty { display:none }`.

## Step-2 triage + naming (LOCKED — single-page rule, no user questions needed)

| Prototype section (`data-section`) | Triage (D1) | Block name / treatment | Decode tier (#95) |
|---|---|---|---|
| header | chrome | `blocks/header` + authored `/interacoustics/nav` | template-slotted (stock hamburger machinery kept) |
| banner (announcement strip) | DEFAULT CONTENT — prose + one CTA (D1: no repeating units; the dismiss control is site behavior, not authored structure) | section-metadata `style: banner` (meadow strip); CTA authored `<strong><a>` with a surface-aware `.section.banner a.button.primary` card-chip override (#41); dismiss button attached as progressive enhancement in `scripts/delayed.js`. First section inside `<main>` (prototype places it between header and main — visually identical). Note: this also keeps main's BLOCK order aligned with the prototype's main-section order (the banner lives outside the prototype `<main>`, so it is absent from the section schema). | n/a |
| hero | block — bespoke composition (video chapter + announcement rail) | `hero` (Collection name reuse D11: mirrors collection hero's content-row model; CSS/JS fully bespoke) | template-slotted |
| products-ledger | block — 6 repeating units | `products`; section head (h2 + portfolio lede) = default content REABSORBED (head is a grid cell — sticky rail — of the same grid as the ledger) | reconstructive |
| integration | DEFAULT CONTENT — pure prose (h2 + p + text link), no repeating units | section-metadata `style: tinted` (mist panel). No block. | n/a |
| affinity-fullrange | block — split-media promo + ruled full-range row | `affinity` | reconstructive (classified roles) |
| academy | block — asymmetric bleed grid (text + edge-bleeding image) | `academy` | reconstructive (fixed roles) |
| events | block — 3 repeating record-sheet rows | `events`; section head = default content styled IN PLACE (head sits above the sheet, outside its grid); trailing "All upcoming events" link = default content after the block | reconstructive |
| sustainability | block — dark statement chapter w/ editorial background image | `sustainability` (authored bg `<img>` rendered as background layer + scrim; forest fallback) | template-slotted |
| blog | block — feature + 3 dateline units | `blog`; head (h2 + "View All") = default content styled in place (flex row) | reconstructive |
| decision-band | block — closing CTA band w/ ruled trust facts | `decision` | reconstructive (2 fixed cells) |
| newsletter | block — interactive form | `newsletter`; head (h2 + lede) = default content styled in place; form composition template-slotted in JS (labels are structural chrome, D15); smallprint = authored rows | template-slotted form + authored smallprint |
| footer | chrome | `blocks/footer` + authored `/interacoustics/footer` | template-slotted |

- No block named after a reserved class. No cross-section pattern merges: every main-section pattern here is genuinely distinct (ledger ≠ record sheet ≠ newsroom), so no variant-collapse candidates (the D9 exception does not apply on a single page).
- Collection check (D11): `hero` matches collection hero naming/content-model; no other section matches a collection pattern (cards/columns/accordion etc.) — invented names derive from prototype section classes / `data-section`.
- Component-model shapes: all blocks are "simple" (one property per row) or "container" (one row per unit); metadata is key-value. OK.

## Step-1 probes
- `style-fingerprint.mjs`: only trivial variation groups — hero `SPAN.fact` (last fact lacks separator span), decision `A.` (one proof link carries a nowrap span), newsletter smallprint (one carries a link). All structural artifacts, reproduced naturally; no flattening risk. Grounds noted (anti-pattern 1b): hero/sustainability/decision = forest `#122A1F` dark; integration/newsletter = mist; events = card; banner = meadow; others = ground. No cross-ground merges performed.
- `section-schema.mjs` → `stardust/eds-schema/index.json`: hero 3×fact, products 6×LI (uniform), events 3×LI, blog 3×LI dateline (+1 feature), decision 2×proof-link, newsletter 3×field+2×smallprint.

## Buttons (D6 mapping)
- `.btn-primary` (pine fill) → authored `<strong><a>` → `a.button.primary` (hero CTA).
- `.btn-secondary` (pine outline) → authored `<em><a>` → `a.button.secondary` (events "Sign up" ×3, affinity full-range "Browse our solutions").
- `.btn-meadow` (meadow fill on forest) → authored `<em><strong><a>` → `a.button.accent` — exactly ONE on the page (decision band), matching the "sparingly" rule.
- `.btn-banner` (banner chip) and header CTA: plain `<a>` inside chrome/banner blocks, styled by the owning block (block-applied variant — the #25 escape hatch; the choice stays with the design system).
- Arrow links ("Learn more …→") are NOT buttons: plain `<a>`; arrow rendered via CSS `::after` (owning block CSS, or foundation rule for default-content sections) — avoids authored `<span class="arr">` entirely (#39; DA strips spans). Authored link text carries no arrow glyph (idempotent by construction, #70).
- Ledger rows / whole-row anchors: authored as `<h3><a href>` per unit; block builds the whole-row anchor (anti-pattern 12: not buttons).

## Fonts (Step 4) — decision
The prototype declares NO webfont: `--heading/body-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` and loads zero `@font-face`. Design intent (#77) IS the system stack. Therefore:
- No brand `@font-face`, no woff2, `styles/fonts.css` emptied (loadFonts() loads a no-op file); stock roboto woff2 files removed from `fonts/`.
- No metric-matched fallback faces needed — nothing ever swaps; font CLS = 0 by construction.
- NO licensing alert needed (#80): no proprietary or OFL faces shipped.

## Images — sourcing decisions
`_crawl-log.json#discovery.fetchTechnique = "headless"` → bare-curl verification permitted (per harness note). ALL source-CDN images verified 200 and REHOSTED (skill default: rehost over hotlink): staged under `media-staging/interacoustics/` (lowercased), authored as `https://content.da.live/paolomoz/stardust-deploy-210726/media/interacoustics/<file>`; manifest at `media-manifest-interacoustics.json`. No uploads performed (harness scope — deploy side pushes the staging dir).
- `logo-dark.svg`: pure-vector (0 embedded rasters, #99 ok) — used in nav + footer docs.
- Hero poster: decoded from the prototype's data-URI (960×540 JPEG) → `hero-poster.jpg` (authorable content image; data-URIs are not authorable).
- Hero background video `evo-compress.mp4` (12.2 MB): staged too; authored as a plain link in the hero block; block JS reproduces the prototype's gating byte-for-byte in spirit: preload=none, poster-first, playback only ≥801px AND not prefers-reduced-motion, deferred via IntersectionObserver + requestIdleCallback, visible aria-pressed Pause/Play toggle, hidden ≤800px.
- `sustainability.webp` is a CSS background in the prototype but sits behind text+scrim → EDITORIAL per skill → authored `<img>`, block renders it as a background layer with scrim `::before` and forest fallback.
- Decorative treatments (scrims, duotone meadow-multiply overlays, hairlines) = CSS only.
- Favicon: extract captured `assets/favicon.png` → repo root `favicon.png` + the ONE permitted `head.html` line.

## Key facts (#86)
`DESIGN-B.json extensions.metadata.keyFacts` exists (4 facts). Server-rendered page content carries: fact 1 verbatim inside the hero lede; "More than 50 years of experience", "800+ employees worldwide", "25 sales offices, present in 100 countries" verbatim in the decision block's trust list (authored content, not chrome). NOTE: keyFacts string 3 is "800+ employees worldwide (200 in Denmark)" — the prototype (both variants) renders only "800+ employees worldwide"; the "(200 in Denmark)" tail is not prototype content and was not invented. Raw-HTML grep is a deploy-side gate; noted for the deploy judge.

## Gate results (Local QA — final)
- `davids-model-lint.mjs content/` → **PASS, exit 0 — 0 🔴, 4 🟡**. 🟡 justifications: (a) 2× authored `.svg` logo — verified pure-vector (0 `<image>`/`data:image` refs, #99 safe); (b) `decision` block "prose-only, default-content candidate" — genuine bespoke band (two-column dark chapter, ruled trust-fact list, accent CTA + proof links; not expressible as prose + style value); (c) `newsletter` — interactive form block (template-slotted fields), not prose.
- Token-completeness (#91) `comm -23` → **empty**.
- URL gate (#44) `grep localhost|aem.page/img|aem.live/img blocks/` → **empty**.
- `npm run lint` (eslint + stylelint) → **exit 0**.
- `sanitise.js` all three content docs → "no non-ASCII characters found" (authored as entities).
- `block-roundtrip.mjs` per block AND whole page (`--map "affinity=[data-section='affinity-fullrange']"`) → **exit 0, 0 structural 🔴** on all 9 blocks. Remaining 🟡 (all intended): hero + sustainability `IMG COUNT proto 0 / EDS 1` (prototype backgrounds are CSS/data-URI; EDS authors them as editorial images per the skill's image rule); newsletter `EXTRA "Thank you for signing up!…"` (the block's JS confirmation message, hidden until submit).
- `qa-gate.mjs` (harness, with eds-schema) → **PASS, exit 0 — 33 ok, 4 warn, 0 fail**. Warn justifications: `newsletter no matching page block by order` — the gate's order-matcher can't align schema sections with D1 default-content sections (verified manually: 3 fields + button render; per-block roundtrip closed); 3× `wide-1600 full-bleed` on hero/academy/sustainability — correct, those prototype sections ARE full-bleed (content constrained by inner shell/grid columns).
- Hand-written interactive drives (#28, `qa/ia-drive.mjs`) → **PASS 32/32**: banner dismiss, video toggle aria-pressed + constant name, newsletter invalid/valid submit, mobile hamburger open/Escape-close, hero-video hidden ≤800px, per-block unit counts + own-slot assertions (6 ledger rows w/ loaded thumbs + reabsorbed head, 3 events + subtitle, feature + 3 datelines, 3 trust facts + 2 proof links + 1 accent CTA, 7 nav links, 4 footer cols + 3 social icons).
- Per-section visual eyeball (#23): proto vs harness screenshot pairs at 1440 for all 13 sections (qa/shots/pair-*.png) — matched.

## Findings fixed during Local QA (worth knowing)
1. **`wrapTextNodes` folds media-led cells into one `<p>`** (aem.js: a cell whose first child is `<img>`, or `<picture>` + siblings, gets ALL children wrapped in a single `<p>`). Every block that classifies flat cell children now expands that wrapper first (`cellNodes()` helper in hero/products/affinity/academy/sustainability/blog). Without it, products rendered thumbnails with NO titles/descriptions and blog dropped a dateline unit — while roundtrip (different renderer) and count-based gates passed.
2. **Font fork from lowercasing `BlinkMacSystemFont`**: Blink maps the exact name `BlinkMacSystemFont` → system-ui; the lowercased form does not match, so EDS fell through to Helvetica Neue while the prototype rendered the SF system face (h1 wrapped to 2 lines; `16ch` = 516px vs 563px). Fixed by using the standard `system-ui` keyword in the stack. Verified by width probe (#77): both sides now render the h1 at 528px.
3. **Section-metadata is pipeline-rendered (rendering v2+)** — this boilerplate has no client-side section-metadata handling; the harness emulates the pipeline (style → section class, block removed). On the deployed site the pipeline does this server-side; locally qa harness post-processing applies it.
4. **CTA decode is dual-shape**: `a.button` when `decorateButtons` ran; emphasis-wrapped `<a>` otherwise (roundtrip harness renders undecorated shapes). Hero/affinity/decision use both detections.
5. **`hidden` attribute vs CSS display**: `.newsletter-form { display: grid }` overrides the UA `[hidden]` style — an explicit `[hidden] { display: none }` rule is required.

## Deploy-side steps NOT run (harness scope: stop after Local QA)
- git commit/push + AEM Code Sync; DA media uploads (media-staging/ + manifest are ready); content `PUT` via DA Source API; `POST /preview` + `/live`.
- Delivered `.plain.html` asserts (200, one `<h1>`, 0 `about:error`, `<img>`+alt count), key-facts raw-HTML grep (#86 — see Key facts note), live computed-style layout gate, CLS probe (#101 — deployed URL only), `content-diff` + `visual-diff` (Step 10 — deployed URL only), per-page `nav`/`footer` metadata verification (pipeline-applied only), PSI check.

## Site-specific notes
- `--nav-height: 116px` (utility strip 44px + logo/nav row 72px) at ALL widths — both bars have fixed min-heights, so the reservation is deterministic; bare `header` gets the chrome's `--card` ground (#81). ≤800px the header sticks at `top: -44px` so the utility strip scrolls away (prototype fix #11), height in flow unchanged.
- Banner is page content (not chrome): per-page dismissible announcement; dismiss button removes the whole section (JS-rendered button — not authorable).
- Events date cell: authored as one string "Jul 14, 2026 - 9:00 am"; block splits at the first ", " into stacked dd/dm presentation (aria-hidden) and keeps the verbatim string sr-only — mirrors the prototype's a11y treatment.
- Newsletter form has no backend in the prototype; block prevents default and shows an inline confirmation. Labels/fields are fixed template chrome; smallprint (with privacy link) is authored.
- Deliberate drops from authored content: none. Structural chrome not authored (by design): events column headers "Date"/"Course or webinar" (block-rendered, as in prototype's own classification), newsletter field labels, social icon SVGs (block-inline, keyed to authored link hrefs).
