// Application entry (spec §84, §03). Mounts the appropriate shell per page
// layout, dispatches to page modules, and wires global behaviors.

// Critical: import the design system stylesheet first so Tailwind utilities
// and component classes are injected before any element is rendered.
import '../css/main.css';

import { qs, qsa, go } from './utils/dom.js';
import { store } from './state/store.js';
import { initSmoothScroll, scrollToTop, prefersReduced } from './animations/gsap.js';
import { renderNavbar, renderFooter, renderBottomNav, renderSidebar, renderTopbar, brand } from './components/shell.js';
import { openSearch, openCommandPalette, openNotifications, openMobileMenu } from './components/modals.js';
import { toast } from './utils/toast.js';
import { icon } from './icons.js';
import { installCoverWatchdog } from './utils/covers.js';

// ---- Page registry ----
import home from './pages/home.js';
import explore from './pages/explore.js';
import categories from './pages/categories.js';
import authors from './pages/authors.js';
import collections from './pages/collections.js';
import book from './pages/book.js';
import reader from './pages/reader.js';
import library from './pages/library.js';
import dashboard from './pages/dashboard.js';
import favorites from './pages/favorites.js';
import history from './pages/history.js';
import shelves from './pages/shelves.js';
import statistics from './pages/statistics.js';
import profile from './pages/profile.js';
import settings from './pages/settings.js';
import onboarding from './pages/onboarding.js';
import login from './pages/login.js';
import register from './pages/register.js';
import about from './pages/about.js';
import faq from './pages/faq.js';
import contact from './pages/contact.js';

const PAGES = {
  home, explore, categories, authors, collections, book, reader,
  library, dashboard, favorites, history, shelves, statistics,
  profile, settings, onboarding, login, register, about, faq, contact
};

// Pages that require a signed-in user. Unauthenticated visitors are
// redirected to the login page and returned here afterwards.
const AUTH_PAGES = new Set(['library', 'dashboard', 'favorites', 'history', 'shelves', 'statistics', 'profile', 'settings']);

function requireAuth(page) {
  if (!AUTH_PAGES.has(page) || store.isAuthed()) return true;
  const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
  location.replace(`login.html?next=${next}`);
  return false;
}

function getParams() {
  const p = new URLSearchParams(location.search);
  return Object.fromEntries(p.entries());
}

