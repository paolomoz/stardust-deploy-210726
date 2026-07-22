# EDS conversion log — baremetrics home (subfolder site `/baremetrics/`)

Run: 2026-07-22 · prototype `stardust/prototypes/home-proposed.html` (semrush/baremetrics) ·
target branch `baremetrics-e2e` (stock adobe/aem-boilerplate main + widget block) ·
DA org/repo `paolomoz/stardust-deploy-210726` · scope: home page only, local-QA stage only (no DA writes, no push).

## Runtime contract

See `stardust/runtime-contract.json`. Verified from this repo's `scripts/scripts.js` + `scripts/aem.js`:
formatted-only buttonization, `p.button-wrapper`, `a.button.primary|secondary|accent`,
`decorateBlock` emits `.block` + `.<name>-wrapper` + section `.<name>-container`, `wrapTextNodes`
wraps bare-text cells in `<p>`. `emptySectionCollapse: true` → foundation carries
`main .section:empty { display: none }`. head.html ships CSP (`strict-dynamic` + trusted types);
`scripts.js` defines the `default` TT policy, so block `innerHTML` and dynamic `import()` work.

## Step 2 triage + names — LOCKED (single-page rule: locked without user round-trip)

| # | prototype section (`data-section`) | D1 triage | block | Collection reuse (D11) | decode tier (#95) |
|---|---|---|---|---|---|
| 1 | header | chrome | `header` (stock block, restyled) | — | template-slotted |
| 2 | hero | block (bespoke composition: carousel h1, lottie/SVG dashboard) | `hero` | collection name `hero`, bespoke model | template-slotted |
| 3 | payment-providers | block (11 repeating logo units); h2 = section head → DEFAULT CONTENT | `logos` | no collection match | reconstructive |
| 4 | dashboard-proof | block (3 repeating cards) | `cards` variant `proof` | collection `cards` (one row per card) | reconstructive |
| 5 | customer-logos | block (8 repeating logo units); h2 → DEFAULT CONTENT | `logos` (reuse) | — | reconstructive |
| 6 | growth-drivers | block (3 cards); h2+lede → DEFAULT CONTENT | `cards` (reuse, default variant) | collection `cards` | reconstructive |
| 7 | testimonial | block (bespoke quote + attrib + G2 badge) | `quote` | collection `quote` model (quote row + attribution row), extended with a 3rd badge row | reconstructive |
| 8 | data-decisions | block (3 cards); h2+lede → DEFAULT CONTENT | `cards` (reuse) | collection `cards` | reconstructive |
| 9 | integrations-notify | block (split copy + email form + 6-logo strip; form = block JS behavior) | `integrations-notify` | no collection match | template-slotted |
| 10 | feature-cancellation-insights | block (badge/h2/lede/CTAs/quote + screenshot split) | `feature` variant `cancellation` | no collection match | template-slotted |
| 11 | feature-recover | same pattern as #10, mirrored + mist band | `feature` variant `recover` (ONE block + variants) | — | template-slotted |
| 12 | open-startups | block (2-col split: copy / image) | `columns` variant `open-startups` | collection `columns` (one row, 2 cells) | reconstructive |
| 13 | publications | block (editorial ledger, 6 repeating date+title rows + subscribe form); eyebrow/h2/lede head → DEFAULT CONTENT, REABSORBED (head lives inside the pub-head grid next to the form) | `publications` | no collection match | reconstructive rows + slotted form |
| 14 | closing-cta | block (2-col split: copy+CTA / image) | `columns` variant `closing` (reuse) | collection `columns` | reconstructive |
| 15 | footer-nav | chrome | `footer` (stock block, restyled) | — | template-slotted |

Same-pattern collapses locked: `logos` ×2 sections (+ the strip INSIDE `integrations-notify` stays
inside that block — D2 forbids nesting); `cards` ×3 sections (variant `proof` = full-width container,
inline icon head, hover lift, mist band); `feature` ×2 (variants `cancellation` / `recover` carry the
signal-orange / signal-magenta badge coding, media side, mist band); `columns` ×2 (variants
`open-startups` / `closing`; `closing` carries the periwinkle-tint gradient panel).

