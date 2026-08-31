// Login / Register (spec §50). Simulated authentication.
import { store } from '../state/store.js';
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { qs } from '../utils/dom.js';

const ILLUSTRATION = `
  <div class="auth-illustration" style="display:none" id="auth-art">
    <div class="font-serif text-2xl mb-3">A quieter way to read.</div>
    <p style="color:rgba(255,255,255,.82);line-height:1.7">Lumina keeps your library, progress, and notes in one calm place. No clutter, no noise — just books worth your time.</p>
    <div class="flex gap-3 mt-5">
      <div style="flex:1;background:rgba(255,255,255,.1);border-radius:12px;padding:1rem"><div class="font-serif" style="font-size:1.6rem" id="art-read">24</div><div class="text-xs" style="color:rgba(255,255,255,.7)">books read</div></div>
      <div style="flex:1;background:rgba(255,255,255,.1);border-radius:12px;padding:1rem"><div class="font-serif" style="font-size:1.6rem">12</div><div class="text-xs" style="color:rgba(255,255,255,.7)">day streak</div></div>
    </div>
  </div>`;

export default {
  render() {
    // Where to send the user after a successful sign-in (set by the auth guard).
    this.nextPage = new URLSearchParams(location.search).get('next') || 'dashboard.html';
    return `
    <div class="grid auth-layout" style="min-height:100vh;grid-template-columns:1fr 1fr" id="auth-grid">
      <div class="auth-form-side" style="display:grid;place-items:center;padding:1.5rem">
        <div class="auth-card">
          <div class="brand mb-6" style="justify-content:flex-start"><span class="brand__mark">L</span>Lumina<span class="brand__dot">.</span></div>
          <div id="auth-form-slot"></div>
          <p class="text-xs muted mt-6 text-center">This is a demonstration. No real account is created and no data leaves your browser.</p>
        </div>
      </div>
      <div class="auth-art-side hide-touch" style="background:linear-gradient(135deg,var(--burgundy),var(--burgundy-deep));display:grid;place-items:center;padding:3rem;color:#fff">${ILLUSTRATION.replace('display:none', '')}</div>
    </div>`;
  },
  init(root) {
    renderLogin();
    function renderLogin() {
      const slot = qs('#auth-form-slot', root);
      slot.innerHTML = `
        <h1 class="page-title" style="font-size:2rem">Welcome back</h1>
        <p class="muted mb-6">Sign in to continue your reading.</p>
        <form id="login-form" class="flex flex-col gap-4">
          <div class="field"><label class="field__label">Email</label><input class="input" type="email" required placeholder="you@example.com" value="alex.morgan@example.com"/></div>
          <div class="field"><label class="field__label">Password</label><input class="input" type="password" required placeholder="••••••••" value="demo-pass"/></div>
          <a class="text-sm" href="#" data-forgot style="color:var(--burgundy);align-self:flex-end">Forgot password?</a>
          <button class="btn btn--primary btn--lg" type="submit" id="login-btn">Sign in</button>
        </form>
        <p class="text-sm muted mt-6 text-center">New to Lumina? <a href="register.html" style="color:var(--burgundy);font-weight:600">Create an account</a></p>`;
      qs('#login-form', root).onsubmit = async (e) => { 
        e.preventDefault(); 
        const email = e.target.querySelector('input[type=email]').value; 
        const password = e.target.querySelector('input[type=password]').value;
        const btn = qs('#login-btn', root);
        const origText = btn.textContent;
        btn.textContent = 'Signing in...';
        btn.disabled = true;
        try {
          const success = await store.login(email, password);
          if (success) {
             toast('Signed in successfully.', 'success');
             const next = this.nextPage || 'dashboard.html';
             setTimeout(() => location.href = next, 500);
          } else {
             toast('Invalid credentials.', 'error');
             btn.textContent = origText;
             btn.disabled = false;
          }
        } catch(err) {
          toast(err.message || 'Login failed.', 'error');
          btn.textContent = origText;
          btn.disabled = false;
        }
      };
      qs('[data-forgot]', root).onclick = (e) => { e.preventDefault(); toast('Password reset is not yet implemented.', 'info'); };
    }
  }
};
