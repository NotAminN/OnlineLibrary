// Explore / Search results (spec §05, §19, §45, §50). Filters, sort, results.
import { icon, stars } from '../icons.js';
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { genreById, genres } from '../data/genres.js';
import { store } from '../state/store.js';
import { qs, qsa, debounce } from '../utils/dom.js';
import { staggerReveal, sectionReveal } from '../animations/gsap.js';

const SORTS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'az', label: 'A–Z' }
];

function filterPanel(active) {
  const lib = store.get().library;
  const selectedGenres = active.genres || [];
  return `
  <aside class="card p-5" style="align-self:start;position:sticky;top:90px" id="filter-panel">
    <div class="flex items-center justify-between mb-4">
      <h3 style="font-size:1.1rem">Filters</h3>
      <button class="text-sm muted" data-clear-filters>Clear</button>
    </div>
    <div class="filter-group">
      <div class="filter-label">Genre</div>
      <div class="flex flex-wrap gap-2" id="genre-filters">
        ${genres.map((g) => `<button class="chip chip--sm ${selectedGenres.includes(g.id) ? 'is-active' : ''}" data-genre="${g.id}">${g.name}</button>`).join('')}
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-label">Minimum rating</div>
      <div class="segmented" id="rating-filter">
        ${[0, 4, 4.3, 4.5].map((r) => `<button class="${active.minRating === r ? 'is-active' : ''}" data-rating="${r}">${r === 0 ? 'Any' : r.toFixed(1)}+</button>`).join('')}
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-label">Publication year</div>
      <div class="flex gap-2">
        <select class="select" id="year-from" aria-label="From year">
          <option value="">From</option>
          ${Array.from({length: 6}, (_,i)=>2024-i).map((y)=>`<option value="${y}" ${active.yearFrom==y?'selected':''}>${y}</option>`).join('')}
        </select>
        <select class="select" id="year-to" aria-label="To year">
          <option value="">To</option>
          ${Array.from({length: 6}, (_,i)=>2024-i).map((y)=>`<option value="${y}" ${active.yearTo==y?'selected':''}>${y}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-label">Library status</div>
      <div class="segmented" id="status-filter">
        ${[['', 'Any'],['want','Want'],['reading','Reading'],['completed','Done']].map(([v,l])=>`<button class="${active.status===v?'is-active':''}" data-status="${v}">${l}</button>`).join('')}
      </div>
    </div>
  </aside>`;
}

export default {
  render(params) {
    const q = params.q || '';
    const isSearch = !!q;
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">${isSearch ? 'SEARCH RESULTS' : 'DISCOVER'}</div>
        <h1 class="page-title">${isSearch ? `Results for “${q}”` : 'Explore the collection'}</h1>
        <p class="lede mt-2" style="max-width:48ch">${isSearch ? 'Books, authors, and genres matching your search.' : 'Browse every title, then filter by genre, rating, year, and your own library.'}</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:2.5rem">
      <div class="grid" style="grid-template-columns:240px 1fr;gap:2.5rem;align-items:start">
        ${filterPanel({ genres: params.genre ? [params.genre] : [], ...params })}
        <div>
          <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div class="result-count" id="result-count"></div>
            <div class="flex items-center gap-2">
              <span class="text-sm muted">Sort</span>
              <select class="select" id="sort-select" style="width:auto;padding:.45rem .7rem">${SORTS.map((s) => `<option value="${s.id}" ${(params.sort || 'relevance') === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
            </div>
          </div>
          <div class="book-grid book-grid--lg" id="results"></div>
          <div id="empty-slot"></div>
        </div>
      </div>
    </section>`;
  },

  init(root, params) {
    const query = params.q || '';
    const state = {
      q: query,
      genres: params.genre ? [params.genre] : [],
      minRating: params.minRating ? +params.minRating : 0,
      yearFrom: params.yearFrom ? +params.yearFrom : null,
      yearTo: params.yearTo ? +params.yearTo : null,
      status: params.status || '',
      sort: params.sort || 'relevance'
    };
    const resultsEl = qs('#results', root);
    const countEl = qs('#result-count', root);
    const emptySlot = qs('#empty-slot', root);

    function run() {
      const lib = store.get().library;
      let res = dataService.search(state.q, {
        genres: state.genres, minRating: state.minRating || null,
        yearFrom: state.yearFrom, yearTo: state.yearTo,
        status: state.status, lib, sort: state.sort
      });
      countEl.textContent = `${res.length} ${res.length === 1 ? 'book' : 'books'}`;
      if (!res.length) {
        resultsEl.innerHTML = '';
        emptySlot.innerHTML = `<div class="empty empty--lg">
          <div class="empty__icon">${icon('search', { size: 28 })}</div>
          <div class="empty__title">No books found</div>
          <p class="empty__text">We couldn't find a book matching your filters. Try removing one.</p>
        </div>`;
        return;
      }
      emptySlot.innerHTML = '';
      resultsEl.innerHTML = res.map((b) => bookCard(b)).join('');
      staggerReveal('.book-card', root, { stagger: 0.04 });
    }

    // Genre chips
    qsa('#genre-filters [data-genre]', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = btn.dataset.genre;
        const i = state.genres.indexOf(g);
        if (i >= 0) state.genres.splice(i, 1); else state.genres.push(g);
        btn.classList.toggle('is-active');
        run();
      });
    });
    qsa('#rating-filter [data-rating]', root).forEach((b) => b.addEventListener('click', () => {
      qsa('#rating-filter button', root).forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active'); state.minRating = +b.dataset.rating; run();
    }));
    qsa('#status-filter [data-status]', root).forEach((b) => b.addEventListener('click', () => {
      qsa('#status-filter button', root).forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active'); state.status = b.dataset.status; run();
    }));
    qs('#year-from', root).addEventListener('change', (e) => { state.yearFrom = e.target.value ? +e.target.value : null; run(); });
    qs('#year-to', root).addEventListener('change', (e) => { state.yearTo = e.target.value ? +e.target.value : null; run(); });
    qs('#sort-select', root).addEventListener('change', (e) => { state.sort = e.target.value; run(); });
    qs('[data-clear-filters]', root).addEventListener('click', () => {
      state.genres = []; state.minRating = 0; state.yearFrom = null; state.yearTo = null; state.status = '';
      root.querySelectorAll('.chip.is-active').forEach((c) => c.classList.remove('is-active'));
      qsa('#rating-filter button', root).forEach((x,i)=>x.classList.toggle('is-active', i===0));
      qsa('#status-filter button', root).forEach((x,i)=>x.classList.toggle('is-active', i===0));
      qs('#year-from', root).value=''; qs('#year-to', root).value='';
      run();
    });

    run();
    sectionReveal(root);
  }
};
