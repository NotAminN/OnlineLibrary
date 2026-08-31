// Personal dashboard (spec §43, §44). Welcome, stats, continue reading, recommendations.
import { dataService } from '../services/dataService.js';
import { recommendService } from '../services/recommendService.js';
import { bookCard } from '../components/bookCard.js';
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { avatarInitials, formatMinutes } from '../utils/format.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

export default {
  topbar: { title: 'Welcome back', subtitle: '' },
  render() {
    const user = store.getUser() || { name: 'Guest Reader', avatarColor: 'var(--burgundy)' };
    const stats = recommendService.stats();
    const goals = store.getGoals();
    const firstName = user.name.split(' ')[0];
    const continueList = store.get().history.slice(0, 3).map((h) => dataService.get(h.bookId)).filter(Boolean);
    const recommend = recommendService.forYou(6);
    const trending = recommendService.trending(6);
    const because = continueList[0] ? recommendService.becauseYouRead(continueList[0].id, 4) : [];

    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="welcome-band card p-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-4">
          <div class="avatar avatar--lg" style="background:${user.avatarColor}">${avatarInitials(user.name)}</div>
          <div>
            <h1 style="font-size:1.7rem;margin:0">Welcome back, ${firstName}.</h1>
            <p class="muted" style="margin:0">Keep going. Your next great chapter is waiting.</p>
          </div>
        </div>
        <a class="btn btn--primary" href="reader.html?id=${continueList[0]?.id || 'b-the-tenth-quiet'}">${icon('play', { size: 16 })} Continue Reading</a>
      </div>

      <div class="grid gap-4 mb-8" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
        ${statTile('Books Read', stats.completed, 'book-open')}
        ${statTile('Currently Reading', stats.reading, 'play')}
        ${statTile('Reading Time', formatMinutes(stats.minutes), 'clock')}
        ${statTile('Pages Read', stats.pagesRead.toLocaleString(), 'file-text')}
        ${statTile('Day Streak', stats.streak + ' days', 'flame')}
      </div>

      <div class="grid gap-6 mb-8" style="grid-template-columns:1fr;grid-template-columns:2fr 1fr" >
        <section data-reveal>
          <h2 class="font-serif mb-4">Continue reading</h2>
          ${continueList.length ? `<div class="grid gap-3">${continueList.map((b) => bookCard(b, { variant: 'continue' })).join('')}</div>`
            : `<div class="empty empty--lg card"><div class="empty__icon">${icon('play', { size: 28 })}</div><div class="empty__title">No books in progress</div><p class="empty__text">Pick a book and start your next chapter.</p><a class="btn btn--primary mt-3" href="explore.html">Explore books</a></div>`}
        </section>
        <section data-reveal>
          <h3 class="font-serif mb-4">Today’s goal</h3>
          <div class="card p-5">
            <div class="flex items-center justify-between mb-2"><span class="text-sm muted">Reading minutes</span><span class="text-sm font-semibold" id="goal-val">${goalProgress(stats.minutes, goals.dailyMinutes)}</span></div>
            <div class="progress"><span style="width:${Math.min(100, Math.round((stats.minutes / Math.max(1, goals.dailyMinutes)) * 100))}%"></span></div>
            <p class="text-xs muted mt-2">Goal: ${goals.dailyMinutes} minutes daily</p>
            <a class="btn btn--ghost btn--sm mt-3" href="settings.html">Adjust goals</a>
          </div>
        </section>
      </div>

      <section class="mb-8" data-reveal>
        <div class="flex items-center justify-between mb-4"><h2 class="font-serif">Recommended for you</h2><a class="btn btn--ghost btn--sm hide-touch" href="explore.html">See more</a></div>
        <div class="book-grid book-grid--lg">${recommend.map((b) => bookCard(b)).join('')}</div>
      </section>

      ${because.length ? `<section class="mb-8" data-reveal><h2 class="font-serif mb-4">Because you read ${continueList[0].title}</h2><div class="book-grid book-grid--lg">${because.map((b) => bookCard(b)).join('')}</div></section>` : ''}

      <section data-reveal>
        <div class="flex items-center justify-between mb-4"><h2 class="font-serif">Trending now</h2><a class="btn btn--ghost btn--sm hide-touch" href="explore.html">Explore</a></div>
        <div class="book-grid book-grid--lg">${trending.map((b) => bookCard(b)).join('')}</div>
      </section>
    </div>`;
  },
  init(root) { staggerReveal('.book-card', root, { stagger: 0.04 }); }
};

function statTile(label, value, ic) {
  return `<div class="stat-tile"><div class="flex items-center gap-2 muted text-sm mb-2">${icon(ic, { size: 16 })} ${label}</div><div class="stat-tile__value">${value}</div></div>`;
}
function goalProgress(min, goal) { return `${Math.min(min, goal)} / ${goal} min`; }
