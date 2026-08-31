from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserSettings


class UserSettingsInline(admin.StackedInline):
    model = UserSettings
    can_delete = False


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    inlines = [UserSettingsInline]
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('avatar', 'bio', 'avatar_color', 'favorite_genres', 'favorite_authors')}),
    )


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'font_size', 'reader_theme', 'auto_save_progress']
    list_filter = ['font_size', 'reader_theme']
