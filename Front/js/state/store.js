// Central application state (spec §69, §70, §95). Persists to localStorage
// via the storage util and notifies subscribers. No framework — plain modules.

import { storage, on, emit } from '../storage.js';
import { books } from '../data/books.js';
import { authors } from '../data/authors.js';

const DEMO_USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  bio: 'Reads across genres, favors a quiet evening and a long chapter. Currently exploring modern classics and the occasional cold case.',
  avatarColor: '#743C45',
  favoriteGenres: ['fiction', 'mystery', 'philosophy', 'history'],
  favoriteAuthors: ['a-marael', 'a-rothwell', 'a-fischer', 'a-costa']
};

// Default reading settings (spec §34)
const DEFAULT_SETTINGS = {
  fontSize: 'medium',      // small | medium | large | xlarge
  lineHeight: 'comfortable', // compact | comfortable | relaxed
  width: 'medium',         // narrow | medium | wide
  align: 'left',           // left | justified
  theme: 'light',          // light | sepia | dark
  autosave: true
};

const DEFAULT_GOALS = { dailyMinutes: 30, dailyPages: 20, monthlyBooks: 4 };

function defaultState() {
  return {
    auth: { loggedIn: true, demo: true }, // demo session by default
    user: { ...DEMO_USER },
    onboarding: { completed: true, step: 5, genres: [...DEMO_USER.favoriteGenres], authors: [...DEMO_USER.favoriteAuthors], goals: { ...DEFAULT_GOALS } },
    library: {},            // bookId -> { status, addedAt }
    favorites: [],          // [bookId]
    shelves: [
      { id: 's-want', name: 'Want to Read', icon: 'bookmark', bookIds: [] },
      { id: 's-reading', name: 'Currently Reading', icon: 'book-open', bookIds: [] },
      { id: 's-done', name: 'Finished', icon: 'check', bookIds: [] },
      { id: 's-fav', name: 'Favorites', icon: 'heart', bookIds: [] }
    ],
    progress: {},           // bookId -> { chapter, page, totalPages, percent, lastOpened, timeSpent }
    history: [],            // [{ bookId, lastOpened, chapter, percent }]
    bookmarks: {},          // bookId -> [{ id, chapter, paragraph, text, createdAt }]
    notes: {},              // bookId -> [{ id, chapter, text, page, createdAt }]
    readingSettings: { ...DEFAULT_SETTINGS },
    goals: { ...DEFAULT_GOALS },
    notifications: [],      // [{ id, type, title, body, createdAt, read }]
    ui: { sidebarCollapsed: false }
  };
}

let state = load();

function load() {
  const base = defaultState();
  // Merge persisted slices on top of defaults so new fields are safe.
  const persisted = storage.get('state', null);
  if (persisted && typeof persisted === 'object') {
    return {
      ...base,
      ...persisted,
      user: { ...base.user, ...(persisted.user || {}) },
      readingSettings: { ...base.readingSettings, ...(persisted.readingSettings || {}) },
      goals: { ...base.goals, ...(persisted.goals || {}) },
      ui: { ...base.ui, ...(persisted.ui || {}) },
      // ensure shelves/default ids exist
      shelves: persisted.shelves && persisted.shelves.length ? persisted.shelves : base.shelves
    };
  }
  return base;
}

function persist() {
  storage.set('state', state);
}

