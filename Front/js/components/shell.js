// Global shell components (spec §03): navbar, footer, sidebar, topbar,
// bottom navigation. Rendered once by app.js based on the page layout.

import { icon } from '../icons.js';
import { store } from '../state/store.js';
import { openSearch, openCommandPalette } from '../components/modals.js';
import { avatarInitials } from '../utils/format.js';

const NAV_PUBLIC = [
  { href: 'index.html', label: 'Home', page: 'home' },
  { href: 'explore.html', label: 'Explore', page: 'explore' },
  { href: 'categories.html', label: 'Categories', page: 'categories' },
  { href: 'authors.html', label: 'Authors', page: 'authors' },
  { href: 'collections.html', label: 'Collections', page: 'collections' }
];

const NAV_APP = [
  { href: 'dashboard.html', label: 'Dashboard', page: 'dashboard', icon: 'grid' },
  { href: 'library.html', label: 'My Library', page: 'library', icon: 'library' },
  { href: 'history.html', label: 'Continue Reading', page: 'history', icon: 'play' },
  { href: 'favorites.html', label: 'Favorites', page: 'favorites', icon: 'heart' },
  { href: 'shelves.html', label: 'Shelves', page: 'shelves', icon: 'layers' },
  { href: 'history.html', label: 'History', page: 'history', icon: 'clock' },
  { href: 'statistics.html', label: 'Statistics', page: 'statistics', icon: 'bar-chart' },
  { href: 'settings.html', label: 'Settings', page: 'settings', icon: 'settings' }
];

const NAV_BOTTOM = [
  { href: 'index.html', label: 'Home', page: 'home', icon: 'home' },
  { href: 'explore.html', label: 'Explore', page: 'explore', icon: 'compass' },
  { href: 'explore.html#search', label: 'Search', page: 'search', icon: 'search' },
  { href: 'library.html', label: 'Library', page: 'library', icon: 'library' },
  { href: 'profile.html', label: 'Profile', page: 'profile', icon: 'user' }
];

export function brand() {
  return `<a href="index.html" class="brand" aria-label="Lumina home">
    <span class="brand__mark">L</span>Lumina<span class="brand__dot">.</span>
  </a>`;
}

