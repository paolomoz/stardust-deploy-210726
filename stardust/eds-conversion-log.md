# The Road Home — stardust:deploy conversion log

Prototype: `fable-uplift-theroadhome/stardust/prototypes/home-A-proposed.html` (single home page).
Target: `paolomoz/stardust-deploy-210726`, branch `theroadhome-e2e` (from stock main).
**Subfolder site**: page at `/theroadhome/`, chrome at `/theroadhome/nav` + `/theroadhome/footer`,
media at `media/theroadhome/`. Internal links root-relative under `/theroadhome/`.
Deploy target: branch **preview (aem.page) only** — no publish to aem.live.

## Runtime contract (probed)
Stock adobe/aem-boilerplate (+ a `widget` auto-block, unused here). Buttons: formatted-only,
`a.button.primary`(strong)/`.secondary`(em)/`.accent`(em+strong) in `p.button-wrapper`.
Block wrapper `.block`, section `.<name>-container`, wrapper `.<name>-wrapper`. See runtime-contract.json.

## Section triage + names (locked)
| # | proto section (data-section) | EDS treatment | block name | decode tier |
|---|---|---|---|---|
| chrome | crisis-strip | nav utility band (section 1 of /nav) | header | template-slotted |
| chrome | header | nav brand/sections/tools | header | template-slotted |
| 1 | hero | block (full-bleed photo + scrim + h1 + deck + 2 CTAs) | `hero` | template-slotted |
| 2 | join-team-band | **default content** (D1) + section style `join` (dusk band) | — | — |
| 3 | ways-3up | block, 3 whole-card photo links (photo+icon+title+arrow) | `ways` | reconstructive |
| 4 | proof-band | block (harbor band: head+2 marks + 3 stats) | `proof` | reconstructive |
| 5 | housing-resources | default-content head/outro + block (3 icon+title cards) | `resources` | reconstructive |
| 6 | stories-grid | default-content head + block (6 story cards) + MORE STORIES cta | `stories` | reconstructive |
| 7 | newsletter | default-content head + block (interactive subscribe form) | `newsletter` | template-slotted (form) |
| chrome | footer / footer-bottom | footer doc (link cols + brand + social) | footer | template-slotted |

Block names match prototype section classes; none reserved. `hero`/`footer`/`header` stock demo
blocks are overwritten on this branch (isolated; only /theroadhome/ deploys here).

## Role inventory (from section-schema.mjs) — the ENCODE/DECODE contract
See `stardust/eds-schema/theroadhome.json`. Key gotchas honored:
- **Stat numbers stay NON-heading** (`<span>`) → proto classifies them `body`; an `<h*>` = ROLE SWAP 🔴.
- **Whole-card `<a>` with imgs is NOT a CTA** in the classifier (image link) → ways titles/arrows inside
  the anchor are not counted; imgCount 6 (3 photos + 3 icons) is the only ways signal.
- **wrapTextNodes (#104)**: a media-led mixed cell folds into one `<p>`. So resource/stat/story cards
  author icon and text in SEPARATE cells (never `<picture>`+`<h3>` in one cell) to keep the heading role.

## Image strategy
Editorial (uploaded to DA `media/theroadhome/`, authored as `content.da.live` `<img>`):
hero photo (slide-1), 3 way photos, 3 way icons (svg), 2 proof marks (charity + centennial png),
3 stat icons (svg), 3 resource icons (svg); chrome: nav logo, footer 100-year logo, footer-bottom logo.
Decorative CSS-only (root-relative fixed asset, committed to repo, not ingested):
resources watermark (`blocks/resources/watermark.png`, opacity 0.07).
Story portraits: prototype provenance marks them **unsourced placeholders** (stock photos pending brand
photography) rendered as initials tiles. Decision: reproduce the initial-avatar design; the block derives
the initial from the name. **Drop the "PLACEHOLDER · other" dev label** (scaffolding) → yields 🟡 MISSING
BODY ×6 on content-diff, justified here (not shipping dev annotations on a live nonprofit site).

## Fonts (Step 4) — ⚠ LICENSING
Brand faces are **proprietary commercial** (self-hosted for fidelity per #80; licensing alert raised):
- HarmoniaSans (Monotype) — heading. Weights 400/500/700/900.
- DINNextLTPro (Linotype/Monotype) — body. Weights 400/700.
Metric-matched fallbacks (Arial, both sans): harmonia size-adjust 100.13% asc 72.90% desc 26.96%;
dinnext size-adjust 97.87% asc 76.63% desc 25.54%. See `fonts/LICENSING.md`.

## Links
Internal theroadhome.org links → root-relative `/theroadhome/...` (subfolder convention). External
(applytojob.com careers, social, tel:) stay absolute. Single-page slice: internal siblings (get-help,
give-main, donate, …) are not deployed → those links 404 on this preview by design (structure correct).

## Gate results (final)
- token-completeness: clean · url-bake grep: clean · David's Model lint: **0 🔴**, 10 🟡 (proof ragged rows; 9 pure-vector SVG advisories — verified)
- block-roundtrip (all blocks): **0 structural 🔴**
- qa-gate (harness): **PASS** 29 ok / 0 warn / 0 fail
- deployed .plain.html: HTTP 200, 0 about:error, 1 `<h1>`, 15 `<img>`, 0 `/img/` srcs
- deployed computed-style guard: 8 blocks decorated, all grids compute grid, hero flex, 0 broken imgs, 0 pageerrors, join band = dusk
- content-diff (deployed): **0 structural 🔴** (6 🟡 placeholder-label drops; 1 🟠 FONT FORK = width-probe noise, HarmoniaSans confirmed loading)
- visual-diff: no blank render, no flush-left; STRETCHED flags all object-fit:cover (justified #45)
- CLS (deployed, fonts+nav delayed): **0.0103** (<0.1)

## Defects caught by gates and fixed
1. **ways icons dropped on live** — `row.querySelectorAll('picture, img')` double-counted each pipeline
   `<picture>`+child `<img>`, so `imgs[1]` was the photo's own img and the icon SVG was dropped (harness
   used bare imgs so roundtrip passed; caught by the live img audit). Fixed: select one media element per cell.
2. **hero CTAs rendered as plain links** — both CTAs shared one `<p>`, so `decorateButtons()` (buttonizes a
   link alone in its paragraph) skipped them. The harness doesn't run decorateButtons so roundtrip passed;
   caught by the deployed-URL eyeball. Fixed: one CTA per `<p>`; hero.js collects all CTA paragraphs.

## Favicon
Extract captured no favicon (only logo.png). Per skill, skip — stock `favicon.ico` left in place.
Follow-up for full launch: ship The Road Home favicon.
