"""
Seed book flags (is_new, is_popular, is_featured, editor_pick) from
scripts/seed_data/books.json so the homepage sections render correctly.

Usage:  python manage.py seed_flags
"""
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.books.models import Book


class Command(BaseCommand):
    help = "Set is_new / is_popular / is_featured / editor_pick flags from seed data."

    def handle(self, *args, **options):
        path = Path(settings.BASE_DIR).parent / 'scripts' / 'seed_data' / 'books.json'
        if not path.exists():
            self.stderr.write(f"Seed data not found: {path}")
            return

        data = json.loads(path.read_text(encoding='utf-8'))
        updated = 0
        for item in data:
            title = (item.get('title') or '').strip()
            book = Book.objects.filter(title__iexact=title).first()
            if not book:
                self.stderr.write(f"  Not in DB: {title}")
                continue

            book.is_new = bool(item.get('isNew'))
            book.is_popular = bool(item.get('isPopular'))
            book.is_featured = bool(item.get('isFeatured'))
            book.editor_pick = bool(item.get('editorPick'))
            book.save(update_fields=['is_new', 'is_popular', 'is_featured', 'editor_pick'])
            updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. Flags updated for {updated} book(s). "
            f"is_new={Book.objects.filter(is_new=True).count()}, "
            f"is_popular={Book.objects.filter(is_popular=True).count()}, "
            f"is_featured={Book.objects.filter(is_featured=True).count()}, "
            f"editor_pick={Book.objects.filter(editor_pick=True).count()}."
        ))
