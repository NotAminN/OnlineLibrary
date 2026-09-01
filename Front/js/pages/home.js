// Homepage (spec §14, §16–§28, §43). 15 sections, editorial + GSAP.

import { icon, stars } from '../icons.js';
import { dataService } from '../services/dataService.js';
import { recommendService } from '../services/recommendService.js';
import { store } from '../state/store.js';
import { bookCard, cover, meta } from '../components/bookCard.js';
import { coverDataUri, coverFallbackUri, authorName } from '../utils/covers.js';
import { genreById, genres } from '../data/genres.js';
import { openSearch } from '../components/modals.js';
import { initBentoGrid } from '../components/bentoGrid.js';
import { authorCard, loadPortraitsThenBind } from '../components/authorCard.js';
import { heroSequence, sectionReveal, staggerReveal, parallax, fadeUp, prefersReduced } from '../animations/gsap.js';
import { gsap } from '../animations/gsap.js';

function sectionHead(eyebrow, title, action) {
  return `
  <div class="flex items-end justify-between gap-4 mb-6" data-reveal>
    <div>
      ${eyebrow ? `<div class="eyebrow mb-2">${eyebrow}</div>` : ''}
      <h2 class="font-serif">${title}</h2>
    </div>
    ${action ? `<a class="btn btn--ghost btn--sm hide-touch" href="${action.href}">${action.label} ${icon('arrow-right', { size: 16 })}</a>` : ''}
  </div>`;
}

