from rest_framework import serializers
from .models import ReadingProgress, Bookmark, Note, ReadingHistory
from apps.books.models import Book
from apps.books.serializers import BookListSerializer


class ReadingProgressSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    book_detail = BookListSerializer(source='book', read_only=True)

    class Meta:
        model = ReadingProgress
        fields = [
            'id', 'book', 'book_detail', 'current_chapter', 'current_page',
            'progress_percentage', 'reading_time_minutes', 'last_read_at',
            'completed', 'completed_at',
        ]
        read_only_fields = ['id', 'last_read_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        user = validated_data['user']
        book = validated_data['book']
        # Upsert: update if exists, create if not
        obj, created = ReadingProgress.objects.update_or_create(
            user=user, book=book, defaults=validated_data
        )
        return obj


class BookmarkSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    class Meta:
        model = Bookmark
        fields = ['id', 'book', 'chapter', 'paragraph', 'page', 'text', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NoteSerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    class Meta:
        model = Note
        fields = ['id', 'book', 'chapter', 'page', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ReadingHistorySerializer(serializers.ModelSerializer):
    book = serializers.SlugRelatedField(slug_field='slug', queryset=Book.objects.all())
    book_detail = BookListSerializer(source='book', read_only=True)

    class Meta:
        model = ReadingHistory
        fields = ['id', 'book', 'book_detail', 'last_opened_at', 'progress_percentage', 'last_chapter']
        read_only_fields = ['id', 'last_opened_at']
