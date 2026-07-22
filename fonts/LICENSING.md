# Font licensing — REQUIRED before publishing to aem.live

| File | Family | Foundry | License status |
|---|---|---|---|
| fakt-pro-300.woff2 | Fakt Pro (Light) | OurType / Forgotten Shapes (proprietary, commercial) | ⚠️ UNCONFIRMED |
| fakt-pro-400.woff2 | Fakt Pro (Regular) | OurType / Forgotten Shapes (proprietary, commercial) | ⚠️ UNCONFIRMED |
| fakt-pro-500.woff2 | Fakt Pro (Medium) | OurType / Forgotten Shapes (proprietary, commercial) | ⚠️ UNCONFIRMED |

These woff2 files were lifted (base64-embedded) from the source prototype for brand
fidelity. Fakt Pro is a proprietary commercial typeface. Do NOT publish this site to
`aem.live` (production) until a webfont/embedding license for the served domain is confirmed.

## Remove path (if licensing cannot be confirmed)
1. Delete `fonts/fakt-pro-*.woff2`.
2. Delete the three `@font-face` blocks in `styles/fonts.css`.
3. The `--heading-font-family` / `--body-font-family` stacks fall back to
   `"fakt-fallback"` (a metric-matched local Arial declared in `styles/styles.css`),
   then the system sans stack. Layout is preserved (metric-matched); only the
   letterforms change.
