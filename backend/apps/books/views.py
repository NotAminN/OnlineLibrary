from rest_framework import viewsets, permissions, filters, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Author, Book, Chapter, Collection, Review
from .serializers import (
    CategorySerializer, AuthorListSerializer, AuthorDetailSerializer,
    BookListSerializer, BookDetailSerializer,
    ChapterSerializer, ChapterDetailSerializer,
    CollectionListSerializer, CollectionDetailSerializer,
    ReviewSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/categories/, GET /api/categories/{slug}/"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    pagination_class = None


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/authors/, GET /api/authors/{slug}/"""
    queryset = Author.objects.all()
    lookup_field = 'slug'
    pagination_class = None
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'biography']
    ordering_fields = ['name', 'birth_year']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AuthorDetailSerializer
        return AuthorListSerializer

    @action(detail=True, methods=['get'], url_path='books')
    def books(self, request, slug=None):
        """GET /api/authors/{slug}/books/"""
        author = self.get_object()
        books = Book.objects.filter(
            author=author, is_published=True
        ).select_related('author', 'genre')
        serializer = BookListSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/books/, GET /api/books/{slug}/"""
    queryset = Book.objects.filter(is_published=True).select_related('author', 'genre')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'genre__slug': ['exact'],
        'author__slug': ['exact'],
        'publication_year': ['exact', 'gte', 'lte'],
        'rating': ['gte'],
        'language': ['exact'],
        'is_featured': ['exact'],
        'is_popular': ['exact'],
        'is_new': ['exact'],
        'editor_pick': ['exact'],
    }
    search_fields = ['title', 'description', 'author__name', 'genre__name', 'isbn']
    ordering_fields = ['title', 'rating', 'publication_year', 'created_at', 'pages']
    ordering = ['-created_at']
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookListSerializer

    @action(detail=True, methods=['get'], url_path='chapters')
    def chapters(self, request, slug=None):
        """GET /api/books/{slug}/chapters/"""
        book = self.get_object()
        chapters = book.chapters.all()
        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post', 'delete'], url_path='reviews')
    def reviews(self, request, slug=None):
        """GET/POST/DELETE /api/books/{slug}/reviews/ — user-submitted reviews.

        GET is public; POST and DELETE require authentication. Each user has
        at most one review per book (upsert on POST, delete own on DELETE).
        """
        book = self.get_object()

        if request.method == 'GET':
            reviews = book.reviews.select_related('user')
            return Response(ReviewSerializer(reviews, many=True, context={'request': request}).data)

        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if request.method == 'POST':
            existing = book.reviews.filter(user=request.user).first()
            serializer = ReviewSerializer(existing, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            review = serializer.save(book=book, user=request.user)
            book.recalc_rating()
            return Response(ReviewSerializer(review, context={'request': request}).data)

        # DELETE — remove the current user's own review
        review = book.reviews.filter(user=request.user).first()
        if review is None:
            return Response({'detail': 'You have no review on this book.'}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        book.recalc_rating()
        return Response({'success': True, 'message': 'Review removed.'})


class ChapterDetailView(generics.RetrieveAPIView):
    """GET /api/books/{book_slug}/chapters/{chapter_number}/"""
    serializer_class = ChapterDetailSerializer

    def get_object(self):
        return Chapter.objects.get(
            book__slug=self.kwargs['book_slug'],
            chapter_number=self.kwargs['chapter_number'],
        )


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/collections/, GET /api/collections/{slug}/"""
    queryset = Collection.objects.prefetch_related('books__author', 'books__genre')
    lookup_field = 'slug'
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollectionDetailSerializer
        return CollectionListSerializer
