/**
 * qa/sos harness post-processing (QA-ONLY, never shipped):
 *  - content.da.live media URLs are auth-gated (401 anon) → rewrite to the
 *    local staged copies under /media-staging/sos/ so the harness renders them
 *  - the metadata nav/footer overrides don't apply off-pipeline → inject
 *    <meta name="nav"/"footer"> pointing at /qa/sos/{nav,footer}, and emit
 *    .plain.html fragments for loadFragment() from the authored chrome docs
 */
import { readFileSync, writeFileSync } from 'fs';

const MEDIA = /https:\/\/content\.da\.live\/paolomoz\/stardust-deploy-210726\/media\/sos\//g;

// 1. harness page: media rewrite + chrome meta
let page = readFileSync('qa/sos/page.html', 'utf8');
page = page.replace(MEDIA, '/media-staging/sos/');

// mimic the delivery pipeline (rendering >= 2): section-metadata "style" values
// become classes on the section div and the metadata block is removed —
// this runtime's client decorateSections no longer consumes section-metadata.
page = page.replace(
  /(<div>)(\s*)<div class="section-metadata">\s*<div><div>style<\/div><div>([^<]+)<\/div><\/div>\s*<\/div>/g,
  (m, open, ws, style) => `<div class="${style.trim()}">${ws}`,
);
page = page.replace('</title>', '</title>\n<meta name="nav" content="/qa/sos/nav">\n<meta name="footer" content="/qa/sos/footer">');
writeFileSync('qa/sos/page.html', page);

// 2. chrome .plain.html fragments (the delivered .plain shape: section divs only)
for (const name of ['nav', 'footer']) {
  let doc = readFileSync(`content/sos/${name}.html`, 'utf8');
  const m = doc.match(/<main>([\s\S]*)<\/main>/i);
  let inner = m ? m[1] : doc;
  inner = inner.replace(MEDIA, '/media-staging/sos/');
  writeFileSync(`qa/sos/${name}.plain.html`, inner.trim() + '\n');
}
console.log('harness post-processed');
