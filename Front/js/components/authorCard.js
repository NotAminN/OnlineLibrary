// Shared editorial author card (used by the Authors page and the homepage).
import { avatarInitials } from '../utils/format.js';
import { genreById } from '../data/genres.js';
import { authorPortraitUrl, loadAuthorPortraits } from '../data/authorPortraits.js';

export function countLabel(n) { return `${n} ${n === 1 ? 'book' : 'books'}`; }

function portraitHtml(a) {
  const url = authorPortraitUrl(a.name);
  return url
    ? `<div class="ace__portrait"><img src="${url}" alt="Portrait of ${a.name}" loading="lazy" onerror="this.closest('.ace__portrait').remove()"></div>`
    : '';
}

/**
 * Editorial author card. By default it behaves like the Authors page card
 * (same-page hash link + data-author hook for the profile view); pass an
 * explicit href for cross-page links (homepage -> authors.html#id).
 */
export function authorCard(a, books, { href = `#${a.id}`, dataAuthor = a.id } = {}) {
  return `
    <a class="ace" href="${href}"${dataAuthor ? ` data-author="${dataAuthor}"` : ''} aria-label="Explore works by ${a.name}">
      <div class="ace__body">
        <div class="ace__badge" aria-hidden="true">${avatarInitials(a.name)}</div>
        <h3 class="ace__name">${a.name}</h3>
        <div class="ace__genres">${(a.genres || []).map((g) => genreById[g]?.name || g).join(', ')}</div>
        <div class="ace__count">${countLabel(books.length)}</div>
        <span class="ace__cta">Explore Works</span>
      </div>
      ${portraitHtml(a)}
    </a>`;
}

/**
 * Insert portraits for cards whose image was resolved at runtime (after
 * loadAuthorPortraits). Cards rendered with a static portrait are untouched.
 */
export function bindAuthorCardImages(rootEl, authors) {
  if (!rootEl) return;
  authors.forEach((a) => {
    const card = rootEl.querySelector(`[data-author="${a.id}"]`);
    if (!card || card.querySelector('.ace__portrait')) return;
    const url = authorPortraitUrl(a.name);
    if (!url) return;
    card.insertAdjacentHTML('beforeend', `<div class="ace__portrait"><img src="${url}" alt="Portrait of ${a.name}" loading="lazy" onerror="this.closest('.ace__portrait').remove()"></div>`);
  });
}

/** Runtime portrait enrichment, then re-bind images onto the given cards. */
export function loadPortraitsThenBind(rootEl, authors) {
  return loadAuthorPortraits(authors.map((a) => a.name)).then(() => bindAuthorCardImages(rootEl, authors));
}