export default {
  render() {
    const featured = dataService.cache.books.find((b) => b.editorPick) || dataService.cache.books[0];
    const popular = recommendService.trending(8);
    const newArrivals = dataService.cache.books.filter((b) => b.isNew).slice(0, 8);
    const editorPick = dataService.cache.books.find((b) => b.editorPick && b.genre === 'poetry') || featured;
    const authorsList = dataService.cache.authors.slice(0, 6);
    const collectionsList = dataService.cache.collections.slice(0, 3);
    const recommend = recommendService.forYou(6);
    const continueReading = store.get().history.slice(0, 4).map((h) => dataService.get(h.bookId)).filter(Boolean);
    const stats = recommendService.stats();

    return `
    <div class="texture-paper">
      <!-- HERO -->
      <section class="relative overflow-hidden">
        <div class="container-wide" style="padding-block:clamp(3rem,7vw,6rem)">
          <div class="grid items-center hero-grid" style="grid-template-columns:1.1fr 0.9fr;gap:3rem">
            <div>
              <div class="eyebrow hero-el">YOUR NEXT GREAT READ AWAITS</div>
              <h1 class="font-serif hero-el" style="margin:1rem 0">Find a book worth<br/>getting <em style="color:var(--burgundy);font-style:italic">lost in.</em></h1>
              <p class="lede hero-el" style="max-width:34rem;margin-bottom:1.75rem">Lumina is a calm, editorial home for discovery, a personal library, and reading without distraction. Curated books, your own shelves, and a reader built for long chapters.</p>
              <div class="flex flex-wrap gap-3 hero-el">
                <a class="btn btn--primary btn--lg" href="explore.html">Explore Books ${icon('arrow-right', { size: 18 })}</a>
                <a class="btn btn--outline btn--lg" href="reader.html?id=b-the-tenth-quiet">Start Reading</a>
              </div>
              <div class="search-input hero-el mt-5" style="max-width:30rem;cursor:pointer" data-action="search">
                <span>${icon('search', { size: 18 })}</span>
                <span style="color:var(--warm-gray)">Search books, authors, genres…</span>
                <kbd>Ctrl K</kbd>
              </div>
            </div>
            <!-- Book cover composition -->
            <div class="relative hero-el hero-comp" style="min-height:460px">
              <div class="book-comp" id="book-comp"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Featured Reads', 'Featured this week', { href: 'explore.html', label: 'Browse all' })}
        ${featured ? `
        <div class="grid" style="grid-template-columns:0.8fr 1.2fr;gap:2.5rem;align-items:start">
          <div class="book-card block" data-reveal style="width:240px;max-width:240px">
            ${cover(featured, { className: 'cover--featured', actions: false })}
            <div class="mt-3">${meta(featured, { linked: false })}</div>
          </div>
          <div data-reveal>
            <div class="eyebrow mb-2">EDITOR’S CHOICE</div>
            <h3 class="font-serif" style="font-size:2rem">${featured.title}</h3>
            <p class="muted mt-1">${authorName(featured.author)} · ${genreById[featured.genre]?.name || ''}</p>
            <div class="mt-2">${stars(featured.rating)}</div>
            <p class="lede mt-4" style="max-width:46ch">${featured.description}</p>
            <div class="flex gap-3 mt-5">
              <a class="btn btn--primary" href="book.html?id=${featured.id}">View Book</a>
              <a class="btn btn--ghost" href="reader.html?id=${featured.id}">${icon('play', { size: 16 })} Start Reading</a>
            </div>
          </div>
        </div>
        ` : '<p class="muted" data-reveal>No books available yet. Please make sure the backend is running and seeded.</p>'}
      </section>

      <!-- POPULAR -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Popular This Week', 'Read by the most readers right now', { href: 'explore.html', label: 'See more' })}
        <div class="rank-list" id="rank-list" data-reveal></div>
      </section>

      <!-- GENRES -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Explore by Genre', 'Find your kind of story', { href: 'categories.html', label: 'View all' })}
        <div class="bento" id="genre-grid" data-reveal></div>
      </section>

      <!-- NEW ARRIVALS -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('New Arrivals', 'Fresh to the shelf', { href: 'explore.html', label: 'Explore' })}
        <div class="book-grid" style="grid-template-columns:repeat(auto-fill,160px);gap:1.75rem;justify-content:start" data-reveal>${newArrivals.map((b) => bookCard(b)).join('')}</div>
      </section>

      <!-- CONTINUE READING -->
      ${continueReading.length ? `
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Continue Reading', 'Pick up where you left off', { href: 'history.html', label: 'History' })}
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))" data-reveal>${continueReading.map((b) => bookCard(b, { variant: 'continue' })).join('')}</div>
      </section>` : ''}

      <!-- EDITORIAL RECOMMENDATION -->
      <section class="container-wide" style="padding-block:clamp(3rem,6vw,5rem)">
  ${editorPick ? `
    <div class="card editorial-pick" data-reveal>
      <div style="display:flex;align-items:center;gap:2.5rem;flex-wrap:wrap">
        <div style="flex:1 1 380px;min-width:300px">
          <div class="eyebrow mb-3">EDITOR’S PICK</div>
          <h3 class="font-serif" style="font-size:2.4rem">${editorPick.title}</h3>
          <p class="muted mt-1">
            ${authorName(editorPick.author)} · ${genreById[editorPick.genre]?.name || 'Book'}
          </p>
          <p class="lede mt-4" style="max-width:52ch">${editorPick.description || ''}</p>
          <a class="btn btn--primary mt-5" href="book.html?id=${editorPick.id}">
            Discover this book ${icon('arrow-right', { size: 16 })}
          </a>
        </div>

        <div style="flex:0 1 300px;min-width:240px;width:min(300px,100%);margin-inline-start:auto">
          ${cover(editorPick, { className: '', actions: false })}
        </div>
      </div>
    </div>
  ` : `
    <div class="card" data-reveal style="padding:2rem;text-align:center">
      <div class="eyebrow mb-2">LIBRARY</div>
      <h3 class="font-serif">Your library is waiting to be filled.</h3>
      <p class="muted mt-2">
        Books will appear here once the library has been populated.
      </p>
      <a class="btn btn--primary mt-4" href="explore.html">
        Explore Books
      </a>
    </div>
  `}
  </section>

      <!-- AUTHORS -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Authors Worth Discovering', 'Voices behind the books', { href: 'authors.html', label: 'All authors' })}
        <div class="authors-grid" style="margin-top:1.5rem" data-reveal id="authors-row"></div>
      </section>

      <!-- COLLECTIONS -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Curated Collections', 'Editorially chosen, ready to read', { href: 'collections.html', label: 'All collections' })}
        <div class="grid gap-5" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))" data-reveal id="collections-row"></div>
      </section>

      <!-- READING EXPERIENCE + STATS -->
      <section class="container-wide" style="padding-block:clamp(3rem,6vw,5rem)">
        <div class="grid gap-6" style="grid-template-columns:1.2fr 0.8fr;align-items:center">
          <div data-reveal>
            <div class="eyebrow mb-2">THE READING EXPERIENCE</div>
            <h2 class="font-serif">A reader built for long chapters.</h2>
            <p class="lede mt-3" style="max-width:48ch">Adjust typography, switch to sepia or dark for late nights, and never lose your place. Your progress, bookmarks, and notes follow you across every device.</p>
            <div class="flex gap-3 mt-5">
              <a class="btn btn--primary" href="reader.html?id=b-the-tenth-quiet">Try the reader ${icon('arrow-right', { size: 16 })}</a>
            </div>
          </div>
          <div class="stat-card" data-reveal>
            <div class="eyebrow mb-3">THE COMMUNITY THIS MONTH</div>
            <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
              <div><div class="stat-num">${stats.completed + 48}</div><div class="muted text-sm">Books finished</div></div>
              <div><div class="stat-num">${stats.pagesRead + 2940}</div><div class="muted text-sm">Pages read</div></div>
              <div><div class="stat-num">${stats.streak + 6}</div><div class="muted text-sm">Day streak</div></div>
              <div><div class="stat-num">${dataService.cache.books.length}</div><div class="muted text-sm">Titles</div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- RECOMMENDED -->
      <section class="container-wide" style="padding-block:clamp(2rem,5vw,4rem)">
        ${sectionHead('Recommended for You', 'Chosen from your taste', { href: 'dashboard.html', label: 'Your dashboard' })}
        <div class="book-grid book-grid--lg" data-reveal>${recommend.map((b) => bookCard(b)).join('')}</div>
      </section>

      <!-- CTA -->
      <section class="container-wide" style="padding-block:clamp(3rem,7vw,6rem)">
        <div class="cta-band" data-reveal>
          <div class="eyebrow mb-3" style="color:var(--gold)">START YOUR LIBRARY</div>
          <h2 class="font-serif" style="color:#fff;font-size:clamp(1.8rem,4vw,3rem)">Your next great chapter is waiting.</h2>
          <p class="lede" style="color:rgba(255,255,255,.8);max-width:44ch;margin:1rem auto 2rem">Create your library, follow a reading streak, and discover books worth your evenings.</p>
          <div class="flex gap-3 justify-center flex-wrap">
            <a class="btn btn--gold btn--lg" href="register.html">Create free account</a>
            <a class="btn btn--lg" href="explore.html" style="background:rgba(255,255,255,.12);color:#fff">Explore books</a>
          </div>
        </div>
      </section>
    </div>`;
  },

  init(root) {
    // Hero book composition
    const comp = root.querySelector('#book-comp');
    if (comp) {
      // Four realistic book covers in a floating editorial arrangement.
      const picks = [
        'b-the-tenth-quiet',     // fiction, burgundy — the anchor
        'b-still-water',         // poetry, quiet gold
        'b-city-of-ideas',       // philosophy, forest
        'b-north-window'         // mystery, deep forest green
      ].map((id) => dataService.get(id)).filter(Boolean);
      // Anchored to the right column of the hero. The four covers sit as one
      // tight, fanned cluster — side by side with slight overlap and subtle
      // rotations, like books stood together on a desk.
      const positions = [
        // Far left of the arc: tilted slightly CCW, lowest z
        { left: '0%',  top: '28%', w: 160, r: -8, z: 1, depth: 'back' },
        // Left-center: tallest, highest in the arc
        { left: '24%', top: '16%', w: 175, r: -3, z: 2, depth: 'front' },
        // Right-center: nearly upright
        { left: '49%', top: '22%', w: 150, r:  3, z: 3, depth: 'mid' },
        // Far right: tilted slightly CW, front of the cluster
        { left: '69%', top: '26%', w: 145, r:  9, z: 4, depth: 'front' }
      ];
      comp.innerHTML = picks.map((b, i) => {
        const p = positions[i % positions.length];
        return `<a href="book.html?id=${b.id}" class="comp-cover" data-depth="${p.depth}" style="--w:${p.w}px;left:${p.left};top:${p.top};transform:rotate(${p.r}deg);z-index:${p.z}">
          <img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="${b.title}" loading="lazy" />
        </a>`;
      }).join('');
    }

    // Rank list (popular)
    const rank = root.querySelector('#rank-list');
    if (rank) {
      const list = recommendService.trending(8);
      rank.innerHTML = list.map((b, i) => `
        <a class="rank-row" href="book.html?id=${b.id}">
          <span class="rank-num font-serif">${String(i + 1).padStart(2, '0')}</span>
          <img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:54px;height:81px;object-fit:cover;border-radius:4px" />
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">${b.title}</div>
            <div class="text-sm muted">${authorName(b.author)} · ${genreById[b.genre]?.name || 'Unknown'}</div>
          </div>
          ${stars(b.rating)}
        </a>`).join('');
    }

    // Genre grid — shared editorial Bento layout (same as Categories page)
    initBentoGrid(root);

    // Authors row — shared editorial card (same design as the Authors page)
    const ar = root.querySelector('#authors-row');
    if (ar) {
      // Homepage-only editorial choice: show Stephen Hawking in place of
      // Alfred Lansing in this row (the Authors page keeps the full list).
      const swapLansingForHawking = (a) => a?.name === 'Alfred Lansing'
        ? dataService.cache.authors.find((x) => x.name === 'Stephen Hawking')
        : a;
      const homeAuthors = dataService.cache.authors.slice(0, 6).map(swapLansingForHawking);
      ar.innerHTML = homeAuthors.map((a) => authorCard(a, dataService.byAuthor(a.id), { href: `authors.html#${a.id}` })).join('');
      loadPortraitsThenBind(ar, homeAuthors);
    }

    // Collections row
    const cr = root.querySelector('#collections-row');
    if (cr) {
      cr.innerHTML = dataService.cache.collections.slice(0, 3).map((c) => collectionCard(c)).join('');
    }

    // Hero book composition: entrance + per-cover hover lift
    const compEl = root.querySelector('#book-comp');
    if (compEl && !prefersReduced) {
      const covers = Array.from(compEl.querySelectorAll('.comp-cover'));
      // Preserve the rotations already inlined in the HTML as CSS custom prop.
      covers.forEach((el) => {
        const t = (el.style.transform || '').match(/rotate\(([-0-9.]+)deg\)/);
        el.dataset.rot = t ? t[1] : '0';
      });
      gsap.set(covers, { opacity: 0, y: 40, scale: 0.9 });
      gsap.to(covers, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9, ease: 'power3.out', stagger: 0.12,
        delay: 0.35
      });
      // Subtle, looping breath on the whole composition
      gsap.to(compEl, { y: -8, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
      // Per-cover hover
      covers.forEach((el) => {
        const rot = parseFloat(el.dataset.rot) || 0;
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { y: -10, scale: 1.04, rotate: rot * 0.4, duration: 0.35, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { y: 0, scale: 1, rotate: rot, duration: 0.5, ease: 'power2.out' });
        });
      });
    } else if (compEl) {
      // Reduced motion: just ensure visibility
      gsap.set(compEl.querySelectorAll('.comp-cover'), { opacity: 1 });
    }

    // Animations
    heroSequence([
      root.querySelector('.eyebrow.hero-el'),
      root.querySelector('h1.hero-el'),
      root.querySelector('p.hero-el'),
      root.querySelector('.hero-el a.btn'),
      root.querySelector('.hero-el .search-input'),
      root.querySelector('.hero-comp')
    ]);
    sectionReveal(root);
    staggerReveal('.book-card', root, { stagger: 0.05 });
    staggerReveal('.rank-row', root, { stagger: 0.04 });
    staggerReveal('.genre-card', root, { stagger: 0.04 });
  }
};

function collectionCard(c) {
  const books = c.bookIds.map((id) => dataService.get(id)).filter(Boolean);
  const covers = books.slice(0, 4);
  return `
  <a class="card collection-card p-5 block" href="collections.html#${c.id}">
    <div class="flex gap-2 mb-4" style="height:140px;align-items:flex-end">
      ${covers.map((b, i) => `<img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:${i === 0 ? 90 : 70}px;height:${i === 0 ? 135 : i === 3 ? 105 : 120}px;object-fit:cover;border-radius:5px;box-shadow:var(--shadow-soft)" loading="lazy"/>`).join('')}
    </div>
    <div class="eyebrow mb-1">${c.subtitle}</div>
    <div class="font-serif text-xl">${c.title}</div>
    <p class="text-sm muted mt-2" style="min-height:3rem">${c.desc}</p>
    <div class="text-xs muted mt-3">${c.bookIds.length} books →</div>
  </a>`;
}
