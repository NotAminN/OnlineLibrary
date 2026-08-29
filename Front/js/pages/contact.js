// Contact page (spec §81). Form with frontend validation.
import { icon } from '../icons.js';
import { toast } from '../utils/toast.js';
import { qs } from '../utils/dom.js';

export default {
  render() {
    return `
    <section class="page-hero">
      <div class="container-wide" style="padding-block:2.5rem">
        <div class="eyebrow mb-2">CONTACT</div>
        <h1 class="page-title">We’d love to hear from you</h1>
        <p class="lede mt-2" style="max-width:48ch">Questions, suggestions, or a book we should carry? Send a note.</p>
      </div>
    </section>
    <section class="container-wide" style="padding-block:3rem">
      <div class="grid gap-8" style="grid-template-columns:1.2fr 0.8fr;align-items:start">
        <div class="card p-7">
          <form id="contact-form" class="flex flex-col gap-4" novalidate>
            <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
              <div class="field"><label class="field__label">Name</label><input class="input" name="name" required placeholder="Your name"/></div>
              <div class="field"><label class="field__label">Email</label><input class="input" name="email" type="email" required placeholder="you@example.com"/></div>
            </div>
            <div class="field"><label class="field__label">Subject</label><input class="input" name="subject" required placeholder="How can we help?"/></div>
            <div class="field"><label class="field__label">Message</label><textarea class="textarea" name="message" required placeholder="Write your message…"></textarea></div>
            <div id="form-error" class="text-sm" style="color:var(--sem-error)"></div>
            <button class="btn btn--primary btn--lg" type="submit">Send message</button>
          </form>
        </div>
        <div class="card p-7 card--paper">
          <h3 class="font-serif mb-4">Other ways to reach us</h3>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3"><span class="avatar avatar--sm" style="background:var(--burgundy)">${icon('mail', { size: 16 })}</span><div><div class="font-semibold text-sm">Email</div><div class="text-sm muted">hello@lumina.example</div></div></div>
            <div class="flex items-center gap-3"><span class="avatar avatar--sm" style="background:var(--forest)">${icon('message-circle', { size: 16 })}</span><div><div class="font-semibold text-sm">Support</div><div class="text-sm muted">Replies within 2 business days</div></div></div>
            <div class="flex gap-3 mt-2">
              <a class="footer__icon" href="#" aria-label="Twitter" style="width:38px;height:38px;border-radius:50%;border:1px solid var(--line-strong);display:grid;place-items:center">${icon('twitter', { size: 16 })}</a>
              <a class="footer__icon" href="#" aria-label="Instagram" style="width:38px;height:38px;border-radius:50%;border:1px solid var(--line-strong);display:grid;place-items:center">${icon('instagram', { size: 16 })}</a>
            </div>
          </div>
          <p class="text-xs muted mt-5">Lumina is a demonstration product. Submitted messages are not sent anywhere — this form validates and confirms locally.</p>
        </div>
      </div>
    </section>`;
  },
  init(root) {
    const form = qs('#contact-form', root);
    const err = qs('#form-error', root);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      err.textContent = '';
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) { err.textContent = 'Please fill in every field.'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { err.textContent = 'Please enter a valid email address.'; return; }
      form.reset();
      toast('Message sent. Thank you — we’ll be in touch.', 'success');
    });
  }
};
