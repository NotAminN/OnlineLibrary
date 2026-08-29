// FAQ (spec §80). Animated accordion.
import { icon } from '../icons.js';
import { qs, qsa } from '../utils/dom.js';

const FAQS = [
  { q: 'How does the library work?', a: 'Add any book to your library with one tap. It’s organized into Want to Read, Currently Reading, and Finished — plus any custom shelves you create. Everything lives in your browser.' },
  { q: 'Can I read books online?', a: 'Yes. Every title opens in our reader, a distraction-free surface tuned for long chapters. Your place, bookmarks, and notes are saved automatically.' },
  { q: 'How do bookmarks work?', a: 'While reading, press B or tap the bookmark icon to save your place. Open the bookmarks panel to jump back to any of them at any time.' },
  { q: 'Can I create shelves?', a: 'Absolutely. Build as many shelves as you like — Weekend Reads, To Explore, Gift Ideas — and add or remove books freely. Shelves persist locally.' },
  { q: 'How is reading progress saved?', a: 'The reader records your chapter and scroll position and stores it in this browser. Reopen a book and you’ll return to the exact spot.' },
  { q: 'Can I customize the reader?', a: 'Yes. Adjust font size, line height, reading width, alignment, and theme (light, sepia, or dark). Your preferences are remembered for next time.' },
  { q: 'Is the platform available on mobile?', a: 'Lumina is fully responsive. On phones you get a bottom navigation bar and touch-friendly reader controls, while desktop keeps the full sidebar experience.' }
];

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">FAQ</div>
        <h1 class="page-title">Questions, answered</h1>
        <p class="lede mt-2" style="max-width:48ch">Everything you need to know about reading with Lumina.</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="faq-wrap" id="faq">
        ${FAQS.map((f, i) => `
          <div class="accordion__item" data-i="${i}">
            <button class="accordion__trigger" aria-expanded="false">${f.q} <span class="accordion__icon">${icon('plus', { size: 20 })}</span></button>
            <div class="accordion__panel"><div class="accordion__inner">${f.a}</div></div>
          </div>`).join('')}
      </div>
    </section>`;
  },
  init(root) {
    qsa('.accordion__item', root).forEach((item) => {
      const trigger = item.querySelector('.accordion__trigger');
      const panel = item.querySelector('.accordion__panel');
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // close others
        qsa('.accordion__item.is-open', root).forEach((o) => { if (o !== item) { o.classList.remove('is-open'); o.querySelector('.accordion__panel').style.height = '0px'; o.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false'); } });
        if (isOpen) { item.classList.remove('is-open'); panel.style.height = '0px'; trigger.setAttribute('aria-expanded', 'false'); }
        else { item.classList.add('is-open'); panel.style.height = panel.querySelector('.accordion__inner').offsetHeight + 'px'; trigger.setAttribute('aria-expanded', 'true'); }
      });
    });
  }
};
