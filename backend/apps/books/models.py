from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Category(models.Model):
    """Book genre / category."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, default='')
    color = models.CharField(max_length=7, default='#743C45')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Author(models.Model):
    """Book author."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    biography = models.TextField(blank=True, default='')
    portrait = models.ImageField(upload_to='authors/', blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, default='')
    birth_year = models.IntegerField(null=True, blank=True)
    death_year = models.IntegerField(null=True, blank=True)
    genres = models.JSONField(default=list, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'authors'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Book(models.Model):
    """A book in the library catalog."""
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True)
    subtitle = models.CharField(max_length=300, blank=True, default='')
    description = models.TextField(blank=True, default='')
    cover = models.ImageField(upload_to='books/', blank=True, null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    genre = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    tags = models.JSONField(default=list, blank=True)
    publication_year = models.IntegerField(null=True, blank=True)
    publisher = models.CharField(max_length=200, blank=True, default='')
    language = models.CharField(max_length=50, default='English')
    pages = models.IntegerField(default=0)
    reading_time = models.IntegerField(default=0, help_text='Estimated reading time in minutes')
    isbn = models.CharField(max_length=20, blank=True, default='', db_index=True)
    rating = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    editor_pick = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'books'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['isbn']),
            models.Index(fields=['rating']),
            models.Index(fields=['publication_year']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure uniqueness
            base_slug = self.slug
            counter = 1
            while Book.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        if not self.reading_time and self.pages:
            self.reading_time = round((self.pages * 1.3) / 10) * 10
        super().save(*args, **kwargs)

    def recalc_rating(self):
        """Recompute rating from user reviews."""
        agg = self.reviews.aggregate(avg=models.Avg('rating'), n=models.Count('id'))
        if agg['n']:
            self.rating = round(agg['avg'], 2)
            self.rating_count = agg['n']
        else:
            # No user reviews yet — keep any seeded baseline rating.
            self.rating_count = 0
        self.save(update_fields=['rating', 'rating_count', 'updated_at'])


class Chapter(models.Model):
    """A chapter within a book."""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=300)
    chapter_number = models.IntegerField(default=1)
    content = models.TextField(blank=True, default='')
    seed = models.TextField(blank=True, default='', help_text='Seed text for client-side prose generation')
    estimated_reading_time = models.IntegerField(default=0, help_text='Minutes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chapters'
        ordering = ['chapter_number']
        unique_together = ['book', 'chapter_number']

    def __str__(self):
        return f"{self.book.title} — {self.title}"


class Collection(models.Model):
    """A curated collection of books."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    subtitle = models.CharField(max_length=200, blank=True, default='')
    description = models.TextField(blank=True, default='')
    cover = models.ImageField(upload_to='collections/', blank=True, null=True)
    books = models.ManyToManyField(Book, related_name='collections', blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'collections'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Review(models.Model):
    """A user-submitted rating + comment on a book."""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5)
    text = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['book', 'user']

    def __str__(self):
        return f"{self.user} — {self.book.title} ({self.rating}★)"
