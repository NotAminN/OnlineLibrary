// Reading history (spec §41). Continue list + clear history.
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { icon, stars } from '../icons.js';
import { store } from '../state/store.js';
import { coverDataUri, coverFallbackUri, authorName } from '../utils/covers.js';
import { timeAgo } from '../utils/format.js';
import { confirmDialog } from '../components/modals.js';
import { toast } from '../utils/toast.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

export default {
  topbar: { title: 'Reading History', subtitle: 'Where you’ve been, and where to pick up.' },
  render() {
    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div class="result-count" id="hist-count"></div>
        <button class="btn btn--ghost btn--sm" data-clear>${icon('trash', { size: 16 })} Clear history</button>
      </div>
      <div id="hist-list" class="flex flex-col gap-3"></div>
      <div id="hist-empty"></div>
    </div>`;
  },
  init(root) {
    const list = qs('#hist-list', root);
    const empty = qs('#hist-empty', root);
    const count = qs('#hist-count', root);

    function run() {
      const h = store.get().history;
      count.textContent = `${h.length} ${h.length === 1 ? 'entry' : 'entries'}`;
      if (!h.length) {
        list.innerHTML = '';
        empty.innerHTML = `<div class="empty empty--lg"><div class="empty__icon">${icon('clock', { size: 28 })}</div><div class="empty__title">Your reading journey starts here</div><p class="empty__text">Open a book and it will appear in your history.</p><a class="btn btn--primary mt-3" href="explore.html">Explore books</a></div>`;
        return;
      }
      empty.innerHTML = '';
      list.innerHTML = h.map((h) => {
        const b = dataService.get(h.bookId);
        if (!b) return '';
        const p = store.getProgress(b.id);
        const percent = p ? p.percent : (h.percent || 0);
        const ch = b.chapters[h.chapter || 0]?.title || 'Chapter 1';
        return `
        <div class="card p-4 flex items-center gap-4">
          <a href="reader.html?id=${b.id}"><img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:60px;height:90px;object-fit:cover;border-radius:5px"/></a>
          <div class="flex-1 min-w-0">
            <a href="book.html?id=${b.id}" class="font-semibold hover:underline">${b.title}</a>
            <div class="text-sm muted">${authorName(b.author)}</div>
            <div class="text-xs muted mt-1">${ch} · ${timeAgo(h.lastOpened)}</div>
            <div class="progress mt-2"><span style="width:${percent}%"></span></div>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold" style="color:var(--burgundy)">${percent}%</div>
            <a class="btn btn--primary btn--sm mt-2" href="reader.html?id=${b.id}">Continue</a>
          </div>
          <button class="btn--icon" data-remove="${b.id}" aria-label="Remove from history">${icon('x', { size: 16 })}</button>
        </div>`;
      }).join('');
      staggerReveal('.card', list, { stagger: 0.04 });
      qsa('[data-remove]', list).forEach((b) => b.onclick = () => {
        store.set({ history: store.get().history.filter((x) => x.bookId !== b.dataset.remove) });
        // re-read via store emit already persisted; just rerun
        run();
      });
    }

    qs('[data-clear]', root).onclick = async () => {
      const ok = await confirmDialog({ title: 'Clear reading history?', message: 'This removes all entries from your history. This cannot be undone.', confirmLabel: 'Clear', danger: true });
      if (ok) { store.clearHistory(); toast('History cleared.', 'info'); run(); }
    };

    run();
  }
};
