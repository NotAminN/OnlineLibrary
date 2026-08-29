// Toast notifications (spec §67). Subtle, non-intrusive, auto-dismiss.
import { icon } from '../icons.js';

let wrap;
function ensureWrap() {
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('role', 'status');
    document.body.appendChild(wrap);
  }
  return wrap;
}

export function toast(message, type = 'success', duration = 2600) {
  const w = ensureWrap();
  const node = document.createElement('div');
  node.className = `toast toast--${type}`;
  const ic = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : type === 'info' ? 'info' : 'check-circle';
  node.innerHTML = `<span class="toast__icon">${icon(ic, { size: 16 })}</span><span class="toast__msg">${message}</span>`;
  w.appendChild(node);
  const remove = () => {
    node.style.transition = 'opacity .3s, transform .3s';
    node.style.opacity = '0';
    node.style.transform = 'translateY(8px)';
    setTimeout(() => node.remove(), 300);
  };
  node.addEventListener('click', remove);
  setTimeout(remove, duration);
  return node;
}
