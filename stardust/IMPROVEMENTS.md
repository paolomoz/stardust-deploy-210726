# stardust:deploy — improvement findings from the theroadhome-e2e run

Two real defects on this run passed every LOCAL gate and surfaced only at deployed-URL
verification. Both are gaps in the off-pipeline harness the in-loop gates use, worth feeding
back to the skill's gate scripts.

## TRH-1 🔴 — block-roundtrip harness renders bare `<img>`, so a picture/img double-count is invisible

**What happened:** `ways.js` read media with `row.querySelectorAll('picture, img')[i]`. On the live
pipeline every authored `<img>` is wrapped as `<picture><img></picture>`, so that selector matches
BOTH the `<picture>` and its child `<img>` — `imgs[1]` was the photo's own img, and the icon SVG was
silently dropped (ways rendered 3 imgs, not 6). The `block-roundtrip` harness renders the authored
**bare** `<img>` (no pipeline), so `[0]`/`[1]` lined up and the gate passed. Caught only by the live
image audit.

**Fix applied (block):** select ONE media element per CELL (`cell.querySelector('picture, img')`),
never index into a whole-row `querySelectorAll('picture, img')`.

**Suggested gate fix:** the roundtrip harness already mimics `wrapTextNodes` (#104); it should ALSO
wrap authored `<img>`/leading media in a `<picture>` the way the delivery pipeline does, so a
picture+img double-count fails the harness instead of shipping. Alternatively, add an advisory when a
block's JS calls `querySelectorAll('picture, img')` and indexes the result.

## TRH-2 🔴 — harness doesn't run decorateButtons, so multi-CTA-in-one-paragraph passes then fails live

**What happened:** the hero authored both CTAs in ONE `<p>` (`<strong><a>GET HELP</a></strong>
<em><a>DONATE</a></em>`). `decorateButtons()` only buttonizes a link ALONE in its paragraph
(`p.textContent === a.textContent`), so on live both stayed plain faint links. `block-roundtrip` and
`qa-gate` both run the block's `decorate()` but NOT `scripts.js` `decorateButtons()`, and the role
classifier counts an `<a>` as a CTA regardless of buttonization — so both gates reported "2 CTAs
matched" and passed. Caught only by the deployed-URL eyeball.

**Fix applied (content + block):** one CTA per `<p>`; `hero.js` collects ALL CTA paragraphs into
`.hero-ctas`.

**Suggested gate fix:** run `decorateButtons()` in the harness (it is exported reachable via
`scripts.js`), and/or add an ENCODE lint rule: two or more emphasis-wrapped (`<strong>`/`<em>`) links
in a single `<p>` will not buttonize — flag as 🟡.
