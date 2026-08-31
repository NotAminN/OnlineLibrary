from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import LibraryItem, Favorite, Shelf, ShelfBook
from .serializers import LibraryItemSerializer, FavoriteSerializer, ShelfSerializer


class LibraryItemViewSet(viewsets.ModelViewSet):
    """CRUD /api/library/ — user's personal library items."""
    serializer_class = LibraryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LibraryItem.objects.filter(
            user=self.request.user
        ).select_related('book__author', 'book__genre')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'], url_path='book/(?P<book_slug>[-\w]+)')
    def remove_by_book(self, request, book_slug=None):
        """DELETE /api/library/book/{book_slug}/ — remove a book from library by slug."""
        deleted, _ = LibraryItem.objects.filter(user=request.user, book__slug=book_slug).delete()
        if deleted:
            return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)
        return Response({'success': False, 'message': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class FavoriteViewSet(viewsets.ModelViewSet):
    """CRUD /api/favorites/ — user's favorite books."""
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        return Favorite.objects.filter(
            user=self.request.user
        ).select_related('book__author', 'book__genre')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'], url_path='book/(?P<book_slug>[-\w]+)')
    def remove_by_book(self, request, book_slug=None):
        """DELETE /api/favorites/book/{book_slug}/ — remove by book slug."""
        deleted, _ = Favorite.objects.filter(user=request.user, book__slug=book_slug).delete()
        if deleted:
            return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)
        return Response({'success': False, 'message': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='check/(?P<book_id>[0-9]+)')
    def check(self, request, book_id=None):
        """GET /api/favorites/check/{book_id}/ — check if book is favorited."""
        is_fav = Favorite.objects.filter(user=request.user, book_id=book_id).exists()
        return Response({'is_favorite': is_fav})


class ShelfViewSet(viewsets.ModelViewSet):
    """CRUD /api/shelves/ — user's custom shelves."""
    serializer_class = ShelfSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Shelf.objects.filter(
            user=self.request.user
        ).prefetch_related('shelf_books__book__author', 'shelf_books__book__genre')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='books')
    def add_book(self, request, pk=None):
        """POST /api/shelves/{id}/books/ — add a book to this shelf."""
        shelf = self.get_object()
        book_id = request.data.get('book')
        if not book_id:
            return Response({'message': 'book field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        obj, created = ShelfBook.objects.get_or_create(shelf=shelf, book_id=book_id)
        if created:
            return Response({'success': True, 'message': 'Book added to shelf.'}, status=status.HTTP_201_CREATED)
        return Response({'success': True, 'message': 'Book already on shelf.'})

    @action(detail=True, methods=['delete'], url_path='books/(?P<book_id>[0-9]+)')
    def remove_book(self, request, pk=None, book_id=None):
        """DELETE /api/shelves/{id}/books/{book_id}/ — remove a book from shelf."""
        shelf = self.get_object()
        deleted, _ = ShelfBook.objects.filter(shelf=shelf, book_id=book_id).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
