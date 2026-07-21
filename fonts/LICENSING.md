# Font licensing status

| File | Family | Foundry | License | Status |
|---|---|---|---|---|
| `hebden-incised.woff2` | Hebden Incised | UNKNOWN (captured webfont shipped with the design prototype; no foundry metadata) | **presumed proprietary** | ⚠️ **BLOCKED — confirm webfont/embedding license before publishing to aem.live** |
| `source-serif-4-variable.woff2` | Source Serif 4 (a.k.a. Source Serif Pro) | Adobe | SIL OFL 1.1 | OK to serve |
| `source-serif-4-italic-variable.woff2` | Source Serif 4 Italic | Adobe | SIL OFL 1.1 | OK to serve |
| `roboto-*.woff2` | Roboto / Roboto Condensed | Google | Apache 2.0 | boilerplate leftovers, unused by brand styles — safe to delete |

Intended-but-unshipped: **Tiempos Text** (Klim Type Foundry, proprietary) is named first in the
prototype's `--serif` stack but no font files were available; the site ships the stack's first
redistributable fallback (Source Serif) per the conversion contract (#77).

## Remove path (if Hebden Incised licensing cannot be confirmed)

1. Delete `fonts/hebden-incised.woff2`.
2. Delete its `@font-face` rule in `styles/fonts.css`.
3. Nothing else changes: every `--display` stack names `hebden-incised-fallback` second
   (a metric-matched local Arial face declared in `styles/styles.css`), so all display type
   falls back with matching metrics and zero layout shift.
4. Remove the licensing banner at the top of `styles/styles.css`.
