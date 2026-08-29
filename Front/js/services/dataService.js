// Data service — query helpers over the mock data (spec §68, §5).
// Keeps UI decoupled from data shape; a real API could replace these.

import { books, bookById } from '../data/books.js';
import { authors, authorById } from '../data/authors.js';
import { genres, genreById } from '../data/genres.js';
import { collections, collectionById } from '../data/collections.js';

export const dataService = {
  books,
  authors,
  genres,
  collections,
  bookById,
  authorById,
  genreById,
  collectionById,

  get(id) { return bookById[id] || null; },
  all() { return books; },

  byAuthor(authorId) { return books.filter((b) => b.author === authorId); },
  byGenre(genreId) { return books.filter((b) => b.genre === genreId); },
  byCollection(collectionId) {
    const c = collectionById[collectionId];
    if (!c) return [];
    return c.bookIds.map((id) => bookById[id]).filter(Boolean);
  },

  // Full-text-ish search across title, author name, genre, tags, description.
  search(query, opts = {}) {
    const q = query.trim().toLowerCase();
    let results = books;
    if (q) {
      results = books.filter((b) => {
        const a = authorById[b.author];
        const g = genreById[b.genre];
        const hay = [b.title, a?.name, g?.name, b.description, b.tags.join(' ')].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    return this.applyFilters(results, opts);
  },

  applyFilters(list, opts = {}) {
    let r = [...list];
    if (opts.genres?.length) r = r.filter((b) => opts.genres.includes(b.genre));
    if (opts.authors?.length) r = r.filter((b) => opts.authors.includes(b.author));
    if (opts.minRating) r = r.filter((b) => b.rating >= opts.minRating);
    if (opts.yearFrom) r = r.filter((b) => b.publicationYear >= opts.yearFrom);
    if (opts.yearTo) r = r.filter((b) => b.publicationYear <= opts.yearTo);
    if (opts.language) r = r.filter((b) => b.language === opts.language);
    if (opts.status && opts.lib) r = r.filter((b) => opts.lib[b.id]?.status === opts.status);
    return this.sort(r, opts.sort);
  },

  sort(list, sort = 'relevance') {
    const r = [...list];
    switch (sort) {
      case 'popular': return r.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
      case 'newest': return r.sort((a, b) => b.publicationYear - a.publicationYear);
      case 'rating': return r.sort((a, b) => b.rating - a.rating);
      case 'az': return r.sort((a, b) => a.title.localeCompare(b.title));
      case 'pages': return r.sort((a, b) => b.pages - a.pages);
      default: return r.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
    }
  },

  // Suggestions for search overlay (titles + authors + genres).
  suggestions(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    books.slice(0, 40).forEach((b) => {
      if (b.title.toLowerCase().includes(q)) out.push({ type: 'book', id: b.id, label: b.title });
    });
    authors.forEach((a) => {
      if (a.name.toLowerCase().includes(q)) out.push({ type: 'author', id: a.id, label: a.name });
    });
    genres.forEach((g) => {
      if (g.name.toLowerCase().includes(q)) out.push({ type: 'genre', id: g.id, label: g.name });
    });
    return out.slice(0, 8);
  },

  popularSearches() { return ['Fiction', 'Mystery', 'Mara El-Amin', 'Philosophy', 'History', 'Modern Classics']; },
  recentSearches() { return ['The Tenth Quiet', 'essential mysteries', 'sleep science']; }
};

export { books, authors, genres, collections };