No block named after a reserved class. Blocks replace the boilerplate demo `hero`/`cards`/`columns`
blocks (repo-global surfaces are ours on this branch).

## Per-instance variation (#90 fingerprint) — findings & dispositions

- `growth-drivers` cards `uniform: false`: card 1 title is a LINK (Benchmarks), cards 2–3 (Goals,
  Notes & Annotations) are plain `<h3>`. Cards block clones the authored heading content, so
  linked/unlinked titles both survive. NOT flattened.
- `publications` last `li` bottom border → CSS `:last-child`, lifted verbatim.
- `footer-nav` 6th column has TWO heading groups (Support + Legal) → preserved in the authored
  footer document (two lists under two headings in one column section).
- `integrations-notify` two `.container` clusters = copy+form vs logo strip — structural, by design.

## Decode-tier notes

- `hero`: template holds the prototype's media half verbatim (lottie `dotlottie-wc` + SVG dashboard
  fallback card, MRR figure `$365,271`) and the h1 integration carousel (9 items). Authored fields
  slotted by role: h1, lede, facts line, CTA cell. DELIBERATE: carousel item list, MRR mock figures,
  and dashboard SVG are design-system data owned by block JS, not authorable (fixed product-proof
  signature; a structure change is a dev change). h1 is authored WITHOUT "+ Chargebee"; the block
  appends the carousel span, so the decorated heading text matches the prototype.
- `feature`: role-classified slotting (badge text, h2, lede, CTA cell, quote para starting with a
  quote mark, attribution img+cite, screenshot img).
- `integrations-notify`: form (label authored as a row; input placeholder + button label owned by
  block JS — chrome copy per prototype provenance) + logo rows.
- `publications`: form label authored as first row (leading `<em>`-free plain text); input
  placeholder + "Subscribe" button label owned by block JS. 6 ledger rows = `date | linked title`
  (2 cells). Block builds `<time datetime>` by parsing the date text.
- `quote`: rows = quote | attribution (`<strong>` name + plain role text per the leading-tag
  sub-field rule; avatar img in same cell) | G2 badge (linked img).

## Images — sourcing decisions

`_crawl-log.json#discovery.fetchTechnique` = `headless` → bare-curl verification permitted (skill
§ migration images). Every editorial image verified 200 against the source CDN, downloaded, staged
at `media-staging/baremetrics/<lowercased-file>` and authored as
`https://content.da.live/paolomoz/stardust-deploy-210726/media/baremetrics/<file>` (rehost-over-
hotlink rule; content.da.live is auth-gated so NOT anon-curl-verified — post-preview check is the
deploy-side gate). HubSpot `hs-fs` renamed files: `image (20).png`→`logo-paddle.png`,
`image (21).png`→`logo-quickbooks.png`, `untitled design (1).png`→`logo-xero.png`,
`Paypal.png`→`logo-paypal.png`. Underscores in source names normalized to hyphens.
SVG staging passed the #99 pure-vector check (no embedded raster) — see manifest.
Manifest: `media-manifest-baremetrics.json` (staged / daPath / authoredUrl / usedBy).

- Lottie animation JSON (`homepage_animation.json`): NOT an authored image — fixed block asset,
  committed at `blocks/hero/homepage-animation.json`, referenced root-relative from hero JS
  (anti-pattern 9b rule). dotlottie player loaded by dynamic `import()` of the pinned unpkg module
  the prototype itself uses (user-authorized external, per prototype provenance); SVG dashboard
  card remains the no-JS / reduced-motion / CDN-failure fallback, gated exactly like the prototype.
- Favicon: extract captured `stardust/current/assets/favicon.png` → repo root `favicon.png` +
  the single permitted `head.html` line `<link rel="icon" href="/favicon.png">`.
- Footer Stripe badge + social icons: inline SVG in the footer document/block (pure vector,
  lifted from prototype). Not media.

## Fonts (Step 4)

