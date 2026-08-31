from django.conf import settings
from django.db import models


class ReadingGoal(models.Model):
    """User's daily/monthly reading goals."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_goal')
    daily_minutes = models.IntegerField(default=30)
    daily_pages = models.IntegerField(default=20)
    monthly_books = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reading_goals'

    def __str__(self):
        return f"Goals for {self.user.username}"
