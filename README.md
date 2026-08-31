# Lumina — Premium Online Library & Digital Reading Platform

A full-stack digital reading experience: **Vite + Tailwind CSS + Vanilla JavaScript (ES6 modules) + GSAP + Lenis** frontend with a **Django + Django REST Framework** backend.

Lumina lets readers discover books, build a personal library, and read in a calm, distraction-free reader. Content is served from the API; personal state persists to `localStorage` and syncs to the backend for signed-in users.

## Features

- **Discovery** — homepage, explore with filters/sort, genres, authors, curated collections, global search (`Ctrl/Cmd + K`), command palette.
- **Book details** — metadata, about-the-book, about-the-author, table of contents, reviews, related titles.
- **Reader** — distraction-free reading with adjustable typography, three themes, persisted progress, bookmarks, and notes.
- **Personal library** — dashboard, my library, favorites, continue reading, reading history, custom shelves.
- **Analytics** — reading statistics with weekly / monthly charts and a genre-mix donut.
- **User** — real JWT authentication (register / login / refresh), profile, settings, onboarding, reading goals, notifications.
- **Responsive** — desktop sidebar layout, tablet, and mobile bottom navigation.

## Tech stack

**Frontend:** Vite, Tailwind CSS (v3), Vanilla JS ES modules, GSAP + ScrollTrigger, Lenis.

**Backend:** Django 5, Django REST Framework, SimpleJWT, django-filter, CORS headers. SQLite for local development, Postgres (via `DATABASE_URL`) in production.

## Getting started (local development)

```bash
npm install                        # frontend dependencies
npm run dev                        # Vite dev server on http://localhost:5173
```

In a second terminal:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env             # Windows; use `cp` elsewhere
python manage.py migrate
python manage.py seed_data         # load books/authors/collections into SQLite
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver 8800    # API on http://127.0.0.1:8800
```

The Vite dev server proxies `/api` and `/media` to `http://127.0.0.1:8800` (see `vite.config.js`).

### Demo account

A seeded demo user is available: **alex.morgan@example.com** / **demo-pass**.

## Deployment (Vercel)

The repository is configured for an all-in-one Vercel deployment (`vercel.json`):

- The Vite frontend builds to `dist/` and is served as static files.
- `/api/*`, `/admin/*`, and `/media/*` are routed to the Django app running as a serverless function (`api/django.py`).

Setup:

1. Push this repository to GitHub and import it in Vercel (framework preset: **Other**; the `vercel.json` handles build/output).
2. Provision a Postgres database (e.g. Vercel Postgres or Neon) and set the environment variables on the Vercel project:
   - `SECRET_KEY` — a strong random value
   - `DEBUG` — `False`
   - `DATABASE_URL` — the Postgres connection string
   - `ALLOWED_HOSTS` — your domain(s), e.g. `your-app.vercel.app`
   - `VERCEL_URL` is injected by Vercel automatically.
3. Run migrations against the production database from your machine:
   ```bash
   cd backend
   DATABASE_URL=<postgres-url> python manage.py migrate
   DATABASE_URL=<postgres-url> python manage.py seed_data
   ```
4. Create an admin user the same way (`python manage.py createsuperuser` with `DATABASE_URL` set) to reach `/admin/`.

## Project structure

```
project-root/
├── Front/                  # Vite root — HTML shells, CSS, JS modules
│   ├── index.html …        # 21 entry pages
│   ├── css/                # main, components, pages, animations, reader
│   └── js/
│       ├── app.js          # app entry: shell, routing, global behavior
│       ├── data/           # genre art, portraits, prose generator
│       ├── components/     # bookCard, shell, modals
│       ├── pages/          # one module per page
│       ├── services/       # api client, dataService, recommendService
│       ├── state/          # store (central state + persistence)
│       ├── utils/          # dom, format, covers, toast
│       └── animations/     # gsap utilities + Lenis
├── backend/
│   ├── config/             # Django settings/urls/wsgi (wsgi = Vercel entry)
│   ├── apps/               # users, books, library, reader, notifications, core
│   ├── manage.py
│   └── requirements.txt
├── api/
│   └── django.py           # Vercel serverless entry for Django
├── scripts/
│   ├── gen-html.mjs        # generates the HTML entry shells
│   ├── export_seed_data.mjs
│   └── seed_data/          # JSON seed data used by `manage.py seed_data`
├── vercel.json             # deployment configuration
└── vite.config.js
```

## Architecture

```
UI → store.js (state + localStorage) → api.js (JWT fetch wrapper) → Django REST API → Postgres / SQLite
```

The UI renders through `dataService`, which reads from the API (with a light in-memory cache). `store.js` keeps optimistic local state and syncs it to the backend for signed-in users.

## Notes

- Covers are lightweight inline SVG (no large image downloads); animations use `transform`/`opacity` and respect `prefers-reduced-motion`.
- The reader generates chapter prose procedurally (`Front/js/data/prose.js`), so books work without large text assets.
- Uploads (covers, avatars) use Django's `ImageField`; on Vercel the filesystem is ephemeral, so connect an object storage provider (e.g. S3 via django-storages) if you need persistent media.