Brand face: **Inter** (SIL OFL 1.1 — no licensing alert needed). Prototype embeds captured Inter
400 + 700 base64 and maps 700 to the 600–800 range; provenance says "migrate should self-host true
Inter 600/800". Decision: self-host **Inter variable latin woff2 (wght 100–900)** from
`@fontsource-variable/inter` in `fonts/`, declared in `styles/fonts.css` (weights 100 900) — gives
true 600/700/800. Metric-matched `inter-fallback` face in `styles/styles.css` with the fontsource
published calibration, `src: local("Arial")` (normal-width sans → Arial is the right width class).
Every stack: `'Inter', inter-fallback, system-ui, sans-serif`. Prototype loads no `opsz` axis and
no italic → wght-only normal file is correct. Stock roboto faces/files removed with the demo layer.

## Key-facts gate (#86)

`DESIGN.json` has NO `extensions.metadata.keyFacts` field (searched whole file) → per skill, the
raw-HTML key-facts grep gate is SKIPPED (noted here). The hero facts line (plans $49–$749/mo,
integrations) is nevertheless authored as server-rendered page content in the hero block's rows.

## Buttons

- `<strong><a>` → `a.button.primary` = prototype `.ds-btn-primary` (filled action).
- `<em><a>` → `a.button.secondary` = prototype `.ds-btn-secondary` (white + outline) — used for the
  header trial CTA (authored in `/baremetrics/nav` tools section).
- Prototype `.ds-link` (Live Demo / Learn More / View Open Startups) is a styled TEXT link, not a
  button → authored as plain `<a>`; global `main a:not(.button)` styling carries the underline
  treatment (prototype styles all content links this way).
- Publications ledger rows and logo-strip anchors are whole-row/tile anchors → plain `<a>`,
  block CSS styles them (convention deliberately not applied).

## Chrome

- `content/baremetrics/nav.html`: 3 sections (brand logo link / primary link list / tools:
  locale list + Sign In + `<em>` trial CTA). Header block keeps stock hamburger machinery
  (`toggleMenu`, aria-expanded, Escape close, `isDesktop` switch) restyled to the prototype;
  desktop breakpoint set to 1081px to match the prototype's 1080px collapse (adapt P1 finding).
  Locale switcher rendered as the prototype's `<details>` dropdown from the authored locale links.
- `content/baremetrics/footer.html`: 7 sections — 6 link-column sections (col 6 carries
  Support + Legal as two heading+list groups) + 1 bottom section (tel link, social links,
  Stripe Verified Partner badge). Footer block slots them; social/Stripe SVGs inline in block JS
  keyed by href/text.
- Every page's metadata block carries `nav: /baremetrics/nav`, `footer: /baremetrics/footer`.
  Site default in header/footer block JS is also `/baremetrics/nav|footer` (subfolder site).
- `--nav-height`: 77px desktop (76 min-height + 1 border), 65px ≤640px, measured from prototype.

## Links

Only the home page is converted. The home page's internal destination set (features, pricing,
blog, compare, about, open-startups…) does not exist under `/baremetrics/` in this run → all
unconverted destinations keep their fully-qualified `https://baremetrics.com/...` (or app/demo
subdomain) URLs (D4). No root-relative `/baremetrics/...` link targets exist on this page other
than chrome metadata refs. Recorded as the locked decision for later page rollouts to revisit.

## Local-QA adaptations (no-DA-write constraint)

- Authored `content.da.live` media URLs cannot resolve before upload (auth-gated, not yet PUT).
  For the LOCAL harness only, the qa build rewrites
  `https://content.da.live/paolomoz/stardust-deploy-210726/media/baremetrics/` →
  `/media-staging/baremetrics/` (same spirit as the #43 `/img/` rewrite; media-staging is served
  by the dev server). Deployed URLs are untouched.
- Harness chrome: `baremetrics/nav.plain.html` + `baremetrics/footer.plain.html` generated
  (gitignored) so the header/footer blocks' fragment fetch resolves on the dev server.
- Dev server on port 8500; prototype static server on 8591 (8500–8599 range mandate).

## Skill steps NOT doable in this run (deploy-side; recorded per harness scope)

