// My Library (spec §39). Tabs, search, sort, grid/list toggle.
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { icon } from '../icons.js';
import { store } from '../state/store.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa, debounce } from '../utils/dom.js';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'reading', label: 'Currently Reading' },
  { id: 'want', label: 'Want to Read' },
  { id: 'completed', label: 'Completed' },
  { id: 'favorites', label: 'Favorites' }
];

export default {
  topbar: { title: 'My Library', subtitle: 'Every book you’ve saved, in one place.' },
  render() {
    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div class="tabs" id="lib-tabs" style="border:none;overflow:visible">
          ${TABS.map((t) => `<button class="tab" data-tab="${t.id}">${t.label}</button>`).join('')}
        </div>
        <div class="flex items-center gap-2">
          <div class="search-input" style="max-width:14rem">${icon('search', { size: 16 })}<input type="text" id="lib-search" placeholder="Search library" aria-label="Search library"/></div>
          <select class="select" id="lib-sort" style="width:auto;padding:.45rem .7rem"><option value="recent">Recent</option><option value="title">Title A–Z</option><option value="rating">Rating</option></select>
          <button class="btn--icon" data-view="grid" title="Grid view">${icon('grid', { size: 18 })}</button>
          <button class="btn--icon" data-view="list" title="List view">${icon('list', { size: 18 })}</button>
        </div>
      </div>
      <div id="lib-grid" class="lib-grid"></div>
      <div id="lib-empty"></div>
    </div>`;
  },
  init(root) {
    let view = 'grid';
    const state = { tab: 'all', q: '', sort: 'recent' };
    const grid = qs('#lib-grid', root);
    const emptySlot = qs('#lib-empty', root);

    function idsForTab() {
      const lib = store.get().library;
      let ids;
      if (state.tab === 'favorites') ids = store.getFavorites();
      else if (state.tab === 'all') ids = Object.keys(lib);
      else ids = Object.keys(lib).filter((id) => lib[id].status === state.tab);
      return ids;
    }

    function run() {
      let ids = idsForTab();
      let list = ids.map((id) => dataService.get(id)).filter(Boolean);
      if (state.q) { const q = state.q.toLowerCase(); list = list.filter((b) => b.title.toLowerCase().includes(q) || dataService.authorById[b.author].name.toLowerCase().includes(q)); }
      if (state.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
      else if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

      if (!list.length) {
        grid.innerHTML = '';
        const map = { all: 'Your library is waiting.', want: 'Nothing queued to read yet.', reading: 'Pick a book and start your next chapter.', completed: 'Finished books will appear here.', favorites: 'Your favorite shelf is waiting.' };
        emptySlot.innerHTML = `<div class="empty empty--lg"><div class="empty__icon">${icon('library', { size: 28 })}</div><div class="empty__title">${map[state.tab]}</div><p class="empty__text">Browse <a href="explore.html" style="color:var(--burgundy)">Explore</a> to add your first book.</p></div>`;
        return;
      }
      emptySlot.innerHTML = '';
      if (view === 'list') {
        grid.className = 'flex flex-col gap-2';
        grid.innerHTML = list.map((b) => bookCard(b, { variant: 'horizontal' })).join('');
      } else {
        grid.className = 'lib-grid';
        grid.innerHTML = list.map((b) => bookCard(b)).join('');
      }
      staggerReveal('.book-card', root, { stagger: 0.04 });
    }

    qsa('#lib-tabs [data-tab]', root).forEach((b) => b.onclick = () => {
      qsa('#lib-tabs .tab', root).forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active'); state.tab = b.dataset.tab; run();
    });
    qs('#lib-search', root).addEventListener('input', debounce((e) => { state.q = e.target.value; run(); }, 200));
    qs('#lib-sort', root).addEventListener('change', (e) => { state.sort = e.target.value; run(); });
    qsa('[data-view]', root).forEach((b) => b.onclick = () => { view = b.dataset.view; run(); });

    // default active tab
    qs('#lib-tabs .tab', root)?.classList.add('is-active');
    run();
  }
};