export function renderNavbar(activePage) {
  const links = NAV_PUBLIC.map((n) =>
    `<a class="nav-link ${n.page === activePage ? 'is-active' : ''}" href="${n.href}">${n.label}</a>`
  ).join('');
  const notifCount = store.getNotifications().filter((n) => !n.read).length;
  return `
  <header class="navbar" id="navbar">
    <div class="container-wide flex items-center justify-between" style="height:68px">
      ${brand()}
      <nav class="hide-touch flex items-center gap-7" aria-label="Primary">${links}</nav>
      <div class="flex items-center gap-2">
        <button class="btn--icon show-touch-none" data-action="search" aria-label="Search">${icon('search', { size: 20 })}</button>
        <a class="btn--ghost btn--sm hide-touch" href="library.html">My Library</a>
        <button class="btn--icon hide-touch" data-action="notifications" aria-label="Notifications">
          ${icon('bell', { size: 20 })}
          ${notifCount ? `<span class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-burgundy text-white text-[10px] grid place-items-center" style="font-size:10px">${notifCount}</span>` : ''}
        </button>
        <a class="btn btn--primary btn--sm hide-touch" href="reader.html?id=b-the-tenth-quiet">Start Reading</a>
        <button class="btn--icon show-touch" data-action="menu" aria-label="Menu">${icon('menu', { size: 22 })}</button>
      </div>
    </div>
  </header>`;
}

export function renderFooter() {
  return `
  <footer class="footer">
    <div class="container-wide py-14">
      <div class="grid gap-10" style="grid-template-columns:1.4fr repeat(3,1fr)">
        <div>
          <div class="font-serif text-2xl mb-3" style="color:#fff">Lumina<span style="color:var(--gold)">.</span></div>
          <p class="text-sm" style="max-width:24rem;line-height:1.7">Discover beautiful books and read without distraction. A calm, editorial home for readers who value the page.</p>
          <div class="flex gap-3 mt-5">
            <a class="footer__icon" href="#" aria-label="Twitter" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center">${icon('twitter', { size: 16 })}</a>
            <a class="footer__icon" href="#" aria-label="Instagram" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center">${icon('instagram', { size: 16 })}</a>
            <a class="footer__icon" href="#" aria-label="Facebook" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center">${icon('facebook', { size: 16 })}</a>
          </div>
        </div>
        <div>
          <div class="footer__heading">Library</div>
          <ul class="space-y-2 text-sm">
            <li><a href="explore.html">Explore Books</a></li>
            <li><a href="categories.html">Categories</a></li>
            <li><a href="authors.html">Authors</a></li>
            <li><a href="collections.html">Collections</a></li>
          </ul>
        </div>
        <div>
          <div class="footer__heading">Platform</div>
          <ul class="space-y-2 text-sm">
            <li><a href="library.html">My Library</a></li>
            <li><a href="dashboard.html">Reading Experience</a></li>
            <li><a href="statistics.html">Reading Statistics</a></li>
            <li><a href="settings.html">Settings</a></li>
          </ul>
        </div>
        <div>
          <div class="footer__heading">Company</div>
          <ul class="space-y-2 text-sm">
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="#" data-action="privacy">Privacy</a></li>
            <li><a href="#" data-action="terms">Terms</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__news rounded-xl p-6 mt-12 grid gap-4 md:grid-cols-2 items-center" style="margin-top:3rem">
        <div>
          <div class="font-serif text-xl" style="color:#fff">Discover something worth reading.</div>
          <p class="text-sm mt-1">Thoughtful recommendations and new releases, delivered to your inbox.</p>
        </div>
        <form class="flex gap-2" data-newsletter>
          <input class="input" type="email" placeholder="Your email address" aria-label="Email address" required style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:#fff" />
          <button class="btn btn--gold" type="submit">Subscribe</button>
        </form>
      </div>
      <div class="text-xs mt-10 pt-6" style="border-top:1px solid rgba(255,255,255,.1);color:#8d877c">
        © 2026 Lumina Library. A demonstration reading platform. All book data is fictional.
      </div>
    </div>
  </footer>`;
}

export function renderBottomNav(activePage) {
  return `
  <nav class="bottom-nav hide-touch-none" aria-label="Mobile">
    ${NAV_BOTTOM.map((n) => `
      <a class="bottom-nav__link ${n.page === activePage ? 'is-active' : ''}" href="${n.href}" ${n.page === 'search' ? 'data-action="search"' : ''}>
        ${icon(n.icon, { size: 22 })}<span>${n.label}</span>
      </a>`).join('')}
  </nav>`;
}

export function renderSidebar(activePage, collapsed = false) {
  const user = store.getUser();
  const links = NAV_APP.map((n) => `
    <a class="sidebar__link ${n.page === activePage ? 'is-active' : ''}" href="${n.href}" title="${n.label}">
      ${icon(n.icon, { size: 20 })}<span class="sidebar__label">${n.label}</span>
    </a>`).join('');
  return `
  <aside class="sidebar ${collapsed ? 'is-collapsed' : ''}" id="sidebar">
    <div class="flex items-center justify-between p-4" style="height:68px">
      ${brand()}
      <button class="btn--icon hide-touch" data-action="toggle-sidebar" aria-label="Toggle sidebar">${icon('chevron-left', { size: 18 })}</button>
    </div>
    <div class="px-4 py-2">
      <div class="flex items-center gap-3 p-3 rounded-lg card--paper">
        <div class="avatar avatar--sm" style="background:${user.avatarColor}">${avatarInitials(user.name)}</div>
        <div class="min-w-0"><div class="text-sm font-semibold truncate">${user.name}</div><div class="text-xs muted truncate">Reader</div></div>
      </div>
    </div>
    <nav class="flex-1 overflow-y-auto px-3 py-2 sidebar__nav" style="display:flex;flex-direction:column;gap:.25rem">${links}</nav>
    <div class="p-3">
      <button class="sidebar__link w-full" data-action="command" title="Command palette">
        ${icon('command', { size: 20 })}<span class="sidebar__label">Command <span class="muted text-xs">(⌘K)</span></span>
      </button>
    </div>
  </aside>`;
}

export function renderTopbar(activePage, title, subtitle) {
  const notifCount = store.getNotifications().filter((n) => !n.read).length;
  return `
  <div class="topbar">
    <div>
      <h1 style="font-size:1.5rem;margin:0">${title}</h1>
      ${subtitle ? `<p class="muted text-sm" style="margin:0">${subtitle}</p>` : ''}
    </div>
    <div class="flex items-center gap-2">
      <button class="btn--icon hide-touch" data-action="search" aria-label="Search">${icon('search', { size: 20 })}</button>
      <button class="btn--icon hide-touch" data-action="command" aria-label="Command palette">${icon('command', { size: 20 })}</button>
      <button class="btn--icon" data-action="notifications" aria-label="Notifications" style="position:relative">
        ${icon('bell', { size: 20 })}
        ${notifCount ? `<span style="position:absolute;top:-2px;right:-2px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:var(--burgundy);color:#fff;font-size:10px;display:grid;place-items:center">${notifCount}</span>` : ''}
      </button>
      <a class="btn--icon" href="profile.html" aria-label="Profile" style="background:${store.getUser().avatarColor};color:#fff;width:2.4rem;height:2.4rem;border-radius:50%;display:grid;place-items:center;font-weight:600;font-size:.8rem">${avatarInitials(store.getUser().name)}</a>
    </div>
  </div>`;
}

export { NAV_PUBLIC, NAV_APP, NAV_BOTTOM };
