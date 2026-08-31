from django.contrib import admin
from .models import ReadingProgress, Bookmark, Note, ReadingHistory


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'progress_percentage', 'current_chapter', 'completed', 'last_read_at']
    list_filter = ['completed']
    search_fields = ['user__username', 'book__title']
    raw_id_fields = ['user', 'book']


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'chapter', 'text', 'created_at']
    search_fields = ['user__username', 'book__title']
    raw_id_fields = ['user', 'book']


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'chapter', 'created_at']
    search_fields = ['user__username', 'book__title', 'content']
    raw_id_fields = ['user', 'book']


@admin.register(ReadingHistory)
class ReadingHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'last_opened_at', 'progress_percentage']
    search_fields = ['user__username', 'book__title']
    raw_id_fields = ['user', 'book']
