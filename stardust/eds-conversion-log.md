# FlexiLoans — EDS conversion log (branch `flexiloans-e2e`, subfolder site `/flexiloans/`)

Source prototype: `/Users/paolo/stardust/semrush/flexiloans/stardust/prototypes/index-proposed.html`
(single page, self-contained; images under `stardust/current/assets/media/`, fonts under `prototypes/assets/fonts/`).
DA target: org `paolomoz`, repo `stardust-deploy-210726`. This run made **no network writes** (no git push, no DA
writes, no admin.hlx.page calls) — it stops after the Local-QA-before-deploy stage.

## Subfolder scope

- Content page: `content/flexiloans/index.html` → delivered at `/flexiloans/`.
- Chrome documents: `content/flexiloans/nav.html` + `content/flexiloans/footer.html` (NOT the default `/nav`,
  `/footer` paths) — therefore **every content page carries `nav: /flexiloans/nav` and `footer: /flexiloans/footer`
  rows in its metadata block** (the stock header/footer blocks read these per-page overrides).
- Internal links: root-relative under `/flexiloans/…`. External (loans.flexiloans.com app, Google Play, social)
  stay fully qualified (D4).
- Editorial images staged at `media-staging/flexiloans/<file>` (lowercased names — DA paths must be lowercase);
  authored as `https://content.da.live/paolomoz/stardust-deploy-210726/media/flexiloans/<file>`; mapping recorded
  in `media-manifest-flexiloans.json` (same shape as the pre-existing `media-manifest.json`, which belongs to a
  prior unrelated conversion and was left untouched, as were `qa/` root files and `media-staging/home/`).
- Repo-global surfaces (styles/, blocks/, scripts/, fonts/, icons/, head.html, favicon) are authored for the
  flexiloans brand — the branch starts from stock adobe/aem-boilerplate main; no coexistence concerns.

## Runtime contract

See `stardust/runtime-contract.json` — read from THIS repo's `scripts/aem.js` + `scripts/scripts.js`
(current-main vintage): `a.button.primary/.secondary/.accent` in `p.button-wrapper`, **formatted-only**
buttonization, NO hero autoblock (only fragment + `/widgets/` autoblocks), `decorateIcons` fills
`span.icon.icon-<x>` with `<img src="/icons/<x>.svg">` before blocks run, `emptySectionCollapse: true`
(foundation adds `main .section:empty { display: none }`).

## Section triage + naming (LOCKED — single-page conversion, names locked without user questions per SKILL Step 2)

