// Authors page (spec §28, §27). List + profile section.
import { dataService } from '../services/dataService.js';
import { genreById } from '../data/genres.js';
import { bookCard } from '../components/bookCard.js';
import { avatarInitials } from '../utils/format.js';
import { icon } from '../icons.js';
import { sectionReveal, staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">AUTHORS</div>
        <h1 class="page-title">Authors worth discovering</h1>
        <p class="lede mt-2" style="max-width:52ch">The minds behind the books. Browse their catalog, biographies, and latest releases.</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="grid gap-5" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))" id="author-grid" data-reveal></div>
    </section>
    <section id="author-profile" class="container-wide" style="padding-block:2rem;display:none"></section>`;
  },
  init(root) {
    const grid = qs('#author-grid', root);
    grid.innerHTML = dataService.authors.map((a) => {
      const books = dataService.byAuthor(a.id);
      const color = genreById[a.genres[0]]?.color || 'var(--burgundy)';
      return `
      <a class="card author-card p-6 block" href="#${a.id}" data-author="${a.id}">
        <div class="flex items-center gap-4">
          <div class="avatar avatar--lg" style="background:${color}">${avatarInitials(a.name)}</div>
          <div>
            <div class="font-serif text-xl">${a.name}</div>
            <div class="text-sm muted">${a.genres.map((g) => genreById[g]?.name).join(', ')}</div>
          </div>
        </div>
        <p class="author-bio text-sm mt-4" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${a.bio}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="badge badge--ghost">${books.length} books</span>
          <span class="text-sm" style="color:var(--burgundy)">View profile →</span>
        </div>
      </a>`;
    }).join('');
    staggerReveal('.author-card', root, { stagger: 0.05 });

    // Profile rendering when hash present / clicked
    function showProfile(id) {
      const a = dataService.authorById[id];
      if (!a) return;
      const books = dataService.byAuthor(id);
      const color = genreById[a.genres[0]]?.color || 'var(--burgundy)';
      const popular = books.slice(0, 4);
      const latest = books.slice(-3).reverse();
      const profile = qs('#author-profile', root);
      profile.style.display = 'block';
      profile.innerHTML = `
        <div class="author-hero card p-8 mb-8" style="background:linear-gradient(135deg, var(--ink), #3a2e2a);color:#fff">
          <div class="avatar avatar--lg" style="background:${color};width:6rem;height:6rem;font-size:2rem">${avatarInitials(a.name)}</div>
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
