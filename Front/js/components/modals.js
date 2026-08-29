// Modal / drawer / overlay system + Search overlay + Command palette +
// Notifications panel + mobile menu (spec §66, §19, §54, §47, §56).

import { icon } from '../icons.js';
import { qs, qsa } from '../utils/dom.js';
import { dataService } from '../services/dataService.js';
import { store } from '../state/store.js';
import { coverDataUri, coverFallbackUri, authorName } from '../utils/covers.js';
import { toast } from '../utils/toast.js';

let overlayEl = null;
let activeClose = null;

export function openOverlay(node, { onClose, position = 'center' } = {}) {
  closeOverlay();
  overlayEl = document.createElement('div');
  overlayEl.className = `overlay ${position === 'top' ? 'overlay--top' : position === 'right' ? 'overlay--right' : position === 'left' ? 'overlay--left' : ''}`;
  overlayEl.appendChild(node);
  document.body.appendChild(overlayEl);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlayEl.classList.add('is-open'));
  activeClose = onClose || null;
  const close = () => closeOverlay();
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) close(); });
  overlayEl._close = close;
  return { overlay: overlayEl, close };
}

export function closeOverlay() {
  if (overlayEl) {
    overlayEl.classList.remove('is-open');
    const el = overlayEl;
    setTimeout(() => { el.remove(); }, 260);
    overlayEl = null;
    document.body.style.overflow = '';
    if (activeClose) { try { activeClose(); } catch (e) {} activeClose = null; }
  }
}

// Generic confirm dialog (spec §66)
export function confirmDialog({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false } = {}) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal__header"><h3 class="modal__title">${title}</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
      <div class="modal__body"><p class="muted">${message}</p>
        <div class="flex gap-3 justify-end mt-5">
          <button class="btn btn--ghost" data-cancel>${cancelLabel}</button>
          <button class="btn ${danger ? 'btn--primary' : 'btn--primary'}" data-confirm style="${danger ? 'background:var(--sem-error)' : ''}">${confirmLabel}</button>
        </div>
      </div>`;
    const { close } = openOverlay(modal);
    modal.querySelector('[data-close]').onclick = () => { close(); resolve(false); };
    modal.querySelector('[data-cancel]').onclick = () => { close(); resolve(false); };
    modal.querySelector('[data-confirm]').onclick = () => { close(); resolve(true); };
  });
}

/* ---------------- SEARCH OVERLAY ---------------- */
export function openSearch(initial = '') {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.maxWidth = '40rem';
  modal.innerHTML = `
    <div class="modal__body" style="padding:1.1rem 1.3rem">
      <div class="search-input" style="border-radius:var(--radius-md)">
        <span>${icon('search', { size: 20 })}</span>
        <input type="text" id="search-input" placeholder="Search books, authors, genres..." value="${initial}" autocomplete="off" aria-label="Search" />
        <kbd>Esc</kbd>
      </div>
      <div id="search-results" class="mt-4"></div>
      <div id="search-footer" class="mt-4"></div>
    </div>`;
  const { close } = openOverlay(modal, { position: 'top' });
  const input = modal.querySelector('#search-input');
  const results = modal.querySelector('#search-results');
  const footer = modal.querySelector('#search-footer');

  function renderFooter() {
    footer.innerHTML = `
      <div class="flex items-center justify-between text-xs muted mb-2">
        <span class="eyebrow eyebrow--muted">Popular searches</span>
      </div>
      <div class="flex flex-wrap gap-2">
        ${dataService.popularSearches().map((s) => `<button class="chip chip--sm" data-q="${s}">${s}</button>`).join('')}
      </div>`;
    footer.querySelectorAll('[data-q]').forEach((b) => b.onclick = () => { input.value = b.dataset.q; run(); });
  }

  function run() {
    const q = input.value.trim();
    if (!q) { results.innerHTML = ''; renderFooter(); return; }
    const res = dataService.search(q).slice(0, 8);
    if (!res.length) {
      results.innerHTML = `<div class="empty" style="padding:2rem"><div class="empty__title">No matches</div><p class="empty__text">We couldn't find anything for “${q}”.</p></div>`;
      return;
    }
    results.innerHTML = res.map((b) => `
      <a class="flex items-center gap-3 p-2 rounded-lg hover:bg-paper" href="book.html?id=${b.id}" data-link>
        <img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:34px;height:51px;object-fit:cover;border-radius:3px" />
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold truncate">${b.title}</div>
          <div class="text-xs muted">${authorName(b.author)} · ${dataService.genreById[b.genre]?.name}</div>
        </div>
        <span class="text-xs muted">${b.rating.toFixed(1)} ★</span>
      </a>`).join('');
    footer.innerHTML = '';
    results.querySelectorAll('[data-link]').forEach((a) => a.onclick = () => close());
  }

  input.addEventListener('input', run);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) { close(); location.href = `explore.html?q=${encodeURIComponent(input.value.trim())}`; }
    if (e.key === 'Escape') close();
  });
  renderFooter();
  setTimeout(() => input.focus(), 60);
}

