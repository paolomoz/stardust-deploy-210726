# Font licensing — Cority home (/cority-home/)

| File | Family | Weight | Foundry | License status |
|---|---|---|---|---|
| fakt-pro-300.woff2 | Fakt Pro | 300 | Fakt / Our Type | ⚠️ PROPRIETARY — commercial webfont license required |
| fakt-pro-400.woff2 | Fakt Pro | 400 | Fakt / Our Type | ⚠️ PROPRIETARY — commercial webfont license required |
| fakt-pro-500.woff2 | Fakt Pro | 500 | Fakt / Our Type | ⚠️ PROPRIETARY — commercial webfont license required |

**Do not publish to aem.live (Content Bus /live/) until Cority's webfont/embedding
license for the delivery domain is confirmed.** Deployed here to the branch PREVIEW
(aem.page) only, for fidelity QA.

## Remove-and-fall-back path
If licensing cannot be confirmed:
1. Delete `fonts/fakt-pro-*.woff2`.
2. Delete the three `@font-face` rules in `styles/fonts.css`.
The `--body-font-family` / `--heading-font-family` stacks then fall back to the
metric-matched `"fakt-pro-fallback"` face (src: local Arial) in `styles/styles.css`,
which is calibrated to Fakt Pro's metrics (size-adjust 125.73%) so layout is preserved.
