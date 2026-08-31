from django.conf import settings
from django.db import models


class Notification(models.Model):
    """A user notification."""
    TYPE_CHOICES = [
        ('new_book', 'New Book'),
        ('recommendation', 'Recommendation'),
        ('reminder', 'Reading Reminder'),
        ('collection', 'Collection'),
        ('system', 'System'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default='')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.title} → {self.user.username}"
