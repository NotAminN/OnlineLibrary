// Authors page (spec §28, §27) — editorial redesign. List + profile section.
import { dataService } from '../services/dataService.js';
import { genreById } from '../data/genres.js';
import { bookCard } from '../components/bookCard.js';
import { avatarInitials } from '../utils/format.js';
import { authorCard, loadPortraitsThenBind } from '../components/authorCard.js';
import { authorPortraitUrl } from '../data/authorPortraits.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

export default {
  render() {
    return `
    <section class="authors-hero">
      <div class="authors-container">
        <div class="authors-hero__row">
          <div>
            <p class="authors-eyebrow">Explore the creators</p>
            <h1 class="page-title authors-title">Voices behind the books</h1>
          </div>
          <a class="authors-all-btn" href="authors.html">All authors <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>
    <section class="authors-container" style="padding-block:0.5rem 8.5rem">
      <div class="authors-grid" id="author-grid"></div>
    </section>
    <section id="author-profile" class="authors-container" style="padding-block:2rem;display:none"></section>`;
  },
  init(root) {
    const authors = dataService.cache.authors;
    const grid = qs('#author-grid', root);
    grid.innerHTML = authors.map((a) => authorCard(a, dataService.byAuthor(a.id))).join('');
    loadPortraitsThenBind(grid, authors);
    staggerReveal('.ace', root, { stagger: 0.05 });

    // Profile rendering when hash present / clicked
    function showProfile(id) {
      const a = dataService.authorById[id];
      if (!a) return;
      const books = dataService.byAuthor(id);
      const popular = books.slice(0, 4);
      const latest = books.slice(-3).reverse();
      const portraitUrl = authorPortraitUrl(a.name);
      const profile = qs('#author-profile', root);
      profile.style.display = 'block';
      profile.innerHTML = `
        <div class="author-hero card p-8 mb-8" style="background:linear-gradient(135deg, var(--ink), #3a2e2a);color:#fff">
          ${portraitUrl
            ? `<img class="author-hero__portrait" src="${portraitUrl}" alt="Portrait of ${a.name}" onerror="this.remove()">`
            : `<div class="avatar avatar--lg" style="background:var(--burgundy);width:6rem;height:6rem;font-size:2rem">${avatarInitials(a.name)}</div>`}
          <div>
            <div class="eyebrow" style="color:var(--gold)">AUTHOR</div>
            <h2 class="font-serif" style="color:#fff;font-size:2.4rem">${a.name}</h2>
            <p style="color:rgba(255,255,255,.7)">${a.nationality} · born ${a.born}</p>
            <p class="author-bio" style="color:rgba(255,255,255,.82);max-width:60ch;margin-top:1rem">${a.bio}</p>
            <div class="flex gap-2 mt-4 flex-wrap">
              ${a.genres.map((g) => `<span class="badge" style="background:rgba(255,255,255,.12);color:#fff">${genreById[g]?.name}</span>`).join('')}
            </div>
          </div>
        </div>
        <h3 class="font-serif mb-4">Popular works</h3>
        <div class="book-grid book-grid--lg mb-8">${popular.map((b) => bookCard(b)).join('')}</div>
        <h3 class="font-serif mb-4">Latest releases</h3>
        <div class="book-grid book-grid--lg">${latest.map((b) => bookCard(b)).join('')}</div>`;
      staggerReveal('.book-card', profile, { stagger: 0.05 });
      profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    qsa('[data-author]', root).forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); showProfile(el.dataset.author); history.replaceState(null, '', '#' + el.dataset.author); }));

    const hash = location.hash.slice(1);
    if (hash && dataService.authorById[hash]) setTimeout(() => showProfile(hash), 350);
  }
};