| Prototype section | D1 triage | Block / treatment | D11 collection match | Decode tier (#95) |
|---|---|---|---|---|
| header | chrome | `blocks/header` + `content/flexiloans/nav.html` | header | template-slotted |
| hero | bespoke pattern (split 7/5 hero, eyebrow/h1/lede/2 CTA/figure) | `hero` | hero (name + model mirrored; CSS bespoke) | template-slotted |
| eligibility-cards | repeating units (2 icon cards) | `cards` variant `eligibility` | cards | reconstructive |
| live-status | bespoke split proof band (map + live counters) | `live-status` | — | template-slotted |
| why-flexiloans | composite trust band: 4 icon chips + campaign figure + asymmetric stat ledger — ONE distinct pattern, one lavender band | `why-flexiloans` | — | reconstructive (segmented by content) |
| products | repeating units (2 shadow cards + primary CTA) | `cards` variant `products` | cards | reconstructive |
| security | repeating units (3 icon items, ice band) + foot link | `cards` variant `security` | cards | reconstructive |
| testimonials | repeating quote cards (blockquote + avatar attribution) — genuinely distinct composition from `cards` | `testimonials` | — | reconstructive |
| achievements | repeating units (4 award plaques on trophy shelf) | `achievements` | — | reconstructive |
| blogs | repeating editorial index rows (whole-row anchors) | `blogs` | — | reconstructive |
| faq | accordion | `accordion` (collection name + Q/A-rows content model) | accordion | reconstructive |
| partner-strip | repeating logo row | `partner-strip` | — | reconstructive |
| footer | chrome | `blocks/footer` + `content/flexiloans/footer.html` | footer | template-slotted |

**Same-pattern collapse (D9):** eligibility-cards / products / security are all icon-or-title card grids
differing in skin → ONE `cards` block with variant classes `eligibility`, `products`, `security`; generic
classify-by-content JS, per-variant CSS. Testimonials kept bespoke (quote-mark + blockquote + figcaption
attribution is a different composition, not a skin).

**Default content (D1):** no full section is bare prose, but every **section head** (h2 + optional sub) is
authored as DEFAULT CONTENT before its block and styled IN PLACE via the global
`main .section > .default-content-wrapper` rules (no reabsorption needed — all heads sit visually outside the
blocks' grids in the prototype). Section-metadata `style` values: none needed (no default-content-only section);
block CSS paints its own section grounds via `main .section:has(> .<name>-wrapper …)`.

**Foot links** ("Learn more…", "View all…", "View all FAQs", "View all Partners") are authored as the final
single-cell link-only row of their owning block (decode: link-only row = foot). Keeps the per-block round-trip
inventory aligned with the prototype section.

## Schema + deliberate encode decisions (`stardust/eds-schema/index.json`)

- hero: 5 roles + 1 img — authored as one row per field (eyebrow / h1 / lede / CTA pair / figure img);
  decoded by QUERY (#42), not row index.
- live-status: the two live counter lines carry their numbers as `<strong>` (preserved tag), matching the
  prototype's `strong` accent — no invented delimiters.
- why-flexiloans: 4 chip rows (icon token + h3 + p per row) + figure row + 4 stat rows (num p + label p per
  row; first stat row = the display-scale lead). Stat vs chip classified by content (h3 presence / numeric lead).
- faq answers 2–3 are captured-verbatim short answers linking to the FAQ centre (prototype's own copy).
- partner-strip: one row per logo (5 rows) + foot row.
- No schema item dropped. The prototype's decorative quote-mark SVG (alt="") is not authored content — injected
  by testimonials JS (decorative, fixed).

## Icons (Feather/Lucide stroke set, ISC — prototype inlines them)

Authored as EDS icon syntax `:name:` in cell text (survives DA; the pipeline emits `span.icon`, `decorateIcons`
fills the `/icons/<name>.svg` img). Block JS decodes BOTH shapes — a decorated `span.icon` AND the literal
`:name:` text (the local harness has no pipeline) — and wraps it in the prototype's `.icon-chip`. SVGs written to
`icons/` with the navy stroke baked in (they load as `<img>`, so `currentColor` can't apply):
`credit-card`, `truck` (eligibility); `unlock`, `zap`, `shield-check`, `receipt` (why chips);
`shield-alert`, `eye-off`, `lock` (security). Footer social icons (`linkedin`, `twitter`, `facebook`,
`instagram`) copied from extract media into `icons/` — fixed brand assets, root-relative, browser-fetched (#67).

## Buttons (D6 mapping)

- `<strong><a>` → `a.button.primary` → green pill (`--tarakki-green` bg, navy text) — prototype `.btn-primary`.
- `<em><a>` → `a.button.secondary` → ghost (navy outline) — prototype `.btn-ghost`; on dark surfaces
  (`main .hero a.button.secondary`) it renders the prototype's `.btn-ghost-inverse` (#41 block-class scope).
- accent slot unused. Prototype `.btn-secondary` (navy fill) is defined but unused on this page — not ported.
- `.btn-sm` (products cards) = block CSS size override on `.cards.products a.button`.
- Prototype `.text-link` (underline-on-hover nav-y links with `→`) is NOT a button: authored as plain `<a>`;
  the arrow `→` is typed in the authored text and block JS re-wraps the trailing arrow in `span.arrow`
  (idempotent strip-then-wrap, #70/#39). `.text-link`/`.arrow` paint lives in `styles/styles.css` next to the
  button system (a global link convention used by 4+ blocks — logged deviation from "nothing more", judged
  cheaper than 4× duplication).

## Chrome

- Header: transparent-over-hero, solidifies on scroll via CSS `animation-timeline: scroll()` (solid navy
  fallback under `@supports not`). The header OVERLAYS the hero (prototype `position: fixed`), so
  `--nav-height: 0` — nothing is displaced when the block loads ⇒ no CLS reservation needed (#81 satisfied
  by overlay; verified with the CLS probe). Stock hamburger/aria machinery kept and restyled; mega menu is
  template-slotted from the nav doc's fixed 3-section contract (brand / sections / tools). Mega group labels
  are `<strong>`-only list items that open a new group (leading-tag sub-field rule).
- Footer: template-slotted from a fixed section contract: [4 link columns (strong-p title + ul each)],
  [contact + social], [addresses], [badges], [legal]. Footer's own top margin = 0 (footer sits flush after
  partner-strip band in the prototype).

## Fonts (Step 4)

- Prototype self-hosts **Roboto** (display; Apache 2.0) + **Montserrat** (body; SIL OFL 1.1) as latin variable
  woff2 — both redistributable ⇒ **no licensing alert needed (#80)**. Copied verbatim to `fonts/roboto-var.woff2`
  + `fonts/montserrat-var.woff2`; declared in `styles/fonts.css` (weight 100–900, swap). Stock roboto/
  roboto-condensed static woff2 + declarations removed.
- Metric-matched fallbacks in `styles/styles.css`: `roboto-fallback` (size-adjust 99.78%, ascent 93%,
  descent 24.5%) and `montserrat-fallback` (size-adjust 112.84%, ascent 85.8%, descent 22.25%) — calibration
  lifted verbatim from the prototype's own fallback faces; both sans-serif, normal width → `local("Arial")`
  is the correct class (#80 width rule: neither family is condensed).
- Every stack names its `-fallback` second. `anek-latin-var.woff2` / `inter-var-opsz.woff2` sit in the
  prototype fonts dir but are NOT referenced by any prototype `@font-face`/stack (superseded font deck) — not shipped.
- Faux-bold note (#22): prototype loads variable 100–900 for both faces; headings use real 700. No single-weight
  faces involved.

## Favicon

Extract captured `stardust/current/assets/favicon.png` (32×32 PNG) → copied to repo root `favicon.png`; ONE line
added to `head.html`: `<link rel="icon" href="/favicon.png">` (the single permitted head.html edit). Stock
`favicon.ico` left in place (harmless; `/favicon.png` link wins).

## scripts/scripts.js

Untouched (stock). No autoblocks needed for this page (no video/embed URLs); the stock fragment + widget
autoblocks remain.

## Anti-patterns consciously avoided this run

- No `text`/`heading` blocks around prose (D1); section heads are default content.
- No section-metadata style vocabulary parallel to block CSS (no default-content-only sections exist).
- No shared utility JS modules; each block inlines its helpers (block-roundtrip inlines JS — no imports).
- No manufactured button anchors; cells cloned, decorator classes honored.
- No reveal-on-scroll opacity lift (prototype `rise` animation re-scoped as pure CSS with
  `prefers-reduced-motion` honored; content visible without JS).
- No absolute-origin asset URLs in block code (gate grep clean).
- No block named after reserved classes.

## Site-specific lesson: `wrapTextNodes` (RECORDED IN runtime-contract.json)

This boilerplate vintage's `decorateBlock` runs `wrapTextNodes(block)`: a cell whose FIRST element child
is not P/PRE/UL/OL/PICTURE/TABLE/H1–H6 (e.g. a bare `<img>`, or a PICTURE followed by more content) gets
its ENTIRE cell content wrapped in ONE `<p>`. First seen as award plaques rendering EMPTY (img found, all
text swallowed by the wrapper `<p>`) — the per-block `block-roundtrip` harness does NOT run this step, so
only the whole-page/real-runtime gates caught it. Fix: every reconstructive collector (`collectNodes` in
cards / why-flexiloans / testimonials / achievements / blogs) now runs `expandWrapper()` — a `<p>` with
block-level element children is expanded back into its constituents. On the live pipeline images become
`<picture>` + siblings, which triggers the same wrap, so the decode fix is required there too.

## Fix applied after eyeball (#23)

The nav doc initially authored top-level menu labels as bare text (`<li>Company<ul>…`) — they rendered
as unstyled ink-on-navy text. Re-authored as trigger LINKS (hrefs from the prototype: Company→/loan/about,
Products→/loan/term-loan, Business Loan→/business-loan, MSME Loan→/msme-loan, Resources→/blog/), matching
the prototype's `<a>Company<caret></a>` shape. Header block injects the caret + builds the grouped mega.

## Advisory-finding justifications

- davids-model-lint 🟡 D1 ×3 (cards eligibility/products, testimonials "prose-only default-content
  candidate"): these are repeating unit grids (2 cards + per-card CTA/icon; 3 quote cards with avatar
  attribution) — genuine blocks per D1's "repeating units" test, not prose sections.
- davids-model-lint 🟡 D3 (accordion rows 2 cells vs 1): the trailing single-cell row is the deliberate
  section-foot CTA contract ("View all FAQs" ghost button); Q/A rows themselves are uniform 2-cell.
- block-roundtrip / content-diff 🟡 IMG COUNT (cards.eligibility 0→2, cards.security 0→3,
  why-flexiloans 1→5): the prototype inlines Feather SVGs; EDS renders them as `/icons/*.svg` `<img>`
  via the icon convention — intentional, pixel-equivalent.
- block-roundtrip 🟡 IMG COUNT (testimonials 6→3): the decorative quote mark is an `<img>` in the
  prototype but a block-owned inline SVG in EDS (alt="" decorative, D13) — intentional.
- visual-diff STRETCHED IMAGE ×2 (testimonial avatars 86×102 → 56×56): justified per #45(b) — the
  prototype renders the SAME 56×56 `object-fit: cover` circle (proto metrics carry the same stretch flag).

## Gate log (final run, all local — no DA / no network writes)

| Gate | Result |
|---|---|
| npm run lint (eslint + stylelint, project config) | exit 0 |
| style-fingerprint.mjs (#90, pre-code) | 5 variation groups, all CSS-structural (hero primary vs ghost-inverse CTA, award border rhythm, lang aria-current, mega divider, footer meta) — all reproduced |
| section-schema.mjs (#93) | `stardust/eds-schema/index.json` — 11 sections, all units uniform |
| davids-model-lint.mjs content/ | `PASS — 0 🔴, 4 🟡` (justified above), exit 0 |
| token-completeness (#91) `comm -23` | empty output |
| URL gate (#44) grep blocks/ | empty output |
| block-roundtrip per block (#94) | exit 0 each: hero ✓, cards[0..2] ✓ (2×🟡 icon-img), live-status ✓, why-flexiloans ✓ (🟡 icon-img), testimonials ✓ (🟡 quote-mark), achievements ✓, blogs ✓, accordion ✓, partner-strip ✓ |
| block-roundtrip whole page (no --blocks) | `✓ all blocks: round-trip closed (0 structural 🔴)`, exit 0 |
| Local-QA probe (qa/flexiloans/probe.mjs) | `SUMMARY: 51/51 checks passed`, exit 0 — one h1; 15 grid/flex computed-layout asserts; 11 unit-count asserts; 0 pageerror; 0 broken images; buttons decorated (3 primary / 2 secondary); ghost-inverse on hero; accordion click; mega hover; lang aria-current; 8 section grounds; wrappers 1240px @1600; hamburger + mobile menu |
| CLS probe (#81, fonts+chrome delayed 1.5s) | `CLS 0.0007 — PASS (<0.1)` (header is overlay chrome, nothing displaced) |
| visual-diff.mjs proto vs harness | red flags: 2× STRETCHED IMAGE (avatars — justified #45(b)); no BLANK/FLUSH/GAP flags; exit 0 |
| content-diff.mjs proto vs harness (#92) | `proto: 94 text nodes — 21 headings, 0 eyebrows, 15 CTAs, 58 body; EDS: 94 — identical roles. Findings: none — content + roles match`, exit 0 |
| sanitise.js (pre-DA encode) | index 16, nav 6, footer 2 non-ASCII chars → entities |
| wrap gate (#74) | no block emits `.wrap`; content constrained by the section scaffold wrapper (measured 1240px @1600) |

## Not done in this run (network-write scope limits)

- No git commit / push; no DA Source API writes (media uploads + content PUTs pending — see
  `media-manifest-flexiloans.json` for the 18 binaries to upload first); no admin.hlx.page preview/live.
- Step 10 proper (content-diff/visual-diff against the DEPLOYED aem.page URL), the delivered
  `.plain.html` img/alt-count check, `about:error` grep, and the per-page atomic delivery chain all
  require the deploy and remain to be run post-push.
- The `nav`/`footer` metadata overrides cannot be exercised by the local harness pipeline (no metadata
  processing off-pipeline); the harness injects equivalent `<meta>` tags — verify per-page chrome on the
  deployed preview.
- The `:icon-name:` cell tokens rely on the pipeline emitting `span.icon`; blocks also decode the literal
  token (harness-verified), so both transport shapes are covered — confirm on preview.