- DA uploads (media + content PUT), sanitise-before-write is run locally but no write follows.
- preview/live POSTs, delivered `.plain.html` asserts, per-page atomic delivery contract.
- Step 10 `content-diff` + `visual-diff` (deployed-URL-only by #101).
- CLS probe (#81/#100/#101 — deployed-URL-only).
- Live computed-style gate on the delivered URL (harness qa-gate stands in locally).
- Per-page chrome override verification (`nav:`/`footer:` metadata needs the pipeline).

## Gate log (final, 2026-07-22)

| Gate | Command | Result |
|---|---|---|
| Project lint | `npm run lint` | exit 0 (eslint + stylelint clean) |
| David's Model | `node skills/deploy/scripts/davids-model-lint.mjs content/` | exit 0 — `PASS — 0 🔴, 33 🟡` |
| Token completeness (#91) | `comm -23` var-vs-:root | empty output (clean) |
| URL gate (#44) | `grep -rn "http://localhost\|aem.page/img\|aem.live/img" blocks/` | empty (clean) |
| Sanitise | `node skills/deploy/scripts/sanitise.js content/baremetrics/*.html` | index: 5 chars encoded; nav/footer: none |
| block-roundtrip per block (#94) | hero / logos×2 / cards×3 / quote / integrations-notify / feature×2 / columns×2 / publications | all `✓ round-trip closed` |
| block-roundtrip whole page | all blocks, mapped | `✓ all blocks: round-trip closed (0 structural 🔴).` |
| qa-gate (#101) | `node skills/deploy/scripts/qa-gate.mjs http://localhost:8500/qa/page.html --schema stardust/eds-schema/index.json` | exit 0 — `QA GATE: PASS — 43 ok, 1 warn, 0 fail` |
| style-fingerprint (#90) | run pre-code | 4 variation groups, all dispositioned above |
| Interactive drives (#28) | Playwright: carousel rotation, notify form (invalid blocked → valid confirms), subscribe form, locale dropdown, mobile hamburger (open/close, 8 panel links), zero pageerrors | all pass |
| Computed-style check | hero-grid / 3 card-grids / 2 feature splits / 2 columns / pub-head | all compute `display: grid`; 1 `<h1>`, 0 nested |

**Justified advisories:**
- qa-gate wide-1600 warn on `cards`: the `proof` variant is INTENTIONALLY full-bleed
  (prototype: `section[data-section="dashboard-proof"] .container { max-width: none }`,
  user request 2026-07-09). The other two cards instances stay within `--max-width`.
- davids-model 🟡 D1 on `quote`: genuine bespoke widget (blockquote + avatar attribution +
  linked G2 review badge; tint band) — collection `quote` pattern, not bare default content.
- davids-model 🟡 D3 on `publications` (rows of 1 and 2 cells): row 1 is the subscribe-form
  label (1 cell), rows 2–7 are date|title items (2 cells) — intentional model, decoded by shape.
- davids-model 🟡 D4 SVG advisories ×31: every staged SVG verified pure-vector at staging time
  (`grep -l "<image\|data:image" *.svg` → none).

**Fixes found by the gates (why the loop works):**
- feature ROLE SWAP (badge classified body): block CSS had added `text-transform: none` on
  `.ds-badge`, losing the prototype's inherited uppercase → classifier missed the eyebrow.
  Removed the override; both feature instances then closed.
- publications EXTRA/MISSING CTA: ledger `<a>` concatenated date+title with no whitespace →
  text mismatch vs prototype. Added a separating text node.
- `feature.recover` media-order selector only matched `picture`; harness (and any bare-img
  shape) delivers `img` → recover band rendered media-right. Selector now covers both.
- `logo-quickbooks.png` (175×77) and `logo-xero.png` (130×130) rendered at natural size,
  larger than the prototype's 117×51 / 72×72 display boxes (EDS layout is driven by asset
  intrinsic size). Resized the staged binaries to the prototype display size.

## Post-deploy TODO (deploy-side judge)

Upload media per `media-manifest-baremetrics.json`, PUT the three sanitised documents, preview
+ live, then: delivered `.plain.html` asserts (45 img+alt on index, 0 `about:error`), Step 10
`content-diff` + `visual-diff` vs `http://<proto-host>/home-proposed.html`, CLS probe (target
< 0.1 — check the `--nav-height` 77/65 reservation and the hero's SVG/lottie slot), live
computed-style grid check, `nav`/`footer` metadata override verification, hamburger + forms
drive on the deployed URL. Lottie: confirm the unpkg module loads under the delivered CSP
(`strict-dynamic` should trust the dynamic import; the SVG dash card is the designed fallback).
