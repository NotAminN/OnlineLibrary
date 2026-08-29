// Favorites (spec §42). Add/remove/search/sort/filter.
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { icon } from '../icons.js';
import { store } from '../state/store.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa, debounce } from '../utils/dom.js';

export default {
  topbar: { title: 'Favorites', subtitle: 'The books you’ve marked as keepers.' },
  render() {
    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div class="result-count" id="fav-count"></div>
        <div class="flex items-center gap-2">
          <div class="search-input" style="max-width:14rem">${icon('search', { size: 16 })}<input type="text" id="fav-search" placeholder="Search favorites" aria-label="Search favorites"/></div>
          <select class="select" id="fav-sort" style="width:auto;padding:.45rem .7rem"><option value="recent">Recent</option><option value="title">Title A–Z</option><option value="rating">Rating</option></select>
        </div>
      </div>
      <div class="lib-grid" id="fav-grid"></div>
      <div id="fav-empty"></div>
    </div>`;
  },
  init(root) {
    const grid = qs('#fav-grid', root);
    const empty = qs('#fav-empty', root);
    const count = qs('#fav-count', root);
    const state = { q: '', sort: 'recent' };

    function run() {
      let list = store.getFavorites().map((id) => dataService.get(id)).filter(Boolean);
      if (state.q) { const q = state.q.toLowerCase(); list = list.filter((b) => b.title.toLowerCase().includes(q) || dataService.authorById[b.author].name.toLowerCase().includes(q)); }
      if (state.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
      else if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      count.textContent = `${list.length} ${list.length === 1 ? 'book' : 'books'}`;
      if (!list.length) {
        grid.innerHTML = '';
        empty.innerHTML = `<div class="empty empty--lg"><div class="empty__icon">${icon('heart', { size: 28 })}</div><div class="empty__title">Your favorite shelf is waiting</div><p class="empty__text">Tap the heart on any book to keep it close.</p><a class="btn btn--primary mt-3" href="explore.html">Find books to love</a></div>`;
        return;
      }
      empty.innerHTML = '';
      grid.innerHTML = list.map((b) => bookCard(b)).join('');
      staggerReveal('.book-card', root, { stagger: 0.04 });
    }
    qs('#fav-search', root).addEventListener('input', debounce((e) => { state.q = e.target.value; run(); }, 200));
    qs('#fav-sort', root).addEventListener('change', (e) => { state.sort = e.target.value; run(); });
    run();
  }
};
