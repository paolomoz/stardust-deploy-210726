# EDS conversion log — Wasatch Back Beerworks (home page)

Source prototype: `/Users/paolo/stardust/surly-mode-b-2/stardust/prototypes/home-proposed.html`
Target: vanilla adobe/aem-boilerplate (current-main vintage — see `stardust/runtime-contract.json`).
DA org/repo for authored URLs: `paolomoz/stardust-deploy-210726`.
Scope: single-page conversion (home → `content/index.html`) + chrome. Naming locked by the agent
per the skill's "scale the naming ceremony" rule (single page, self-evident names — no user questions).

## Section triage + naming (LOCKED before any block code)

| Prototype section (`data-section`) | Block? (D1) | Collection match (D11) | Locked name | Decode tier (#95) |
|---|---|---|---|---|
| `founding-hero` (`.ds-hero-cinematic`) | Yes — bespoke cinematic composition (photo bg + '96 monogram + grid-escape rule) | hero (name + content model mirrored; CSS bespoke) | `hero` | **template-slotted** |
| `beer-six` (`.ds-section` + `.ds-beer-grid`) | Yes — 6 repeating card units | cards (container model: one row per card) | `cards` + variant `beers` | **reconstructive** |
| `taproom-pair` (`.ds-taprooms-diptych`) | Yes — 2 repeating photographic panels | none (bespoke diptych) | `taprooms` (derived from `data-section`; the section carries no class and `taproom-pair`'s pair-ness is presentation) | **reconstructive** |
| `brewery-story` (`.ds-story-cinematic`) | Yes — bespoke full-bleed cinematic band with editorial bg image (an authorable image behind text needs a block to layer it; not expressible as default content + closed-set style) | none | `story` | **template-slotted** |
| `founder` (`.ds-founder`) | Yes — image-beside-text | columns (stock block JS kept verbatim; variant CSS only) | `columns` + variant `founder` | reconstructive (stock `columns.js`) |
| `closer` (`.ds-closer-band`) | Yes — bespoke cinematic closer band with editorial bg image | none | `closer` | **template-slotted** |
| `site-header` | chrome | header | `header` (stock block, template-slotted rebuild) | template-slotted |
| `site-footer` | chrome | footer | `footer` (stock block, template-slotted rebuild) | template-slotted |

**Default-content triage (D1):** the section heads of `beer-six` ("Six beers · two seasons · one
range" / "The Lineup" / "See all six") and `taproom-pair` ("Two taprooms · one range" / "Come Drink
Where We Brew" / "Hours & directions") are authored as **default content** in their sections, before
the block, and styled IN PLACE via `.cards-container .default-content-wrapper` /
`.taprooms-container .default-content-wrapper` (first-choice head treatment — no reabsorption
needed; the head sits visually outside the block's grid in the prototype). No standalone
default-content prose sections exist on this page, so the Step-3 closed `style` vocabulary is
EMPTY for this site — no section-metadata blocks are authored at all (only page `metadata`).

**Per-instance variation (#90 fingerprint):** ONE real variation group — `A.ds-beer` × 6, each with
a distinct substrate background + ink direction (tabernacle #5a1a1a/paper, cutthroat #177566/paper,
goldspike #e8b830/ink, antelope #a7c8e3/ink, powder-day #3eb0d8/ink, hoarfrost #1f2c5c/paper). The
substrate key does NOT survive DA, so `cards.js` derives it from the beer-name slug and
`cards.css` carries the six substrate rules (`.cards.beers .ds-beer.beer-<slug>`) + a neutral
default for unknown future beers. This keeps the color decision in the design system, not with
authors (D6 spirit).

## Schema + deliberate drops (#93)

Schema: `stardust/eds-schema/home.json` (all blocks' JSDoc cite it). Deliberate ENCODE decisions:

- Hero "Drink in" scroll cue: presentation-only (aria-hidden in prototype) — lives in the hero
  template, NOT authored. Deliberate drop from the authored content.
- Hero '96 monogram + its meta line ARE authored (founding year is meaning, not decoration).
- Hero meta stats: one `<p>` per stat, label led by `<strong>` (ENCODE sub-field rule — leading
  preserved tag, no invented delimiter). No `<a>` involved so no buttonization side effects.
- Beer card fields: one row per beer, parts as flat siblings in one cell (grouped-item-set rule).
  Style/ABV authored as one line "Imperial Stout · 6.5% ABV" — decode splits on the `·` (this is
  the DA-flattened spec-line shape #50, emitted deliberately because style+ABV is one visual row
  in the prototype). Card link rides the `<h3><a>` (whole-panel anchor rebuilt by the block —
  NOT a button, plain `<a>`, per "when NOT to use the convention").
- Taproom panels: whole-panel anchors; "Visit Heber Valley"/"Visit Park City" authored as trailing
  plain-text `<p>` (it is a styled text label inside the panel anchor, not a button).
- Footer taproom address/phone placeholders kept verbatim (brief marks them placeholder).

## Buttons

`decorateButtons()` on this target requires authored `<strong>`/`<em>` (formatted-only). The home
page has ZERO chip-buttons by design — every link is a text link with goldspike underline
(`.ds-more`, `.ds-tap-cta`) or a whole-card anchor. All CTAs are therefore authored as plain `<a>`
and styled per-block. The global button system in `styles/styles.css` was still rebranded
(goldspike primary / outline secondary / sunburn accent) for future pages.

## Chrome

- `content/nav.html`: section 1 = brand (wordmark link), section 2 = link list `<ul>`. The stock
  three-section contract (brand / sections / tools) is kept; this site has no tools section.
- `content/footer.html`: 4 sections — brand+tagline+email / site links / taprooms / colophon.
- `blocks/header`: template-slotted; keeps hamburger machinery (aria-expanded, Escape close,
  desktop media-query switch at 641px to match the prototype's 640px collapse). Scroll-stuck state
  (`.is-stuck` past 80px) wired in block JS.
- **Header reservation (#81): `--nav-height: 0px`** — deliberate: the prototype chrome OVERLAYS the
  hero (absolute, transparent gradient), it does not sit in flow above it, so the late header load
  displaces nothing and needs no height reservation. The stock `header { height: var(--nav-height) }`
  rule is kept intact with the token at 0.
- Footer needs no reservation (below fold).

## Fonts (Step 4) — decisions + LICENSING ALERT

| Family | Role | License | Decision |
|---|---|---|---|
| **Hebden Incised** | display (`--display`) | **UNKNOWN / presumed proprietary** (captured webfont shipped with the prototype, no foundry metadata) | Self-hosted `fonts/hebden-incised.woff2` for fidelity (#80). **LICENSING ALERT raised in 3 places**: `styles/styles.css` banner, `fonts/LICENSING.md`, this log. Do NOT publish to aem.live until the webfont license is confirmed. Remove path documented in LICENSING.md. |
| Tiempos Text | intended body serif (named first in prototype `--serif`) | Proprietary (Klim), **no font files available** | NOT shipped. Per #77 the prototype itself never loads it — the design's documented intent is its first redistributable fallback. |
| **Source Serif 4** ("Source Serif Pro") | body serif actually shipped | OFL 1.1 | Self-hosted variable latin woff2 (normal + italic; italic is used by beer vernacular + footer `<em>`). wght-only file — the prototype requests no `opsz` axis (#30 n/a; it loads no Google Fonts at all). |

Metric-matched fallbacks (computed with fontTools, declared in `styles/styles.css`):
- `hebden-incised-fallback` ← `local("Arial")`, size-adjust 118.34%, ascent-override 95.8%,
  descent-override 27.85%, line-gap-override 0%. **Width-class note (#80):** the prototype's own
  fallback stack names condensed faces (Trade Gothic Condensed, Impact), but the ACTUAL Hebden
  metrics are wide (caps avg 0.80 em vs Arial 0.68, Impact 0.51, Arial Narrow 0.56) — a condensed
  fallback would be a real width mismatch, so classification-by-measurement picked plain Arial
  with caps-based size-adjust (display face is used all-uppercase). Computed, not assumed.
- `source-serif-fallback` ← `local("Times New Roman")`, size-adjust 127.97%, ascent-override
  80.96%, descent-override 26.18%, line-gap-override 0% (skill's xAvgCharWidth recipe; the
  @fontsource-variable package publishes no Fallback face to lift). Italic swap is not separately
  metric-matched — italic is used only in small vernacular lines/footer notes; CLS impact
  negligible (documented trade-off per Step 4.4/#12).
- `head.html` untouched except the single permitted favicon line (`/favicon.svg`, prototype format
  preserved).

## Images (editorial vs decorative)

All five photographs are EDITORIAL (they carry meaning / sit behind text as campaign-swappable
backgrounds) → authored `<img>` with `content.da.live` URLs; blocks render them into background
layers with CSS scrims over them; ink-ground CSS fallback when the cell is empty:

| File | Used by | Authored URL scope |
|---|---|---|
| home-hero-wide.jpg | hero bg + closer bg (same asset, two authored refs) | media/home/ |
| taproom-heber-valley.jpg / taproom-park-city.jpg | taprooms panels | media/home/ |
| brewery-mash-tun.jpg | story bg | media/home/ |
| brewery-founder-portrait.jpg | columns.founder portrait | media/home/ |

No DA writes in this run (harness scope limit): binaries staged under `media-staging/home/` with
`media-manifest.json` mapping staged file → DA destination → authored URL. Decorative treatments
(scrims, gradients, goldspike rules, the spike diamond) are CSS/template only. Favicon:
`favicon.svg` copied to repo root (+ head.html link).

## Anti-patterns consciously avoided this run

- No `text`/`heading` block around the section heads (D1) — default content, styled in place.
- No section-metadata `style` classes at all (the page has no standalone prose sections).
- Buttons not manufactured in JS; no custom button classes.
- Full-bleed blocks (hero/taprooms/story/closer) override the section-wrapper max-width on their
  OWN wrapper class; constrained blocks (cards, columns.founder) keep the `--container` wrap (#13).
- Prototype's inline scroll/burger `<script>` NOT lifted — rewired in header block JS (#16/D15).
- `main .section:empty { display: none }` added (emptySectionCollapse: true — metadata block
  leaves an empty first section after pipeline consumption).
- Hero `'96`/scroll-cue kept aria-hidden in the decorated DOM (as in the prototype).

## Local-gate rewrites (QA-only)

`content.da.live` media URLs are auth-gated (401 anonymously) — correct for deploy, unloadable in
local probes. The QA harness build post-rewrites `https://content.da.live/paolomoz/stardust-deploy-210726/media/home/<f>`
→ `http://localhost:8791/assets/images/<f>` (the prototype's own static server) so image-dependent
gates exercise real pixels. Deployed content keeps the `content.da.live` URLs; post-preview
`.plain.html` verification is out of scope for this run (no live site) — recorded as not-run.

## Gate log (2026-07-21 — all local; no live site, no DA writes in this run)

| Gate | Command | Result (verbatim summary) |
|---|---|---|
| Runtime probe | read `scripts/scripts.js` + `scripts/aem.js` | `stardust/runtime-contract.json` — buttonization `formatted-only`, `p.button-wrapper`, `.<name>-wrapper`/`.<name>-container`, emptySectionCollapse true |
| Style fingerprint (#90) | `style-fingerprint.mjs` | 1 variation group: `A.ds-beer` × 6, six substrate/ink clusters (reproduced via `beer-<slug>` classes) |
| Section schema (#93) | `section-schema.mjs → stardust/eds-schema/home.json` | `6 sections: founding-hero(14 items, 4×SPAN.), beer-six(9 items, 6×A.ds-beer), taproom-pair(5 items, 2×A.ds-tap-panel), brewery-story(5 items), founder(5 items), closer(3 items)` |
| David's Model lint | `davids-model-lint.mjs content/` | `PASS — 0 🔴, 2 🟡` (story/closer default-content candidates — justified above: editorial bg image behind text needs a block layer) |
| Token completeness (#91) | `comm -23` grep | only `--substrate` printed — a block-PRIVATE property defined per-slug in cards.css with an in-place fallback; justified, not a missing foundation token |
| Project lint | `npm run lint` | exit 0 (after stylelint --fix + 3 manual fixes) |
| Block round-trip per block (#94) | `block-roundtrip.mjs --blocks <name>` | hero/story/closer/cards/taprooms/columns ALL `✓ round-trip closed (0 structural 🔴)`; 🟡 IMG COUNT on hero/taprooms/story/closer = intentional CSS-background→authored-`<img>` conversion |
| Whole-page round-trip (#94) | `block-roundtrip.mjs` (no --blocks) | `✓ all blocks: round-trip closed (0 structural 🔴).` (4 intentional IMG COUNT 🟡) |
| visual-diff (Step 10) | vs local harness | red flags: 5 × `STRETCHED IMAGE` — ALL justified per #45(a): `object-fit: cover` full-bleed bg layers (hero, 2×taprooms, story, closer); no BLANK/FLUSH/GAP/SURFACE flags; mainHeight proto 5819 vs EDS 5742; every heading matches tag/text/color/size, `Hebden Incised` loaded both sides |
| content-diff (#92) | vs local harness | `proto: 41 text nodes — 6 headings, 17 eyebrows, 10 CTAs, 8 body; 1 img` / `EDS: 41 …; 6 img` → `Findings: none — content + roles match` |
| Local QA (decoration) | Playwright vs harness | body.appear ✓, 6 sections, 8 blocks `loaded`, exactly 1 `<h1>` (0 nested), hero wrap non-empty, 6 beer cards w/ 6 correct substrates, 2 tap panels + 2 hrefs, 0 pageerrors, 0 broken images |
| Computed layout (silent-failure guard) | Playwright | hero inner `grid`, beer grid `grid`, diptych `grid`, story inner+body `grid`, founder row `flex`, footer inner `grid` — no grid fell back to `block` |
| Wide viewport (#13) | Playwright @1600 | wraps constrained: hero inner 1200, cards 1136, story inner 1000, founder 1136, footer 1200; full-bleed only where the proto is full-bleed (hero band/diptych/story/closer = 1600) |
| Interactive drive (#28) | Playwright | scroll 600px → `.is-stuck` true, fixed, bg rgb(26,22,18); mobile 390px: burger visible, click → nav flex + aria-expanded=true, Escape → closed |
| CLS probe (#81) | fonts+chrome fetches delayed 1500ms | `CLS 0.0000 PASS (<0.1)` (chrome overlays the hero — no reservation needed; metric-matched fallbacks for both faces) |
| URL gate (#44/#67) | `grep -rn "http://localhost\|aem.page/img\|aem.live/img" blocks/` | empty (exit 1, no matches) |
| Sanitise | `sanitise.js content/*.html` | index: 16 chars encoded; footer: 4; nav: none |

## Fidelity fixes found by the gates (why the loop matters)

- cards/taprooms MISSING CTA 🔴 → decorated anchors concatenated child text with no separators; fixed with whitespace text nodes between children.
- taprooms MISSING CTA 🔴 → the authored `<img>` inside the whole-panel anchor made the classifier read it as an image link; restructured to bg-layer sibling + stretched text link (also better a11y: accessible name = panel copy).
- columns ROLE SWAP 🔴 → the PROTOTYPE's founder eyebrow actually computes 21px SERIF (its `.ds-founder-copy p` rule out-specifies `.ds-eyebrow`); matched the rendered prototype, not the nominal class.
- MISSING EYEBROW 🔴 → curly vs straight apostrophes ('96/'99/isn't/aren't — prototype uses straight ASCII); authored content now matches the prototype text verbatim.
- Mid-word wrap "ORIGINA/L" → the boilerplate's `a:any-link { overflow-wrap: break-word }` reached headings inside whole-panel anchors; `overflow-wrap: normal` restored on `.ds-tap-link`/`.ds-beer`.

## Not done in this run (requires deploy / out of local scope)

- git push / AEM Code Sync build; DA Source API PUTs (content + nav + footer + 5 media binaries — see `media-manifest.json`); admin.hlx.page preview/live POSTs.
- Delivered `.plain.html` verification (img+alt count, about:error grep, one-h1 on DELIVERED HTML) — post-preview by contract.
- Computed-style gate on the DELIVERED live URL (run locally instead — see gate log).
- `#79` `<p>`-unwrap verification against a real pipeline render (decodes read cells/queries, not `querySelectorAll('p')`-only, and multi-element cells keep their `<p>`s; single-text cells are read via `textContent`).
- Key-facts raw-HTML grep (#86): no `DESIGN.json.extensions.metadata.keyFacts[]` exists for this site — gate skipped per contract (skip-and-note).
- PSI / Lighthouse 100 target (AGENTS.md publishing step) — needs the deployed preview URL.
