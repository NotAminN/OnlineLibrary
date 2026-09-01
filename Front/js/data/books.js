// 43 real books. Covers load from the Open Library Covers API by ISBN, so
// every cover image matches the exact title and author shown. Each chapter
// holds a `seed` used by the reader's prose generator to produce readable text.
export const books = [
  {
    id: 'b-the-tenth-quiet', title: 'To Kill a Mockingbird', author: 'a-harper-lee', genre: 'fiction',
    description: 'A childhood in Depression-era Alabama becomes the frame for one of literature\'s great moral trials, as lawyer Atticus Finch defends an innocent man and teaches his children what courage means.',
    tags: ['classic', 'justice', 'coming-of-age'], rating: 4.3, pages: 336, publicationYear: 1960, language: 'English', isNew: true, isPopular: true, editorPick: true, isbn: '9780099549482',
    chapters: [
      { title: 'Part One', seed: 'Maycomb in the 1930s seen through a child\'s eyes, where Boo Radley is a rumor and summers are long' },
      { title: 'Part Two', seed: 'Atticus takes the case nobody in town wants him to take and explains why to his children' },
      { title: 'Part Three', seed: 'the trial of Tom Robinson unfolds in a courtroom where the verdict is decided before it begins' },
      { title: 'Part Four', seed: 'the aftermath, and what a man named Boo Radley finally shows them about their neighbors' }
    ]
  },
  {
    id: 'b-north-window', title: 'And Then There Were None', author: 'a-christie', genre: 'mystery',
    description: 'Ten strangers are invited to an island off the Devon coast. One by one, they begin to die — each in the manner of a nursery rhyme hanging on the wall. The defining locked-circle mystery.',
    tags: ['classic', 'locked-island', 'puzzle'], rating: 4.3, pages: 272, publicationYear: 1939, language: 'English', isPopular: true, isbn: '9780062073488',
    chapters: [
      { title: 'Part One', seed: 'ten guests arrive on Soldier Island, each lured by a different lie, and a recorded voice names their crimes' },
      { title: 'Part Two', seed: 'the first death is ruled accidental, but the nursery rhyme on the wall is being followed exactly' },
      { title: 'Part Three', seed: 'panic sets in as the count dwindles and everyone realizes the killer must be one of them' },
      { title: 'Part Four', seed: 'a confession in a bottle explains the method, the motive, and the impossible arithmetic of guilt' }
    ]
  },
  {
    id: 'b-ledger-of-tides', title: 'Sapiens', author: 'a-harari', genre: 'history',
    description: 'A sweeping account of how an insignificant African ape came to dominate the planet — through cognitive revolutions, agricultural gambles, and fictions like money, empire, and law.',
    tags: ['big-history', 'anthropology', 'civilization'], rating: 4.4, pages: 464, publicationYear: 2011, language: 'English', isPopular: true, isbn: '9780062316097',
    chapters: [
      { title: 'Part One', seed: 'the cognitive revolution, and how shared fictions made large-scale cooperation possible' },
      { title: 'Part Two', seed: 'the agricultural revolution as history\'s most successful fraud, told from the perspective of the wheat' },
      { title: 'Part Three', seed: 'money, empires, and religion as imagined orders that bind strangers into a single society' },
      { title: 'Part Four', seed: 'the scientific revolution, capitalism, and whether we are happier than our ancestors' }
    ]
  },
  {
    id: 'b-second-law', title: 'A Brief History of Time', author: 'a-hawking', genre: 'science',
    description: 'Hawking guides readers from Aristotle to black holes and imaginary time, asking where the universe came from and whether it has an edge — without a single equation beyond E = mc².',
    tags: ['cosmology', 'physics', 'classic'], rating: 4.2, pages: 212, publicationYear: 1988, language: 'English', isNew: true, isbn: '9780553380163',
    chapters: [
      { title: 'Part One', seed: 'from Aristotle to Newton, how our picture of the universe was built by asking better questions' },
      { title: 'Part Two', seed: 'space and time are not a stage but actors, curved by mass and bent by motion' },
      { title: 'Part Three', seed: 'black holes are not black, and what escapes them tells us where the universe keeps its information' },
      { title: 'Part Four', seed: 'the arrow of time, imaginary time, and why the universe may need no beginning at all' }
    ]
  },
  {
    id: 'b-still-water', title: 'milk and honey', author: 'a-kaur', genre: 'poetry',
    description: 'A collection of poetry and prose about survival, love, loss, and femininity — four movements that walk from the bitterest hurt to the sweetest healing.',
    tags: ['collection', 'love', 'healing'], rating: 4.1, pages: 208, publicationYear: 2014, language: 'English', isNew: true, isPopular: true, editorPick: true, isbn: '9781449474256',
    chapters: [
      { title: 'The Hurting', seed: 'poems of childhood wounds and the silences families keep' },
      { title: 'The Loving', seed: 'falling into love as an act of trust and surrender' },
      { title: 'The Breaking', seed: 'the end of love, and the self that remains after it leaves' },
      { title: 'The Healing', seed: 'learning to hold yourself, gently, in your own hands' }
    ]
  },
  {
    id: 'b-attention', title: 'Thinking, Fast and Slow', author: 'a-kahneman', genre: 'psychology',
    description: 'A Nobel laureate\'s lifetime of research distilled: the fast, intuitive System 1 and the slow, deliberate System 2 — and the biases that arise whenever the two disagree about reality.',
    tags: ['cognition', 'bias', 'decision-making'], rating: 4.1, pages: 499, publicationYear: 2011, language: 'English', isPopular: true, isbn: '9780374533557',
    chapters: [
      { title: 'Part One', seed: 'two characters in the mind, the effortless intuitor and the lazy deliberate thinker' },
      { title: 'Part Two', seed: 'heuristics and biases, why we judge by ease and answer an easier question than the one asked' },
      { title: 'Part Three', seed: 'overconfidence, the illusion of validity, and the failure of expert prediction' },
      { title: 'Part Four', seed: 'two selves, experiencing and remembering, and why the ending decides the story' }
    ]
  },
  {
    id: 'b-whiteout', title: 'Into the Wild', author: 'a-krakauer', genre: 'adventure',
    description: 'In 1992 a young idealist named Christopher McCandless walked into the Alaskan wilderness carrying little more than a rifle and a copy of Tolstoy. Krakauer reconstructs the journey and the pull that led to it.',
    tags: ['nonfiction', 'wilderness', 'true-story'], rating: 4.0, pages: 224, publicationYear: 1996, language: 'English', isPopular: true, isbn: '9780385486804',
    chapters: [
      { title: 'Part One', seed: 'a decomposed body found in an abandoned bus, and the hitchhiker who left no address behind' },
      { title: 'Part Two', seed: 'the two years of wandering that led Chris McCandless from Atlanta across the American west' },
      { title: 'Part Three', seed: 'the trail of letters and kindnesses he left behind, and the family that never stopped looking' },
      { title: 'Part Four', seed: 'the months inside the magic bus, the river that became a wall, and what the wild finally said back' }
    ]
  },
  {
    id: 'b-muralists', title: 'The Story of Art', author: 'a-gombrich', genre: 'art',
    description: 'The most famous art book in the world: Gombrich\'s single, continuous narrative from cave paintings to modernism, written to make the reader look — really look — for the first time.',
    tags: ['art-history', 'classic', 'illustrated'], rating: 4.4, pages: 688, publicationYear: 1950, language: 'English', isbn: '9780714832470',
    chapters: [
      { title: 'Part One', seed: 'strange beginnings, how prehistoric and tribal art served ritual before it served beauty' },
      { title: 'Part Two', seed: 'greece, rome, and the discovery that art could aim at what the eye actually sees' },
      { title: 'Part Three', seed: 'the renaissance and the long conquest of visual truth, from Giotto to Rembrandt' },
      { title: 'Part Four', seed: 'the modern revolt, when artists stopped imitating appearances and started questioning the frame itself' }
    ]
  },
  {
    id: 'b-small-team', title: 'Zero to One', author: 'a-thiel', genre: 'business',
    description: 'Notes on startups, or how to build the future: Thiel argues that real progress comes not from copying what works but from creating something entirely new — going from zero to one.',
    tags: ['startups', 'innovation', 'contrarian'], rating: 4.1, pages: 224, publicationYear: 2014, language: 'English', isbn: '9780804139298',
    chapters: [
      { title: 'Part One', seed: 'every moment in business happens only once, and monopoly, not competition, is the goal' },
      { title: 'Part Two', seed: 'why last-mover advantage beats first-mover, and how a company is valued by its future cash flows' },
      { title: 'Part Three', seed: 'secrets still exist, and finding one is the beginning of every great company' },
      { title: 'Part Four', seed: 'founders, sales, and the seven questions every business must answer before it begins' }
    ]
  },
  {
    id: 'b-city-of-ideas', title: 'Meditations', author: 'a-marcus-aurelius', genre: 'philosophy',
    description: 'The private notebooks of a Roman emperor, written on campaign and never meant for publication — the most intimate surviving record of Stoic philosophy practiced daily.',
    tags: ['stoicism', 'classic', 'ethics'], rating: 4.2, pages: 304, publicationYear: 180, language: 'English', isbn: '9780140449334',
    chapters: [
      { title: 'Part One', seed: 'debts and lessons, a catalogue of what family and teachers gave him before he faced the world' },
      { title: 'Part Two', seed: 'begin each day by telling yourself you will meet the interfering, the ungrateful, the arrogant' },
      { title: 'Part Three', seed: 'the obstacle is the way, and the mind that withdraws into itself needs no retreat' },
      { title: 'Part Four', seed: 'death, the brevity of fame, and doing the work of a human being without expectation of witness' }
    ]
  },
  {
    id: 'b-cold-case', title: 'The Girl with the Dragon Tattoo', author: 'a-larsson', genre: 'crime',
    description: 'A disgraced journalist and a brilliant, hostile hacker investigate a forty-year-old disappearance inside a powerful industrial family — and uncover a corridor of violence no one wanted opened.',
    tags: ['thriller', 'investigation', 'sweden'], rating: 4.1, pages: 672, publicationYear: 2005, language: 'English', isbn: '9780307454546',
    chapters: [
      { title: 'Part One', seed: 'a journalist loses a libel case, and a stranger begins compiling his entire life on paper' },
      { title: 'Part Two', seed: 'an old man asks him to solve the disappearance of a niece forty years after she vanished' },
      { title: 'Part Three', seed: 'the researcher with the dragon tattoo breaks through, and the family album starts to confess' },
      { title: 'Part Four', seed: 'a killer is found, but the case turns back on the investigator before the Vanger file can close' }
    ]
  },
  {
    id: 'b-cosmos-within', title: 'Cosmos', author: 'a-sagan', genre: 'science',
    description: 'Sagan\'s luminous tour of fifteen billion years of cosmic evolution — from the library of Alexandria to the Voyager golden record — a book that taught a generation to feel the scale of the universe.',
    tags: ['astronomy', 'classic', 'science-communication'], rating: 4.4, pages: 396, publicationYear: 1980, language: 'English', isbn: '9780345539434',
    chapters: [
      { title: 'Part One', seed: 'the shore of the cosmic ocean, and how far a beam of light travels in a human lifetime' },
      { title: 'Part Two', seed: 'the library of Alexandria and the scientists who first measured the world with shadows and wells' },
      { title: 'Part Three', seed: 'planets as worlds, and the Voyager spacecraft carrying earth\'s greeting to the stars' },
      { title: 'Part Four', seed: 'evolution of the brain, the lives of the stars, and who speaks for earth' }
    ]
  },
{
    id: 'b-coast-road', title: 'The Hunger Games', author: 'a-suzanne-collins', genre: 'ya',
    description: 'In a ruined future America, Katniss Everdeen volunteers for a televised fight to the death in place of her sister — and turns an act of love into the spark of a rebellion.',
    tags: ['dystopia', 'survival', 'rebellion'], rating: 4.3, pages: 374, publicationYear: 2008, language: 'English', isbn: '9780439023481',
    chapters: [
      { title: 'Part One', seed: 'the reaping in district twelve, a name called in the square, and a sister stepping forward to die' },
      { title: 'Part Two', seed: 'the capitol, the training, and a strategy built on being unforgettable rather than strong' },
      { title: 'Part Three', seed: 'the arena begins, alliances form and burn, and every sponsor gift carries a message' },
      { title: 'Part Four', seed: 'two winners instead of one, a rule revoked, and berries that become an act of defiance' }
    ]
  },
  {
    id: 'b-factory-of-tomorrow', title: 'The Innovator\'s Dilemma', author: 'a-christensen', genre: 'technology',
    description: 'Why do great companies fail precisely when they do everything right? Christensen\'s theory of disruptive innovation explains why listening to your best customers can destroy your business.',
    tags: ['disruption', 'management', 'classic'], rating: 4.2, pages: 336, publicationYear: 1997, language: 'English', isbn: '9780062060242',
    chapters: [
      { title: 'Part One', seed: 'why good management is exactly the wrong response, told through the failure of disk-drive makers' },
      { title: 'Part Two', seed: 'sustaining versus disruptive technologies, and the value networks that blind incumbents' },
      { title: 'Part Three', seed: 'how excavators, steel mills, and motorcycles prove the pattern across industries' },
      { title: 'Part Four', seed: 'managing disruptive change, small bets in small markets, and the resources of a new growth engine' }
    ]
  },
  {
    id: 'b-her-own-ink', title: 'Steve Jobs', author: 'a-isaacson', genre: 'biography',
    description: 'The definitive biography, drawn from more than forty interviews with Jobs and hundreds with family, friends, rivals, and colleagues — a portrait of genius, obsession, and its costs.',
    tags: ['business', 'innovation', 'biography'], rating: 4.3, pages: 656, publicationYear: 2011, language: 'English', isbn: '9781451648539',
    chapters: [
      { title: 'Part One', seed: 'adopted, unlovely, and fascinated by the garages of a california valley learning to build futures' },
      { title: 'Part Two', seed: 'apple\'s founding, the garage, and a temperament that divided the world into geniuses and bozos' },
      { title: 'Part Three', seed: 'exile from his own company, the wilderness years, and the animation studio that saved him' },
      { title: 'Part Four', seed: 'the return, the imac, the iphone, and a design philosophy that bent technology to taste' }
    ]
  },
{
    id: 'b-inheritance-of-rooms', title: 'Pride and Prejudice', author: 'a-jane-austen', genre: 'fiction',
    description: 'Elizabeth Bennet has principles; Mr. Darcy has pride and a large estate. Austen\'s comedy of manners turns a country dance into a negotiation about money, class, and the slow education of two stubborn hearts.',
    tags: ['classic', 'romance', 'satire'], rating: 4.3, pages: 480, publicationYear: 1813, language: 'English', isbn: '9780141439518',
    chapters: [
      { title: 'Part One', seed: 'a new neighbor arrives at netherfield and the whole village rearranges itself around his income' },
      { title: 'Part Two', seed: 'a first insult at a dance becomes the lens through which every later kindness is misread' },
      { title: 'Part Three', seed: 'a proposal refused in the rain, and a letter that begins the long correction of a judgment' },
      { title: 'Part Four', seed: 'pemberley, a scandal, and the discovery that pride and prejudice were shared between them' }
    ]
  },
  {
    id: 'b-science-of-sleep', title: 'Quiet', author: 'a-susan-cain', genre: 'psychology',
    description: 'At least a third of us are introverts, and the world is built for the other two-thirds. Cain\'s landmark book makes the case for the power of the quiet in a culture that can\'t stop talking.',
    tags: ['introversion', 'temperament', 'society'], rating: 4.1, pages: 368, publicationYear: 2012, language: 'English', isbn: '9780307352156',
    chapters: [
      { title: 'Part One', seed: 'the extrovert ideal, from Dale Carnegie to the open-plan office, and who it leaves behind' },
      { title: 'Part Two', seed: 'the biology of temperament, high-reactive infants, and how temperament is neither destiny nor nothing' },
      { title: 'Part Three', seed: 'do all cultures have an extrovert ideal, from a wall street pitch to a quiet temple in california' },
      { title: 'Part Four', seed: 'how to love, teach, and parent the quiet, and when to act out of character for something you believe in' }
    ]
  },
  {
    id: 'b-avant-garde', title: 'Ways of Seeing', author: 'a-berger', genre: 'art',
    description: 'A short, radical book about looking: how oil painting served property and publicity, how the nude is seen, and how the camera changed what an image is forever.',
    tags: ['criticism', 'media', 'classic'], rating: 4.0, pages: 176, publicationYear: 1972, language: 'English', isbn: '9780141035796',
    chapters: [
      { title: 'Part One', seed: 'the act of looking comes before words, and the reciprocal nature of vision is where meaning begins' },
      { title: 'Part Two', seed: 'the nude, and how being seen by others became a convention of European painting' },
      { title: 'Part Three', seed: 'oil painting as a celebration of private property, owning images as a way of owning the world' },
      { title: 'Part Four', seed: 'publicity, glamour, and the advertisement as the last great art form of consumer happiness' }
    ]
  },
  {
    id: 'b-the-quiet-severance', title: 'Man\'s Search for Meaning', author: 'a-frankl', genre: 'philosophy',
    description: 'A psychiatrist\'s memoir of surviving the Nazi death camps and the psychology he built from it: those who found meaning in suffering could endure almost anything — and meaning is available to everyone.',
    tags: ['memoir', 'holocaust', 'meaning'], rating: 4.4, pages: 200, publicationYear: 1946, language: 'English', isbn: '9780807014295',
    chapters: [
      { title: 'Part One', seed: 'arrival at auschwitz, and the stripping away of everything except the last human freedom' },
      { title: 'Part Two', seed: 'the phases of a prisoner\'s mind, from shock to apathy to the strange suffering of liberation' },
      { title: 'Part Three', seed: 'logotherapy, will to meaning, and why happiness cannot be pursued but only ensue' },
      { title: 'Part Four', seed: 'the tragic triad of pain, guilt, and death, and how to turn suffering into achievement' }
    ]
  },
];

