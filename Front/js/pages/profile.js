// User profile (spec §48). Avatar, bio, genres, reading activity.
import { dataService } from '../services/dataService.js';
import { recommendService } from '../services/recommendService.js';
import { bookCard } from '../components/bookCard.js';
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { avatarInitials, timeAgo } from '../utils/format.js';
import { staggerReveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

export default {
  topbar: { title: 'Profile', subtitle: 'Your reader identity.' },
  render() {
    const user = store.getUser();
    const stats = recommendService.stats();
    const favGenres = user.favoriteGenres.map((g) => dataService.genreById[g]).filter(Boolean);
    const activity = store.get().history.slice(0, 6);
    const wantList = Object.keys(store.get().library).filter((id) => store.get().library[id].status === 'want').map((id) => dataService.get(id)).filter(Boolean).slice(0, 4);

    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="card p-7 mb-6" style="background:linear-gradient(135deg, var(--ink), #3a2e2a);color:#fff">
        <div class="flex items-center gap-5 flex-wrap">
          <div class="avatar avatar--lg" style="background:${user.avatarColor};width:5.5rem;height:5.5rem;font-size:2rem">${avatarInitials(user.name)}</div>
          <div class="flex-1 min-w-0">
            <h1 class="font-serif" style="color:#fff;font-size:2rem;margin:0">${user.name}</h1>
            <p style="color:rgba(255,255,255,.7);margin:.25rem 0 0">${user.email}</p>
            <p style="color:rgba(255,255,255,.82);max-width:52ch;margin-top:.75rem">${user.bio}</p>
          </div>
          <button class="btn btn--gold" data-edit>${icon('edit', { size: 16 })} Edit profile</button>
        </div>
      </div>

      <div class="grid gap-5 mb-6" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        ${miniStat('Books read', stats.completed)}
        ${miniStat('Currently reading', stats.reading)}
        ${miniStat('Favorites', stats.favorites)}
        ${miniStat('Day streak', stats.streak + ' days')}
      </div>

      <div class="grid gap-6 mb-6" style="grid-template-columns:1fr 1fr">
        <section>
          <h3 class="font-serif mb-3">Favorite genres</h3>
          <div class="flex flex-wrap gap-2">
            ${favGenres.map((g) => `<span class="badge badge--burgundy">${g.name}</span>`).join('') || '<span class="muted text-sm">No favorites set yet.</span>'}
          </div>
        </section>
        <section>
          <h3 class="font-serif mb-3">Reading activity</h3>
          <div class="card p-4">
            ${activity.length ? activity.map((h) => { const b = dataService.get(h.bookId); return `<div class="flex items-center gap-3 py-2" style="border-bottom:1px solid var(--line)"><span class="avatar avatar--sm" style="background:var(--burgundy)">${icon('book-open', { size: 14 })}</span><span class="flex-1 text-sm truncate">${b?.title}</span><span class="text-xs muted">${timeAgo(h.lastOpened)}</span></div>`; }).join('') : '<p class="muted text-sm">No recent activity.</p>'}
          </div>
        </section>
      </div>

      ${wantList.length ? `<section class="mb-6"><h3 class="font-serif mb-4">Want to read</h3><div class="book-grid book-grid--lg">${wantList.map((b) => bookCard(b)).join('')}</div></section>` : ''}
    </div>`;
  },
  init(root) {
    staggerReveal('.book-card', root, { stagger: 0.04 });
    const btn = qs('[data-edit]', root);
    if (btn) btn.onclick = () => { location.href = 'settings.html'; };
  }
};

function miniStat(label, value) {
  return `<div class="stat-tile"><div class="stat-tile__value" style="font-size:1.8rem">${value}</div><div class="stat-tile__label">${label}</div></div>`;
}
