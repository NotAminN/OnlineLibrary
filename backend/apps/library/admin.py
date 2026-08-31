from django.contrib import admin
from .models import LibraryItem, Favorite, Shelf, ShelfBook


@admin.register(LibraryItem)
class LibraryItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'status', 'added_at']
    list_filter = ['status']
    search_fields = ['user__username', 'book__title']
    raw_id_fields = ['user', 'book']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'created_at']
    search_fields = ['user__username', 'book__title']
    raw_id_fields = ['user', 'book']


@admin.register(Shelf)
class ShelfAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'icon', 'created_at']
    search_fields = ['user__username', 'name']
    raw_id_fields = ['user']


@admin.register(ShelfBook)
class ShelfBookAdmin(admin.ModelAdmin):
    list_display = ['shelf', 'book', 'added_at']
    raw_id_fields = ['shelf', 'book']
