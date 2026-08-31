// Lucide-style inline SVG icons. Minimal, consistent stroke icons.
// Usage: icon('search') -> string of <svg ...>. Pass size via class in CSS.
const P = (p) => p; // passthrough for readability

export const icons = {
  home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 9.5V21h14V9.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  library: '<path d="M4 19V5a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1Z"/><path d="M9 19V4h4v16H9Z"/><path d="m14 19-3-1V8l3-1v12Z"/><path d="m17 19-3-1V8l3-1v12Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4V4Z"/>',
  'bookmark-fill': '<path d="M6 4h12v16l-6-4-6 4V4Z" fill="currentColor" stroke="none"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-8.4C1.3 9 2.6 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.7 3.5 3.2 6.1C19 15.6 12 20 12 20Z"/>',
  'heart-fill': '<path d="M12 20s-7-4.4-9.2-8.4C1.3 9 2.6 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.7 3.5 3.2 6.1C19 15.6 12 20 12 20Z" fill="currentColor" stroke="none"/>',
  star: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z"/>',
  'star-fill': '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" fill="currentColor" stroke="none"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-up': '<path d="m6 15 6-6 6 6"/>',
  'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 5 5 9-11"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  'book-open': '<path d="M12 5.5C11 4.7 9.4 4 7.5 4 4.9 4 3 5 3 5v14s1.9-1 4.5-1c1.9 0 3.5.7 4.5 1.5"/><path d="M12 5.5C13 4.7 14.6 4 16.5 4 19.1 4 21 5 21 5v14s-1.9-1-4.5-1c-1.9 0-3.5.7-4.5 1.5"/><path d="M12 5.5V20"/>',
  'book-marked': '<path d="M5 4h11a2 2 0 0 1 2 2v14l-7.5-4L5 20V4Z"/><path d="M9 5v6l1.5-1L12 11V5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  'more-horizontal': '<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  sort: '<path d="M4 7h10M4 12h7M4 17h4M16 9l3-3 3 3M19 6v12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  'type': '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  'align-left': '<path d="M4 6h16M4 12h10M4 18h13"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  flame: '<path d="M12 3c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1-.3-1.8-.7-2.5 2 1 3.7 3.3 3.7 6.3a7 7 0 0 1-14 0c0-3 2-5.5 3.5-8C11 4.5 11.7 3.6 12 3Z"/>',
  'trending-up': '<path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"/>',
  quote: '<path d="M7 7H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3v3a3 3 0 0 1-3 3M20 7h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3v3a3 3 0 0 1-3 3"/>',
  feather: '<path d="M20.2 3.8a5.4 5.4 0 0 0-7.6 0L5 11.4V19a1 1 0 0 0 1 1h7.6l7.6-7.6a5.4 5.4 0 0 0 0-7.6Z"/><path d="M16 8 2 22M17.5 13H9"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  play: '<path d="M7 4v16l13-8L7 4Z"/>',
  command: '<path d="M15 6a3 3 0 1 1 3 3h-3V6Zm0 0v12m0 0a3 3 0 1 0 3-3h-3Zm0 0H9m0 0a3 3 0 1 1-3-3h3v3Zm0 0V6a3 3 0 1 0-3 3h3Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  'user-plus': '<circle cx="9" cy="8" r="4"/><path d="M3 21a6 6 0 0 1 12 0M19 8v6M22 11h-6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S9 4 6.5 6 12 8 12 8Zm0 0s3-4 5.5-2S12 8 12 8Z"/>',
  'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  'book-plus': '<path d="M5 4h11a2 2 0 0 1 2 2v14l-7.5-4L5 20V4Z"/><path d="M9 9v5M6.5 11.5h5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-4 1 2-5 4-1Z"/>',
  'hash': '<path d="M4 9h16M4 15h16M10 4 8 20M16 4l-2 16"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  'bar-chart': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  'pie-chart': '<path d="M12 3a9 9 0 0 1 9 9h-9V3Z"/><path d="M12 3v9h9A9 9 0 0 0 12 3Z"/>',
  'message-circle': '<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z"/>',
  'external-link': '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  'thumbs-up': '<path d="M7 22V11l4-8a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17 22H7Z"/><path d="M7 11H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/>',
  'chevrons-right': '<path d="m6 6 6 6-6 6M13 6l6 6-6 6"/>',
  'sliders-horizontal': '<path d="M4 6h11M19 6h1M4 12h1M9 12h11M4 18h7M15 18h5"/><circle cx="16" cy="6" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="13" cy="18" r="2"/>',
  'star-half': '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9V3Z"/><path d="M12 3 9.4 8.3 3.5 9.2 7.8 13.3 6.8 19.1 12 16.9V3Z" fill="currentColor" stroke="none"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'bookmark-plus': '<path d="M6 4h12v16l-6-4-6 4V4Z"/><path d="M12 9v4M10 11h4"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'alert-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
  'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  'send': '<path d="M21 3 3 10l7 3 3 7 8-17Z"/><path d="m10 13 4-4"/>',
  'twitter': '<path d="M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.7-2.2 8 8 0 0 1-2.5 1A4 4 0 0 0 12 8.5a11.3 11.3 0 0 1-8.2-4.1 4 4 0 0 0 1.2 5.3A4 4 0 0 1 3 9v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.5a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.8Z"/>',
  'instagram': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  'facebook': '<path d="M14 9V7a2 2 0 0 1 2-2h2V2h-3a4 4 0 0 0-4 4v3H7v3h4v9h3v-9h3l1-3h-4Z"/>',
  'youtube': '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none"/>',
  'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>',
  'book-copy': '<path d="M5 4h11a2 2 0 0 1 2 2v14l-7.5-4L5 20V4Z"/><path d="M9 5v6l1.5-1L12 11V5"/>',
  'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  'award': '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/>',
  'zap': '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  'coffee': '<path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M5 5c0-1 .8-1.5.5-2.5"/><path d="M8 2.5C8 1 9 1 9 .5"/>',
  'sunrise': '<path d="M12 3v6M5 9H3m18 0h-2M5.6 12.6 4.2 11.2m15.6 1.4-1.4-1.4M3 19h18M7 19a5 5 0 0 1 10 0"/>',
  // Category (bento) icons
  'key': '<circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 9-9M15 4l3 3M12 7l2.5 2.5"/>',
  'hammer': '<path d="m15 12-8.5 8.5a1.8 1.8 0 0 1-2.5-2.5L12.5 9.5"/><path d="M14 4.5 19.5 10 22 7.5 16.5 2 14 4.5Zm0 0-2 2 5.5 5.5 2-2"/>',
  'map': '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
  'clock-history': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2M12 3v2"/>',
  'brain': '<path d="M9.5 3a3 3 0 0 0-3 3c-1.7.3-3 1.8-3 3.6 0 1 .4 1.9 1 2.6-.6.6-1 1.5-1 2.4A3.5 3.5 0 0 0 7 18c.4 1.7 1.9 3 3.8 3H12V3H9.5Z"/><path d="M14.5 3a3 3 0 0 1 3 3c1.7.3 3 1.8 3 3.6 0 1-.4 1.9-1 2.6.6.6 1 1.5 1 2.4A3.5 3.5 0 0 1 17 18c-.4 1.7-1.9 3-3.8 3H12V3h2.5Z"/>',
  'atom': '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
  'cpu': '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18M12 11v3"/>',
  'image-art': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 19 6-6 4 4 3-3 3 3"/>',
  'growth': '<path d="M12 21v-8"/><path d="M12 13c0-4 2.5-7 7-8-.5 4.5-3 7.5-7 8Z"/><path d="M12 13c0-3.4-2.1-6-6-6.8.4 3.8 2.5 6.3 6 6.8Z"/>',
  'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7M17.5 14.5a6.5 6.5 0 0 1 4 5.5"/>',
  'feather': '<path d="M20.2 3.8a5.5 5.5 0 0 0-7.8 0L4 12.2V20h7.8l8.4-8.4a5.5 5.5 0 0 0 0-7.8Z"/><path d="M16 8 4 20M13 11h5"/>',
  'compass': '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  'sparkle': '<path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5 12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
};

export function icon(name, { size = 18, cls = '', stroke = 1.75 } = {}) {
  const body = icons[name] || icons.info;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${body}</svg>`;
}

// Stars renderer (rating)
export function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = '<span class="rating" aria-label="Rated ' + rating.toFixed(1) + ' out of 5">';
  for (let i = 0; i < 5; i++) {
    if (i < full) out += icon('star-fill', { size: 14 });
    else if (i === full && half) out += icon('star-half', { size: 14 });
    else out += icon('star', { size: 14, cls: 'opacity-30' });
  }
  out += `<span class="rating__val">${rating.toFixed(1)}</span></span>`;
  return out;
}

// Interactive star picker for review forms. Clicking a star sets the rating.
export function renderStarsInput(value = 0) {
  let out = '<div class="star-input" role="radiogroup" aria-label="Choose a rating">';
  for (let i = 1; i <= 5; i++) {
    out += `<button type="button" data-val="${i}" class="star-input__btn ${i <= value ? 'is-active' : ''}" aria-label="${i} star${i > 1 ? 's' : ''}" title="${i} star${i > 1 ? 's' : ''}">${icon(i <= value ? 'star-fill' : 'star', { size: 22 })}</button>`;
  }
  out += '</div>';
  return out;
}
