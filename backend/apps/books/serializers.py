from rest_framework import serializers
from .models import Category, Author, Book, Chapter, Collection, Review


class CategorySerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'color', 'image', 'featured', 'book_count']

    def get_book_count(self, obj):
        return obj.books.count()


class AuthorListSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['id', 'name', 'slug', 'biography', 'portrait', 'country',
                  'birth_year', 'death_year', 'genres', 'featured', 'book_count']

    def get_book_count(self, obj):
        return obj.books.count()


class AuthorDetailSerializer(AuthorListSerializer):
    class Meta(AuthorListSerializer.Meta):
        pass


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'chapter_number', 'seed', 'estimated_reading_time']


class ChapterDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'chapter_number', 'content', 'seed', 'estimated_reading_time']


class BookListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_slug = serializers.CharField(source='author.slug', read_only=True)
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    genre_slug = serializers.CharField(source='genre.slug', read_only=True)
    genre_color = serializers.CharField(source='genre.color', read_only=True)
    chapter_count = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'slug', 'subtitle', 'description', 'cover',
            'author', 'author_name', 'author_slug',
            'genre', 'genre_name', 'genre_slug', 'genre_color',
            'tags', 'publication_year', 'language', 'pages', 'reading_time',
            'isbn', 'rating', 'rating_count',
            'is_featured', 'is_popular', 'is_new', 'editor_pick',
            'chapter_count', 'created_at',
        ]

    def get_chapter_count(self, obj):
        return obj.chapters.count()


class BookDetailSerializer(BookListSerializer):
    author_detail = AuthorListSerializer(source='author', read_only=True)
    genre_detail = CategorySerializer(source='genre', read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)
    related_books = serializers.SerializerMethodField()

    class Meta(BookListSerializer.Meta):
        fields = BookListSerializer.Meta.fields + [
            'author_detail', 'genre_detail', 'chapters', 'related_books', 'updated_at',
        ]

    def get_related_books(self, obj):
        related = Book.objects.filter(
            genre=obj.genre, is_published=True
        ).exclude(pk=obj.pk).select_related('author', 'genre')[:4]
        return BookListSerializer(related, many=True, context=self.context).data


class CollectionListSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()
    preview_books = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'title', 'slug', 'subtitle', 'description', 'cover',
                  'featured', 'book_count', 'preview_books', 'created_at']

    def get_book_count(self, obj):
        return obj.books.count()

    def get_preview_books(self, obj):
        preview = obj.books.select_related('author', 'genre')[:4]
        return BookListSerializer(preview, many=True, context=self.context).data


class CollectionDetailSerializer(CollectionListSerializer):
    books = BookListSerializer(many=True, read_only=True)

    class Meta(CollectionListSerializer.Meta):
        fields = CollectionListSerializer.Meta.fields + ['books']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    avatar_color = serializers.CharField(source='user.avatar_color', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'user_name', 'avatar_color', 'rating', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name or obj.user.username

    def validate_rating(self, value):
        if not 1 <= int(value) <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
