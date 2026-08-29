// Onboarding flow (spec §51). 5 steps, persisted locally.
import { genres } from '../data/genres.js';
import { dataService } from '../services/dataService.js';
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { qs, qsa } from '../utils/dom.js';

const STEPS = 5;
export default {
  render() {
    return `
    <div class="onboarding" style="min-height:100vh;display:grid;place-items:center;padding:2rem;background:var(--paper)">
      <div class="onb-card card" style="width:100%;max-width:42rem;padding:clamp(1.5rem,4vw,3rem)">
        <div class="brand mb-5 justify-center" style="display:flex;justify-content:center"><span class="brand__mark">L</span>Lumina<span class="brand__dot">.</span></div>
        <div class="onb-progress mb-6"><div class="progress"><span id="onb-bar" style="width:20%"></span></div><div class="text-xs muted mt-2" id="onb-step">Step 1 of ${STEPS}</div></div>
        <div id="onb-body"></div>
      </div>
    </div>`;
  },
  init(root) {
    let step = 1;
    const sel = { genres: [], authors: [], goals: { dailyMinutes: 20, dailyPages: 15, monthlyBooks: 3 } };
    const body = qs('#onb-body', root);

    function render() {
      qs('#onb-bar', root).style.width = (step / STEPS) * 100 + '%';
      qs('#onb-step', root).textContent = `Step ${step} of ${STEPS}`;
      if (step === 1) step1();
      else if (step === 2) step2();
      else if (step === 3) step3();
      else if (step === 4) step4();
      else step5();
    }

    function step1() {
      body.innerHTML = `
        <h2 class="font-serif text-center mb-2">Tell us what you love to read.</h2>
        <p class="muted text-center mb-6">Pick a few genres and we’ll shape your recommendations.</p>
        <div class="flex flex-wrap gap-2 justify-center" id="onb-genres">
          ${genres.map((g) => `<button class="chip ${sel.genres.includes(g.id) ? 'is-active' : ''}" data-g="${g.id}">${g.name}</button>`).join('')}
        </div>
        <div class="flex justify-between mt-7">
          <span></span>
          <button class="btn btn--primary" data-next ${sel.genres.length ? '' : 'disabled'}>Continue</button>
        </div>`;
      qsa('#onb-genres .chip', body).forEach((b) => b.onclick = () => { const g = b.dataset.g; const i = sel.genres.indexOf(g); if (i >= 0) sel.genres.splice(i, 1); else sel.genres.push(g); b.classList.toggle('is-active'); qs('[data-next]', body).disabled = !sel.genres.length; });
      qs('[data-next]', body).onclick = () => { if (sel.genres.length) { step++; render(); } };
    }

    function step2() {
      body.innerHTML = `
        <h2 class="font-serif text-center mb-2">Choose favorite authors.</h2>
        <p class="muted text-center mb-6">Optional — but it sharpens “because you read” suggestions.</p>
        <div class="grid gap-2" id="onb-authors" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
          ${dataService.authors.map((a) => `<button class="chip chip--sm ${sel.authors.includes(a.id) ? 'is-active' : ''}" data-a="${a.id}">${a.name}</button>`).join('')}
        </div>
        <div class="flex justify-between mt-7">
          <button class="btn btn--ghost" data-back>Back</button>
          <button class="btn btn--primary" data-next>Continue</button>
        </div>`;
      qsa('#onb-authors .chip', body).forEach((b) => b.onclick = () => { const a = b.dataset.a; const i = sel.authors.indexOf(a); if (i >= 0) sel.authors.splice(i, 1); else sel.authors.push(a); b.classList.toggle('is-active'); });
      qs('[data-back]', body).onclick = () => { step--; render(); };
      qs('[data-next]', body).onclick = () => { step++; render(); };
    }

    function step3() {
      body.innerHTML = `
        <h2 class="font-serif text-center mb-2">Set a gentle reading goal.</h2>
        <p class="muted text-center mb-6">We’ll track a streak, never nag.</p>
        <div class="grid gap-4" style="grid-template-columns:repeat(3,1fr)">
          ${goalBox('dailyMinutes', 'Minutes / day', 20)}
          ${goalBox('dailyPages', 'Pages / day', 15)}
          ${goalBox('monthlyBooks', 'Books / month', 3)}
        </div>
        <div class="flex justify-between mt-7">
          <button class="btn btn--ghost" data-back>Back</button>
          <button class="btn btn--primary" data-next>Continue</button>
        </div>`;
      bindGoals();
      qs('[data-back]', body).onclick = () => { step--; render(); };
      qs('[data-next]', body).onclick = () => { step++; render(); };
    }

    function goalBox(key, label, def) {
      return `<div class="field" style="text-align:center"><label class="field__label">${label}</label><input class="input" type="number" min="0" data-goal="${key}" value="${sel.goals[key] || def}"/></div>`;
    }
    function bindGoals() { qsa('[data-goal]', body).forEach((i) => i.oninput = () => sel.goals[i.dataset.goal] = +i.value || 0); }

    function step4() {
      body.innerHTML = `
        <h2 class="font-serif text-center mb-2">Almost there.</h2>
        <p class="muted text-center mb-6">Your tastes are saved on this device. You can change them anytime in Settings.</p>
        <div class="card p-5 mb-6">
          <div class="text-sm muted mb-2">Selected genres</div>
          <div class="flex flex-wrap gap-2">${sel.genres.map((g) => `<span class="badge badge--burgundy">${genres.find((x) => x.id === g)?.name}</span>`).join('') || '<span class="muted">None</span>'}</div>
          <div class="text-sm muted mb-2 mt-3">Authors</div>
          <div class="flex flex-wrap gap-2">${sel.authors.map((a) => `<span class="badge badge--ghost">${dataService.authorById[a]?.name}</span>`).join('') || '<span class="muted">None</span>'}</div>
        </div>
        <div class="flex justify-between">
          <button class="btn btn--ghost" data-back>Back</button>
          <button class="btn btn--primary" data-next>Finish</button>
        </div>`;
      qs('[data-back]', body).onclick = () => { step--; render(); };
      qs('[data-next]', body).onclick = () => { step++; render(); };
    }

    function step5() {
      // Persist selections
      store.set({ onboarding: { completed: true, step: 5, genres: sel.genres, authors: sel.authors, goals: sel.goals } });
      const user = store.getUser();
      store.updateUser({ favoriteGenres: sel.genres.length ? sel.genres : user.favoriteGenres, favoriteAuthors: sel.authors });
      store.set({ goals: sel.goals });
      body.innerHTML = `
        <div class="center" style="flex-direction:column;gap:1rem;padding:1rem 0">
          <div class="avatar" style="background:var(--forest);width:4rem;height:4rem">${icon('check', { size: 28 })}</div>
          <h2 class="font-serif text-center">Your library is ready.</h2>
          <p class="muted text-center" style="max-width:32ch">We’ve curated a few titles to get you started. Happy reading.</p>
          <a class="btn btn--primary btn--lg mt-3" href="index.html">Enter Lumina</a>
        </div>`;
    }

    render();
  }
};