/* ---------------- COMMAND PALETTE ---------------- */
const COMMANDS = [
  { id: 'search', label: 'Search Books', icon: 'search', run: () => openSearch() },
  { id: 'library', label: 'Go to Library', icon: 'library', run: () => go('library.html') },
  { id: 'continue', label: 'Continue Reading', icon: 'play', run: () => go('history.html') },
  { id: 'favorites', label: 'Open Favorites', icon: 'heart', run: () => go('favorites.html') },
  { id: 'authors', label: 'Explore Authors', icon: 'user', run: () => go('authors.html') },
  { id: 'categories', label: 'Browse Categories', icon: 'grid', run: () => go('categories.html') },
  { id: 'history', label: 'View History', icon: 'clock', run: () => go('history.html') },
  { id: 'settings', label: 'Open Settings', icon: 'settings', run: () => go('settings.html') },
  { id: 'theme', label: 'Change Reading Theme', icon: 'sun', run: () => cycleReaderTheme() },
  { id: 'dashboard', label: 'Open Dashboard', icon: 'grid', run: () => go('dashboard.html') },
  { id: 'collections', label: 'View Collections', icon: 'layers', run: () => go('collections.html') }
];

export function openCommandPalette() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.maxWidth = '38rem';
  modal.innerHTML = `
    <div class="modal__body" style="padding:1rem 1.2rem">
      <div class="search-input" style="border-radius:var(--radius-md)">
        <span>${icon('command', { size: 18 })}</span>
        <input type="text" id="cmd-input" placeholder="Type a command…" autocomplete="off" aria-label="Command palette" />
        <kbd>Esc</kbd>
      </div>
      <div id="cmd-list" class="mt-3 flex flex-col gap-1" role="listbox"></div>
    </div>`;
  const { close } = openOverlay(modal, { position: 'top' });
  const input = modal.querySelector('#cmd-input');
  const list = modal.querySelector('#cmd-list');
  let active = 0;
  let filtered = COMMANDS.slice();

  function render() {
    list.innerHTML = filtered.map((c, i) => `
      <button class="cmd-item flex items-center gap-3 p-2.5 rounded-lg text-left ${i === active ? 'is-active' : ''}" data-i="${i}" role="option">
        <span class="muted">${icon(c.icon, { size: 18 })}</span>
        <span class="flex-1 text-sm">${c.label}</span>
        <span class="cmd-kbd text-xs muted" style="border:1px solid var(--line-strong);border-radius:5px;padding:1px 6px">↵</span>
      </button>`).join('');
    list.querySelectorAll('.cmd-item').forEach((b) => {
      b.onmouseenter = () => { active = +b.dataset.i; render(); };
      b.onclick = () => exec(filtered[+b.dataset.i]);
    });
  }
  function exec(c) { if (c) { close(); c.run(); } }
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
    active = 0; render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { active = Math.min(filtered.length - 1, active + 1); render(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); render(); e.preventDefault(); }
    if (e.key === 'Enter') exec(filtered[active]);
    if (e.key === 'Escape') close();
  });
  render();
  setTimeout(() => input.focus(), 60);
}

function cycleReaderTheme() {
  const order = ['light', 'sepia', 'dark'];
  const cur = store.getSettings().theme;
  const next = order[(order.indexOf(cur) + 1) % order.length];
  store.setSetting('theme', next);
  toast(`Reader theme: ${next}`, 'info');
}

