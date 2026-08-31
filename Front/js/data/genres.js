// Genres / categories (spec §23, §94). Colors drive procedural cover art.
export const genres = [
  { id: 'fiction', name: 'Fiction', color: '#743C45', desc: 'Stories that map the interior lives of their characters.' },
  { id: 'mystery', name: 'Mystery', color: '#3F5246', desc: 'Puzzles of motive, memory, and consequence.' },
  { id: 'crime', name: 'Crime', color: '#5E2F37', desc: 'The line between law and its breaking.' },
  { id: 'adventure', name: 'Adventure', color: '#9C834F', desc: ' Journeys that test the limits of endurance.' },
  { id: 'history', name: 'History', color: '#B58A4C', desc: 'How the past quietly shapes the present.' },
  { id: 'philosophy', name: 'Philosophy', color: '#52685A', desc: 'Clear thinking about the hardest questions.' },
  { id: 'psychology', name: 'Psychology', color: '#6E6A64', desc: 'The architecture of the mind and behavior.' },
  { id: 'science', name: 'Science', color: '#5A7C9A', desc: 'The observable universe, explained.' },
  { id: 'technology', name: 'Technology', color: '#4A5A8A', desc: 'The tools that redefine what is possible.' },
  { id: 'business', name: 'Business', color: '#7A6A45', desc: 'How value is created, traded, and sustained.' },
  { id: 'biography', name: 'Biography', color: '#8A6B52', desc: 'A life examined, in full color.' },
  { id: 'art', name: 'Art', color: '#9A5A6A', desc: 'The making of meaning with form and color.' },
  { id: 'self', name: 'Self-Development', color: '#5A7A5F', desc: 'Practical wisdom for a life well directed.' },
  { id: 'ya', name: 'Young Adult', color: '#B0596A', desc: 'First thresholds into a wider world.' },
  { id: 'poetry', name: 'Poetry', color: '#6A5A8A', desc: 'Language distilled to its essential music.' }
];

export const genreById = Object.fromEntries(genres.map((g) => [g.id, g]));

// Curated background art per genre (themed, non-random). Centralized so the
// presentation layer only reads from here. If an image fails to load, the
// card falls back to the genre color gradient (handled in CSS/markup).
export const genreArt = {
  fiction:    { img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&q=60&auto=format&fit=crop', tag: 'Explore worlds' },
  mystery:    { img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=700&q=60&auto=format&fit=crop', tag: 'Solve puzzles' },
  crime:      { img: 'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=700&q=60&auto=format&fit=crop' },
  adventure:  { img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=60&auto=format&fit=crop', tag: 'Explore worlds' },
  history:    { img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=700&q=60&auto=format&fit=crop', tag: 'Discover the past' },
  business:   { img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=60&auto=format&fit=crop', tag: 'Explore markets' },
  'historical-fiction': { img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=700&q=60&auto=format&fit=crop', tag: 'Timeless tales' },
  'mystery-crime':      { img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1100&q=60&auto=format&fit=crop', tag: 'Crack the case' },
};

// Icon per genre id (reuses the site's single inline-SVG icon system).
export const genreIcon = {
  fiction: 'key', mystery: 'search', crime: 'hammer', adventure: 'map',
  history: 'clock-history', philosophy: 'sparkle', psychology: 'brain',
  science: 'atom', technology: 'cpu', business: 'briefcase',
  biography: 'image-art', art: 'image-art', self: 'growth', ya: 'users', poetry: 'feather',
};
