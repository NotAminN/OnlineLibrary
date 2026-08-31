// Categories / Genres page — editorial asymmetric Bento layout.
// Featured image cards (Fiction, Mystery, Crime, Adventure, History), a tall
// Business card with book covers, two special feature cards (Historical
// Fiction, Mystery Crime) and minimal standard cards for the rest.
import { genres, genreById, genreArt, genreIcon } from '../data/genres.js';
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

// Categories / Genres page — editorial asymmetric Bento layout (shared component).
import { initBentoGrid } from '../components/bentoGrid.js';

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">EXPLORE BY GENRE</div>
        <h1 class="page-title">Find your kind of story</h1>
      </div>
    </section>
    <section class="container-wide" style="padding-block:1.5rem 5rem">
      <div class="bento" id="genre-grid" data-reveal></div>
    </section>`;
  },
  init(root) {
    initBentoGrid(root);
  }
};
