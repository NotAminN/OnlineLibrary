// Shared editorial asymmetric Bento genre grid.
// Used by both the Categories page and the Home "Explore by Genre" section.
// Featured image cards (Fiction, Mystery, Crime, Adventure, History), a tall
// Business card with book covers, two special feature cards (Historical
// Fiction, Mystery Crime) and minimal standard cards for the rest.
import { genreById, genreArt, genreIcon } from '../data/genres.js';
import { dataService } from '../services/dataService.js';
import { icon } from '../icons.js';
import { coverDataUri } from '../utils/covers.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

// Bento composition spec: id -> [colSpan, rowSpan, variant]
// variant: 'img' = photo card, 'stack' = tall card with covers, 'std' = minimal
const BENTO = [
  ['fiction',    2, 1, 'img'],
  ['mystery',    1, 1, 'img'],
  ['crime',      1, 1, 'img'],
  ['adventure',  1, 2, 'stack'],
  ['history',    1, 1, 'img'],
  ['psychology', 1, 1, 'std'],
  ['science',    1, 1, 'std'],
  ['technology', 1, 1, 'std'],
  ['business',   1, 2, 'stack'],
  ['biography',  1, 1, 'std'],
  ['art',        1, 1, 'std'],
  ['self',       1, 1, 'std'],
  ['ya',         1, 1, 'std'],
  ['poetry',     1, 1, 'std'],
  ['philosophy', 1, 1, 'std'],
];

function chip(iconName, color) {
  return `<span class="bento__chip" style="background:${color}">${icon(iconName, { size: 18 })}</span>`;
}

function miniCovers(books, max = 3) {
  return `<div class="bento__covers">${books.slice(0, max).map((b, i) => `
    <img class="bento__cover" style="--i:${i}" src="${coverDataUri(b)}" alt=""
         loading="lazy" onerror="this.style.visibility='hidden'">`).join('')}</div>`;
}

function imageCard(g, colSpan, { tag, covers, arrow = false, books: bookOverride } = {}) {
  const books = bookOverride || dataService.byGenre(g.id);
  const art = genreArt[g.id] || {};
  const label = tag || art.tag || `${books.length} titles`;
  return `
  <a class="bento__card bento__card--img bento__card--w${colSpan}"
     href="explore.html?genre=${g.id}" id="${g.id}" style="--g:${g.color}">
    <img class="bento__bg" src="${art.img || ''}" alt="" loading="lazy"
         onerror="this.remove()">
    <div class="bento__scrim"></div>
    ${chip(genreIcon[g.id] || 'book-open', g.color)}
    <div class="bento__content">
      <h3 class="bento__title">${g.name}</h3>
      <p class="bento__sub">${label}</p>
    </div>
    ${covers ? miniCovers(books, 2) : ''}
    ${arrow ? '<span class="bento__arrow">' + icon('arrow-right', { size: 16 }) + '</span>' : ''}
  </a>`;
}

function standardCard(g) {
  const books = dataService.byGenre(g.id);
  return `
  <a class="bento__card bento__card--std" href="explore.html?genre=${g.id}"
     id="${g.id}" style="--g:${g.color}">
    ${chip(genreIcon[g.id] || 'book-open', g.color)}
    <h3 class="bento__name">${g.name}</h3>
    <p class="bento__count">${books.length} ${books.length === 1 ? 'title' : 'titles'}</p>
  </a>`;
}

function stackCard(g, colSpan, rowSpan = 1) {
  const books = dataService.byGenre(g.id);
  return `
  <a class="bento__card bento__card--stack bento__card--w${colSpan}"
     href="explore.html?genre=${g.id}" id="${g.id}"
     style="--g:${g.color};${rowSpan > 1 ? `grid-row:span ${rowSpan}` : ''}">
    <div class="bento__stacktop">
      ${chip(genreIcon[g.id] || 'book-open', g.color)}
      <h3 class="bento__name">${g.name}</h3>
      <p class="bento__count">${books.length} ${books.length === 1 ? 'title' : 'titles'}</p>
    </div>
    ${miniCovers(books, 2)}
  </a>`;
}

// Fill the given `.bento` container (inside `root`) with the bento grid.
export function initBentoGrid(root, selector = '#genre-grid') {
  const grid = qs(selector, root);
  if (!grid) return;
  let html = '';
  for (const [id, colSpan, rowSpan, variant] of BENTO) {
    const g = genreById[id];
    if (!g) continue;
    if (variant === 'img') html += imageCard(g, colSpan);
    else if (variant === 'stack') html += stackCard(g, colSpan, rowSpan);
    else html += standardCard(g);
  }
  // Special feature cards (link to their closest real genre)
  html += imageCard({ id: 'historical-fiction', name: 'Historical Fiction', color: '#5E2F37' }, 1,
    { tag: 'Discover the past', covers: true, books: dataService.byGenre('history') });
  html += imageCard({ id: 'mystery-crime', name: 'Mystery Crime', color: '#3F5246' }, 2,
    { covers: true, arrow: true, books: dataService.byGenre('mystery') });
  grid.innerHTML = html;
  // Special cards: point at real genres for filtering
  const hf = qs('#historical-fiction', root); if (hf) hf.href = 'explore.html?genre=history';
  const mc = qs('#mystery-crime', root); if (mc) mc.href = 'explore.html?genre=mystery';
  staggerReveal('.bento__card', root, { stagger: 0.04 });
  // On the Categories page, scroll to the anchored genre if present in the hash.
  const hash = location.hash.slice(1);
  if (hash && qs('#' + CSS.escape(hash), root)) {
    setTimeout(() => qs('#' + CSS.escape(hash), root).scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  }
}
