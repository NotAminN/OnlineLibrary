// Settings (spec §49). Account, reading preferences, notifications, privacy, appearance, library, goals.
import { store } from '../state/store.js';
import { dataService } from '../services/dataService.js';
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { confirmDialog } from '../components/modals.js';
import { qs, qsa } from '../utils/dom.js';

const FONT = { small: 'S', medium: 'M', large: 'L', xlarge: 'XL' };
const LH = { compact: 'Compact', comfortable: 'Comfortable', relaxed: 'Relaxed' };
const W = { narrow: 'Narrow', medium: 'Medium', wide: 'Wide' };
const AL = { left: 'Left', justified: 'Justified' };
const TH = { light: 'Light', sepia: 'Sepia', dark: 'Dark' };

function seg(label, key, map) {
  const s = store.getSettings();
  return `<div class="settings-section flex items-center justify-between flex-wrap gap-3">
    <div><div class="font-semibold">${label}</div></div>
    <div class="segmented" data-seg-key="${key}">
      ${Object.entries(map).map(([v, l]) => `<button data-val="${v}" class="${s[key] === v ? 'is-active' : ''}">${l}</button>`).join('')}
    </div>
  </div>`;
}

export default {
  topbar: { title: 'Settings', subtitle: 'Tune the experience to your reading.' },
  render() {
    const user = store.getUser();
    const goals = store.getGoals();
    const s = store.getSettings();
    return `
    <div class="container-wide" style="padding-block:1.5rem;max-width:60rem">
      <!-- Account -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-4">Account</h3>
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
          <div class="field"><label class="field__label">Display name</label><input class="input" id="set-name" value="${user.name}"/></div>
          <div class="field"><label class="field__label">Email</label><input class="input" id="set-email" value="${user.email}"/></div>
        </div>
        <div class="field mt-4"><label class="field__label">Bio</label><textarea class="textarea" id="set-bio">${user.bio}</textarea></div>
        <button class="btn btn--primary btn--sm mt-4" data-save-account>${icon('check', { size: 16 })} Save changes</button>
      </section>

      <!-- Reading preferences (applies to reader) -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-2">Reading preferences</h3>
        <p class="muted text-sm mb-2">These set the defaults for the reader and sync the next time you open a book.</p>
        ${seg('Font size', 'fontSize', FONT)}
        ${seg('Line height', 'lineHeight', LH)}
        ${seg('Reading width', 'width', W)}
        ${seg('Text alignment', 'align', AL)}
        ${seg('Theme', 'theme', TH)}
        <div class="settings-section flex items-center justify-between">
          <div><div class="font-semibold">Auto-save progress</div><div class="text-sm muted">Keep your place automatically as you read.</div></div>
          <button class="segmented" data-toggle="autosave"><span class="${s.autosave ? 'is-active' : ''}">${s.autosave ? 'On' : 'Off'}</span></button>
        </div>
        <a class="btn btn--outline btn--sm mt-3" href="reader.html?id=b-the-tenth-quiet">Preview in reader</a>
      </section>

      <!-- Goals -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-4">Reading goals</h3>
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
          <div class="field"><label class="field__label">Daily minutes</label><input class="input" type="number" min="0" id="goal-min" value="${goals.dailyMinutes}"/></div>
          <div class="field"><label class="field__label">Daily pages</label><input class="input" type="number" min="0" id="goal-pages" value="${goals.dailyPages}"/></div>
          <div class="field"><label class="field__label">Monthly books</label><input class="input" type="number" min="0" id="goal-books" value="${goals.monthlyBooks}"/></div>
        </div>
        <button class="btn btn--primary btn--sm mt-4" data-save-goals>Save goals</button>
      </section>

      <!-- Notifications -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-4">Notifications</h3>
        ${toggleRow('Reading reminders', 'notif-reminder', true)}
        ${toggleRow('New book alerts', 'notif-new', true)}
        ${toggleRow('Recommendations', 'notif-rec', true)}
        ${toggleRow('Collection updates', 'notif-coll', false)}
      </section>

      <!-- Privacy -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-4">Privacy</h3>
        ${toggleRow('Share reading activity', 'privacy-activity', false)}
        ${toggleRow('Personalized recommendations', 'privacy-rec', true)}
        <p class="text-xs muted mt-3">This is a demonstration product. No data leaves your browser, and authentication is simulated.</p>
      </section>

      <!-- Library / Data -->
      <section class="card p-6 mb-5">
        <h3 class="font-serif mb-4">Library data</h3>
        <p class="muted text-sm mb-3">Your library, progress, and preferences are stored locally in this browser.</p>
        <div class="flex gap-3 flex-wrap">
          <button class="btn btn--ghost btn--sm" data-export>Export data</button>
          <button class="btn btn--ghost btn--sm" data-reset style="color:var(--sem-error)">Reset everything</button>
        </div>
      </section>
    </div>`;
  },
  init(root) {
    // Reading preference segments
    qsa('[data-seg-key]', root).forEach((group) => {
      group.querySelectorAll('button').forEach((b) => b.onclick = () => {
        const key = group.dataset.segKey, val = b.dataset.val;
        store.setSetting(key, val);
        group.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b));
        toast('Reader preference updated.', 'success');
      });
    });
    const auto = qs('[data-toggle="autosave"]', root);
    if (auto) auto.onclick = () => { const v = !store.getSettings().autosave; store.setSetting('autosave', v); auto.querySelector('span').classList.toggle('is-active', v); auto.querySelector('span').textContent = v ? 'On' : 'Off'; };

    qs('[data-save-account]', root).onclick = () => {
      store.updateUser({ name: qs('#set-name', root).value.trim() || store.getUser().name, email: qs('#set-email', root).value.trim(), bio: qs('#set-bio', root).value.trim() });
      toast('Profile saved.', 'success');
    };
    qs('[data-save-goals]', root).onclick = () => {
      store.setGoal('dailyMinutes', +qs('#goal-min', root).value || 0);
      store.setGoal('dailyPages', +qs('#goal-pages', root).value || 0);
      store.setGoal('monthlyBooks', +qs('#goal-books', root).value || 0);
      toast('Goals saved.', 'success');
    };
    qsa('[data-toggle]', root).forEach((t) => { if (t.dataset.toggle !== 'autosave') t.onclick = () => { t.querySelector('span').classList.toggle('is-active'); }; });

    qs('[data-export]', root).onclick = () => {
      const data = JSON.stringify(store.get(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'lumina-library.json'; a.click();
      URL.revokeObjectURL(url);
      toast('Library exported.', 'success');
    };
    qs('[data-reset]', root).onclick = async () => {
      const ok = await confirmDialog({ title: 'Reset everything?', message: 'This clears your library, progress, and preferences from this browser. This cannot be undone.', confirmLabel: 'Reset', danger: true });
      if (ok) { store.resetAll(); toast('All data reset.', 'info'); setTimeout(() => location.href = 'index.html', 600); }
    };
  }
};

function toggleRow(label, id, on) {
  return `<div class="settings-section flex items-center justify-between">
    <div class="font-semibold">${label}</div>
    <button class="segmented" data-toggle="${id}"><span class="${on ? 'is-active' : ''}">${on ? 'On' : 'Off'}</span></button>
  </div>`;
}
