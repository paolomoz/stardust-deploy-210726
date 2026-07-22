/**
 * blog — newsroom: featured story (with image) + dateline list (index-B
 * prototype, IB bright-newsroom anchor). Reconstructive (#95).
 * Schema: stardust/eds-schema/index.json § blog.
 *
 * Authoring: the head (h2 "Blog" + "View All" link) is DEFAULT CONTENT before
 * the block, styled in place as a flex row via .blog-container. Block rows:
 * one per story — a single cell holding (optional image), date line, <h3>
 * title, excerpt paragraph, "Read more" link. The first image-bearing row is
 * the feature; the rest form the dateline list.
 */

// wrapTextNodes (aem.js) folds a media-led cell (img/picture + siblings) into ONE
// wrapper <p> — expand it back to its element children before classifying.
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].matches('p')
      && kids[0].children.length > 1
      && kids[0].querySelector('h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) {
    kids = [...kids[0].children];
  }
  return kids;
}

function classifyUnit(nodes) {
  const unit = {
    media: null, date: null, title: null, excerpt: null, link: null,
  };
  nodes.forEach((el) => {
    const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const a = el.matches('a') ? el : el.querySelector('a');
    if (pic && !unit.media) { unit.media = pic; return; }
    if (el.matches('h3, h4') && !unit.title) { unit.title = el; return; }
    if (a && !unit.link) { unit.link = a; return; }
    const text = el.textContent.trim();
    if (!text) return;
    if (!unit.date && /^\d{1,2}\s/.test(text) && text.length < 24) { unit.date = text; return; }
    if (!unit.excerpt) unit.excerpt = el;
  });
  return unit;
}

function buildArticle(unit, withMedia) {
  const article = document.createElement('article');
  if (withMedia && unit.media) article.append(unit.media);
  if (unit.date) {
    const date = document.createElement('span');
    date.className = 'date';
    date.textContent = unit.date;
    article.append(date);
  }
  if (unit.title) article.append(unit.title);
  if (unit.excerpt) {
    unit.excerpt.classList.add('excerpt');
    article.append(unit.excerpt);
  }
  if (unit.link) {
    unit.link.classList.add('arrow-link');
    article.append(unit.link);
  }
  return article;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const units = rows
    .map((row) => classifyUnit([...row.querySelectorAll(':scope > div')].flatMap((c) => cellNodes(c))))
    .filter((u) => u.title || u.excerpt || u.link);

  const newsroom = document.createElement('div');
  newsroom.className = 'newsroom';

  const featureIdx = units.findIndex((u) => u.media);
  const feature = featureIdx >= 0 ? units.splice(featureIdx, 1)[0] : units.shift();
  if (feature) {
    const featureEl = buildArticle(feature, true);
    featureEl.classList.add('feature');
    newsroom.append(featureEl);
  }

  const list = document.createElement('ul');
  list.className = 'dateline-list';
  units.forEach((unit) => {
    const li = document.createElement('li');
    li.append(buildArticle(unit, false));
    list.append(li);
  });
  newsroom.append(list);

  block.replaceChildren(newsroom);
}