// Remaining real books, defined compactly and expanded to the same schema.
const REST = [
  ['b-the-long-reckoning', 'The Big Sleep', 'a-chandler', 'crime',
    'When the Sternwood family hires Philip Marlowe to trace a blackmail debt, the detective finds two sisters, a vanished chauffeur, and more murder than anyone paid for.',
    ['noir', 'detective', 'classic'], 4.0, 274, 1939, '9780241956281', {},
    ['a dying general, a case of blackmail, and marlowe walking into the Sternwood garden for the first time',
     'the bookshop, the missing chauffeur, and a body pulled from an oil sump off the coast road',
     'a pornographer, a gambler, and the truth about where the rain never falls',
     'the last confession, and why some cases are solved by refusing to hand them over']],
  ['b-tides-of-empire', 'Long Walk to Freedom', 'a-mandela', 'biography',
    'Mandela tells his own story: a village boyhood, the law practice that made him a revolutionary, twenty-seven years in prison, and the Presidency that forgave the jailer.',
    ['autobiography', 'apartheid', 'leadership'], 4.4, 656, 1994, '9780316548182', {},
    ['a thrashing ox and a childhood in the transkei, where stories of ancestors kept courage alive',
     'johannesburg, the law firm, and the slow discovery that freedom was a conversation with the state',
     'rivonia, the dock, and the speech from which only a biography of prison could follow',
     'robben island, the lime quarry, and twenty-seven years spent making prison into a university']],
  ['b-quantum-gardens', 'The Selfish Gene', 'a-dawkins', 'science',
    'Dawkins rewrites the logic of evolution from the gene\'s point of view: bodies are survival machines, altruism has a ledger, and memes are ideas that reproduce like organisms.',
    ['evolution', 'biology', 'classic'], 4.2, 360, 1976, '9780198788607', {},
    ['why are people, and the primordial soup where a replicator first learned to copy itself',
     'survival machines, and how a gene that helps another can still be selfish',
     'aggression, the stable strategy, and why animals rarely fight to the death',
     'the meme, a new replicator, and what happens when ideas start evolving in us']],
  ['b-river-of-words', 'One Hundred Years of Solitude', 'a-marquez', 'fiction',
    'The Buendía family builds Macondo out of hope and repeats itself for a century — wars, golden fish, ascensions, and the rain of yellow flowers that marks love remembered.',
    ['magical-realism', 'family-saga', 'classic'], 4.3, 417, 1967, '9780060883287', {},
    ['a founding family haunted by the memory of incest, and a gypsy who brings magnets to a village of adobe houses',
     'colonel aureliano buendía fights thirty-two wars and loses every one of them',
     'the banana company arrives with trains and fever, and leaves three thousand people in a freight car',
     'the last aureliano reads the manuscripts of melquíades as the wind takes macondo away']],
  ['b-mind-in-balance', 'Atomic Habits', 'a-clear', 'self',
    'Tiny changes, remarkable results: Clear\'s four laws of behavior change turn identity, not motivation, into the engine of habit — one percent better every day.',
    ['habits', 'behavior', 'productivity'], 4.3, 320, 2018, '9780735211292', {},
    ['the surprising power of atomic habits, and why systems beat goals every single time',
     'make it obvious, and the environment as the invisible hand shaping every choice',
     'make it attractive and make it easy, how cravings are engineered and friction decides everything',
     'make it satisfying, the cardinal rule of behavior change, and identity as the deepest layer of habit']],
  ['b-summer-of-ash', 'Endurance', 'a-lansing', 'adventure',
    'In 1914 Ernest Shackleton\'s ship was crushed by Antarctic ice, stranding twenty-eight men for nearly two years. Lansing\'s account of their survival is one of the great true stories.',
    ['exploration', 'survival', 'true-story'], 4.5, 416, 1959, '9780465062881', {},
    ['the weddell sea closes like a trap, and endurance freezes into the ice a hundred miles from land',
     'the ship is crushed, and twenty-eight men camp on drifting floes with three small boats',
     'elephant island, and an 800-mile open-boat voyage through the worst ocean on earth',
     'south georgia crossed by moonlight, and a rescue that took four attempts to finish']],
  ['b-color-and-courage', 'The Diary of a Young Girl', 'a-anne-frank', 'biography',
    'Written in hiding in an Amsterdam annex between 1942 and 1944, Anne Frank\'s diary is the voice of a funny, furious, brilliant teenager confronting history with total honesty.',
    ['diary', 'history', 'classic'], 4.4, 283, 1947, '9780553296983', {},
    ['the annex, a diary for a birthday, and a family disappearing behind a swinging bookcase',
     'eight people in hiding, the sound of the westertoren bells, and the arithmetic of silence',
     'peter, first love at thirteen, and the thinking that grows in the margins of fear',
     'the last entry, three days before the annex is betrayed and the voice falls silent']],
  ['b-durable', 'The Soul of a New Machine', 'a-kidder', 'technology',
    'Inside Data General in the late 1970s, a team of young engineers secretly builds a new computer against impossible deadlines. Kidder made engineering read like a novel — and won a Pulitzer.',
    ['engineering', 'nonfiction', 'computers'], 4.2, 293, 1981, '9781579546038', {},
    ['a company falling behind, and a manager who signs up to build a machine no one assigned him',
     'the basement of westborough, mushroom managers, and engineers who sign their work in microcode',
     'the race to tape-out, sixteen-hour days, and debugging by feel at three in the morning',
     'the eagle works, the machine ships, and the men who built it discover what it cost them']],
  ['b-the-quiet-republic', 'SPQR', 'a-mary-beard', 'history',
    'Beard retells a thousand years of Roman history — from a village on the Tiber to an empire of fifty million — asking who the Romans really were and what "Rome" meant to the people it ruled.',
    ['rome', 'classics', 'empire'], 4.3, 606, 2015, '9780871404237', {},
    ['a river, a hill, and Romulus, taking the founding stories apart before putting history back together',
     'the republic, senators in mud-stained togas, and how a city of citizens learned to argue with itself',
     'empire without a plan, from Carthage to Britain, and the provinces that made Rome richer than Rome',
     'emperors, subjects, and the million strangers who turned a city into a civilization']],
  ['b-the-garden-detective', 'In the Woods', 'a-tana-french', 'mystery',
    'A twelve-year-old girl is found dead in an Irish woodland — at the exact site where, twenty years earlier, two children vanished and the third was found with no memory. Detective Ryan investigates both.',
    ['psychological', 'irish', 'literary'], 3.9, 429, 2007, '9780143113492', {},
    ['a summer of archaeological digging, a child\'s body among the stones, and a detective who was once the boy who survived this wood',
     'knocknaree, the vanished of 1984, and a partner who asks the questions Ryan is afraid to answer',
     'the bond breaks, the evidence turns inward, and every witness remembers a different wood',
     'the case closes and the memory never does, and what the woods gave back is not the truth']],
  ['b-first-light-of-reason', 'Sophie\'s World', 'a-gaarder', 'philosophy',
    'A fourteen-year-old girl receives mysterious letters — "Who are you? Where does the world come from?" — and with them a complete course in philosophy that slowly becomes a mystery about herself.',
    ['philosophy', 'novel', 'education'], 4.0, 544, 1991, '9780374530716', {},
    ['the garden of eden, three strange letters, and a course in everything beginning with the myths',
     'socrates, athens, and a white rabbit pulled from a hat that we have all stopped marveling at',
     'the middle ages to freud, and a girl who notices the postcards are addressed to someone else',
     'the major\'s cabin, a mirror that winks, and the discovery that Sophie\'s world is being written']],
  ['b-the-widow-of-rooms', 'Nineteen Eighty-Four', 'a-george-orwell', 'fiction',
    'In a world of telescreens, doublethink, and the Ministry of Truth, Winston Smith commits the last crime left: he thinks for himself, and falls in love. Orwell\'s nightmare has never faded.',
    ['dystopia', 'totalitarianism', 'classic'], 4.2, 328, 1949, '9780451524935', {},
    ['a cold day in april, and the clocks striking thirteen as winston begins a diary he cannot keep',
     'the ministry of truth, rewriting the past daily, and a note that reads i love you',
     'the room above the junk shop, a paperweight of glass, and the belief that the proles are the future',
     'room 101, the betrayal of julia, and learning to love big brother']],
  ['b-the-machines-we-trust', 'The Immortal Life of Henrietta Lacks', 'a-skloot', 'science',
    'Her cells — taken without consent in 1951 — became the first immortal human cell line and made modern medicine possible. Skloot tells the science and the family history that medicine ignored.',
    ['medicine', 'ethics', 'nonfiction'], 4.4, 381, 2010, '9781400052189', {},
    ['a young mother in the colored ward of johns hopkins, a sample taken, and cells that refused to die',
     'the first immortal cells, a factory of vials, and polio vaccines grown on a woman nobody named',
     'the lacks family learns what HeLa means, decades after the cells circled the world',
     'skloot and deborah in a hospital basement, finally looking at their mother\'s cells together']],
  ['b-her-handwriting', 'Guns, Germs, and Steel', 'a-diamond', 'history',
    'Why did Europeans conquer the world and not the other way around? Diamond\'s answer is not genes or genius but geography: the axes of continents, domesticable animals, and the germs they shared.',
    ['geography', 'anthropology', 'big-history'], 4.0, 480, 1997, '9780393354324', {},
    ['yali\'s question on a new guinea beach, and why the obvious answers are the wrong ones',
     'anna\'s apples, the fertile crescent, and thirteen species that changed what farming could build',
     'the axes of the continents, and why ideas travel east-west faster than they travel north-south',
     'germs as the silent conquistador, and writing, steel, and horses as the rest of the story']],
  ['b-the-engineer-of-small-things', 'Deep Work', 'a-newport', 'self',
    'Focus has become the rarest skill in the economy. Newport argues for deep work — cognitively demanding, distraction-free concentration — and prescribes rules for reclaiming it.',
    ['focus', 'productivity', 'work'], 4.1, 304, 2016, '9781455586691', {},
    ['deep work is valuable, and why the ability to concentrate has become the scarce skill of the new economy',
     'shallow work is a trap, busyness as a proxy for productivity in a workplace without metrics',
     'the rules of the ritual, choosing a philosophy, and embracing boredom as training',
     'quit the attention reserve, drain the shallows, and schedule every minute of the day']],
  ['b-sleeping-cities', 'Silent Spring', 'a-carson', 'science',
    'A quiet, furious book about pesticides that became the birth of environmentalism: Carson showed how DDT moved through soil, water, and birdsong — and how a spring without birds was possible.',
    ['environment', 'ecology', 'classic'], 4.0, 400, 1962, '9780618249060', {},
    ['a town where no birds sing, a fable for tomorrow drawn from the chemistry already in the fields',
     'the obligation to endure, and elixirs of death moving through soil into water into bone',
     'rivers of death, the elm trees, and the robins that stopped coming back',
     'the other road, biological control, and the choice between chemicals and sense']],
  ['b-the-shape-of-joy', 'Ariel', 'a-plath', 'poetry',
    'The collection Plath arranged in the last months of her life: poems of velocity, fury, and luminous control — "Lady Lazarus", "Daddy", "Ariel" — that reset the boundaries of confessional poetry.',
    ['collection', 'confessional', 'classic'], 4.3, 112, 1965, '9780060723712', {},
    ['morning song, love set going like a fat gold watch, and the arrival of a new voice',
     'lady lazarus eats men like air, and the art of dying as a theatrical comeback',
     'daddy, a shoe in which the foot has lived for thirty years, and a poem that says everything twice',
     'ariel, the ride at dawn, and the arrow that flies into the red eye of the sun']],
  ['b-the-cartographer-of-souls', 'The Great Gatsby', 'a-fitzgerald', 'fiction',
    'Jay Gatsby throws the most extravagant parties on Long Island for one reason: to be seen by a woman across the bay. A perfect short novel about wealth, longing, and the green light.',
    ['classic', 'jazz-age', 'american'], 3.9, 180, 1925, '9780743273565', {},
    ['a narrator who reserves judgments, a mansion of parties, and a man who reaches toward green light',
     'the valley of ashes, the eyes of doctor t. j. eckleburg, and a lunch with a man who fixed the world series',
     'a reunion across a table of flowers, and the past that gatsby insists can be repeated',
     'the heat, the plaza hotel, a yellow car coming back from new york, and boats against the current']],
  ['b-a-short-history-of-doubt', 'The Myth of Sisyphus', 'a-camus', 'philosophy',
    'Camus takes on the one truly serious philosophical problem — suicide — and answers it with lucidity: even in a universe without meaning, the struggle itself toward the heights is enough to fill a heart.',
    ['absurdism', 'essays', 'classic'], 4.0, 192, 1942, '9780679733737', {},
    ['an absurd reasoning, and why the one truly serious philosophical problem is suicide',
     'the absurd man, living without appeal, and Don Juan as a model of lucid passion',
     'absurd creation, art as the experience of living one\'s own absurdity to the end',
     'the myth of sisyphus, and the moment the rock is rolling back down when the walk begins']],
  ['b-the-lighthouse-letters', 'The Remains of the Day', 'a-ishiguro', 'fiction',
    'In 1956 an English butler drives west to meet the housekeeper he loved and lost, and his diary of the trip becomes a quiet, devastating reckoning with dignity, duty, and a life spent in service.',
    ['literary', 'england', 'memory'], 4.2, 258, 1989, '9780679731726', {},
    ['a day in the country, darlington hall sold to an american, and stevens setting out in a ford',
     'salisbury, dignity in one\'s profession, and memories of a housekeeper who laughed on the stairs',
     'lord darlington and the appeasers, the unfortunate evenings, and what serving a great man cost',
     'moscombe, the meeting by the pier, and the evening that remains for every man']],
  ['b-the-patient-investor', 'Good to Great', 'a-jim-collins', 'business',
    'Collins and his research team asked why some companies leap from average to exceptional and stay there. The answers — Level 5 leadership, the hedgehog concept, the flywheel — became management canon.',
    ['management', 'research', 'leadership'], 4.2, 300, 2001, '9780066620992', {},
    ['good is the enemy of great, and a five-year research question applied to eleven companies',
     'level 5 leadership, a paradox of personal humility and professional will at the top',
     'first who then what, the hedgehog concept, and the intersection of passion, competence, and economics',
     'the flywheel and the doom loop, technology as accelerator, and discipline that sustains greatness']],
  ['b-the-last-translator', 'The Kite Runner', 'a-hosseini', 'fiction',
    'Amir and Hassan were kite-flying boys in a peaceful Kabul until one winter afternoon Amir watched something he never confessed — and twenty-six years later a phone call tells him there is a way to be good again.',
    ['afghanistan', 'friendship', 'redemption'], 4.3, 371, 2003, '9781594631931', {},
    ['kabul in the 1970s, hazara and pashtun, a servant\'s son who reads stories under the pomegranate tree',
     'the kite tournament of 1975, the alley, and the watching that changes two boys forever',
     'flight from soviet kabul, fremont california, and a father selling blankets at a flea market',
     'a phone call from peshawar, a return to taliban kabul, and running one last kite for a boy behind glass']],
  ['b-a-guide-to-getting-lost', 'Mindset', 'a-dweck', 'self',
    'Why do some people bloom from failure while others are shattered by it? Dweck\'s decades of research came down to two beliefs about ability — fixed and growth — and the different lives they build.',
    ['psychology', 'learning', 'success'], 4.1, 320, 2006, '9780345472328', {},
    ['the mindsets, two theories of intelligence, and a puzzle experiment with ten-year-old children',
     'inside the mindsets, how praise becomes a prison and failure becomes a verdict',
     'the truth about ability and accomplishment, from sports stars to benjamin bloom\'s violinists',
     'changing mindsets, the workshop, and parents, teachers, and coaches who let children grow']],
  ['b-the-weight-of-snow', 'Norwegian Wood', 'a-murakami', 'fiction',
    'Toru Watanabe hears a Beatles song on a plane and is thrown back to his student years in Tokyo: two women, one death, and the long business of learning to live with grief.',
    ['literary', 'romance', 'japan'], 4.0, 296, 1987, '9780375704024', {},
    ['the meadow, a well in the garden of memory, and naoko\'s twentieth birthday that ends in goodbye',
     'tokyo, a dormitory of politics and mustard warnings, and midori as everything alive',
     'the sanatorium in the mountains, reconnecting with naoko, and letters that ask for patience',
     'two loves, one forest, and the telephone ringing in a world without her in it']]
];

// Expand the compact definitions to the same schema as the verbose entries.
books.push(...REST.map(([id, title, author, genre, description, tags, rating, pages, publicationYear, isbn, flags, chSeeds]) => ({
  id, title, author, genre, description, tags, rating, pages, publicationYear, language: 'English', isbn, ...flags,
  chapters: chSeeds.map((s, i) => ({ title: 'Part ' + ['One', 'Two', 'Three', 'Four', 'Five'][i], seed: s }))
})));

// Approximate reading time from page count (~1.3 min per page), rounded to 10.
books.forEach((b) => { b.readingTime = Math.round((b.pages * 1.3) / 10) * 10; });

export const bookById = Object.fromEntries(books.map((b) => [b.id, b]));
