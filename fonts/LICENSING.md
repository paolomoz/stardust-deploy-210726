# ⚠ Font licensing — required before going live (aem.live)

This site self-hosts **proprietary commercial** brand faces for fidelity (stardust:deploy #80).
They are lifted from the prototype's captured webfonts. **Do NOT publish to `aem.live`** until the
webfont/embedding license is confirmed for the delivery domain.

| file | family | foundry | status |
|---|---|---|---|
| harmonia-400/500/700/900.woff2 | HarmoniaSans Pro | Monotype | ⚠ license unconfirmed |
| dinnext-400/700.woff2 | DIN Next LT Pro | Linotype / Monotype | ⚠ license unconfirmed |

## Remove path (fall back to metric-matched system fonts)
If licensing cannot be confirmed: delete the `harmonia-*`/`dinnext-*` `.woff2` files and their
`@font-face` rules in `styles/fonts.css`. The `:root` stacks then fall back to the metric-matched
`harmonia-fallback` / `dinnext-fallback` faces (Arial, in `styles/styles.css`) — layout is preserved
(zero CLS), only the letterforms degrade to Arial.

This deploy targets the **branch preview (aem.page) only** — not published live — so the alert stands
as a launch gate, not a current violation.
