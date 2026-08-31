from rest_framework import serializers
from .models import LibraryItem, Favorite, Shelf, ShelfBook
from apps.books.models import Book
from apps.books.serializers import BookListSerializer


class LibraryItemSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    book_detail = BookListSerializer(source='book', read_only=True)

    class Meta:
        model = LibraryItem
        fields = ['id', 'book', 'book_detail', 'status', 'added_at']
        read_only_fields = ['id', 'added_at']

    def validate_book(self, value):
        user = self.context['request'].user
        if self.instance is None and LibraryItem.objects.filter(user=user, book=value).exists():
            raise serializers.ValidationError('This book is already in your library.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class FavoriteSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    book_detail = BookListSerializer(source='book', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'book', 'book_detail', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ShelfBookSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    book_detail = BookListSerializer(source='book', read_only=True)

    class Meta:
        model = ShelfBook
        fields = ['id', 'book', 'book_detail', 'added_at']
        read_only_fields = ['id', 'added_at']


class ShelfSerializer(serializers.ModelSerializer):
    books = ShelfBookSerializer(source='shelf_books', many=True, read_only=True)
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Shelf
        fields = ['id', 'name', 'description', 'icon', 'books', 'book_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_book_count(self, obj):
        return obj.shelf_books.count()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
