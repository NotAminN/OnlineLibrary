from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import ReadingProgress, Bookmark, Note, ReadingHistory
from .serializers import (
    ReadingProgressSerializer, BookmarkSerializer,
    NoteSerializer, ReadingHistorySerializer,
)


class ReadingProgressViewSet(viewsets.ModelViewSet):
    """CRUD /api/reading-progress/ — user's reading progress per book."""
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'put', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = ReadingProgress.objects.filter(
            user=self.request.user
        ).select_related('book__author', 'book__genre')
        book_id = self.request.query_params.get('book')
        if book_id:
            qs = qs.filter(book_id=book_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='book/(?P<book_slug>[-\w]+)')
    def by_book(self, request, book_slug=None):
        """GET /api/reading-progress/book/{book_slug}/ — get progress for a specific book."""
        try:
            progress = ReadingProgress.objects.get(user=request.user, book__slug=book_slug)
            return Response(ReadingProgressSerializer(progress, context={'request': request}).data)
        except ReadingProgress.DoesNotExist:
            return Response({'detail': 'No progress found.'}, status=status.HTTP_404_NOT_FOUND)


class BookmarkViewSet(viewsets.ModelViewSet):
    """CRUD /api/bookmarks/ — user's bookmarks."""
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Bookmark.objects.filter(user=self.request.user)
        book_id = self.request.query_params.get('book')
        if book_id:
            qs = qs.filter(book_id=book_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteViewSet(viewsets.ModelViewSet):
    """CRUD /api/notes/ — user's notes."""
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Note.objects.filter(user=self.request.user)
        book_id = self.request.query_params.get('book')
        if book_id:
            qs = qs.filter(book_id=book_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReadingHistoryViewSet(viewsets.ModelViewSet):
    """GET /api/history/ — user's reading history."""
    serializer_class = ReadingHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        return ReadingHistory.objects.filter(
            user=self.request.user
        ).select_related('book__author', 'book__genre')

    def perform_create(self, serializer):
        # Upsert
        user = self.request.user
        book = serializer.validated_data['book']
        obj, _ = ReadingHistory.objects.update_or_create(
            user=user, book=book,
            defaults={
                'progress_percentage': serializer.validated_data.get('progress_percentage', 0),
                'last_chapter': serializer.validated_data.get('last_chapter', 0),
            }
        )

    @action(detail=False, methods=['delete'], url_path='clear')
    def clear(self, request):
        """DELETE /api/history/clear/ — clear all reading history."""
        ReadingHistory.objects.filter(user=request.user).delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)
