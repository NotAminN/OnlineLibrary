// Reading statistics (spec §44). Tiles, weekly/monthly charts, genre donut.
import { dataService } from '../services/dataService.js';
import { recommendService } from '../services/recommendService.js';
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { formatMinutes } from '../utils/format.js';
import { reveal } from '../animations/gsap.js';
import { qs } from '../utils/dom.js';

// Deterministic pseudo-random based on a seed, for stable demo charts.
function seeded(seed) { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s % 1000) / 1000; }; }

export default {
  topbar: { title: 'Reading Statistics', subtitle: 'A measured look at your reading life.' },
  render() {
    const stats = recommendService.stats();
    const rnd = seeded(42);
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const week = Array.from({ length: 7 }, () => Math.round(rnd() * 90) + 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthVals = Array.from({ length: 6 }, () => Math.round(rnd() * 6) + 1);
    const maxWeek = Math.max(...week);
    const maxMonth = Math.max(...monthVals);

    // genre distribution from completed/reading books
    const owned = Object.keys(store.get().library);
    const genreCount = {};
    owned.forEach((id) => { const b = dataService.get(id); if (b) genreCount[b.genre] = (genreCount[b.genre] || 0) + 1; });
    const palette = { fiction: '#743C45', mystery: '#3F5246', philosophy: '#52685A', history: '#B58A4C', poetry: '#6A5A8A', psychology: '#6E6A64', science: '#5A7C9A', adventure: '#9C834F' };
    const totalBooks = owned.length || 1;
    let acc = 0;
    const segs = Object.entries(genreCount).map(([g, c]) => { const start = acc; acc += (c / totalBooks) * 100; return { g, c, start, end: acc, color: palette[g] || '#999' }; });

    return `
    <div class="container-wide" style="padding-block:1.5rem">
      <div class="grid gap-4 mb-6" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        ${tile('Books completed', stats.completed, 'book-open')}
        ${tile('Pages read', stats.pagesRead.toLocaleString(), 'file-text')}
        ${tile('Reading time', formatMinutes(stats.minutes), 'clock')}
        ${tile('Current streak', (stats.streak) + ' days', 'flame')}
        ${tile('Avg. session', '24 min', 'coffee')}
        ${tile('Books / month', '3.2', 'bar-chart')}
      </div>

      <div class="grid gap-5 mb-6" style="grid-template-columns:2fr 1fr">
        <div class="chart-card">
          <div class="flex items-center justify-between mb-4"><h3 class="font-serif">This week</h3><span class="text-sm muted">minutes read per day</span></div>
          <div class="bar-chart">
            ${week.map((v, i) => `<div class="bar-col"><span class="bar-val">${v}</span><div class="bar" style="height:${(v / maxWeek) * 100}%"></div><span class="bar-label">${days[i]}</span></div>`).join('')}
          </div>
        </div>
        <div class="chart-card">
          <h3 class="font-serif mb-4">Genre mix</h3>
          ${segs.length ? `
          <div class="donut">
            <svg width="120" height="120" viewBox="0 0 42 42">
              ${segs.map((s) => `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${s.color}" stroke-width="6" stroke-dasharray="${s.end - s.start} ${100 - (s.end - s.start)}" stroke-dashoffset="${-s.start}" transform="rotate(-90 21 21)"></circle>`).join('')}
            </svg>
            <div class="legend">
              ${segs.map((s) => `<div class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${dataService.genreById[s.g]?.name || s.g} <span class="muted">· ${s.c}</span></div>`).join('')}
            </div>
          </div>` : `<div class="muted text-sm">Add books to your library to see your mix.</div>`}
        </div>
      </div>

      <div class="chart-card mb-6">
        <div class="flex items-center justify-between mb-4"><h3 class="font-serif">Books per month</h3><span class="text-sm muted">last 6 months</span></div>
        <div class="bar-chart">
          ${monthVals.map((v, i) => `<div class="bar-col"><span class="bar-val">${v}</span><div class="bar" style="height:${(v / maxMonth) * 100}%;background:linear-gradient(var(--forest),var(--forest-deep))"></div><span class="bar-label">${months[i]}</span></div>`).join('')}
        </div>
      </div>

      <div class="chart-card">
        <div class="flex items-center justify-between mb-4"><h3 class="font-serif">Completion rate</h3><span class="text-sm muted">${stats.reading ? Math.round((stats.completed / Math.max(1, stats.completed + stats.reading)) * 100) : 100}% finished</span></div>
        <div class="progress" style="height:12px"><span style="width:${stats.reading ? Math.round((stats.completed / Math.max(1, stats.completed + stats.reading)) * 100) : 100}%"></span></div>
        <p class="text-sm muted mt-3">You’ve completed ${stats.completed} books and have ${stats.reading} in progress. A steady, unhurried pace — exactly how good reading happens.</p>
      </div>
    </div>`;
  },
  init(root) { reveal(qs('.chart-card', root), { y: 20 }); }
};

function tile(label, value, ic) {
  return `<div class="stat-tile"><div class="flex items-center gap-2 muted text-sm mb-2">${icon(ic, { size: 16 })} ${label}</div><div class="stat-tile__value">${value}</div></div>`;
}
