from django.contrib import admin
from .models import Category, Author, Book, Chapter, Collection, Review


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0
    fields = ['chapter_number', 'title', 'seed', 'estimated_reading_time']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'featured']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['featured']
    search_fields = ['name']


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'country', 'birth_year', 'featured']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['featured', 'country']
    search_fields = ['name', 'biography']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'genre', 'rating', 'pages', 'is_published', 'is_popular', 'is_new']
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ['genre', 'is_published', 'is_popular', 'is_new', 'is_featured', 'editor_pick', 'language']
    search_fields = ['title', 'description', 'isbn', 'author__name']
    raw_id_fields = ['author', 'genre']
    inlines = [ChapterInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['book', 'chapter_number', 'title']
    list_filter = ['book']
    search_fields = ['title', 'book__title']


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'featured', 'created_at']
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ['featured']
    search_fields = ['title', 'description']
    filter_horizontal = ['books']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['text', 'book__title', 'user__username']
