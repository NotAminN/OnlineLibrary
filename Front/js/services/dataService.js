import { api } from './api.js';

// We'll maintain a local cache to keep the app snappy
// and to avoid rewriting synchronous getters entirely where possible,
// but all main fetch methods will now be async.

export const dataService = {
  // We can cache data here
  cache: {
    books: [],
    authors: [],
    genres: [],
    collections: [],
    booksLoaded: false,
  },

  authorById: {},
  genreById: {},
  collectionById: {},

  async initialize() {
    if (this.cache.booksLoaded) return;
    try {
      const [books, authors, categories, collections] = await Promise.all([
        api.get('/books/'),
        api.get('/authors/'),
        api.get('/categories/'),
        api.get('/collections/')
      ]);

      // Normalize: some DRF endpoints may return paginated {count, results:[...]}
      const asList = (data) => (Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []));
      const mapBook = (b) => ({
        ...b,
        id: b.slug,
        author: b.author_slug,
        genre: b.genre_slug,
        isPopular: b.is_popular,
        isNew: b.is_new,
        editorPick: b.editor_pick,
        publicationYear: b.publication_year
      });

      const mapAuthor = (a) => ({ ...a, id: a.slug });
      const mapCat = (c) => ({ ...c, id: c.slug });
      const mapCol = (c) => ({
        ...c,
        id: c.slug,
        desc: c.description,
        bookIds: c.preview_books ? c.preview_books.map(b => b.slug) : []
      });

      this.cache.books = asList(books).map(mapBook);
      this.cache.authors = asList(authors).map(mapAuthor);
      this.cache.genres = asList(categories).map(mapCat);
      this.cache.collections = asList(collections).map(mapCol);
      
      this.cache.authors.forEach(a => this.authorById[a.id] = a);
      this.cache.genres.forEach(c => this.genreById[c.id] = c);
      this.cache.collections.forEach(c => this.collectionById[c.id] = c);
      
      this.cache.booksLoaded = true;
    } catch (e) {
      console.error('Failed to load initial data from API', e);
    }
  },

  get(slug) { 
    return this.cache.books.find(b => b.id === slug) || null; 
  },
  
  async getFullBook(slug) {
    return await api.get(`/books/${slug}/`);
  },

  all() { return this.cache.books; },

  byAuthor(authorSlug) { 
    return this.cache.books.filter((b) => b.author === authorSlug); 
  },
  
  byGenre(genreSlug) { 
    return this.cache.books.filter((b) => b.genre === genreSlug); 
  },
  
  async byCollection(collectionSlug) {
    const c = await api.get(`/collections/${collectionSlug}/`);
    return c.books || [];
  },

  async search(query, opts = {}) {
    // We can use the API search endpoint
    if (!query) {
       // Just apply local filters if no query
       return this.applyFilters(this.cache.books, opts);
    }
    const params = { q: query };
    if (opts.minRating) params.rating__gte = opts.minRating;
    // ... we can map other filters, or for now just use the local applyFilters on API results
    const results = await api.get('/search/', { q: query });
    const mapped = (results.books || []).map(b => ({
      ...b,
      id: b.slug,
      author: b.author_slug,
      genre: b.genre_slug,
      isPopular: b.is_popular,
      isNew: b.is_new,
      editorPick: b.editor_pick,
      publicationYear: b.publication_year
    }));
    return this.applyFilters(mapped, opts);
  },

  applyFilters(list, opts = {}) {
    let r = [...list];
    if (opts.genres?.length) r = r.filter((b) => opts.genres.includes(b.genre));
    if (opts.authors?.length) r = r.filter((b) => opts.authors.includes(b.author));
    if (opts.minRating) r = r.filter((b) => b.rating >= opts.minRating);
    if (opts.yearFrom) r = r.filter((b) => b.publicationYear >= opts.yearFrom);
    if (opts.yearTo) r = r.filter((b) => b.publicationYear <= opts.yearTo);
    if (opts.language) r = r.filter((b) => b.language === opts.language);
    // lib status requires fetching from library API, for now filter locally if provided
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

  async suggestions(query) {
    const q = query.trim();
    if (!q) return [];
    const res = await api.get('/search/', { q });
    const out = [];
    (res.books || []).slice(0, 4).forEach(b => out.push({ type: 'book', id: b.slug, label: b.title }));
    (res.authors || []).slice(0, 2).forEach(a => out.push({ type: 'author', id: a.slug, label: a.name }));
    (res.categories || []).slice(0, 2).forEach(g => out.push({ type: 'genre', id: g.slug, label: g.name }));
    return out;
  },

  popularSearches() { return ['Fiction', 'Mystery', 'Mara El-Amin', 'Philosophy', 'History', 'Modern Classics']; },
  recentSearches() { return ['The Tenth Quiet', 'essential mysteries', 'sleep science']; }
};
