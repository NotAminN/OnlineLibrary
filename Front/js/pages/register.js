// Register (spec §50). Simulated sign-up.
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { qs } from '../utils/dom.js';

import { api } from '../services/api.js';

export default {
  render() {
    return `
    <div class="grid auth-layout" style="min-height:100vh;grid-template-columns:1fr 1fr">
      <div class="auth-art-side hide-touch" style="background:linear-gradient(135deg,var(--forest),var(--forest-deep));display:grid;place-items:center;padding:3rem;color:#fff">
        <div style="max-width:24rem">
          <div class="font-serif text-3xl mb-3">Build your library in minutes.</div>
          <p style="color:rgba(255,255,255,.82);line-height:1.7">Create a free account to save books, track progress, and get recommendations shaped to your taste.</p>
          <div class="flex gap-3 mt-6">
            <div style="flex:1;background:rgba(255,255,255,.1);border-radius:12px;padding:1rem"><div class="font-serif" style="font-size:1.6rem">30s</div><div class="text-xs" style="color:rgba(255,255,255,.7)">to set up</div></div>
            <div style="flex:1;background:rgba(255,255,255,.1);border-radius:12px;padding:1rem"><div class="font-serif" style="font-size:1.6rem">∞</div><div class="text-xs" style="color:rgba(255,255,255,.7)">shelves</div></div>
          </div>
        </div>
      </div>
      <div class="auth-form-side" style="display:grid;place-items:center;padding:1.5rem">
        <div class="auth-card">
          <div class="brand mb-6" style="justify-content:flex-start"><span class="brand__mark">L</span>Lumina<span class="brand__dot">.</span></div>
          <h1 class="page-title" style="font-size:2rem">Create your account</h1>
          <p class="muted mb-6">Start building your personal library.</p>
          <form id="register-form" class="flex flex-col gap-4">
            <div class="field"><label class="field__label">Display name</label><input class="input" required placeholder="Alex Morgan" /></div>
            <div class="field"><label class="field__label">Email</label><input class="input" type="email" required placeholder="you@example.com"/></div>
            <div class="field"><label class="field__label">Password</label><input class="input" type="password" required placeholder="At least 6 characters" /></div>
            <button class="btn btn--primary btn--lg" type="submit" id="register-btn">Create account</button>
          </form>
          <p class="text-sm muted mt-6 text-center">Already have an account? <a href="login.html" style="color:var(--burgundy);font-weight:600">Sign in</a></p>
        </div>
      </div>
    </div>`;
  },
  init(root) {
    qs('#register-form', root).onsubmit = async (e) => {
      e.preventDefault();
      const name = e.target.querySelector('input[placeholder="Alex Morgan"]').value.trim() || 'Reader';
      const email = e.target.querySelector('input[type=email]').value;
      const password = e.target.querySelector('input[type=password]').value;
      const btn = qs('#register-btn', root);
      const origText = btn.textContent;
      btn.textContent = 'Creating...';
      btn.disabled = true;

      try {
         const res = await api.post('/auth/register/', {
            username: email,
            email: email,
            password: password,
            password_confirm: password,
            display_name: name
         });
         
         if (res.tokens) {
            api.setTokens(res.tokens);
            await store.initAuth();
            toast('Account created successfully.', 'success');
            setTimeout(() => location.href = 'onboarding.html', 500);
         }
      } catch (err) {
         toast(err.message || 'Registration failed.', 'error');
         btn.textContent = origText;
         btn.disabled = false;
      }
    };
  }
};
