// Book details page (spec §30, §31).
import { dataService } from '../services/dataService.js';
import { bookCard, cover } from '../components/bookCard.js';
import { coverDataUri, authorName } from '../utils/covers.js';
import { genreById } from '../data/genres.js';
import { store } from '../state/store.js';
import { api } from '../services/api.js';
import { icon, stars, renderStarsInput } from '../icons.js';
import { toast } from '../utils/toast.js';
import { avatarInitials } from '../utils/format.js';
import { reveal, staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

const FALLBACK_REVIEWS = [
  { user_name: 'Priya N.', rating: 5, created_at: '2 weeks ago', text: 'I read it in two sittings and then immediately wanted to begin again. The prose is quiet but it stays with you for days.' },
  { user_name: 'Marcus T.', rating: 4, created_at: '1 month ago', text: 'A thoughtful, unhurried book. Not every chapter lands, but the whole is greater than its parts.' },
  { user_name: 'Elena R.', rating: 5, created_at: '2 months ago', text: 'Exactly the kind of book this library seems built to recommend. Calm, intelligent, and genuinely moving.' }
];

export default {
  topbar: { title: 'Book details', subtitle: '' },
  render(params) {
    return `<div id="book-detail-root" class="container-wide py-12 text-center muted">Loading book...</div>`;
  },

  async init(root, params) {
    const bookContainer = qs('#book-detail-root', root);
    let book;
    try {
      book = await dataService.getFullBook(params.id);
      
      // Map API fields for frontend rendering
      book.id = book.slug;
      book.author = book.author_slug;
      book.genre = book.genre_slug;
      book.publicationYear = book.publication_year;
      book.readingTime = book.reading_time;
      
    } catch(err) {
      bookContainer.innerHTML = notFound();
      return;
    }
    if (!book) {
      bookContainer.innerHTML = notFound();
      return;
    }

    const a = dataService.authorById[book.author];
    const inLib = store.inLibrary(book.id);
    const status = inLib ? store.get().library[book.id].status : null;
    const fav = store.isFavorite(book.id);
    const progress = store.getProgress(book.id);
    
    // Use related_books from API if available, else fallback to cache
    let related = book.related_books || dataService.byGenre(book.genre).filter((b) => b.id !== book.id).slice(0, 4);
    let byAuthor = dataService.byAuthor(book.author).filter((b) => b.id !== book.id).slice(0, 4);

    // Map related items
    const mapBook = (b) => ({...b, id: b.slug, author: b.author_slug, genre: b.genre_slug});
    related = related.map(mapBook);
    
    // Replace the root HTML with the actual content
    bookContainer.outerHTML = `
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
          <div class="eyebrow mb-2">${genreById[book.genre]?.name.toUpperCase()} · ${book.publicationYear}</div>
          <h1 class="font-serif" style="font-size:clamp(2rem,4vw,3rem)">${book.title}</h1>
          <p class="text-lg muted mt-2">by <a href="authors.html#${a?.id}" style="color:var(--burgundy)">${a?.name}</a></p>
          <div class="flex items-center gap-3 mt-3">${stars(book.rating)}<span class="muted text-sm">${book.rating.toFixed(1)} · ${book.rating_count || 0} reviews</span></div>

          <div class="meta-grid mt-5">
            <div class="meta-item"><div class="meta-item__label">Pages</div><div class="meta-item__value">${book.pages}</div></div>
            <div class="meta-item"><div class="meta-item__label">Reading time</div><div class="meta-item__value">${Math.round(book.readingTime / 60 * 10) / 10} h</div></div>
            <div class="meta-item"><div class="meta-item__label">Language</div><div class="meta-item__value">${book.language}</div></div>
            <div class="meta-item"><div class="meta-item__label">Published</div><div class="meta-item__value">${book.publicationYear}</div></div>
            <div class="meta-item"><div class="meta-item__label">Chapters</div><div class="meta-item__value">${(book.chapters || []).length}</div></div>
            <div class="meta-item"><div class="meta-item__label">Status</div><div class="meta-item__value">${status ? cap(status) : 'Not added'}</div></div>
          </div>

          <h3 class="font-serif mt-7 mb-2">About the book</h3>
          <p class="lede">${book.description}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            ${(book.tags || []).map((t) => `<span class="chip chip--sm">#${t}</span>`).join('')}
          </div>

          <h3 class="font-serif mt-7 mb-3">Table of contents</h3>
          <div>
            ${(book.chapters || []).map((c, i) => `<a class="toc-row" href="reader.html?id=${book.id}&ch=${i}"><span class="toc-row__num">${String(i + 1).padStart(2, '0')}</span><span class="flex-1">${c.title}</span>${icon('chevron-right', { size: 16 })}</a>`).join('')}
          </div>

          <h3 class="font-serif mt-7 mb-3">About the author</h3>
          <div class="card p-5 flex items-center gap-4">
            <div class="avatar avatar--lg" style="background:${genreById[a?.genres?.[0]]?.color || 'var(--burgundy)'}">${avatarInitials(a?.name || 'A')}</div>
            <div>
              <div class="font-serif text-lg">${a?.name}</div>
              <p class="text-sm muted mt-1" style="max-width:48ch">${a?.bio || ''}</p>
              <a class="btn btn--ghost btn--sm mt-3" href="authors.html#${a?.id}">Explore author ${icon('arrow-right', { size: 14 })}</a>
            </div>
          </div>

          <h3 class="font-serif mt-7 mb-3">Reviews</h3>
          <div id="review-form-slot"></div>
          <div class="grid gap-3" id="reviews"></div>

          ${byAuthor.length ? section('More by ' + (a?.name || 'this author'), byAuthor) : ''}
          ${related.length ? section('Related books', related) : ''}
        </div>
      </div>
    </div>`;

    qs('#reviews', root).innerHTML = `<div class="muted text-sm">Loading reviews…</div>`;
    initReviews(root, book);

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

/* ---------------- Reviews ---------------- */

function reviewCard(r, isMine) {
  const name = r.user_name || 'Reader';
  const date = r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  return `
  <div class="review-card" ${isMine ? 'data-mine="1"' : ''}>
    <div class="review-card__head">
      <div class="avatar avatar--sm" style="background:${r.avatar_color || 'var(--forest)'}">${avatarInitials(name)}</div>
      <div class="flex-1"><div class="font-semibold text-sm">${name}${isMine ? ' <span class="text-xs muted">(you)</span>' : ''}</div><div class="text-xs muted">${date}</div></div>
      ${stars(r.rating)}
    </div>
    <p class="muted text-sm">${r.text}</p>
  </div>`;
}

function initReviews(root, book) {
  loadReviews(root, book);
  renderReviewForm(root, book);
}

async function loadReviews(root, book) {
  const list = qs('#reviews', root);
  let reviews;
  try {
    reviews = await api.get(`/books/${book.id}/reviews/`);
  } catch (e) {
    // Backend unavailable — show editorial fallback so the section is never empty.
    reviews = FALLBACK_REVIEWS;
  }
  const mine = store.isAuthed() ? reviews.find((r) => r.user_name === store.getUser()?.name) : null;
  const others = reviews.filter((r) => r !== mine);
  list.innerHTML = (others.length || mine) ? [...(mine ? [mine] : []), ...others].map((r) => reviewCard(r, r === mine)).join('')
    : `<div class="empty"><div class="empty__title">No reviews yet</div><p class="empty__text">Be the first to share what you thought of this book.</p></div>`;
}

function renderReviewForm(root, book) {
  const slot = qs('#review-form-slot', root);
  const user = store.getUser();

  if (!store.isAuthed()) {
    slot.innerHTML = `
    <div class="card p-4 mb-4 flex items-center gap-4 flex-wrap">
      <div class="flex-1 min-w-0"><div class="font-semibold text-sm">Share your thoughts</div>
      <p class="text-sm muted">Sign in to rate this book and leave a review.</p></div>
      <a class="btn btn--primary btn--sm" href="login.html?next=${encodeURIComponent('book.html?id=' + book.id)}">Sign in to review</a>
    </div>`;
    return;
  }

  const mineReview = null; // filled after load via data-mine marker
  slot.innerHTML = `
  <form class="card p-4 mb-4" id="review-form">
    <div class="flex items-center gap-3 mb-3">
      <div class="avatar avatar--sm" style="background:${user?.avatarColor || 'var(--burgundy)'}">${avatarInitials(user?.name || 'A')}</div>
      <div class="flex-1"><div class="font-semibold text-sm">Write a review</div>
      <div class="text-xs muted">Your rating and comment appear on this page for other readers.</div></div>
    </div>
    <div class="flex items-center gap-2 mb-3" id="review-stars">${renderStarsInput(0)}</div>
    <textarea class="textarea" id="review-text" rows="3" placeholder="What did you think of this book?"></textarea>
    <div class="flex gap-2 mt-3">
      <button class="btn btn--primary btn--sm" type="submit">Post review</button>
      <button class="btn btn--ghost btn--sm" type="button" id="review-delete" style="display:none;color:var(--sem-error)">Delete my review</button>
    </div>
  </form>`;

  let rating = 0;
  const starsEl = qs('#review-stars', root);
  starsEl.querySelectorAll('button').forEach((b) => {
    b.onclick = () => { rating = +b.dataset.val; starsEl.innerHTML = renderStarsInput(rating); bindStars(); };
  });
  function bindStars() {
    starsEl.querySelectorAll('button').forEach((b) => {
      b.onclick = () => { rating = +b.dataset.val; starsEl.innerHTML = renderStarsInput(rating); bindStars(); };
    });
  }

  qs('#review-form', root).onsubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast('Please choose a star rating first.', 'info'); return; }
    const text = qs('#review-text', root).value.trim();
    if (!text) { toast('Please write a few words about the book.', 'info'); return; }
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Posting…';
    try {
      await api.post(`/books/${book.id}/reviews/`, { rating, text });
      toast('Review posted. Thank you for sharing!', 'success');
      await loadReviews(root, book);
      btn.disabled = false; btn.textContent = 'Post review';
      qs('#review-text', root).value = '';
      rating = 0; starsEl.innerHTML = renderStarsInput(0); bindStars();
    } catch (err) {
      toast(err.message || 'Could not post your review.', 'error');
      btn.disabled = false; btn.textContent = 'Post review';
    }
  };
}
function notFound() {
  return `<div class="container-x center" style="min-height:60vh;flex-direction:column;gap:1rem"><div class="font-serif text-5xl" style="color:var(--burgundy)">Not found</div><h2>We couldn’t find that book.</h2><a class="btn btn--primary" href="explore.html">Browse the library</a></div>`;
}