function mount() {
  const body = document.body;
  const page = body.dataset.page;
  const layout = body.dataset.layout;
  const mod = PAGES[page] || notFound;
  // Always remove the boot overlay, even if a downstream render throws —
  // otherwise an uncaught error leaves the user staring at a blank screen.
  const removeBoot = (delay = 0) => setTimeout(() => {
    const b = qs('#app-boot');
    if (b) { b.classList.add('hide'); setTimeout(() => b.remove(), 450); }
  }, delay);
  // Show a clear error in the body if something throws, so the user is never
  // left with a blank white page.
  const showError = (err) => {
    console.error('Lumina mount error:', err);
    const node = document.createElement('div');
    node.style.cssText = 'max-width:42rem;margin:4rem auto;padding:1.5rem;background:#fff;border:1px solid #ddd;border-radius:12px;font-family:Inter,system-ui,sans-serif;color:#252321';
    node.innerHTML = `
      <h2 style="margin:0 0 .5rem;font-family:'Playfair Display',serif;color:#743C45">Something went wrong</h2>
      <p style="margin:0 0 1rem;color:#6E6A64">The page failed to render. Try a hard reload, and check the console for details.</p>
      <pre style="white-space:pre-wrap;background:#F7F4EE;padding:1rem;border-radius:8px;font-size:.85rem;overflow:auto;margin:0">${(err && err.stack) || String(err)}</pre>
      <button style="margin-top:1rem;background:#743C45;color:#fff;border:none;padding:.6rem 1rem;border-radius:8px;cursor:pointer;font-weight:600" onclick="location.reload()">Reload</button>`;
    body.appendChild(node);
    removeBoot(0);
  };
  window.addEventListener('error', (e) => { if (e.error) console.error('Window error:', e.error); });
  window.addEventListener('unhandledrejection', (e) => { console.error('Unhandled rejection:', e.reason); });

  try {
    // Scroll progress bar
    const prog = document.createElement('div');
    prog.className = 'scroll-progress';
    document.body.appendChild(prog);

    const params = getParams();

    // Gate personal pages behind login — redirect before anything renders.
    if (!requireAuth(page)) { removeBoot(0); return; }

    if (layout === 'reader') {
      // Reader manages its own full screen; still allow global search/command.
      renderGlobalChrome(true);
      mountReader(mod, params);
      return;
    }

    if (layout === 'auth') {
      body.style.background = 'var(--ivory)';
      const wrap = document.createElement('div');
      wrap.innerHTML = `<div class="auth-shell">${brand()}<div id="page-content"></div></div>`;
      body.appendChild(wrap);
      document.getElementById('page-content').innerHTML = mod.render(params);
      mod.init?.(qs('#page-content'), params);
      finishBoot();
      wireGlobal();
      return;
    }

    let shell;
    if (layout === 'app') {
      shell = `
        <div class="app-shell">
          <div id="sidebar-mount"></div>
          <div class="app-main">
            <div id="topbar-mount"></div>
            <main class="app-content" id="page-content"></main>
            ${renderBottomNav(page)}
          </div>
        </div>`;
    } else {
      shell = `
        ${renderNavbar(page)}
        <main id="page-content"></main>
        ${renderFooter()}
        ${renderBottomNav(page)}`;
    }

    body.innerHTML = shell;

    // Back-to-top button — appended after the shell so innerHTML doesn't wipe it
    if (layout !== 'reader') {
      const backTop = document.createElement('button');
      backTop.className = 'back-to-top';
      backTop.setAttribute('aria-label', 'Back to top');
      backTop.innerHTML = icon('arrow-up', { size: 20 });
      backTop.addEventListener('click', () => {
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(backTop);
    }

    if (layout === 'app') {
      qs('#sidebar-mount').innerHTML = renderSidebar(page, store.get().ui?.sidebarCollapsed);
      const tb = mod.topbar || { title: mod.title || 'Library', subtitle: '' };
      qs('#topbar-mount').innerHTML = renderTopbar(page, tb.title, tb.subtitle);
    }

    const content = qs('#page-content');
    content.innerHTML = mod.render(params);
    mod.init?.(content, params);

    wireGlobal();
    wireShellEvents(layout, page);
    finishBoot();
  } catch (err) {
    showError(err);
  }
}

/* Reader layout still wants search/command available but no navbar. */
function renderGlobalChrome(isReader) {
  // minimal: nothing visible; handlers attached via wireGlobal
}

function mountReader(mod, params) {
  const content = document.createElement('div');
  content.id = 'reader-root';
  document.body.appendChild(content);
  document.body.style.background = '#fff';
  try {
    mod.render(content, params);
    mod.init?.(content, params);
    wireGlobal();
  } catch (err) {
    content.innerHTML = `<div style="padding:2rem;max-width:42rem;margin:0 auto;color:#252321"><h2 style="font-family:'Playfair Display',serif;color:#743C45">Reader error</h2><p>The book failed to open. <a href="index.html" style="color:#743C45">Return to library</a></p></div>`;
    console.error('Reader mount error:', err);
  }
  const boot = qs('#app-boot'); if (boot) boot.remove();
}

function notFound() {
  return {
    title: 'Not found',
    render() {
      return `<div class="container-x center" style="min-height:70vh;flex-direction:column;gap:1rem">
        <div class="font-serif text-6xl" style="color:var(--burgundy)">404</div>
        <h2>This page wandered off the shelf.</h2>
        <a class="btn btn--primary" href="index.html">Back to library</a>
      </div>`;
    }
  };
}

/* ---------------- Global wiring ---------------- */
function wireGlobal() {
  // Delegated clicks for data-action
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;
    switch (action) {
      case 'search': openSearch(); break;
      case 'command': openCommandPalette(); break;
      case 'notifications': openNotifications(); break;
      case 'menu': openMobileMenu(document.body.dataset.page); break;
      case 'toggle-sidebar': store.toggleSidebar(); location.reload(); break;
      case 'privacy':
      case 'terms':
        toast('This is a demo — no legal documents are provided.', 'info'); break;
      default: break;
    }
  });

  // Newsletter submit (delegated)
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-newsletter]');
    if (f) { e.preventDefault(); f.reset(); toast('Thanks — you’re subscribed to thoughtful reading.', 'success'); }
  });

  // Favorite toggles (anywhere)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.js-fav');
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.book;
    const added = store.toggleFavorite(id);
    b.classList.toggle('is-active', added);
    b.innerHTML = icon(added ? 'heart-fill' : 'heart', { size: 17 });
    toast(added ? 'Added to favorites.' : 'Removed from favorites.', 'success');
  });

  // Global keyboard
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommandPalette(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape') { /* overlay handles its own */ }
  });
}

function wireShellEvents(layout, page) {
  const navbar = qs('#navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const backTop = qs('.back-to-top');
  if (backTop) {
    const onScrollTop = () => {
      const scrolled = window.scrollY > 480;
      backTop.classList.toggle('is-visible', scrolled);
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
  }
  const prog = qs('.scroll-progress');
  if (prog && layout !== 'app') {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop || window.scrollY) / (h.scrollHeight - h.clientHeight || 1);
      prog.style.width = (pct * 100).toFixed(1) + '%';
    }, { passive: true });
  }
}

function finishBoot() {
  scrollToTop();
  const boot = qs('#app-boot');
  if (boot) {
    setTimeout(() => { boot.classList.add('hide'); setTimeout(() => boot.remove(), 450); }, prefersReduced ? 0 : 260);
  }
}

import { dataService } from './services/dataService.js';

/* ---------------- Boot ---------------- */
async function boot() {
  initSmoothScroll();
  try {
    await store.initAuth();
    await dataService.initialize();
  } catch (e) {
    console.error('Failed to initialize data during boot', e);
  }
  installCoverWatchdog({
    findBookByIsbn: (isbn) => dataService.cache.books.find((b) => b.isbn === isbn)
  });
  mount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
