// Generates genuine, readable chapter prose for the reader (spec §32, §94).
// No Lorem ipsum: text is assembled from literary sentence pools, seeded by
// the chapter so it is stable across sessions and bookmark positions.

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const OPEN = [
  'It began, as these things often do, with a small and unremarkable decision.',
  'There is a particular silence that arrives just before something changes.',
  'She had learned to read the room the way others read the weather.',
  'The morning arrived without ceremony, and with it, the old question.',
  'What followed could not have been predicted from the first, quiet hour.',
  'He understood, later, that this was the moment everything turned.',
  'Memory is an unreliable narrator, and yet we trust it with our lives.',
  'The letter had been waiting longer than anyone cared to admit.'
];
const OBS = [
  'The light through the window fell in a way that suggested an ending.',
  'A detail, overlooked until now, proved to be the whole of the matter.',
  'The city outside continued its indifferent and beautiful routine.',
  'Something in the arrangement of the room felt deliberately unfinished.',
  'Time, which had been generous, suddenly grew exacting.',
  'The words on the page seemed to belong to someone else entirely.',
  'A name, spoken aloud, carried more weight than it should have.',
  'The distance between two people narrowed, then opened again.',
  'What had seemed certain now looked like a story told too soon.',
  'The silence between them was its own kind of conversation.'
];
const TURN = [
  'And still, the decision had to be made.',
  'So she did the only thing left that was honest.',
  'He chose, against his better judgment, to keep going.',
  'It was, in the end, a question of who they were willing to become.',
  'They agreed, without saying so, to let the night decide.',
  'What happened next was not what either of them expected.'
];
const CLOSE = [
  'By the time the hour ended, the shape of the day had changed.',
  'When at last she looked up, the room was different somehow.',
  'The moment passed, but it left its weather behind.',
  'He would remember this long after the reasons had faded.',
  'And in that small way, something was finally settled.',
  'It would be enough, for now, to have understood this much.'
];

const GENRE_TONE = {
  fiction: ['a quiet', 'an inward', 'a tender', 'a careful'],
  mystery: ['an unsolved', 'a hidden', 'a withheld', 'a deliberate'],
  crime: ['a guilty', 'a buried', 'a reckless', 'a calculated'],
  adventure: ['a wild', 'an open', 'a perilous', 'a restless'],
  history: ['a forgotten', 'a recorded', 'an archived', 'a recovered'],
  philosophy: ['a reasoned', 'an examined', 'a doubtful', 'a deliberate'],
  psychology: ['an observed', 'a measured', 'a quieted', 'a restless'],
  science: ['a measured', 'an observed', 'a patient', 'a luminous'],
  technology: ['a built', 'an automated', 'a designed', 'a coded'],
  business: ['a durable', 'a patient', 'a small', 'a deliberate'],
  biography: ['a lived', 'a recovered', 'a hidden', 'a documented'],
  art: ['a painted', 'a composed', 'a colored', 'an imagined'],
  self: ['a practiced', 'a gentle', 'a daily', 'a steady'],
  ya: ['a first', 'a last', 'a restless', 'a golden'],
  poetry: ['a lyrical', 'a quiet', 'a brief', 'a luminous']
};

function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Build a paragraph around a seed phrase. `rnd` deterministic per (book,chapter,para).
function makeParagraph(seedWords, tone, rnd) {
  const sentences = [];
  sentences.push(cap(pick(rnd, OPEN)));
  // weave a seed-derived clause
  const n = seedWords.length;
  const idx = Math.floor(rnd() * n);
  const w = seedWords[idx];
  const clause = pick(rnd, [
    `It was a thing bound up with ${w}.`,
    `No one could explain ${w}, and that was the point.`,
    `She kept returning to ${w}, as if it held the answer.`,
    `${cap(w)} was not what it appeared to be.`,
    `They spoke of ${w} only when no one was listening.`
  ]);
  sentences.push(clause);
  sentences.push(cap(pick(rnd, OBS)));
  if (rnd() > 0.5) sentences.push(cap(pick(rnd, OBS)));
  sentences.push(cap(pick(rnd, TURN)));
  sentences.push(cap(pick(rnd, CLOSE)));
  return sentences.join(' ');
}

// Public: generate an array of paragraph strings for a chapter.
export function generateChapterText(book, chapterIndex, paragraphCount = 6) {
  const ch = book.chapters[chapterIndex];
  if (!ch) return [];
  const key = `${book.id}:${chapterIndex}:${ch.title}`;
  const rnd = mulberry32(hashStr(key));
  const tone = (GENRE_TONE[book.genre] || GENRE_TONE.fiction);
  // extract simple words from the seed for weaving
  const stop = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'and', 'that', 'with', 'is', 'was', 'she', 'he', 'it', 'they', 'her', 'his', 'on', 'at', 'by', 'for', 'from', 'as', 'but', 'not', 'no', 'one', 'who', 'what', 'when', 'where', 'why', 'how', 'into', 'out', 'this', 'their']);
  const seedWords = ch.seed.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter((w) => w.length > 3 && !stop.has(w));
  const paras = [];
  for (let i = 0; i < paragraphCount; i++) paras.push(makeParagraph(seedWords.length ? seedWords : ['the quiet', 'the past', 'the light'], tone, rnd));
  return paras;
}
