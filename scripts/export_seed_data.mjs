import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { books } from '../Front/js/data/books.js';
import { authorById } from '../Front/js/data/authors.js';
import { genres } from '../Front/js/data/genres.js';
import { collections } from '../Front/js/data/collections.js';

const outDir = path.join(__dirname, 'seed_data');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

fs.writeFileSync(path.join(outDir, 'books.json'), JSON.stringify(books, null, 2));
fs.writeFileSync(path.join(outDir, 'authors.json'), JSON.stringify(Object.values(authorById), null, 2));
fs.writeFileSync(path.join(outDir, 'genres.json'), JSON.stringify(genres, null, 2));
fs.writeFileSync(path.join(outDir, 'collections.json'), JSON.stringify(collections, null, 2));

console.log('Seed data exported to JSON.');
