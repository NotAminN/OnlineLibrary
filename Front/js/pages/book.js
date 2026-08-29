// Book details page (spec §30, §31).
import { dataService } from '../services/dataService.js';
import { bookCard, cover } from '../components/bookCard.js';
import { coverDataUri, authorName } from '../utils/covers.js';
import { genreById } from '../data/genres.js';
import { store } from '../state/store.js';
import { icon, stars } from '../icons.js';
import { toast } from '../utils/toast.js';
import { avatarInitials } from '../utils/format.js';
import { reveal, staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

const REVIEWS = [
  { name: 'Priya N.', rating: 5, date: '2 weeks ago', text: 'I read it in two sittings and then immediately wanted to begin again. The prose is quiet but it stays with you for days.' },
  { name: 'Marcus T.', rating: 4, date: '1 month ago', text: 'A thoughtful, unhurried book. Not every chapter lands, but the whole is greater than its parts.' },
  { name: 'Elena R.', rating: 5, date: '2 months ago', text: 'Exactly the kind of book this library seems built to recommend. Calm, intelligent, and genuinely moving.' }
];

export default {
  topbar: { title: 'Book details', subtitle: '' },
  render(params) {
    const book = dataService.get(params.id);
    if (!book) return notFound('book');
    const a = dataService.authorById[book.author];
    const inLib = store.inLibrary(book.id);
    const status = inLib ? store.get().library[book.id].status : null;
    const fav = store.isFavorite(book.id);
    const progress = store.getProgress(book.id);
    const related = dataService.byGenre(book.genre).filter((b) => b.id !== book.id).slice(0, 4);
    const byAuthor = dataService.byAuthor(book.author).filter((b) => b.id !== book.id).slice(0, 4);

    return `
    <div class="container-wide" style="padding-block:2rem">
      <a href="explore.html" class="text-sm muted" style="display:inline-flex;gap:.4rem;align-items:center;margin-bottom:1.5rem">${icon('arrow-left', { size: 16 })} Back to explore</a>
      <div class="book-detail">
        <div>
          <div class="cover-lg">${cover(book, { className: '', actions: false })}</div>
          <div class="grid gap-2 mt-5">
            <button class="btn btn--primary btn--block" href="reader.html?id=${book.id}" data-read>${icon('play', { size: 16 })} ${progress ? 'Continue Reading' : 'Start Reading'}</button>
            <button class="btn btn--outline btn--block" data-lib>${inLib ? 'In your library' : 'Add to Library'}</button>
            <button class="btn btn--subtle btn--block" data-fav>${icon(fav ? 'heart-fill' : 'heart', { size: 16 })} ${fav ? 'Favorited' : 'Add to Favorites'}</button>
            <button class="btn btn--subtle btn--block" data-bm>${icon('bookmark', { size: 16 })} Bookmark</button>
          </div>
          ${progress ? `<div class="card p-4 mt-4"><div class="text-xs muted">Your progress</div><div class="progress mt-2"><span style="width:${progress.percent}%"></span></div><div class="text-xs muted mt-1">${progress.percent}% · Chapter ${progress.chapter + 1}</div></div>` : ''}
        </div>
        <div>
          <div class="eyebrow mb-2">${genreById[book.genre].name.toUpperCase()} · ${book.publicationYear}</div>
          <h1 class="font-serif" style="font-size:clamp(2rem,4vw,3rem)">${book.title}</h1>
          <p class="text-lg muted mt-2">by <a href="authors.html#${a.id}" style="color:var(--burgundy)">${a.name}</a></p>
          <div class="flex items-center gap-3 mt-3">${stars(book.rating)}<span class="muted text-sm">${book.rating.toFixed(1)} · ${REVIEWS.length} reviews</span></div>

          <div class="meta-grid mt-5">
            <div class="meta-item"><div class="meta-item__label">Pages</div><div class="meta-item__value">${book.pages}</div></div>
            <div class="meta-item"><div class="meta-item__label">Reading time</div><div class="meta-item__value">${Math.round(book.readingTime / 60 * 10) / 10} h</div></div>
            <div class="meta-item"><div class="meta-item__label">Language</div><div class="meta-item__value">${book.language}</div></div>
            <div class="meta-item"><div class="meta-item__label">Published</div><div class="meta-item__value">${book.publicationYear}</div></div>
            <div class="meta-item"><div class="meta-item__label">Chapters</div><div class="meta-item__value">${book.chapters.length}</div></div>
            <div class="meta-item"><div class="meta-item__label">Status</div><div class="meta-item__value">${status ? cap(status) : 'Not added'}</div></div>
          </div>

          <h3 class="font-serif mt-7 mb-2">About the book</h3>
          <p class="lede">${book.description}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            ${book.tags.map((t) => `<span class="chip chip--sm">#${t}</span>`).join('')}
          </div>

          <h3 class="font-serif mt-7 mb-3">Table of contents</h3>
          <div>
            ${book.chapters.map((c, i) => `<a class="toc-row" href="reader.html?id=${book.id}&ch=${i}"><span class="toc-row__num">${String(i + 1).padStart(2, '0')}</span><span class="flex-1">${c.title}</span>${icon('chevron-right', { size: 16 })}</a>`).join('')}
          </div>

          <h3 class="font-serif mt-7 mb-3">About the author</h3>
          <div class="card p-5 flex items-center gap-4">
            <div class="avatar avatar--lg" style="background:${genreById[a.genres[0]]?.color || 'var(--burgundy)'}">${avatarInitials(a.name)}</div>
            <div>
              <div class="font-serif text-lg">${a.name}</div>
              <p class="text-sm muted mt-1" style="max-width:48ch">${a.bio}</p>
              <a class="btn btn--ghost btn--sm mt-3" href="authors.html#${a.id}">Explore author ${icon('arrow-right', { size: 14 })}</a>
            </div>
          </div>

          <h3 class="font-serif mt-7 mb-3">Reviews</h3>
          <div class="grid gap-3" id="reviews"></div>

          ${byAuthor.length ? section('More by ' + a.name, byAuthor) : ''}
          ${related.length ? section('Related books', related) : ''}
        </div>
      </div>
    </div>`;
  },

  init(root, params) {
    const book = dataService.get(params.id);
    if (!book) return;

    qs('#reviews', root).innerHTML = REVIEWS.map((r) => `
      <div class="review-card">
        <div class="review-card__head">
          <div class="avatar avatar--sm" style="background:var(--forest)">${avatarInitials(r.name)}</div>
          <div class="flex-1"><div class="font-semibold text-sm">${r.name}</div><div class="text-xs muted">${r.date}</div></div>
          ${stars(r.rating)}
        </div>
        <p class="muted text-sm">${r.text}</p>
      </div>`).join('');

    // Actions
    const readBtn = qs('[data-read]', root);
    if (readBtn) readBtn.onclick = () => location.href = `reader.html?id=${book.id}`;
    const libBtn = qs('[data-lib]', root);
    if (libBtn) libBtn.onclick = () => {
      if (store.inLibrary(book.id)) { store.removeFromLibrary(book.id); libBtn.textContent = 'Add to Library'; toast('Removed from your library.', 'info'); }
      else { store.addToLibrary(book.id, 'want'); libBtn.textContent = 'In your library'; toast('Added to your library.', 'success'); }
    };
    const favBtn = qs('[data-fav]', root);
    if (favBtn) favBtn.onclick = () => {
      const added = store.toggleFavorite(book.id);
      favBtn.innerHTML = `${icon(added ? 'heart-fill' : 'heart', { size: 16 })} ${added ? 'Favorited' : 'Add to Favorites'}`;
      toast(added ? 'Added to favorites.' : 'Removed from favorites.', 'success');
    };
    const bmBtn = qs('[data-bm]', root);
    if (bmBtn) bmBtn.onclick = () => {
      store.addBookmark(book.id, { chapter: 0, paragraph: 0, text: 'Saved from book page' });
      toast('Bookmark saved.', 'success');
    };

    staggerReveal('.book-card', root, { stagger: 0.04 });
    staggerReveal('.meta-item', root, { stagger: 0.03 });
  }
};

function section(title, books) {
  return `<h3 class="font-serif mt-7 mb-3">${title}</h3><div class="book-grid book-grid--lg">${books.map((b) => bookCard(b)).join('')}</div>`;
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function notFound() {
  return `<div class="container-x center" style="min-height:60vh;flex-direction:column;gap:1rem"><div class="font-serif text-5xl" style="color:var(--burgundy)">Not found</div><h2>We couldn’t find that book.</h2><a class="btn btn--primary" href="explore.html">Browse the library</a></div>`;
}
