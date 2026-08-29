// Collections page (spec §29).
import { dataService } from '../services/dataService.js';
import { bookCard } from '../components/bookCard.js';
import { coverDataUri, coverFallbackUri } from '../utils/covers.js';
import { icon } from '../icons.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs, qsa } from '../utils/dom.js';

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">COLLECTIONS</div>
        <h1 class="page-title">Curated collections</h1>
        <p class="lede mt-2" style="max-width:52ch">Editorially chosen sets of books, gathered around a mood, a question, or a quiet evening.</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="grid gap-6" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))" id="coll-grid" data-reveal></div>
    </section>
    <section id="coll-detail" class="container-wide" style="padding-block:2rem;display:none"></section>`;
  },
  init(root) {
    const grid = qs('#coll-grid', root);
    grid.innerHTML = dataService.collections.map((c) => {
      const books = c.bookIds.map((id) => dataService.get(id)).filter(Boolean);
      const covers = books.slice(0, 4);
      return `
      <a class="card collection-card p-5 block" href="#${c.id}" data-coll="${c.id}">
        <div class="flex gap-2 mb-4" style="height:150px;align-items:flex-end">
          ${covers.map((b, i) => `<img src="${coverDataUri(b)}" onerror="this.onerror=null;this.src='${coverFallbackUri(b)}'" alt="" style="width:${i === 0 ? 96 : 74}px;height:${i === 0 ? 142 : i === 3 ? 112 : 128}px;object-fit:cover;border-radius:5px;box-shadow:var(--shadow-soft)" loading="lazy"/>`).join('')}
        </div>
        <div class="eyebrow mb-1">${c.subtitle}</div>
        <div class="font-serif text-2xl">${c.title}</div>
        <p class="text-sm muted mt-2 line-clamp-2">${c.desc}</p>
        <div class="text-xs muted mt-3">${c.bookIds.length} books →</div>
      </a>`;
    }).join('');
    staggerReveal('.collection-card', root, { stagger: 0.05 });

    function showColl(id) {
      const c = dataService.collectionById[id];
      if (!c) return;
      const books = dataService.byCollection(id);
      const detail = qs('#coll-detail', root);
      detail.style.display = 'block';
      detail.innerHTML = `
        <div class="collection-hero mb-8">
          <div class="eyebrow" style="color:var(--gold)">${c.subtitle}</div>
          <h2 class="font-serif" style="font-size:2.6rem">${c.title}</h2>
          <p class="muted mt-2" style="max-width:54ch">${c.desc}</p>
          <p class="muted mt-3">${c.bookIds.length} books in this collection</p>
        </div>
        <div class="book-grid book-grid--lg">${books.map((b) => bookCard(b)).join('')}</div>`;
      staggerReveal('.book-card', detail, { stagger: 0.04 });
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    qsa('[data-coll]', root).forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); showColl(el.dataset.coll); history.replaceState(null, '', '#' + el.dataset.coll); }));

    const hash = location.hash.slice(1);
    if (hash && dataService.collectionById[hash]) setTimeout(() => showColl(hash), 350);
  }
};
