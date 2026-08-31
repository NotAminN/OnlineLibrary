// Book card system (spec §20) — variants: standard, featured, compact,
// horizontal, search, continue, recommendation. Returns HTML strings.

import { icon, stars } from '../icons.js';
import { coverDataUri, coverFallbackUri, authorName } from '../utils/covers.js';
import { genreById } from '../data/genres.js';
import { store } from '../state/store.js';
import { dataService } from '../services/dataService.js';

// Nested <a> inside the wrapping card <a> is invalid HTML and the browser
// reparents it apart, leaving cards blank. When `linked: false` the cover
// renders as a <div>; the surrounding card anchor handles navigation.
function cover(book, { className = '', progress = null, actions = true, linked = true } = {}) {
  const fav = store.isFavorite(book.id);
  const act = actions ? `
    <button class="cover-action js-fav ${fav ? 'is-active' : ''}" data-book="${book.id}" title="Favorite" aria-label="Toggle favorite">${icon(fav ? 'heart-fill' : 'heart', { size: 17 })}</button>
  ` : '';
  const prog = progress != null ? `<div class="cover-progress"><span style="width:${progress}%"></span></div>` : '';
  const open = linked
    ? `<a href="book.html?id=${book.id}" class="cover ${className}" aria-label="${book.title} by ${authorName(book.author)}">`
    : `<div class="cover ${className}">`;
  const close = linked ? '</a>' : '</div>';
  return `
    ${open}
      <img src="${coverDataUri(book)}" onerror="this.onerror=null;this.src='${coverFallbackUri(book)}'" alt="Cover of ${book.title}" loading="lazy" decoding="async" width="300" height="450" />
      ${act}${prog}
    ${close}`;
}

function meta(book, { showRating = true, linked = true } = {}) {
  const a = dataService.authorById[book.author];
  // linked=false avoids a nested <a> when the surrounding card is itself an
  // anchor — invalid HTML that the browser silently breaks apart.
  const title = linked
    ? `<a href="book.html?id=${book.id}">${book.title}</a>`
    : book.title;
  return `
    <h3 class="book-card__title">${title}</h3>
    <p class="book-card__author">${a ? a.name : 'Unknown'}</p>
    <div class="book-card__meta">
      <span class="badge badge--ghost">${genreById[book.genre]?.name || 'Book'}</span>
      ${showRating ? stars(book.rating) : ''}
    </div>`;
}

export function bookCard(book, opts = {}) {
  const { variant = 'standard' } = opts;
  const fav = store.isFavorite(book.id);

  if (variant === 'horizontal' || variant === 'search') {
    return `
    <article class="book-card book-card--horizontal ${variant === 'search' ? 'card p-3' : ''}">
      <div class="flex gap-4">
        <div class="book-card__cover" style="width:96px;flex-shrink:0">${cover(book, { className: 'cover--sm' })}</div>
        <div class="flex-1 min-w-0">${meta(book)}</div>
      </div>
    </article>`;
  }

  if (variant === 'continue') {
    const p = store.getProgress(book.id);
    const percent = p ? p.percent : (opts.percent || 0);
    const chapter = opts.chapter || (p ? `Chapter ${p.chapter + 1}` : 'Chapter 1');
    const last = opts.lastOpened || (p ? p.lastOpened : Date.now());
    return `
    <a href="reader.html?id=${book.id}" class="card continue-card p-4 block" style="text-decoration:none">
      <div class="flex gap-4 items-center">
        <div class="book-card__cover" style="width:84px;flex-shrink:0">${cover(book, { className: 'cover--sm', actions: false, linked: false })}</div>
        <div class="flex-1 min-w-0">
          <h3 class="book-card__title">${book.title}</h3>
          <p class="book-card__author">${authorName(book.author)}</p>
          <p class="muted text-sm mt-1">${chapter} · ${timeAgo(last)}</p>
          <div class="progress mt-3"><span style="width:${percent}%"></span></div>
          <p class="text-xs muted mt-1">${percent}% complete</p>
        </div>
      </div>
    </a>`;
  }

  if (variant === 'compact') {
    return `
    <a href="book.html?id=${book.id}" class="book-card block">
      ${cover(book, { actions: false, linked: false })}
      <div class="mt-3">${meta(book, { showRating: false, linked: false })}</div>
    </a>`;
  }

  if (variant === 'featured') {
    return `
    <a href="book.html?id=${book.id}" class="book-card block">
      <div class="book-card__cover" style="max-width:240px">${cover(book, { className: '', linked: false })}</div>
      <div class="mt-3">${meta(book, { linked: false })}</div>
    </a>`;
  }

  // standard
  return `
    <a href="book.html?id=${book.id}" class="book-card block">
      ${cover(book, { actions: opts.actions !== false, linked: false })}
      <div class="mt-3">${meta(book, { linked: false })}</div>
    </a>`;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${Math.max(1, min)}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export { cover, meta, timeAgo };
