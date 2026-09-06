import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from apps.books.models import Category, Author, Book, Chapter, Collection

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with initial data from JSON exports.'

    def handle(self, *args, **options):
        base_dir = Path(__file__).resolve().parent.parent.parent.parent.parent.parent
        seed_dir = base_dir / 'scripts' / 'seed_data'

        if not seed_dir.exists():
            self.stdout.write(self.style.ERROR(f"Seed data directory not found at {seed_dir}"))
            return

        self.stdout.write("Seeding Genres/Categories...")
        with open(seed_dir / 'genres.json', 'r', encoding='utf-8') as f:
            genres_data = json.load(f)
            for g in genres_data:
                Category.objects.get_or_create(
                    slug=g['id'],
                    defaults={
                        'name': g['name'],
                        'color': g['color'],
                        'description': g.get('description', ''),
                        'featured': g.get('featured', False)
                    }
                )

        self.stdout.write("Seeding Authors...")
        with open(seed_dir / 'authors.json', 'r', encoding='utf-8') as f:
            authors_data = json.load(f)
            for a in authors_data:
                Author.objects.get_or_create(
                    slug=a['id'],
                    defaults={
                        'name': a['name'],
                        'biography': a.get('bio', ''),
                        'country': a.get('country', ''),
                        'birth_year': a.get('born', None),
                        'death_year': a.get('died', None),
                        'genres': a.get('genres', []),
                        'featured': a.get('featured', False)
                    }
                )

        self.stdout.write("Seeding Books and Chapters...")
        with open(seed_dir / 'books.json', 'r', encoding='utf-8') as f:
            books_data = json.load(f)
            for b in books_data:
                author = Author.objects.filter(slug=b['author']).first()
                genre = Category.objects.filter(slug=b['genre']).first()
                if not author:
                    self.stdout.write(self.style.WARNING(f"Author {b['author']} not found for book {b['title']}"))
                
                book, created = Book.objects.get_or_create(
                    slug=b['id'],
                    defaults={
                        'title': b['title'],
                        'description': b.get('description', ''),
                        'author': author,
                        'genre': genre,
                        'tags': b.get('tags', []),
                        'publication_year': b.get('publicationYear', None),
                        'pages': b.get('pages', 0),
                        'reading_time': b.get('readingTime', 0),
                        'rating': b.get('rating', 0.0),
                        'language': b.get('language', 'English'),
                        'isbn': b.get('isbn', ''),
                        'is_new': b.get('isNew', False),
                        'is_popular': b.get('isPopular', False),
                        'is_featured': b.get('isFeatured', False),
                        'editor_pick': b.get('editorPick', False),
                    }
                )
                
                # Chapters
                if 'chapters' in b:
                    for i, ch in enumerate(b['chapters']):
                        Chapter.objects.get_or_create(
                            book=book,
                            chapter_number=i,
                            defaults={
                                'title': ch.get('title', f"Chapter {i+1}"),
                                'seed': ch.get('seed', '')
                            }
                        )

        self.stdout.write("Seeding Collections...")
        with open(seed_dir / 'collections.json', 'r', encoding='utf-8') as f:
            collections_data = json.load(f)
            for c in collections_data:
                collection, created = Collection.objects.get_or_create(
                    slug=c['id'],
                    defaults={
                        'title': c['title'],
                        'subtitle': c.get('subtitle', ''),
                        'description': c.get('desc', ''),
                        'featured': c.get('featured', False)
                    }
                )
                if not created:
                    collection.title = c['title']
                    collection.subtitle = c.get('subtitle', '')
                    collection.description = c.get('desc', '')
                    collection.save(update_fields=['title', 'subtitle', 'description'])
                
                if 'bookIds' in c:
                    books_to_add = Book.objects.filter(slug__in=c['bookIds'])
                    collection.books.set(books_to_add)
                    if not books_to_add.exists():
                        self.stdout.write(self.style.WARNING(f"No books found for collection {c['id']}"))

        self.stdout.write("Creating Demo User...")
        demo_user, created = User.objects.get_or_create(
            email='alex.morgan@example.com',
            defaults={
                'username': 'alex.morgan@example.com',
                'first_name': 'Alex',
                'last_name': 'Morgan',
                'bio': 'Demo Reader',
                'avatar_color': '#743C45'
            }
        )
        if created:
            demo_user.set_password('demo-pass')
            demo_user.save()
            from apps.users.models import UserSettings
            UserSettings.objects.get_or_create(user=demo_user)

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
