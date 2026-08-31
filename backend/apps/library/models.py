from django.conf import settings
from django.db import models


class LibraryItem(models.Model):
    """A book in a user's personal library with a reading status."""
    STATUS_CHOICES = [
        ('want', 'Want to Read'),
        ('reading', 'Currently Reading'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library_items')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='library_items')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'library_items'
        unique_together = ['user', 'book']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} — {self.book.title} ({self.status})"


class Favorite(models.Model):
    """A user's favorite book."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorites'
        unique_together = ['user', 'book']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} ♥ {self.book.title}"


class Shelf(models.Model):
    """A custom user-created shelf for organizing books."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shelves')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='bookmark')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shelves'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} / {self.name}"


class ShelfBook(models.Model):
    """M2M through table for shelf↔book."""
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE, related_name='shelf_books')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='shelf_entries')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shelf_books'
        unique_together = ['shelf', 'book']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.shelf.name} — {self.book.title}"
