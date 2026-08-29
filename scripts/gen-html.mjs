// Generates the Front/*.html entry shells from a single source of truth.
// Each shell is intentionally thin: the global shell + page content are
// rendered by JavaScript (see Front/js/app.js). This keeps the repeated
// markup DRY while preserving per-page SEO metadata.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONT = resolve(__dirname, '../Front');

const SITE = 'Lumina';
const TAGLINE = 'Discover beautiful books. Read without distraction.';

const pages = [
  { file: 'index.html', page: 'home', layout: 'public', title: 'Lumina — Discover Books Worth Getting Lost In', desc: 'A premium digital library and reading platform. Discover curated books, build your personal library, and read without distraction.' },
  { file: 'explore.html', page: 'explore', layout: 'public', title: 'Explore Books — Lumina', desc: 'Browse the full Lumina collection. Filter by genre, author, rating, and more to find your next great read.' },
  { file: 'categories.html', page: 'categories', layout: 'public', title: 'Genres & Categories — Lumina', desc: 'Explore books by genre — fiction, mystery, history, philosophy, science, and more.' },
  { file: 'authors.html', page: 'authors', layout: 'public', title: 'Authors — Lumina', desc: 'Discover the authors behind the books worth reading. Browse biographies, popular works, and latest releases.' },
  { file: 'collections.html', page: 'collections', layout: 'public', title: 'Curated Collections — Lumina', desc: 'Editorially curated collections of books — modern classics, essential mysteries, quiet-evening stories, and more.' },
  { file: 'book.html', page: 'book', layout: 'public', title: 'Book Details — Lumina', desc: 'Read about a book, its author, table of contents, reviews, and related titles.' },
  { file: 'reader.html', page: 'reader', layout: 'reader', title: 'Reader — Lumina', desc: 'A distraction-free reading experience with adjustable typography, themes, and progress tracking.' },
  { file: 'library.html', page: 'library', layout: 'app', title: 'My Library — Lumina', desc: 'Your personal library — currently reading, want to read, completed, and favorites.' },
  { file: 'dashboard.html', page: 'dashboard', layout: 'app', title: 'Dashboard — Lumina', desc: 'Your reading dashboard — progress, streak, and recommendations.' },
  { file: 'favorites.html', page: 'favorites', layout: 'app', title: 'Favorites — Lumina', desc: 'The books you have saved as favorites.' },
  { file: 'history.html', page: 'history', layout: 'app', title: 'Reading History — Lumina', desc: 'A history of the books you have opened and your reading progress.' },
  { file: 'shelves.html', page: 'shelves', layout: 'app', title: 'My Shelves — Lumina', desc: 'Organize your books into personal shelves.' },
  { file: 'statistics.html', page: 'statistics', layout: 'app', title: 'Reading Statistics — Lumina', desc: 'Insights into your reading — books completed, pages read, streaks, and genre distribution.' },
  { file: 'profile.html', page: 'profile', layout: 'app', title: 'Profile — Lumina', desc: 'Your reader profile, favorite genres, and reading activity.' },
  { file: 'settings.html', page: 'settings', layout: 'app', title: 'Settings — Lumina', desc: 'Manage your account, reading preferences, notifications, and appearance.' },
  { file: 'login.html', page: 'login', layout: 'auth', title: 'Sign In — Lumina', desc: 'Sign in to your Lumina library.' },
  { file: 'register.html', page: 'register', layout: 'auth', title: 'Create an Account — Lumina', desc: 'Create your Lumina account and start building your library.' },
  { file: 'about.html', page: 'about', layout: 'public', title: 'About — Lumina', desc: 'Our mission, vision, and reading philosophy. A calm home for readers.' },
  { file: 'faq.html', page: 'faq', layout: 'public', title: 'FAQ — Lumina', desc: 'Answers to common questions about reading, bookmarks, shelves, and progress.' },
  { file: 'contact.html', page: 'contact', layout: 'public', title: 'Contact — Lumina', desc: 'Get in touch with the Lumina team.' }
];

const shell = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.desc}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#F7F4EE" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
  <style>
    html { background: #F7F4EE; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #252321; -webkit-font-smoothing: antialiased; }
    .boot { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #F7F4EE; z-index: 99999; transition: opacity .4s ease; }
    .boot-mark { font-family: "Playfair Display", serif; font-size: 1.6rem; letter-spacing: .04em; color: #743C45; }
    .boot-mark i { font-style: normal; opacity: .45; }
    .boot.hide { opacity: 0; pointer-events: none; }
    @media (prefers-reduced-motion: reduce) { .boot { transition: none; } }
  </style>
</head>
<body data-page="${p.page}" data-layout="${p.layout}">
  <div class="boot" id="app-boot" aria-hidden="true"><div class="boot-mark">${SITE}<i>.</i></div></div>
  <script type="module" src="./js/app.js"></script>
  <noscript><div style="padding:2.5rem;font-family:Inter,system-ui,sans-serif;max-width:42rem;margin:0 auto">${SITE} is a reading application and requires JavaScript to be enabled in your browser.</div></noscript>
</body>
</html>
`;

mkdirSync(FRONT, { recursive: true });
for (const p of pages) {
  writeFileSync(resolve(FRONT, p.file), shell(p), 'utf8');
  console.log('wrote', p.file);
}
console.log(`\n${pages.length} HTML shells generated in Front/.`);
