// Central application state (spec §69, §70, §95). Persists to localStorage
// via the storage util and notifies subscribers. No framework — plain modules.
import { storage, on, emit } from '../storage.js';
import { api } from '../services/api.js';

const DEFAULT_SETTINGS = {
  fontSize: 'medium',
  lineHeight: 'comfortable',
  width: 'medium',
  align: 'left',
  theme: 'light',
  autosave: true
};

const DEFAULT_GOALS = { dailyMinutes: 30, dailyPages: 20, monthlyBooks: 4 };

function defaultState() {
  return {
    auth: { loggedIn: false, demo: false },
    user: null,
    onboarding: { completed: true, step: 5, genres: [], authors: [], goals: { ...DEFAULT_GOALS } },
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
  const persisted = storage.get('state', null);
  if (persisted && typeof persisted === 'object') {
    return {
      ...base,
      ...persisted,
      user: persisted.user || base.user,
      readingSettings: { ...base.readingSettings, ...(persisted.readingSettings || {}) },
      goals: { ...base.goals, ...(persisted.goals || {}) },
      ui: { ...base.ui, ...(persisted.ui || {}) },
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

  // ---- Auth & API Sync ----
  
  async initAuth() {
    const tokens = api.getTokens();
    if (tokens && tokens.access) {
      try {
        const user = await api.get('/auth/me/');
        state.auth = { loggedIn: true, demo: false };
        state.user = {
          name: `${user.first_name} ${user.last_name}`.trim() || user.username,
          email: user.email,
          avatarColor: user.avatar_color,
          bio: user.bio,
          favoriteGenres: user.favorite_genres,
          favoriteAuthors: user.favorite_authors
        };
        persist();
        emit('auth', state.auth);
        emit('user', state.user);
        
        // Sync user data in background
        this.syncUserData();
        
        return true;
      } catch (err) {
        console.error('Auth check failed', err);
        api.clearTokens();
        this.logout();
        return false;
      }
    }
    return false;
  },

  async syncUserData() {
    try {
      const [libItems, favs, shelvesData, stats, notifs] = await Promise.all([
        api.get('/library/'),
        api.get('/favorites/'),
        api.get('/shelves/'),
        api.get('/statistics/'),
        api.get('/notifications/')
      ]);
      
      // Update local state with API data
      if (favs) {
        state.favorites = favs.map(f => f.book_detail.slug);
      }
      if (libItems) {
        state.library = {};
        libItems.forEach(item => {
          state.library[item.book_detail.slug] = { status: item.status, addedAt: new Date(item.added_at).getTime() };
        });
      }
      if (shelvesData) {
         state.shelves = shelvesData.map(s => ({
            id: s.id,
            name: s.name,
            icon: s.icon,
            bookIds: s.books.map(b => b.book_detail.slug)
         }));
      }
      if (notifs) {
         state.notifications = notifs.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            read: n.read,
            createdAt: new Date(n.created_at).getTime()
         }));
      }
      
      persist();
      emit('state', state);
    } catch(e) {
      console.error('Sync failed', e);
    }
  },

  isAuthed() { return !!state.auth?.loggedIn; },
  
  async login(email, password) {
    // This is now handled by the real login page, but keeping API for reference
    const res = await api.post('/auth/login/', { email, password });
    if (res.tokens) {
       api.setTokens(res.tokens);
       await this.initAuth();
       return true;
    }
    return false;
  },
  
  async logout() {
    try {
      const tokens = api.getTokens();
      if (tokens && tokens.refresh) {
         await api.post('/auth/logout/', { refresh: tokens.refresh });
      }
    } catch(e) {}
    
    api.clearTokens();
    state.auth = { loggedIn: false, demo: false };
    state.user = null;
    persist();
    emit('auth', state.auth);
    emit('state', state);
  },
  
  getUser() { return state.user; },
  
  updateUser(patch) { 
    state.user = { ...state.user, ...patch }; 
    persist(); 
    emit('user', state.user); 
    // Optimistic background sync
    api.patch('/profile/', patch).catch(console.error);
  },

  // ---- Library (Optimistic Updates) ----
  inLibrary(id) { return !!state.library[id]; },
  addToLibrary(id, status = 'want') { 
    state.library[id] = { status, addedAt: Date.now() }; 
    persist(); 
    emit('library', state.library);
    
    api.post('/library/', { book: id, status }).catch(console.error);
  },
  removeFromLibrary(id) { 
    delete state.library[id]; 
    persist(); 
    emit('library', state.library); 
    api.delete(`/library/book/${id}/`).catch(console.error);
  },
  setStatus(id, status) { 
    if (state.library[id]) { 
      state.library[id].status = status; 
      persist(); 
      emit('library', state.library); 
    } 
  },
  getLibraryIds() { return Object.keys(state.library); },

  // ---- Favorites ----
  isFavorite(id) { return state.favorites.includes(id); },
  toggleFavorite(id) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter((x) => x !== id);
      api.delete(`/favorites/book/${id}/`).catch(console.error);
    } else {
      state.favorites.unshift(id);
      api.post('/favorites/', { book: id }).catch(console.error);
    }
    persist(); emit('favorites', state.favorites); emit('state', state);
    return state.favorites.includes(id);
  },

  // ---- Shelves ----
  getShelves() { return state.shelves; },
  addShelf(name, icon = 'bookmark') {
    const s = { id: 's-' + Math.random().toString(36).slice(2, 8), name, icon, bookIds: [] };
    state.shelves.push(s); 
    persist(); 
    emit('shelves', state.shelves); 
    return s;
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

  // ---- Bookmarks & Notes ----
  getBookmarks(id) { return state.bookmarks[id] || []; },
  addBookmark(id, bm) {
    if (!state.bookmarks[id]) state.bookmarks[id] = [];
    const rec = { id: 'bm-' + Date.now().toString(36), createdAt: Date.now(), ...bm };
    state.bookmarks[id].push(rec); persist(); emit('bookmarks', state.bookmarks); return rec;
  },
  removeBookmark(id, bmId) { state.bookmarks[id] = (state.bookmarks[id] || []).filter((b) => b.id !== bmId); persist(); emit('bookmarks', state.bookmarks); },

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

export { DEFAULT_SETTINGS, DEFAULT_GOALS };
