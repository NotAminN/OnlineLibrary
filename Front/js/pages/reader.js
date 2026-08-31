// Online reader (spec §32–§38, §75, §76). Distraction-free, themeable,
// with persisted progress, bookmarks, and notes.

import { dataService } from '../services/dataService.js';
import { generateChapterText } from '../data/prose.js';
import { genreById } from '../data/genres.js';
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { openOverlay, closeOverlay } from '../components/modals.js';
import { avatarInitials } from '../utils/format.js';
import { qs, qsa } from '../utils/dom.js';

const FONT_SIZE = { small: '0.95rem', medium: '1.125rem', large: '1.3rem', xlarge: '1.55rem' };
const LINE_HEIGHT = { compact: 1.6, comfortable: 1.85, relaxed: 2.1 };
const WIDTH = { narrow: '58ch', medium: '72ch', wide: '86ch' };

export default {
  render(root, params) {
    root.innerHTML = `<div class="center" style="height:100vh;flex-direction:column;gap:1rem"><div class="muted">Loading reader...</div></div>`;
  },

  async init(root, params) {
    let book;
    try {
      book = await dataService.getFullBook(params.id);
      book.id = book.slug;
      book.pages = book.pages || 300;
    } catch (e) {
      root.innerHTML = `<div class="center" style="height:100vh;flex-direction:column;gap:1rem"><h2>Book not found</h2><a class="btn btn--primary" href="explore.html">Browse library</a></div>`;
      return;
    }
    
    if (!book || !book.chapters || !book.chapters.length) {
      root.innerHTML = `<div class="center" style="height:100vh;flex-direction:column;gap:1rem"><h2>Book content not available</h2><a class="btn btn--primary" href="explore.html">Browse library</a></div>`;
      return;
    }

    const s = store.getSettings();
    root.className = 'reader' + (s.theme === 'dark' ? ' is-dark' : s.theme === 'sepia' ? ' is-sepia' : '');
    root.style.setProperty('--reader-font-size', FONT_SIZE[s.fontSize]);
    root.style.setProperty('--reader-line-height', LINE_HEIGHT[s.lineHeight]);
    root.style.setProperty('--reader-width', WIDTH[s.width]);
    root.style.setProperty('--reader-align', s.align);

    root.innerHTML = `
      <div class="reader__bar">
        <div class="flex items-center gap-3" style="min-width:0">
          <button class="reader__btn" data-exit aria-label="Exit reader">${icon('chevron-left', { size: 20 })}</button>
          <span class="reader__title">${book.title}</span>
        </div>
        <div class="reader__bar-actions">
          <button class="reader__btn" data-toc aria-label="Table of contents">${icon('list', { size: 20 })}</button>
          <button class="reader__btn" data-bookmarks aria-label="Bookmarks">${icon('bookmark', { size: 20 })}</button>
          <button class="reader__btn" data-notes aria-label="Notes">${icon('edit', { size: 20 })}</button>
          <button class="reader__btn" data-settings aria-label="Reading settings">${icon('settings', { size: 20 })}</button>
        </div>
      </div>
      <div class="reader__stage">
        <article class="reader__content" id="reader-content"></article>
      </div>
      <div class="reader__footer">
        <button class="reader__nav-btn" data-prev>${icon('chevron-left', { size: 16 })} Prev</button>
        <div class="reader__progress-track"><div class="reader__progress-fill" id="reader-fill"></div></div>
        <span class="reader__pct" id="reader-pct">0%</span>
        <button class="reader__nav-btn" data-next>Next ${icon('chevron-right', { size: 16 })}</button>
      </div>`;

    const content = qs('#reader-content', root);
    const fill = qs('#reader-fill', root);
    const pctEl = qs('#reader-pct', root);
    const total = book.chapters.length;

    let chapter = 0;
    const saved = store.getProgress(book.id);
    const urlCh = params.ch;
    if (urlCh != null && !isNaN(+urlCh)) chapter = Math.max(0, Math.min(total - 1, +urlCh));
    else if (saved) chapter = Math.min(saved.chapter || 0, total - 1);

    let lastSave = Date.now();

    function renderChapter(idx, restoreScrollFrac = 0) {
      chapter = idx;
      const ch = book.chapters[idx];
      const paras = generateChapterText(book, idx, 7);
      content.innerHTML = `
        <div class="reader__chapter-label">Chapter ${idx + 1} of ${total}</div>
        <h2>${ch.title}</h2>
        ${paras.map((p, i) => `<p data-pidx="${i}">${p}</p>`).join('')}`;
      // attach bookmark markers
      const bms = store.getBookmarks(book.id).filter((b) => b.chapter === idx);
      bms.forEach((bm) => {
        const target = content.querySelector(`p[data-pidx="${bm.paragraph}"]`);
        if (target) target.setAttribute('data-bmid', bm.id);
      });
      qs('.reader__bar .reader__title')?.setAttribute('title', ch.title);
      // mark current in TOC if open
      qsa('.toc-item').forEach((t) => t.classList.toggle('is-current', +t.dataset.ch === idx));
      // scroll handling
      const stage = qs('.reader__stage', root);
      requestAnimationFrame(() => {
        const maxScroll = stage.scrollHeight - stage.clientHeight;
        stage.scrollTop = maxScroll * restoreScrollFrac;
      });
      updateProgress();
      bindShortcuts();
    }

    function computePercent() {
      const stage = qs('.reader__stage', root);
      const maxScroll = stage.scrollHeight - stage.clientHeight;
      const frac = maxScroll > 0 ? stage.scrollTop / maxScroll : 0;
      return Math.min(100, Math.round(((chapter + frac) / total) * 100));
    }

    function updateProgress() {
      const p = computePercent();
      fill.style.width = p + '%';
      pctEl.textContent = p + '%';
      // throttle save
      if (Date.now() - lastSave > 1200) saveProgress(p);
    }

    function saveProgress(p) {
      lastSave = Date.now();
      store.setProgress(book.id, {
        chapter, percent: p, totalPages: book.pages,
        page: Math.round((p / 100) * book.pages)
      });
      store.recordHistory(book.id, { chapter, percent: p });
      if (store.getSettings().autosave) { /* persisted already */ }
    }

    // Auto-save on stage scroll
    const stage = qs('.reader__stage', root);
    stage.addEventListener('scroll', () => { updateProgress(); }, { passive: true });

    // Also save on unload
    const saveOnExit = () => saveProgress(computePercent());
    window.addEventListener('beforeunload', saveOnExit);

    // Buttons
    qs('[data-exit]', root).onclick = () => { saveOnExit(); location.href = `book.html?id=${book.id}`; };
    qs('[data-prev]', root).onclick = () => { if (chapter > 0) { renderChapter(chapter - 1); qs('.reader__stage', root).scrollTop = 0; } };
    qs('[data-next]', root).onclick = () => { if (chapter < total - 1) { renderChapter(chapter + 1); qs('.reader__stage', root).scrollTop = 0; } };
    qs('[data-settings]', root).onclick = () => openSettings();
    qs('[data-toc]', root).onclick = () => openTOC();
    qs('[data-bookmarks]', root).onclick = () => openBookmarks();
    qs('[data-notes]', root).onclick = () => openNotes();

    function openTOC() {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">Contents</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body">
          ${book.chapters.map((c, i) => `<button class="toc-item ${i === chapter ? 'is-current' : ''}" data-ch="${i}"><span><span class="toc-num">${String(i + 1).padStart(2, '0')}</span> ${c.title}</span><span class="toc-num">${i < chapter ? icon('check', { size: 14 }) : ''}</span></button>`).join('')}
        </div>`;
      const { close } = openOverlay(drawer, { position: 'left' });
      drawer.querySelector('[data-close]').onclick = close;
      qsa('.toc-item', drawer).forEach((b) => b.onclick = () => {
        const i = +b.dataset.ch;
        const frac = i < chapter ? 0.0 : 0.0;
        renderChapter(i); qs('.reader__stage', root).scrollTop = 0; close();
      });
    }

    function openSettings() {
      const s = store.getSettings();
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">Reading settings</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body">
          ${segRow('Font size', 'fontSize', [['small', 'S'], ['medium', 'M'], ['large', 'L'], ['xlarge', 'XL']])}
          ${segRow('Line height', 'lineHeight', [['compact', 'Compact'], ['comfortable', 'Comfortable'], ['relaxed', 'Relaxed']])}
          ${segRow('Reading width', 'width', [['narrow', 'Narrow'], ['medium', 'Medium'], ['wide', 'Wide']])}
          ${segRow('Alignment', 'align', [['left', 'Left'], ['justified', 'Justified']])}
          ${segRow('Theme', 'theme', [['light', 'Light'], ['sepia', 'Sepia'], ['dark', 'Dark']], true)}
          <div class="reader-setting">
            <div class="reader-setting__label">Auto-save progress</div>
            <button class="segmented" data-toggle="autosave"><span class="${s.autosave ? 'is-active' : ''}">${s.autosave ? 'On' : 'Off'}</span></button>
          </div>
        </div>`;
      const { close } = openOverlay(drawer, { position: 'right' });
      drawer.querySelector('[data-close]').onclick = close;
      qsa('[data-seg]', drawer).forEach((btn) => btn.onclick = () => {
        const key = btn.dataset.seg, val = btn.dataset.val;
        store.setSetting(key, val);
        btn.parentElement.querySelectorAll('[data-val]').forEach((b) => b.classList.toggle('is-active', b.dataset.val === val));
        applySetting(key, val);
      });
      const auto = drawer.querySelector('[data-toggle="autosave"]');
      auto.onclick = () => { const v = !store.getSettings().autosave; store.setSetting('autosave', v); auto.querySelector('span').classList.toggle('is-active', v); auto.querySelector('span').textContent = v ? 'On' : 'Off'; };
    }

    function sepPreview(val) {
      return `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;margin-right:.4rem;vertical-align:-2px;background:${val === 'light' ? 'var(--surface)' : val === 'sepia' ? 'var(--sepia-bg)' : 'var(--darkreader-surface)'};border:1px solid var(--line-strong)"></span>`;
    }

    function segRow(label, key, opts, withIcon = false) {
      const s = store.getSettings();
      return `<div class="reader-setting"><div class="reader-setting__label">${label}</div>
        <div class="segmented">${opts.map(([v, l]) => `<button data-seg="${key}" data-val="${v}" class="${s[key] === v ? 'is-active' : ''}">${withIcon ? sepPreview(v) : ''}${l}</button>`).join('')}</div></div>`;
    }

    function applySetting(key, val) {
      // root IS the .reader element (see init above) — classList goes on it directly.
      if (key === 'fontSize') root.style.setProperty('--reader-font-size', FONT_SIZE[val]);
      if (key === 'lineHeight') root.style.setProperty('--reader-line-height', LINE_HEIGHT[val]);
      if (key === 'width') root.style.setProperty('--reader-width', WIDTH[val]);
      if (key === 'align') root.style.setProperty('--reader-align', val);
      if (key === 'theme') {
        root.classList.toggle('is-dark', val === 'dark');
        root.classList.toggle('is-sepia', val === 'sepia');
        // Keep the page behind the reader in sync so overscroll matches the theme.
        document.body.style.background = val === 'dark' ? 'var(--darkreader-bg)' : val === 'sepia' ? 'var(--sepia-bg)' : '#fff';
      }
      // recalc progress after layout shift
      updateProgress();
    }

    function openBookmarks() {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      const bms = store.getBookmarks(book.id);
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">Bookmarks</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body">
          ${bms.length ? bms.map((b) => `<div class="bookmark-list-item">
            <span class="avatar avatar--sm" style="background:var(--burgundy);width:2rem;height:2rem">${icon('bookmark', { size: 14 })}</span>
            <div class="flex-1 min-w-0">
              <button class="text-left" data-goto="${b.chapter}" style="background:none;border:none;cursor:pointer"><div class="text-sm font-semibold">Ch ${b.chapter + 1}${b.text ? ' · ' + b.text : ''}</div></button>
              <div class="text-xs muted">${new Date(b.createdAt).toLocaleDateString()}</div>
            </div>
            <button class="btn--icon" data-delbm="${b.id}" aria-label="Delete bookmark">${icon('trash', { size: 16 })}</button>
          </div>`).join('') : `<div class="empty"><div class="empty__title">No bookmarks yet</div><p class="empty__text">Press B while reading to save your place.</p></div>`}
        </div>`;
      const { close } = openOverlay(drawer, { position: 'right' });
      drawer.querySelector('[data-close]').onclick = close;
      qsa('[data-goto]', drawer).forEach((b) => b.onclick = () => { renderChapter(+b.dataset.goto); qs('.reader__stage', root).scrollTop = 0; close(); });
      qsa('[data-delbm]', drawer).forEach((b) => b.onclick = () => { store.removeBookmark(book.id, b.dataset.delbm); toast('Bookmark removed.', 'info'); close(); setTimeout(openBookmarks, 50); });
    }

    function openNotes() {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      const notes = store.getNotes(book.id);
      drawer.innerHTML = `
        <div class="drawer__header"><h3 class="modal__title">Notes</h3><button class="btn--icon" data-close>${icon('x')}</button></div>
        <div class="drawer__body">
          <form class="note-form mb-4" data-addnote>
            <textarea class="textarea" placeholder="Add a note for chapter ${chapter + 1}…" aria-label="New note"></textarea>
            <button class="btn btn--primary btn--sm mt-2" type="submit">Save note</button>
          </form>
          <div id="notes-list">
            ${notes.length ? notes.map((n) => `<div class="bookmark-list-item">
              <span class="avatar avatar--sm" style="background:var(--gold);width:2rem;height:2rem;color:#2a2417">${icon('edit', { size: 14 })}</span>
              <div class="flex-1 min-w-0">
                <div class="text-xs muted">Ch ${n.chapter + 1} · ${new Date(n.createdAt).toLocaleDateString()}</div>
                <div class="text-sm mt-0.5">${n.text}</div>
              </div>
              <button class="btn--icon" data-delnote="${n.id}" aria-label="Delete note">${icon('trash', { size: 16 })}</button>
            </div>`).join('') : `<div class="empty"><div class="empty__title">No notes yet</div><p class="empty__text">Capture a thought while it’s fresh.</p></div>`}
          </div>
        </div>`;
      const { close } = openOverlay(drawer, { position: 'right' });
      drawer.querySelector('[data-close]').onclick = close;
      drawer.querySelector('[data-addnote]').onsubmit = (e) => {
        e.preventDefault();
        const ta = e.target.querySelector('textarea');
        if (!ta.value.trim()) return;
        store.addNote(book.id, { chapter, text: ta.value.trim(), page: Math.round((computePercent() / 100) * book.pages) });
        ta.value = '';
        toast('Note saved.', 'success');
        close(); setTimeout(openNotes, 50);
      };
      qsa('[data-delnote]', drawer).forEach((b) => b.onclick = () => { store.removeNote(book.id, b.dataset.delnote); close(); setTimeout(openNotes, 50); });
    }

    function addBookmarkHere() {
      const stage = qs('.reader__stage', root);
      const frac = computePercent();
      // find paragraph nearest top
      let nearest = 0, min = Infinity;
      qsa('#reader-content p', root).forEach((para, i) => {
        const d = Math.abs(para.getBoundingClientRect().top - stage.getBoundingClientRect().top - 40);
        if (d < min) { min = d; nearest = i; }
      });
      store.addBookmark(book.id, { chapter, paragraph: nearest, text: `Progress ${frac}%` });
      toast('Bookmark saved.', 'success');
    }

    function bindShortcuts() {
      // remove old listener to avoid duplicates
      document.removeEventListener('keydown', keyHandler);
      document.addEventListener('keydown', keyHandler);
    }

    function keyHandler(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      switch (e.key) {
        case 'ArrowRight': if (chapter < total - 1) { renderChapter(chapter + 1); qs('.reader__stage', root).scrollTop = 0; } break;
        case 'ArrowLeft': if (chapter > 0) { renderChapter(chapter - 1); qs('.reader__stage', root).scrollTop = 0; } break;
        case 'b': case 'B': addBookmarkHere(); break;
        case 't': case 'T': openTOC(); break;
        case 's': case 'S': openSettings(); break;
        case 'n': case 'N': openNotes(); break;
        default: break;
      }
    }

    // Initial restore: if saved, restore approximate scroll within chapter
    const restoreFrac = saved ? Math.max(0, ((saved.percent / 100) * total) - chapter) : 0;
    renderChapter(chapter, saved ? Math.min(1, Math.max(0, restoreFrac)) : 0);

    // ensure keyboard works even before any chapter interaction
    bindShortcuts();
  }
};
