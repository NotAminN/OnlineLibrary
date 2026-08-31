from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Extended user model with reading profile fields."""
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True, default='')
    avatar_color = models.CharField(max_length=7, default='#743C45')
    favorite_genres = models.JSONField(default=list, blank=True)
    favorite_authors = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username


class UserSettings(models.Model):
    """Per-user reading and notification preferences."""
    FONT_SIZE_CHOICES = [
        ('small', 'Small'), ('medium', 'Medium'),
        ('large', 'Large'), ('xlarge', 'Extra Large'),
    ]
    LINE_HEIGHT_CHOICES = [
        ('compact', 'Compact'), ('comfortable', 'Comfortable'),
        ('relaxed', 'Relaxed'),
    ]
    WIDTH_CHOICES = [
        ('narrow', 'Narrow'), ('medium', 'Medium'), ('wide', 'Wide'),
    ]
    THEME_CHOICES = [
        ('light', 'Light'), ('sepia', 'Sepia'), ('dark', 'Dark'),
    ]
    ALIGN_CHOICES = [
        ('left', 'Left'), ('justified', 'Justified'),
    ]

    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='settings'
    )
    font_size = models.CharField(max_length=10, choices=FONT_SIZE_CHOICES, default='medium')
    line_height = models.CharField(max_length=15, choices=LINE_HEIGHT_CHOICES, default='comfortable')
    reading_width = models.CharField(max_length=10, choices=WIDTH_CHOICES, default='medium')
    reader_theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    text_align = models.CharField(max_length=10, choices=ALIGN_CHOICES, default='left')
    auto_save_progress = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    reading_reminders = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_settings'
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'

    def __str__(self):
        return f"Settings for {self.user.username}"