export const store = {
  get() { return state; },
  getState() { return state; },

  set(patch, { silent = false } = {}) {
    state = { ...state, ...patch };
    persist();
    if (!silent) emit('state', state);
  },

  // ---- Auth (simulated) ----
  isAuthed() { return !!state.auth?.loggedIn; },
  login(email) { state.auth = { loggedIn: true, demo: true }; if (email) state.user.email = email; persist(); emit('auth', state.auth); emit('state', state); },
  logout() { state.auth = { loggedIn: false, demo: true }; persist(); emit('auth', state.auth); emit('state', state); },
  getUser() { return state.user; },
  updateUser(patch) { state.user = { ...state.user, ...patch }; persist(); emit('user', state.user); emit('state', state); },

  // ---- Library ----
  inLibrary(id) { return !!state.library[id]; },
  addToLibrary(id, status = 'want') { state.library[id] = { status, addedAt: Date.now() }; persist(); emit('library', state.library); emit('state', state); },
  removeFromLibrary(id) { delete state.library[id]; persist(); emit('library', state.library); emit('state', state); },
  setStatus(id, status) { if (state.library[id]) { state.library[id].status = status; persist(); emit('library', state.library); } },
  getLibraryIds() { return Object.keys(state.library); },

  // ---- Favorites ----
  isFavorite(id) { return state.favorites.includes(id); },
  toggleFavorite(id) {
    if (state.favorites.includes(id)) state.favorites = state.favorites.filter((x) => x !== id);
    else state.favorites.unshift(id);
    persist(); emit('favorites', state.favorites); emit('state', state);
    return state.favorites.includes(id);
  },

  // ---- Shelves ----
  getShelves() { return state.shelves; },
  addShelf(name, icon = 'bookmark') {
    const s = { id: 's-' + Math.random().toString(36).slice(2, 8), name, icon, bookIds: [] };
    state.shelves.push(s); persist(); emit('shelves', state.shelves); return s;
  },
  renameShelf(id, name) { const s = state.shelves.find((x) => x.id === id); if (s) { s.name = name; persist(); emit('shelves', state.shelves); } },
  deleteShelf(id) { state.shelves = state.shelves.filter((x) => x.id !== id); persist(); emit('shelves', state.shelves); },
  toggleInShelf(shelfId, bookId) {
    const s = state.shelves.find((x) => x.id === shelfId); if (!s) return;
    if (s.bookIds.includes(bookId)) s.bookIds = s.bookIds.filter((x) => x !== bookId);
    else s.bookIds.push(bookId);
    persist(); emit('shelves', state.shelves); return s.bookIds.includes(bookId);
  },

  // ---- Progress ----
  getProgress(id) { return state.progress[id] || null; },
  setProgress(id, data) {
    const prev = state.progress[id] || {};
    state.progress[id] = { ...prev, ...data, lastOpened: Date.now() };
    // keep library status in sync
    if (!state.library[id]) state.library[id] = { status: 'reading', addedAt: Date.now() };
    else if (state.library[id].status === 'want') state.library[id].status = 'reading';
    if (data.percent >= 100 && state.library[id].status !== 'completed') state.library[id].status = 'completed';
    persist(); emit('progress', state.progress); emit('state', state);
  },

  // ---- History ----
  recordHistory(id, { chapter, percent } = {}) {
    state.history = state.history.filter((h) => h.bookId !== id);
    state.history.unshift({ bookId: id, lastOpened: Date.now(), chapter, percent });
    if (state.history.length > 50) state.history = state.history.slice(0, 50);
    persist(); emit('history', state.history); emit('state', state);
  },
  clearHistory() { state.history = []; persist(); emit('history', state.history); },

  // ---- Bookmarks ----
  getBookmarks(id) { return state.bookmarks[id] || []; },
  addBookmark(id, bm) {
    if (!state.bookmarks[id]) state.bookmarks[id] = [];
    const rec = { id: 'bm-' + Date.now().toString(36), createdAt: Date.now(), ...bm };
    state.bookmarks[id].push(rec); persist(); emit('bookmarks', state.bookmarks); return rec;
  },
  removeBookmark(id, bmId) { state.bookmarks[id] = (state.bookmarks[id] || []).filter((b) => b.id !== bmId); persist(); emit('bookmarks', state.bookmarks); },

  // ---- Notes ----
  getNotes(id) { return state.notes[id] || []; },
  addNote(id, note) {
    if (!state.notes[id]) state.notes[id] = [];
    const rec = { id: 'nt-' + Date.now().toString(36), createdAt: Date.now(), ...note };
    state.notes[id].push(rec); persist(); emit('notes', state.notes); return rec;
  },
  updateNote(id, noteId, text) { const n = (state.notes[id] || []).find((x) => x.id === noteId); if (n) { n.text = text; persist(); emit('notes', state.notes); } },
  removeNote(id, noteId) { state.notes[id] = (state.notes[id] || []).filter((n) => n.id !== noteId); persist(); emit('notes', state.notes); },

  // ---- Reading settings ----
  getSettings() { return state.readingSettings; },
  setSetting(key, value) { state.readingSettings = { ...state.readingSettings, [key]: value }; persist(); emit('settings', state.readingSettings); },

  // ---- Goals ----
  getGoals() { return state.goals; },
  setGoal(key, value) { state.goals = { ...state.goals, [key]: value }; persist(); emit('goals', state.goals); },

  // ---- Notifications ----
  getNotifications() { return state.notifications; },
  addNotification(n) { const rec = { id: 'ntf-' + Date.now().toString(36), createdAt: Date.now(), read: false, ...n }; state.notifications.unshift(rec); persist(); emit('notifications', state.notifications); },
  markRead(id) { const n = state.notifications.find((x) => x.id === id); if (n) { n.read = true; persist(); emit('notifications', state.notifications); } },
  markAllRead() { state.notifications.forEach((n) => (n.read = true)); persist(); emit('notifications', state.notifications); },
  removeNotification(id) { state.notifications = state.notifications.filter((x) => x.id !== id); persist(); emit('notifications', state.notifications); },

  // ---- UI ----
  toggleSidebar() { state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed; persist(); emit('ui', state.ui); },
  resetAll() { state = defaultState(); persist(); emit('state', state); }
};

// Seed a couple of demo notifications if none exist, to make the bell feel alive.
if (store.getNotifications().length === 0) {
  store.addNotification({ type: 'recommendation', title: 'Because you read fiction', body: '“The Cartographer of Souls” was added to your recommendations.' });
  store.addNotification({ type: 'reminder', title: 'Reading reminder', body: 'You set a goal of 30 minutes today. A quiet chapter awaits.' });
  store.addNotification({ type: 'collection', title: 'New collection', body: '“Stories for a Quiet Evening” has fresh additions.' });
}

export { DEMO_USER, DEFAULT_SETTINGS, DEFAULT_GOALS };