/* ---------------- NOTIFICATIONS ---------------- */
export function openNotifications() {
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  const list = store.getNotifications();
  drawer.innerHTML = `
    <div class="drawer__header">
      <h3 class="modal__title">Notifications</h3>
      <div class="flex items-center gap-2">
        <button class="btn--sm btn--subtle" data-markall>Mark all read</button>
        <button class="btn--icon" data-close>${icon('x')}</button>
      </div>
    </div>
    <div class="drawer__body" id="notif-list">
      ${list.length ? list.map(notifRow).join('') : `<div class="empty"><div class="empty__title">All caught up</div><p class="empty__text">You have no new notifications.</p></div>`}
    </div>`;
  const { close } = openOverlay(drawer, { position: 'right' });
  drawer.querySelector('[data-close]').onclick = close;
  drawer.querySelector('[data-markall]').onclick = () => { store.markAllRead(); renderNotifList(); };
  function renderNotifList() {
    const l = store.getNotifications();
    const body = drawer.querySelector('#notif-list');
    body.innerHTML = l.length ? l.map(notifRow).join('') : `<div class="empty"><div class="empty__title">All caught up</div></div>`;
    bind();
  }
  function bind() {
    drawer.querySelectorAll('[data-read]').forEach((b) => b.onclick = () => { store.markRead(b.dataset.read); renderNotifList(); });
    drawer.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => { store.removeNotification(b.dataset.del); renderNotifList(); });
  }
  bind();
}
function notifRow(n) {
  const iconMap = { recommendation: 'sparkles', reminder: 'clock', collection: 'layers', book: 'book-open', update: 'info' };
  return `
    <div class="flex gap-3 p-3 rounded-lg ${n.read ? '' : 'card--paper'}" style="border:1px solid var(--line);margin-bottom:.6rem">
      <span class="avatar avatar--sm" style="background:${n.read ? 'var(--warm-gray-light)' : 'var(--burgundy)'};width:2.2rem;height:2.2rem;flex-shrink:0">${icon(iconMap[n.type] || 'info', { size: 16 })}</span>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold">${n.title}</div>
        <div class="text-xs muted mt-0.5">${n.body}</div>
        <div class="flex gap-3 mt-2">
          ${n.read ? '' : `<button class="text-xs" data-read="${n.id}" style="color:var(--burgundy)">Mark read</button>`}
          <button class="text-xs muted" data-del="${n.id}">Delete</button>
        </div>
      </div>
    </div>`;
}

/* ---------------- MOBILE MENU ---------------- */
export function openMobileMenu(activePage) {
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  const links = [
    { href: 'index.html', label: 'Home', icon: 'home' },
    { href: 'explore.html', label: 'Explore', icon: 'compass' },
    { href: 'categories.html', label: 'Categories', icon: 'grid' },
    { href: 'authors.html', label: 'Authors', icon: 'user' },
    { href: 'collections.html', label: 'Collections', icon: 'layers' },
    { href: 'library.html', label: 'My Library', icon: 'library' },
    { href: 'dashboard.html', label: 'Dashboard', icon: 'grid' },
    { href: 'favorites.html', label: 'Favorites', icon: 'heart' },
    { href: 'shelves.html', label: 'Shelves', icon: 'layers' },
    { href: 'history.html', label: 'History', icon: 'clock' },
    { href: 'statistics.html', label: 'Statistics', icon: 'bar-chart' },
    { href: 'profile.html', label: 'Profile', icon: 'user' },
    { href: 'settings.html', label: 'Settings', icon: 'settings' }
  ];
  drawer.innerHTML = `
    <div class="drawer__header"><h3 class="modal__title">Menu</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
    <div class="drawer__body flex flex-col gap-1">
      ${links.map((l) => `<a class="sidebar__link ${l.page === activePage ? 'is-active' : ''}" href="${l.href}">${icon(l.icon, { size: 20 })}<span class="sidebar__label">${l.label}</span></a>`).join('')}
      <a class="sidebar__link" href="login.html">${icon('logout', { size: 20 })}<span class="sidebar__label">Sign out</span></a>
    </div>`;
  const { close } = openOverlay(drawer, { position: 'left' });
  drawer.querySelector('[data-close]').onclick = close;
}
