// Reusable localStorage utility (spec §70). Wraps JSON with namespacing,
// safe parse, and an event emitter so views can react to changes.

const NS = 'lumina:';
const listeners = new Map(); // key -> Set<fn>

function safeParse(raw, fallback) {
  if (raw == null) return fallback;
  try {
    const v = JSON.parse(raw);
    return v === null ? fallback : v;
  } catch (err) {
    return fallback;
  }
}

export const storage = {
  get(key, fallback) {
    try {
      return safeParse(localStorage.getItem(NS + key), fallback == null ? null : fallback);
    } catch (err) {
      return fallback == null ? null : fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch (err) {
      console.warn('storage.set failed', key, err);
    }
    emit(key, value);
  },
  remove(key) {
    try { localStorage.removeItem(NS + key); } catch (err) { /* noop */ }
    emit(key, null);
  },
  has(key) {
    try { return localStorage.getItem(NS + key) != null; } catch (err) { return false; }
  }
};

// Lightweight pub/sub so components stay decoupled from storage writes.
export function on(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return function () {
    var set = listeners.get(key);
    if (set) set.delete(fn);
  };
}

export function emit(key, value) {
  var set = listeners.get(key);
  if (set) set.forEach(function (fn) { try { fn(value); } catch (err) { console.warn(err); } });
  var star = listeners.get('*');
  if (star) star.forEach(function (fn) { try { fn(key, value); } catch (err) { /* noop */ } });
}

export function onAny(fn) { return on('*', fn); }
