// Categories / Genres page (spec §23). Editorial grid linking to explore.
import { genres, genreById } from '../data/genres.js';
import { dataService } from '../services/dataService.js';
import { icon } from '../icons.js';
import { sectionReveal, staggerReveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">GENRES</div>
        <h1 class="page-title">Explore by genre</h1>
        <p class="lede mt-2" style="max-width:48ch">Every shelf is a different kind of company. Choose the mood you’re in.</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="genre-grid--xl" id="genre-grid" data-reveal></div>
    </section>`;
  },
  init(root) {
    const grid = qs('#genre-grid', root);
    grid.innerHTML = genres.map((g) => {
      const books = dataService.byGenre(g.id);
      const sample = books.slice(0, 3);
      return `
      <a class="genre-block" href="explore.html?genre=${g.id}" id="${g.id}" style="--g:${g.color}">
        <div class="genre-block__art" style="background:linear-gradient(140deg, ${g.color}, ${g.color}bb)">
          ${icon('book-open', { size: 30 })}
        </div>
        <div class="genre-block__body">
          <h3>${g.name}</h3>
          <p class="muted">${g.desc}</p>
          <div class="genre-block__meta">
            <span class="badge badge--ghost">${books.length} titles</span>
            <span class="text-xs muted">Explore →</span>
          </div>
        </div>
      </a>`;
    }).join('');
    staggerReveal('.genre-block', root, { stagger: 0.05 });
    // If a hash is present, scroll to it
    const hash = location.hash.slice(1);
    if (hash && qs('#' + CSS.escape(hash), root)) {
      setTimeout(() => qs('#' + CSS.escape(hash), root).scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
    }
  }
};
