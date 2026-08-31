// Mock recommendation engine (spec §53). No real AI — deterministic logic
// based on favorites, history, completed books, and popularity.

import { dataService } from './dataService.js';
import { store } from '../state/store.js';

export const recommendService = {
  // "Recommended for You": blend of favorite genres + high rating.
  forYou(limit = 8) {
    const { user, favorites, history, library } = store.get();
    const favGenres = new Set(user?.favoriteGenres || []);
    const owned = new Set([...favorites, ...Object.keys(library), ...history.map((h) => h.bookId)]);
    const scored = dataService.cache.books
      .filter((b) => !owned.has(b.id))
      .map((b) => {
        let s = b.rating;
        if (favGenres.has(b.genre)) s += 1.5;
        if (b.editorPick) s += 0.8;
        if (b.isPopular) s += 0.4;
        return { b, s };
      })
      .sort((a, b) => b.s - a.s);
    return scored.slice(0, limit).map((x) => x.b);
  },

  // "Because You Read X": nearest by genre/author to most recent book.
  becauseYouRead(recentBookId, limit = 6) {
    const base = dataService.get(recentBookId);
    if (!base) return [];
    return dataService.cache.books
      .filter((b) => b.id !== recentBookId)
      .map((b) => {
        let s = 0;
        if (b.genre === base.genre) s += 3;
        if (b.author === base.author) s += 4;
        s += b.rating / 2;
        return { b, s };
      })
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.b);
  },

  // "Trending Now": popular + new.
  trending(limit = 8) {
    return dataService.sort(
      dataService.cache.books.filter((b) => b.isPopular || b.isNew),
      'popular'
    ).slice(0, limit);
  },

  // "Hidden Gems": high rating, not popular, not new.
  hiddenGems(limit = 6) {
    return dataService.cache.books
      .filter((b) => b.rating >= 4.4 && !b.isPopular && !b.isNew)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  // "New in Your Favorite Genres"
  newInFavGenres(limit = 8) {
    const fav = new Set(store.get().user?.favoriteGenres || []);
    return dataService.cache.books
      .filter((b) => fav.has(b.genre) && b.isNew)
      .slice(0, limit);
  },

  // Stat summary for dashboard (spec §95, §43, §44).
  stats() {
    const { library, progress, favorites, history } = store.get();
    const ids = Object.keys(library);
    const completed = ids.filter((id) => library[id].status === 'completed');
    const reading = ids.filter((id) => library[id].status === 'reading');
    let pagesRead = 0;
    Object.values(progress).forEach((p) => { pagesRead += Math.round((p.percent / 100) * (p.totalPages || 300)); });
    let minutes = 0;
    Object.values(progress).forEach((p) => { minutes += Math.round((p.timeSpent || 0)); });
    return {
      completed: completed.length,
      reading: reading.length,
      favorites: favorites.length,
      pagesRead,
      minutes,
      history: history.length,
      streak: 12
    };
  }
};
