# EDS conversion log — sos.org index (subfolder site `/sos/`)

Run: 2026-07-22 · prototype `semrush/sos/stardust/prototypes/index-proposed.html` · target branch `sos-e2e` (stock adobe/aem-boilerplate) · DA org/repo `paolomoz/stardust-deploy-210726`. Single-page conversion — names locked without user questions per SKILL.md Step 2 ("scale the naming ceremony").

## Runtime contract (probed, `stardust/runtime-contract.json`)

Vanilla EDS current-main vintage: `formatted-only` buttonization, `a.button.primary/.secondary/.accent` in `p.button-wrapper`, `.block` wrapper class, `wrapTextNodes` wraps bare-text cells in `<p>`. `emptySectionCollapse: true` → `main .section:empty { display: none }` added to foundation.

## Step 2 triage + names (LOCKED)

| Prototype section | Triage (D1) | Block / treatment | D11 collection | Decode tier (#95) |
|---|---|---|---|---|
| hero | block (bespoke full-bleed composition: bg image + scrim + eyebrow/h1/lede/CTAs) | `hero` | hero (name + model mirrored) | reconstructive, query-based (#42) |
| event-promo | block (2-cell split-media) | `columns` variant `event` | columns | reconstructive (generic columns) |
| quote-band | block (quote pattern) | `quote` | quote (row1 quote, row2 attribution) | template-slotted |
| recent-talks | block (2 repeating cards) + section head + trailing view-all as DEFAULT CONTENT | `cards` variant `talks` | cards (1 row/card: image cell + body cell) | reconstructive |
| featured-video | DEFAULT CONTENT — lone Vimeo URL is D1 auto-blocked to `video` block via `buildAutoBlocks()`; "Featured video" caption line stays prose | auto-block `video` | video | n/a (auto-block) |
| webinars | block (3 repeating tiles) + head default content | `cards` variant `webinars` | cards | reconstructive |
| spiritual-insights | block (bespoke side-rail: pull-quote + featured card + 5-item list rail) + head default content | `insights` | none (bespoke) | reconstructive (row-classified) |
| happenings | block (3 repeating cards) + head + trailing view-all default content | `cards` (default grid skin) | cards | reconstructive |
| books | block (5 repeating cover figures) + head default content | `books` | none (bespoke rail) | reconstructive |
| articles | block (3 repeating cards) + head default content | `cards` (default grid skin — same pattern as happenings) | cards | reconstructive |
| featured-videos | block (3 repeating video facades w/ title+description) + head default content | `videos` | none (video-grid, bespoke) | reconstructive |
| about | block (2-col prose — structure default content can't express) + head default content | `columns` variant `about` | columns | reconstructive |
| cta-band | DEFAULT CONTENT (prose + CTAs, no repeating units, no bespoke structure) — section style `cta` | — | — | n/a |
| header (chrome) | authored `/sos/nav` document + `blocks/header` | `header` | — | template-slotted |
| footer (chrome) | authored `/sos/footer` document + `blocks/footer` | `footer` | — | template-slotted |

Same-pattern collapse (D9): talks / webinars / happenings / articles are all card grids → ONE `cards` block, variants `talks`, `webinars`, default. event-promo / about are both one-row 2-cell splits → ONE `columns` block, variants `event`, `about`. Genuinely bespoke sections (`hero`, `insights`, `books`, `videos`) stay their own blocks.

Section `style` closed set (default-content sections only): `cta` (centered serif lead + inline CTA row). Nothing else.

## Fingerprint (#90)

`style-fingerprint.mjs`: no per-instance variation inside any repeat group except `about`'s two columns (kids 5 vs 3 — legitimate: distinct column content, preserved verbatim by the columns block). No active-chip/accent-card variants to reproduce.

## Schema (#93)

`stardust/eds-schema/index.json` — 13 sections; repeats all `uniform: true` except about (2 non-uniform cells, expected). Every block's JSDoc cites this schema. Deliberate drops: none — every schema item is authored.

## Images (migration rules)

`_crawl-log.json#discovery.fetchTechnique = "headless"` (not headed-chrome) and origin serves a bare curl → bare-curl 200 verification permitted. All editorial images REHOSTED: downloaded from www.sos.org → `media-staging/sos/<lowercased-file>`, authored as `https://content.da.live/paolomoz/stardust-deploy-210726/media/sos/<file>` (auth-gated — exempt from anon pre-author 200-check per SKILL; harness rewrites them to local staged copies for QA only). Manifest: `media-manifest-sos.json`. Name normalization: lowercased; `_` → `-`; trailing `-` inside a segment stripped (`the-science-of-all-sciences-.jpg.webp` → `the-science-of-all-sciences.jpg.webp`); DA-path rule (no trailing `-`/`_`, no double slash).

Hero image keeps the prototype's deliberate `alt=""` (pure background under a scrim; D13 — no data in alt). All other images carry the prototype's alt verbatim.

Decorative/CSS-only: hero scrim gradient, gold rules (quote/about), video facade gradient + play glyph — CSS/inline-SVG in owning blocks, not content.

## Fonts (Step 4)

- Prototype stacks: heading `'adobe-caslon-pro', 'Lusitana', Georgia, serif`; body `'Jost', 'Century Gothic', 'Futura', sans-serif`. Prototype loads Jost 400/500/600 + Lusitana 400/700 from Google Fonts; **adobe-caslon-pro is named but never loaded** (Adobe Fonts/Typekit, proprietary, no files available) — per #77 the shipped display face is the prototype's own intended redistributable fallback **Lusitana** (SIL OFL 1.1).
- Self-hosted: `fonts/jost-variable.woff2` (@fontsource-variable, latin wght 100–900 — prototype loads no opsz axis), `fonts/lusitana-400.woff2` + `fonts/lusitana-700.woff2` (@fontsource static — Lusitana ships no variable axis, #11). Declared in `styles/fonts.css` only.
- Metric-matched fallbacks in `styles/styles.css`: `jost-fallback` ← local Arial (calibration lifted from @fontsource-variable/jost index.css); `lusitana-fallback` ← local Times New Roman (computed with fontTools per #11 — serif classification, normal width; Lusitana is not condensed so no condensed-analog needed).
- Stacks: `--heading-font-family: 'adobe-caslon-pro', 'Lusitana', 'lusitana-fallback', georgia, serif` (adobe-caslon-pro kept first for brand fidelity if Typekit is ever licensed/added; it resolves to Lusitana everywhere today); `--body-font-family: 'Jost', 'jost-fallback', sans-serif`.
- **LICENSING NOTE (#80):** no proprietary font FILES are shipped (nothing to license for the shipped bundle — both shipped faces are OFL). `adobe-caslon-pro` remains only as an unshipped first stack entry; if the client wants true Adobe Caslon Pro it requires an Adobe Fonts license + Typekit CSS (documented CDN coupling trade-off) — flagged in the hand-off report.
- Jost renders eyebrows/labels at 600, headings h2+ (`.headline`) are Jost 600 — weights inside the variable file. Caslon/Lusitana headings render 400 per prototype (`font-weight: 400` on hero h1/event h2/quote/cta lead).

## Buttons (D6)

- Primary (`<strong><a>`) → gold fill `--color-gold` / navy text (prototype `.btn-primary`).
- Secondary (`<em><a>`) → solid navy `--color-accent` / white text (prototype `.btn-secondary`).
- Accent combo: unused on this page.
- Text links ("Find a Center", "View All Posts", "See all happenings", insight/card "Read …" links, footer links) are NOT buttons — plain `<a>`, styled per-block / via `.default-content-wrapper` rules (SKILL "When NOT to use the convention").

## Chrome (Step 6)

- `content/sos/nav.html`: 3-section contract — brand (logo `content.da.live` img in a link), sections (6 topic/org links), tools (two lists: utility-primary, utility-secondary incl. EN). Header block template-slots: navy utility bar (tools) above masthead (nav-left 3 / logo / nav-right 3), keeps stock hamburger machinery; desktop switch at 901px to match prototype; `:scope > a, :scope > p > a` trigger lookup (#98).
- `content/sos/footer.html`: sections = 4 link columns (h3 + ul) + legal section (privacy/terms list + brand line). Footer block slots them into `.footer-grid` + `.footer-bottom`.
- Every content page carries `nav: /sos/nav` + `footer: /sos/footer` metadata rows (subfolder chrome variant mechanism).
- `--nav-height` measured from the harness render per breakpoint (#81), header background set on bare `header`.

## Internal links

All `https://www.sos.org/<path>` internal hrefs → root-relative `/sos/<path>` (subfolder scope). External (facebook/instagram/youtube/twitter/vimeo player URLs) stay fully qualified (D4).

## Anti-patterns consciously avoided

- No `text`/`heading` block around cta-band or featured-video prose (D1).
- Section heads authored as default content, styled in place via `.<name>-container .default-content-wrapper` — no reabsorption needed anywhere (all heads sit outside the block grids). Zero-pixel-change rule not triggered.
- No font lines in `head.html` (only the favicon link — the one permitted edit). Favicon: captured `favicon.jpg` → repo root + `<link rel="icon" href="/favicon.jpg">`.
- Video URLs not authored as an embed block (featured-video = auto-block); the `videos` grid is a legitimate repeating block whose cells carry titled links.
- Block CSS paints its own sections (white bands via `.section:has(...)` / `.<name>-container`); the `cta` style value exists only for the default-content cta-band.
- No `<span class>` relied on in cells (prototype `.label`/`.title` spans re-created in decorate()).

## Scope limits honored (harness-imposed)

No git commit/push, no DA writes, no admin.hlx.page calls. Stopped after Local-QA-before-deploy. Gates that REQUIRE deploy could not run (listed in run report): deployed-preview CLS probe (#100), post-deploy content-diff/visual-diff vs live URL (run locally vs harness instead), delivered `.plain.html` img/alt-count + about:error checks, #98 live `<p>`-wrap nav verification (decode written to tolerate both shapes).

## Gate results (final)

| Gate | Result (verbatim summary) |
|---|---|
| `style-fingerprint.mjs` (#90) | only `about` group >1 cluster (kids 5 vs 3) — legitimate distinct-column content |
| `section-schema.mjs` (#93) | `schema → stardust/eds-schema/index.json` — 13 sections, repeats uniform except about |
| `sanitise.js` | "no non-ASCII characters found" ×3 (index/nav/footer — authored with entities) |
| `davids-model-lint.mjs content/sos/` | `PASS — 0 🔴, 4 🟡` — exit 0 |
| token-completeness (#91) | `comm -23` output empty |
| URL gate (#44/#67) | `grep localhost\|aem.page/img\|aem.live/img blocks/` → no matches |
| wrap-rule gate (#74) | hero-content / header .wrap / footer .wrap all have matching CSS rules |
| `npm run lint` | exit 0 (eslint + stylelint clean after fixes) |
| `block-roundtrip` per block | hero, quote, columns[0..1], cards[0..3], insights, books, videos — ALL "✓ round-trip closed" |
| `block-roundtrip` whole page (#94) | "✓ all blocks: round-trip closed (0 structural 🔴)." exit 0 |
| Playwright QA gate (qa/sos/qa-gate.mjs) | `QA GATE: PASS (0 failures)` — 57 assertions: 0 pageerror, 1 <h1>, 13 sections, all grids compute grid/flex, all counts == authored (2/3/5/1/5/3/3/3 …), 0 broken images, 24/24 imgs, section paints correct, wide-1600 constrained (1136px, hero full-bleed), hamburger drive + Escape pass |
| CLS probe (fetch-delayed fonts+chrome) | `1440x900 CLS = 0.0001 PASS`, `375x800 CLS = 0.0046 PASS` |
| `visual-diff` (vs local harness) | 6 STRETCHED IMAGE advisories, ALL justified per #45(a): hero bg + 5 insight-list 96×60 thumbs are object-fit:cover crops the prototype itself declares. No BLANK RENDER / FLUSH-LEFT / GAP / IMAGE-DID-NOT-LOAD flags |
| `content-diff` (vs local harness) (#92) | `proto: 71 text nodes — 22 headings, 8 eyebrows, 18 CTAs, 23 body; 24 img` == EDS 71/22/8/18/23/24. `Findings: 1 (0 structural 🔴)` — one 🟠 FONT FORK, the #77 correct direction (proto fell back to system for one heading; EDS ships the intended Jost) |

### 🟡 advisory justifications (davids-model-lint)

- **hero** "prose-only block": genuine bespoke composition — full-bleed editorial bg image + scrim + the page `<h1>` + CTAs (Block Collection hero pattern, D11). Not default content.
- **quote** "prose-only block": Block Collection `quote` shape verbatim (quotation row + attribution row, D11).
- **insights** D3 ragged rows (1 vs 2 cells): intentional container shape — quote row is 1 cell, featured/list rows are image+body; decode classifies by content, no spans authored.
- **videos** "prose-only block": repeating 3-unit pattern with per-unit title/description/player-link consumed into facades — a real block, not prose.

### Chrome height measurements (#81)

Measured on the harness: 183px desktop, 159px ≤900px, 203px ≤519px (utility links wrap). `--nav-height` set 184/160/204 (1px over). Bare `header` painted with a navy-over-cream gradient matching the two chrome bands. CLS probe confirms ≈0.

### Harness-only adaptations (never shipped)

`qa/sos/build-harness-sos.mjs`: (1) rewrites auth-gated `content.da.live` media URLs to local `/media-staging/sos/` copies; (2) injects `<meta name="nav|footer">` → `/qa/sos/{nav,footer}` and emits `.plain.html` chrome fragments (the metadata nav/footer override needs the pipeline); (3) applies the pipeline's rendering-v2 section-metadata transform (style value → section class, block removed) — this runtime's client `decorateSections` no longer consumes section-metadata, the server does.

### Verify at deploy time (could not be done locally — no DA writes/pushes allowed this run)

1. Upload 25 staged binaries per `media-manifest-sos.json`, then delivered `.plain.html`: 24 `<img>` + alt count, zero `about:error`, `<body>` wrapper intact, one `<h1>`.
2. `section-metadata style=cta` renders server-side as a section class (rendering version ≥2) — confirmed only via harness simulation.
3. #98 live nav `<p>`-wrap shape — header decode already matches `:scope > a, :scope > p > a`.
4. CLS + computed-style gate against the DEPLOYED preview URL (#100/#86) and PSI.
5. `content-diff`/`visual-diff` against the live branch URL (run here against the harness — all green).
6. Video auto-block + `videos` facades on live (CSP nonce environment).
