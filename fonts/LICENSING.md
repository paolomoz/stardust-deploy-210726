# Font licensing — REQUIRED before publishing to aem.live

| File | Family | Weight | Foundry | License status |
|---|---|---|---|---|
| escuela-400.woff2 | Escuela | 400 | proprietary (captured from source prototype) | ⚠️ UNCONFIRMED |
| escuela-600.woff2 | Escuela | 600 | proprietary | ⚠️ UNCONFIRMED |
| escuela-700.woff2 | Escuela | 700 | proprietary | ⚠️ UNCONFIRMED |
| escuela-900.woff2 | Escuela | 900 | proprietary | ⚠️ UNCONFIRMED |

Escuela is the card-corner.de brand display/body face. It was inlined as base64
woff2 in the source prototype and is self-hosted here for brand fidelity.

**Do not publish to aem.live until a webfont / embedding license for Escuela is
confirmed.**

## Remove path (fall back to metric-matched system face)
1. Delete `fonts/escuela-*.woff2`.
2. Delete the four `@font-face { font-family: Escuela }` rules in `styles/fonts.css`.
3. The `--heading-font-family` / `--body-font-family` stacks then fall back to
   `escuela-fallback` (a metric-matched `local("Arial")` face declared in
   `styles/styles.css`, size-adjust 127.32%), so layout/CLS is unaffected — only
   the letterforms degrade to Arial.
