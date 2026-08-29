// About page (spec §79). Mission, vision, reading philosophy, features, stats.
import { icon } from '../icons.js';
import { dataService } from '../services/dataService.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

export default {
  render() {
    const total = dataService.books.length;
    const authors = dataService.authors.length;
    const collections = dataService.collections.length;
    return `
    <section class="about-hero" style="margin:clamp(1.5rem,4vw,3rem);">
      <div class="eyebrow" style="color:var(--gold)">ABOUT LUMINA</div>
      <h1 class="font-serif" style="font-size:clamp(2.4rem,5vw,4rem);color:#fff">A home for readers who value the page.</h1>
      <p class="muted mt-4" style="max-width:60ch;font-size:1.1rem">Lumina began with a simple frustration: discovery tools had become feeding machines, and reading apps had become dashboards. We wanted a place that does two things beautifully — help you find books worth your time, and get out of the way while you read them.</p>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="grid gap-6 mb-8" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${valueCard('Discover', 'editorial-discovery', 'Curated shelves and a calm search experience, not an endless feed.')}
        ${valueCard('Read', 'book-open', 'A distraction-free reader with type you actually want to spend hours in.')}
        ${valueCard('Keep', 'library', 'Your own library, shelves, and progress — yours to arrange.')}
        ${valueCard('Return', 'clock', 'Pick up exactly where you left off, on any visit.')}
      </div>
      <div class="card p-8 mb-8">
        <h2 class="font-serif mb-3">Our reading philosophy</h2>
        <p class="lede" style="max-width:64ch">Reading is not a metric. A good chapter at the end of a long day is its own reward. We design for attention, not engagement — fewer notifications, more quiet, and recommendations that respect your taste rather than exploit it.</p>
      </div>
      <div class="grid gap-5 mb-8" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));text-align:center">
        <div class="stat-tile"><div class="stat-tile__value">${total}</div><div class="stat-tile__label">Titles in catalog</div></div>
        <div class="stat-tile"><div class="stat-tile__value">${authors}</div><div class="stat-tile__label">Featured authors</div></div>
        <div class="stat-tile"><div class="stat-tile__value">${collections}</div><div class="stat-tile__label">Curated collections</div></div>
        <div class="stat-tile"><div class="stat-tile__value">3</div><div class="stat-tile__label">Reader themes</div></div>
      </div>
      <div class="cta-band" style="text-align:center">
        <h2 class="font-serif" style="color:#fff">Ready to find your next great read?</h2>
        <a class="btn btn--gold btn--lg mt-4" href="explore.html">Explore the library</a>
      </div>
    </section>`;
  },
  init(root) { staggerReveal('.value-card, .stat-tile', root, { stagger: 0.05 }); }
};

function valueCard(title, ic, desc) {
  return `<div class="value-card"><div class="eyebrow mb-2">${icon(ic, { size: 18 })}</div><h3 class="font-serif" style="font-size:1.3rem">${title}</h3><p class="muted text-sm mt-2">${desc}</p></div>`;
}
