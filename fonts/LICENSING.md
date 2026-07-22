# Font licensing — ACTION REQUIRED before publishing to aem.live

The Riverview Health brand faces are **proprietary** (Adobe Fonts / Typekit).
They are self-hosted here for brand fidelity, but the webfont/embedding license
must be confirmed before the site goes live on `aem.live`.

| File | Family | Weight | Foundry / source | Status |
|---|---|---|---|---|
| parabolica-400.woff2 | parabolica | 400 | Adobe Fonts / Typekit (kit gwk6iao) | ⚠️ license unconfirmed |
| parabolica-700.woff2 | parabolica | 700 | Adobe Fonts / Typekit | ⚠️ license unconfirmed |
| parabolica-900.woff2 | parabolica | 900 | Adobe Fonts / Typekit | ⚠️ license unconfirmed |
| parabolica-text-400.woff2 | parabolica-text | 400 | Adobe Fonts / Typekit | ⚠️ license unconfirmed |
| parabolica-text-700.woff2 | parabolica-text | 700 | Adobe Fonts / Typekit | ⚠️ license unconfirmed |
| parabolica-text-900.woff2 | parabolica-text | 900 | Adobe Fonts / Typekit | ⚠️ license unconfirmed |

Sourced from the riverview.org Typekit kit (`use.typekit.net`, kit `gwk6iao`).

## Remove-and-fall-back path (if the license cannot be confirmed)

1. Delete the six `parabolica*.woff2` files from `fonts/`.
2. Delete their `@font-face` rules from `styles/fonts.css`.
3. The `--heading-font-family` / `--body-font-family` stacks in `styles/styles.css`
   then fall back to the metric-matched `parabolica-fallback` /
   `parabolica-text-fallback` faces (`local("Arial")`), so layout is preserved
   with zero CLS. Visual fidelity degrades to a system sans.
