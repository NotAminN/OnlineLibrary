// Procedural book cover art (spec §64). Generates an editorial SVG cover
// keyed to the book's genre color + title. Deterministic per book id so a
// cover is stable across sessions. No external image dependencies.

import { genreById } from '../data/genres.js';
import { authorById } from '../data/authors.js';

const AUTHOR_NAMES = Object.fromEntries(Object.values(authorById).map((a) => [a.id, a.name]));

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Pick a motif by genre for visual variety.
const MOTIF = {
  fiction: 'arc', mystery: 'concentric', crime: 'wedge', adventure: 'peaks',
  history: 'columns', philosophy: 'orbit', psychology: 'spiral', science: 'lattice',
  technology: 'grid', business: 'bars', biography: 'portrait', art: 'swirl',
  self: 'path', ya: 'sun', poetry: 'lines'
};

function darken(hex, amt = 0.18) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r * (1 - amt)); g = Math.round(g * (1 - amt)); b = Math.round(b * (1 - amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function lighten(hex, amt = 0.35) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function motifSvg(motif, color) {
  const ink = '#ffffff';
  switch (motif) {
    case 'arc': return `<path d="M40 150 A110 110 0 0 1 260 150" fill="none" stroke="${ink}" stroke-width="2" opacity="0.5"/><circle cx="150" cy="150" r="60" fill="none" stroke="${ink}" stroke-width="2" opacity="0.35"/>`;
    case 'concentric': return [0, 1, 2, 3].map((i) => `<circle cx="150" cy="150" r="${34 + i * 34}" fill="none" stroke="${ink}" stroke-width="2" opacity="${0.5 - i * 0.1}"/>`).join('');
    case 'wedge': return `<path d="M150 40 L260 260 L40 260 Z" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/><path d="M150 90 L210 260 L90 260 Z" fill="none" stroke="${ink}" stroke-width="2" opacity="0.3"/>`;
    case 'peaks': return `<path d="M30 250 L100 120 L150 200 L210 90 L270 250 Z" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/>`;
    case 'columns': return [50, 90, 130, 170, 210, 250].map((x) => `<rect x="${x - 9}" y="80" width="18" height="160" rx="2" fill="none" stroke="${ink}" stroke-width="2" opacity="0.35"/>`).join('');
    case 'orbit': return `<circle cx="150" cy="150" r="70" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/><circle cx="150" cy="80" r="10" fill="${ink}" opacity="0.6"/><ellipse cx="150" cy="150" rx="110" ry="44" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.3"/>`;
    case 'spiral': return `<path d="M150 150 m0 0 a10 10 0 1 1 14 4 a24 24 0 1 1 -34 -8 a40 40 0 1 1 56 12" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/>`;
    case 'lattice': return Array.from({ length: 6 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => `<circle cx="${60 + c * 36}" cy="${60 + r * 36}" r="3" fill="${ink}" opacity="0.45"/>`).join('')).join('') + `<path d="M60 60 L240 240 M240 60 L60 240" stroke="${ink}" stroke-width="1" opacity="0.2"/>`;
    case 'grid': return Array.from({ length: 5 }).map((_, i) => `<line x1="50" y1="${55 + i * 50}" x2="250" y2="${55 + i * 50}" stroke="${ink}" stroke-width="1.5" opacity="0.3"/>`).join('') + Array.from({ length: 5 }).map((_, i) => `<line x1="${50 + i * 50}" y1="55" x2="${50 + i * 50}" y2="255" stroke="${ink}" stroke-width="1.5" opacity="0.3"/>`).join('');
    case 'bars': return [40, 80, 120, 160, 200].map((h, i) => `<rect x="${60 + i * 32}" y="${250 - h}" width="20" height="${h}" rx="2" fill="${ink}" opacity="${0.25 + i * 0.08}"/>`).join('');
    case 'portrait': return `<circle cx="150" cy="120" r="46" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/><path d="M86 250 a64 64 0 0 1 128 0" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/>`;
    case 'swirl': return `<path d="M150 150 C 200 120, 200 80, 150 80 C 100 80, 100 150, 150 150 C 200 150, 200 200, 150 200 C 70 200, 70 110, 150 110" fill="none" stroke="${ink}" stroke-width="2" opacity="0.35"/>`;
    case 'path': return `<path d="M40 220 C 110 120, 120 60, 200 60 S 270 180, 240 240" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/>`;
    case 'sun': return `<circle cx="150" cy="150" r="50" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4"/>` + Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${150 + Math.cos(a) * 60}" y1="${150 + Math.sin(a) * 60}" x2="${150 + Math.cos(a) * 84}" y2="${150 + Math.sin(a) * 84}" stroke="${ink}" stroke-width="2" opacity="0.3"/>`; }).join('');
    case 'lines': return Array.from({ length: 7 }).map((_, i) => `<line x1="40" y1="${70 + i * 24}" x2="${260 - (i % 3) * 30}" y2="${70 + i * 24}" stroke="${ink}" stroke-width="2" opacity="${0.5 - i * 0.05}"/>`).join('');
    default: return `<circle cx="150" cy="150" r="60" fill="none" stroke="${ink}" stroke-width="2" opacity="0.35"/>`;
  }
}

// Returns an SVG string sized to 2:3 cover ratio (300x450).
// Designed to look like a real cloth-bound book: paper grain, foil band,
// centered serif title, hairline rule, monogram, publisher mark, year.
export function coverSVG(book) {
  const genre = genreById[book.genre] || { color: '#743C45', name: 'Fiction' };
  const color = genre.color;
  const dark = darken(color, 0.34);
  const ink = '#F7F4EE';
  const softInk = 'rgba(247,244,238,0.78)';
  const h = hash(book.id);
  const motif = MOTIF[book.genre] || 'arc';
  const baseId = `c${(h % 99999).toString(36)}`;
  // Three layout variants so different books feel distinct but coherent.
  const layout = h % 3; // 0 centered, 1 top-heavy, 2 bottom-anchored
  const titleLines = wrapTitle(book.title, layout === 0 ? 14 : 16);
  const authorFull = authorName(book.author);
  const initials = authorFull.split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
  const year = book.publicationYear || '';
  const titleSize = layout === 0 ? 26 : layout === 1 ? 28 : 24;
  const titleLh = Math.round(titleSize * 1.05);
  const titleY = layout === 0
    ? 240 + Math.max(0, (3 - titleLines.length) * 14)
    : layout === 1 ? 210 : 320;
  const titleSvg = titleLines.map((line, i) =>
    `<text x="150" y="${titleY + i * titleLh}" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="${titleSize}" font-weight="700" fill="${ink}" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('');
  const ruleY = layout === 0 ? 218 : layout === 1 ? 188 : 298;
  const rule = `<line x1="120" y1="${ruleY}" x2="180" y2="${ruleY}" stroke="${ink}" stroke-width="0.8" opacity="0.7"/>`;
  const authorY = titleY + titleLines.length * titleLh + 24;
  const authorSvg = `<text x="150" y="${authorY}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" letter-spacing="2.4" fill="${softInk}">${escapeXml(initials)} &#x00B7; ${escapeXml(authorFull.toUpperCase())}</text>`;
  const eyebrow = `<text x="150" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" letter-spacing="3" fill="${softInk}">${escapeXml(genre.name.toUpperCase())}</text>`;
  const monogram = `<text x="32" y="44" font-family="Playfair Display, Georgia, serif" font-size="18" fill="${ink}" opacity="0.85">L</text><line x1="50" y1="34" x2="50" y2="54" stroke="${ink}" stroke-width="0.8" opacity="0.6"/>`;
  const yearLine = `<text x="32" y="432" font-family="Inter, sans-serif" font-size="9" letter-spacing="2" fill="${softInk}">${escapeXml(String(year))}</text><text x="268" y="432" text-anchor="end" font-family="Inter, sans-serif" font-size="9" letter-spacing="2" fill="${softInk}">LUMINA PRESS</text>`;
  const spine = `<rect x="0" y="0" width="6" height="450" fill="rgba(0,0,0,0.18)"/><rect x="0" y="0" width="6" height="450" fill="url(#${baseId}_hi)"/>`;
  return `<svg viewBox="0 0 300 450" width="300" height="450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Cover of ${escapeXml(book.title)}">
    <defs>
      <linearGradient id="${baseId}_bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}"/>
        <stop offset="1" stop-color="${dark}"/>
      </linearGradient>
      <linearGradient id="${baseId}_hi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.25)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,0)"/>
        <stop offset="1" stop-color="rgba(0,0,0,0.2)"/>
      </linearGradient>
      <pattern id="${baseId}_grain" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="transparent"/>
        <circle cx="1" cy="1" r="0.4" fill="rgba(255,255,255,0.04)"/>
        <circle cx="4" cy="3" r="0.4" fill="rgba(0,0,0,0.05)"/>
      </pattern>
    </defs>
    <rect width="300" height="450" fill="url(#${baseId}_bg)"/>
    <rect width="300" height="450" fill="url(#${baseId}_grain)"/>
    <rect x="18" y="78" width="264" height="294" fill="none" stroke="${ink}" stroke-width="0.8" opacity="0.35" rx="2"/>
    <g opacity="0.55"><g transform="translate(0,0)">${motifSvg(motif, color)}</g></g>
    <rect x="18" y="78" width="264" height="294" fill="${dark}" opacity="0.18"/>
    ${spine}
    ${eyebrow}
    ${monogram}
    ${rule}
    ${titleSvg}
    ${authorSvg}
    ${yearLine}
  </svg>`;
}

export function authorName(authorId) {
  return AUTHOR_NAMES[authorId] || 'Unknown';
}

function wrapTitle(title, maxLine = 16) {
  const words = title.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLine && cur) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
function escapeXml(s) { return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])); }

// Real cover image via the Open Library Covers API, keyed to the book's ISBN,
// so the image always matches the exact title and author in the catalog.
export function coverUrl(book) {
  if (!book?.isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`;
}

// Procedural SVG fallback, used if the real cover cannot be loaded.
export function coverFallbackUri(book) {
  const uri = 'data:image/svg+xml;utf8,' + encodeURIComponent(coverSVG(book));
  // Make it safe to embed inside a double-quoted onerror attribute.
  return uri.replace(/'/g, '%27');
}

// Primary <img src> for a book cover: real artwork when available.
export function coverDataUri(book) {
  return coverUrl(book) || coverFallbackUri(book);
}
