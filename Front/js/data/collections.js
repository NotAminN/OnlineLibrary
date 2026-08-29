// Curated collections (spec §29, §94 — at least 8).
export const collections = [
  { id: 'c-modern-classics', title: 'Modern Classics', subtitle: 'EDITOR’S COLLECTION', desc: 'Books from the last two decades that already feel permanent. Quietly essential, endlessly rereadable.', bookIds: ['b-the-tenth-quiet', 'b-city-of-ideas', 'b-inheritance-of-rooms', 'b-river-of-words', 'b-cartographer-of-souls', 'b-widow-of-rooms'] },
  { id: 'c-essential-mysteries', title: 'Essential Mysteries', subtitle: 'FOR THE CURIOUS', desc: 'Cases that reward patience. Locked rooms, cold cases, and the slow pleasure of the solution.', bookIds: ['b-north-window', 'b-cold-case', 'b-long-reckoning', 'b-garden-detective'] },
  { id: 'c-perspective', title: 'Books That Change Perspective', subtitle: 'FOR THE OPEN-MINDED', desc: 'Titles that rearrange how you see a familiar thing — a habit, a city, a sentence.', bookIds: ['b-second-law', 'b-attention', 'b-cosmos-within', 'b-first-light-of-reason', 'b-quiet-severance'] },
  { id: 'c-quiet-evening', title: 'Stories for a Quiet Evening', subtitle: 'UNWIND', desc: 'Warm, contained, and made to be read by lamplight. No cliffhangers required.', bookIds: ['b-coast-road', 'b-weight-of-snow', 'b-lighthouse-letters', 'b-still-water', 'b-shape-of-joy'] },
  { id: 'c-historical', title: 'Great Historical Reads', subtitle: 'LOOK BACK', desc: 'The past, recovered with rigor and told with the pace of a novel.', bookIds: ['b-ledger-of-tides', 'b-tides-of-empire', 'b-her-own-ink', 'b-quiet-republic', 'b-her-handwriting'] },
  { id: 'c-philosophy', title: 'Introduction to Philosophy', subtitle: 'START HERE', desc: 'A gentle on-ramp to thinking clearly about the hardest questions.', bookIds: ['b-city-of-ideas', 'b-quiet-severance', 'b-first-light-of-reason', 'b-short-history-of-doubt'] },
  { id: 'c-science', title: 'Science Worth Understanding', subtitle: 'WONDER', desc: 'The universe, explained with patience and without condescension.', bookIds: ['b-second-law', 'b-cosmos-within', 'b-quantum-gardens', 'b-machines-we-trust', 'b-sleeping-cities'] },
  { id: 'c-new-voices', title: 'New Voices of 2024', subtitle: 'FRESH', desc: 'The debut and recent work defining this year’s conversation.', bookIds: ['b-still-water', 'b-coast-road', 'b-science-of-sleep', 'b-last-translator', 'b-shape-of-joy', 'b-guide-to-getting-lost'] },
  { id: 'c-mind-matters', title: 'The Reading Mind', subtitle: 'SELF', desc: 'On attention, rest, and the quiet discipline of a steady inner life.', bookIds: ['b-attention', 'b-mind-in-balance', 'b-science-of-sleep', 'b-guide-to-getting-lost'] }
];

export const collectionById = Object.fromEntries(collections.map((c) => [c.id, c]));
