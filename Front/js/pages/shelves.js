// Personal shelves (spec §40). Create, rename, delete, add/remove books.
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { icon } from '../icons.js';
import { store } from '../state/store.js';
import { coverDataUri, coverFallbackUri } from '../utils/covers.js';
import { confirmDialog } from '../components/modals.js';
import { toast } from '../utils/toast.js';
import { openOverlay, closeOverlay } from '../components/modals.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

export default {
  topbar: { title: 'My Shelves', subtitle: 'Organize your library your way.' },
  render() {
    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div class="result-count">${store.getShelves().length} shelves</div>
        <button class="btn btn--primary btn--sm" data-new>${icon('plus', { size: 16 })} New shelf</button>
      </div>
      <div class="grid gap-5" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))" id="shelf-grid"></div>
      <div id="shelf-empty"></div>
    </div>`;
  },
  init(root) {
    const grid = qs('#shelf-grid', root);
    const empty = qs('#shelf-empty', root);

    function run() {
      const shelves = store.getShelves();
      if (!shelves.length) {
        grid.innerHTML = '';
        empty.innerHTML = `<div class="empty empty--lg"><div class="empty__icon">${icon('layers', { size: 28 })}</div><div class="empty__title">No shelves yet</div><p class="empty__text">Create a shelf to group books by mood, project, or season.</p></div>`;
        return;
      }
      empty.innerHTML = '';
      grid.innerHTML = shelves.map((s) => shelfCardHtml(s)).join('');
      bindShelves();
      staggerReveal('.shelf-card', root, { stagger: 0.05 });
    }

    function shelfCardHtml(s) {
      const books = s.bookIds.map((id) => dataService.get(id)).filter(Boolean);
      const covers = books.slice(0, 4);
      return `
      <div class="shelf-card" data-shelf="${s.id}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2"><span class="muted">${icon(s.icon || 'layers', { size: 18 })}</span><h3 class="font-serif" style="font-size:1.25rem">${s.name}</h3></div>
          <button class="btn--icon" data-menu="${s.id}" aria-label="Shelf options">${icon('more-horizontal', { size: 18 })}</button>
        </div>
        <div class="shelf-cover-stack mb-3">
          ${covers.length ? covers.map((b) => `<img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt=""/>`).join('') : `<div class="muted text-sm" style="padding:1rem 0">Empty shelf</div>`}
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm muted">${books.length} ${books.length === 1 ? 'book' : 'books'}</span>
          <button class="btn btn--outline btn--sm" data-open="${s.id}">Open</button>
        </div>
      </div>`;
    }

    function bindShelves() {
      qsa('[data-open]', root).forEach((b) => b.onclick = () => openShelfDetail(b.dataset.open));
      qsa('[data-menu]', root).forEach((b) => b.onclick = () => shelfMenu(b.dataset.menu));
    }

    function shelfMenu(id) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.maxWidth = '20rem';
      modal.innerHTML = `<div class="modal__body" style="padding:1rem">
        <button class="menu__item" data-rename>${icon('edit', { size: 16 })} Rename shelf</button>
        <button class="menu__item" data-add>${icon('book-plus', { size: 16 })} Add books</button>
        <div class="menu__sep"></div>
        <button class="menu__item" data-del style="color:var(--sem-error)">${icon('trash', { size: 16 })} Delete shelf</button>
        <button class="btn btn--ghost btn--sm mt-3 w-full" data-close>Cancel</button>
      </div>`;
      const { close } = openOverlay(modal);
      modal.querySelector('[data-close]').onclick = close;
      modal.querySelector('[data-rename]').onclick = async () => { close(); const name = prompt('Rename shelf to:'); if (name && name.trim()) { store.renameShelf(id, name.trim()); toast('Shelf renamed.', 'success'); run(); } };
      modal.querySelector('[data-add]').onclick = () => { close(); addBooksToShelf(id); };
      modal.querySelector('[data-del]').onclick = async () => { close(); const ok = await confirmDialog({ title: 'Delete shelf?', message: 'The books inside remain in your library.', confirmLabel: 'Delete', danger: true }); if (ok) { store.deleteShelf(id); toast('Shelf deleted.', 'info'); run(); } };
    }

    function openShelfDetail(id) {
      const s = store.getShelves().find((x) => x.id === id);
      if (!s) return;
      const books = s.bookIds.map((bid) => dataService.get(bid)).filter(Boolean);
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">${s.name}</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body">
          ${books.length ? `<div class="book-grid">${books.map((b) => bookCard(b)).join('')}</div>`
            : `<div class="empty"><div class="empty__title">No books here</div><p class="empty__text">Add books from the shelf menu.</p></div>`}
        </div>`;
      const { close } = openOverlay(drawer, { position: 'right' });
      drawer.querySelector('[data-close]').onclick = close;
    }

    function addBooksToShelf(id) {
      const candidates = dataService.cache.books.filter((b) => !store.getShelves().find((s) => s.id === id).bookIds.includes(b.id)).slice(0, 30);
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">Add to shelf</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body" id="add-list">
          ${candidates.map((b) => `<button class="cmd-item w-full flex items-center gap-3 p-2 rounded-lg text-left" data-addbook="${b.id}">
            <img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:34px;height:51px;object-fit:cover;border-radius:3px"/>
            <span class="flex-1"><span class="block text-sm font-semibold truncate">${b.title}</span><span class="block text-xs muted">${authorName(b.author)}</span></span>
          </button>`).join('')}
        </div>`;
      const { close } = openOverlay(drawer, { position: 'right' });
      drawer.querySelector('[data-close]').onclick = close;
      qsa('[data-addbook]', drawer).forEach((b) => b.onclick = () => { store.toggleInShelf(id, b.dataset.addbook); toast('Added to shelf.', 'success'); b.remove(); run(); });
    }

    qs('[data-new]', root).onclick = () => {
      const name = prompt('Name your new shelf:');
      if (name && name.trim()) { store.addShelf(name.trim()); toast('Shelf created.', 'success'); run(); }
    };

    run();
  }
};

function authorName(id) { return dataService.authorById[id]?.name || 'Unknown'; }
