/**
 * quote — Block Collection quote (prototype section.quote-band).
 * Schema: stardust/eds-schema/index.json → section "quote-band".
 *
 * Authoring rows: row 1 = quotation, row 2 = attribution (collection shape).
 * Template-slotted (#95): the prototype band DOM (gold rule + blockquote +
 * cite) is fixed; authored values fill the slots. Decode tolerates the
 * DA-flattened single-cell shape (first paragraph = quote, last = attribution).
 */
export default function decorate(block) {
  const paragraphs = [...block.querySelectorAll('p')];
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const sources = paragraphs.length ? paragraphs : cells;

  const bq = document.createElement('blockquote');
  const rule = document.createElement('span');
  rule.className = 'rule';
  rule.setAttribute('aria-hidden', 'true');
  bq.append(rule);

  const quoteSrc = sources[0];
  const citeSrc = sources.length > 1 ? sources[sources.length - 1] : null;

  if (quoteSrc) {
    const q = document.createElement('p');
    q.append(...[...quoteSrc.childNodes].map((n) => n.cloneNode(true)));
    bq.append(q);
  }
  if (citeSrc) {
    const cite = document.createElement('cite');
    cite.className = 'label byline';
    cite.append(...[...citeSrc.childNodes].map((n) => n.cloneNode(true)));
    bq.append(cite);
  }

  block.replaceChildren(bq);
}
