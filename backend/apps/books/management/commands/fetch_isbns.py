import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.books.models import Book


class Command(BaseCommand):
    help = "Populate empty ISBN fields from seed data or the Open Library search API so real cover artwork can be shown."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run', action='store_true',
            help='Only show what would be updated, without saving.'
        )

    def handle(self, *args, **options):
        seed_isbns = self._load_seed_isbns()
        books = Book.objects.all()
        updated = 0
        missing = 0

        for book in books:
            if book.isbn:
                continue

            isbn = seed_isbns.get(book.title.strip().lower())
            source = 'seed'
            if not isbn:
                isbn = self._find_isbn(book.title, book.author.name if book.author else '')
                source = 'openlibrary'
                time.sleep(1)  # be gentle with the public API
            if isbn:
                self.stdout.write(f"  {book.slug}: ISBN {isbn} ({source})")
                if not options['dry_run']:
                    book.isbn = isbn
                    book.save(update_fields=['isbn'])
                updated += 1
            else:
                self.stdout.write(self.style.WARNING(f"  {book.slug}: no ISBN found for '{book.title}'"))
                missing += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. Updated {updated} book(s); {missing} book(s) without a match."
        ))

    def _load_seed_isbns(self):
        """Map lowercase seed titles to their ISBNs so we avoid network calls when possible."""
        mapping = {}
        candidates = [
            Path(settings.BASE_DIR).parent / 'scripts' / 'seed_data' / 'books.json',
        ]
        for path in candidates:
            if not path.exists():
                continue
            try:
                data = json.loads(path.read_text(encoding='utf-8'))
                for item in data:
                    title = (item.get('title') or '').strip().lower()
                    isbn = item.get('isbn')
                    if title and isbn:
                        mapping[title] = isbn
            except Exception as exc:
                self.stderr.write(f"  Could not load seed data {path}: {exc}")
        return mapping

    def _find_isbn(self, title, author, retries=3):
        """Query the Open Library search API for an ISBN-13 matching the title/author."""
        query = f"{title} {author}".strip()
        url = (
            'https://openlibrary.org/search.json?'
            + urllib.parse.urlencode({
                'q': query,
                'fields': 'key,title,isbn',
                'limit': 3,
            })
        )
        for attempt in range(retries):
            try:
                with urllib.request.urlopen(url, timeout=15) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                break
            except Exception as exc:
                if attempt == retries - 1:
                    self.stderr.write(f"  Open Library request failed after {retries} attempts: {exc}")
                    return None
                time.sleep(2 * (attempt + 1))

        for doc in data.get('docs', []):
            # Prefer ISBN-13 entries (start with 978/979)
            candidates = [i for i in doc.get('isbn', []) if i.startswith(('978', '979')) and len(i) == 13]
            if candidates:
                return candidates[0]
            if doc.get('isbn'):
                return doc['isbn'][0]
        return None
