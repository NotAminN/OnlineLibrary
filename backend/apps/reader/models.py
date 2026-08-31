from django.conf import settings
from django.db import models


class ReadingProgress(models.Model):
    """Tracks a user's reading progress within a book."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_progress')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='reader_progress')
    current_chapter = models.IntegerField(default=0)
    current_page = models.IntegerField(default=0)
    progress_percentage = models.FloatField(default=0.0)
    reading_time_minutes = models.IntegerField(default=0)
    last_read_at = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reading_progress'
        unique_together = ['user', 'book']
        ordering = ['-last_read_at']

    def __str__(self):
        return f"{self.user.username} — {self.book.title} ({self.progress_percentage}%)"


class Bookmark(models.Model):
    """A user's bookmark within a book."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='bookmarks')
    chapter = models.IntegerField(default=0)
    paragraph = models.IntegerField(default=0)
    page = models.IntegerField(default=0)
    text = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bookmarks'
        ordering = ['-created_at']

    def __str__(self):
        return f"Bookmark: {self.user.username} — {self.book.title} ch.{self.chapter}"


class Note(models.Model):
    """A user's note within a book."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='notes')
    chapter = models.IntegerField(default=0)
    page = models.IntegerField(default=0)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notes'
        ordering = ['-created_at']

    def __str__(self):
        return f"Note: {self.user.username} — {self.book.title}"


class ReadingHistory(models.Model):
    """Track when a user last opened a book."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_history')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='reading_history')
    last_opened_at = models.DateTimeField(auto_now=True)
    progress_percentage = models.FloatField(default=0.0)
    last_chapter = models.IntegerField(default=0)

    class Meta:
        db_table = 'reading_history'
        unique_together = ['user', 'book']
        ordering = ['-last_opened_at']

    def __str__(self):
        return f"{self.user.username} opened {self.book.title}"
