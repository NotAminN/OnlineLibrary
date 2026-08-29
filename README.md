# Lumina — Premium Online Library & Digital Reading Platform

A frontend-only, editorial digital reading experience built with **HTML5 + Tailwind CSS + Vanilla JavaScript (ES6 modules) + Vite + GSAP + Lenis**.

Lumina lets readers discover books, build a personal library, and read in a calm, distraction-free reader — all without a backend. Data is mock/local, and all state persists to `localStorage`.

## Features

- **Discovery** — homepage, explore with filters/sort, genres, authors, curated collections, global search (`Ctrl/Cmd + K`), command palette.
- **Book details** — metadata, about-the-book, about-the-author, table of contents, reviews, related titles.
- **Reader** — distraction-free reading with adjustable typography (font size, line height, width, alignment), three themes (Light / Sepia / Dark), persisted progress, bookmarks, and notes. Keyboard shortcuts (`←/→` chapters, `B` bookmark, `T` contents, `S` settings, `N` notes).
- **Personal library** — dashboard, my library (tabs, grid/list), favorites, continue reading, reading history, custom shelves.
- **Analytics** — reading statistics with weekly / monthly charts and a genre-mix donut.
- **User** — simulated authentication, profile, settings, onboarding, reading goals, notifications.
- **Responsive** — desktop sidebar layout, tablet, and mobile bottom navigation.
- **Motion** — GSAP + ScrollTrigger reveals and a Lenis smooth-scroll that respects `prefers-reduced-motion`.

## Tech stack

- Vite
- Tailwind CSS (v3) + custom CSS (`css/main.css`, `components.css`, `pages.css`, `animations.css`, `reader.css`)
- Vanilla JS ES modules
- GSAP + ScrollTrigger
- Lenis
- No framework, no backend.

## Getting started

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # production build to ../dist
npm run preview  # preview the production build
```

## Project structure

```
project-root/
├── Front/
│   ├── index.html … reader.html … (18 entry pages)
│   ├── assets/            # images / icons / books (covers are generated procedurally as SVG)
│   ├── css/               # main, components, pages, animations, reader
│   └── js/
│       ├── app.js         # app entry: shell, routing, global behavior
│       ├── data/          # books, authors, genres, collections, prose generator
│       ├── components/     # bookCard, shell, modals
│       ├── pages/         # one module per page
│       ├── services/      # dataService, recommendService
│       ├── state/         # store (central state + persistence)
│       ├── utils/         # dom, format, covers, toast
│       └── animations/    # gsap utilities + Lenis
├── scripts/gen-html.mjs   # generates the HTML entry shells
├── vite.config.js
└── README.md
```

## Architecture

```
UI  →  Application State (store.js)  →  Services / API layer (dataService, recommendService)  →  Future Backend API
```

The UI never reads hardcoded content directly. Page modules render data from `dataService`, which is the single seam where a real API could be swapped in.

## Data & persistence

- Mock data lives in `Front/js/data/`. All 42 books, 18 authors, 15 genres, and 9 collections are fictional but production-quality.
- State persists to `localStorage` under the `lumina:` namespace: library, favorites, shelves, reading progress, history, bookmarks, notes, reading settings, goals, notifications, and auth (simulated).
- A demo user (**Alex Morgan**) is signed in by default so the dashboard, library, and recommendations are populated.

## Accessibility & performance

- Semantic HTML, visible focus states, ARIA labels on interactive controls, and `prefers-reduced-motion` support.
- Covers are lightweight inline SVG (no large image downloads). Animations use `transform`/`opacity`.

## Notes

This is a demonstration product. Authentication is simulated, no data leaves the browser, and there is no real backend. The architecture is designed so a real API can be connected later without rewriting the UI.
