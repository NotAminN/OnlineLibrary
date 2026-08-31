import { authorPortraitUrl } from '../Front/js/data/authorPortraits.js';
import { readFileSync } from 'fs';

// Pull the raw map so we can test every URL including nulls.
const src = readFileSync(new URL('../Front/js/data/authorPortraits.js', import.meta.url), 'utf8');
const names = [...src.matchAll(/'([^']+)':/g)].map((m) => m[1]).filter((n) => !['width'].includes(n));

let bad = 0, ok = 0, none = 0;
for (const n of names) {
  const url = authorPortraitUrl(n);
  if (!url) { none++; console.log('NO-FREE-IMAGE:', n); continue; }
  try {
    const res = await fetch(url, { method: 'GET' });
    const type = res.headers.get('content-type') || '';
    if (res.ok && type.startsWith('image')) ok++;
    else { bad++; console.log('BAD:', n, res.status, type, url.slice(0, 120)); }
  } catch (e) { bad++; console.log('ERR:', n, e.message, url.slice(0, 120)); }
  await new Promise((r) => setTimeout(r, 350));
}
console.log(`total=${names.length} ok=${ok} noImage=${none} bad=${bad}`);
