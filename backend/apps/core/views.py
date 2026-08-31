from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Sum, Count, Avg

from apps.books.models import Book, Author, Category, Collection
from apps.books.serializers import (
    BookListSerializer, AuthorListSerializer,
    CategorySerializer, CollectionListSerializer,
)
from apps.library.models import LibraryItem, Favorite
from apps.reader.models import ReadingProgress, ReadingHistory
from apps.users.serializers import ProfileSerializer, UserSettingsSerializer
from apps.users.models import UserSettings
from .models import ReadingGoal
from .serializers import ReadingGoalSerializer


class HomeView(APIView):
    """GET /api/home/ — aggregated homepage data."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        featured = Book.objects.filter(
            is_published=True, is_featured=True
        ).select_related('author', 'genre')[:6]

        popular = Book.objects.filter(
            is_published=True, is_popular=True
        ).select_related('author', 'genre').order_by('-rating')[:6]

        new_releases = Book.objects.filter(
            is_published=True, is_new=True
        ).select_related('author', 'genre')[:6]

        editor_picks = Book.objects.filter(
            is_published=True, editor_pick=True
        ).select_related('author', 'genre')[:6]

        categories = Category.objects.all()[:12]
        featured_authors = Author.objects.filter(featured=True)[:6]
        collections = Collection.objects.filter(featured=True).prefetch_related('books')[:4]

        ctx = {'request': request}
        return Response({
            'featured_books': BookListSerializer(featured, many=True, context=ctx).data,
            'popular_books': BookListSerializer(popular, many=True, context=ctx).data,
            'new_releases': BookListSerializer(new_releases, many=True, context=ctx).data,
            'editor_picks': BookListSerializer(editor_picks, many=True, context=ctx).data,
            'categories': CategorySerializer(categories, many=True, context=ctx).data,
            'featured_authors': AuthorListSerializer(featured_authors, many=True, context=ctx).data,
            'collections': CollectionListSerializer(collections, many=True, context=ctx).data,
        })


class SearchView(APIView):
    """GET /api/search/?q=... — global search across books, authors, categories."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response({'books': [], 'authors': [], 'categories': []})

        books = Book.objects.filter(
            Q(title__icontains=q) | Q(description__icontains=q) |
            Q(isbn__icontains=q) | Q(author__name__icontains=q) |
            Q(tags__icontains=q),
            is_published=True
        ).select_related('author', 'genre').distinct()[:20]

        authors = Author.objects.filter(
            Q(name__icontains=q) | Q(biography__icontains=q)
        )[:10]

        categories = Category.objects.filter(
            Q(name__icontains=q) | Q(description__icontains=q)
        )[:10]

        ctx = {'request': request}
        return Response({
            'books': BookListSerializer(books, many=True, context=ctx).data,
            'authors': AuthorListSerializer(authors, many=True, context=ctx).data,
            'categories': CategorySerializer(categories, many=True, context=ctx).data,
        })


class RecommendationsView(APIView):
    """GET /api/recommendations/ — personalized recommendations."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        ctx = {'request': request}

        # Books the user has interacted with
        library_book_ids = list(
            LibraryItem.objects.filter(user=user).values_list('book_id', flat=True)
        )
        favorite_book_ids = list(
            Favorite.objects.filter(user=user).values_list('book_id', flat=True)
        )
        known_ids = set(library_book_ids + favorite_book_ids)

        # Get user's preferred genres from library books
        preferred_genres = list(
            Book.objects.filter(id__in=known_ids).values_list('genre_id', flat=True).distinct()
        )

        # "For You" — books in preferred genres not yet in library
        for_you = Book.objects.filter(
            genre_id__in=preferred_genres, is_published=True
        ).exclude(id__in=known_ids).select_related('author', 'genre').order_by('-rating')[:6]

        # If no preferences, use popular books
        if not for_you.exists():
            for_you = Book.objects.filter(
                is_published=True, is_popular=True
            ).exclude(id__in=known_ids).select_related('author', 'genre')[:6]

        # Trending — popular books
        trending = Book.objects.filter(
            is_published=True
        ).select_related('author', 'genre').order_by('-rating')[:6]

        # "Because you read X" — find a recently read book, suggest same genre/author
        because = []
        because_title = ''
        last_history = ReadingHistory.objects.filter(user=user).first()
        if last_history:
            because_title = last_history.book.title
            because_qs = Book.objects.filter(
                Q(genre=last_history.book.genre) | Q(author=last_history.book.author),
                is_published=True
            ).exclude(id__in=known_ids).exclude(
                id=last_history.book_id
            ).select_related('author', 'genre')[:4]
            because = BookListSerializer(because_qs, many=True, context=ctx).data

        return Response({
            'for_you': BookListSerializer(for_you, many=True, context=ctx).data,
            'trending': BookListSerializer(trending, many=True, context=ctx).data,
            'because_you_read': {
                'title': because_title,
                'books': because,
            },
        })


class StatisticsView(APIView):
    """GET /api/statistics/ — user's reading statistics."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Completed books
        completed = ReadingProgress.objects.filter(user=user, completed=True).count()

        # Currently reading
        reading = LibraryItem.objects.filter(user=user, status='reading').count()

        # Total reading time
        total_minutes = ReadingProgress.objects.filter(
            user=user
        ).aggregate(total=Sum('reading_time_minutes'))['total'] or 0

        # Total pages read (estimated from progress)
        progress_data = ReadingProgress.objects.filter(user=user).select_related('book')
        pages_read = sum(
            int((p.progress_percentage / 100) * p.book.pages) for p in progress_data
        )

        # Library counts
        library_total = LibraryItem.objects.filter(user=user).count()
        favorites_total = Favorite.objects.filter(user=user).count()

        # Genre breakdown
        genre_counts = (
            LibraryItem.objects.filter(user=user)
            .values('book__genre__name', 'book__genre__color')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        genre_breakdown = [
            {
                'name': gc['book__genre__name'] or 'Unknown',
                'color': gc['book__genre__color'] or '#743C45',
                'count': gc['count'],
            }
            for gc in genre_counts
        ]

        # Reading streak (simplified — count of unique days with activity in last 30 days)
        from django.utils import timezone
        from datetime import timedelta
        thirty_days_ago = timezone.now() - timedelta(days=30)
        unique_days = (
            ReadingHistory.objects.filter(user=user, last_opened_at__gte=thirty_days_ago)
            .dates('last_opened_at', 'day')
            .count()
        )

        return Response({
            'completed': completed,
            'reading': reading,
            'minutes': total_minutes,
            'pages_read': pages_read,
            'library_total': library_total,
            'favorites_total': favorites_total,
            'streak': unique_days,
            'genre_breakdown': genre_breakdown,
        })


class GoalsView(APIView):
    """GET/PATCH /api/goals/ — reading goals."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        goal, _ = ReadingGoal.objects.get_or_create(user=request.user)
        return Response(ReadingGoalSerializer(goal).data)

    def patch(self, request):
        goal, _ = ReadingGoal.objects.get_or_create(user=request.user)
        serializer = ReadingGoalSerializer(goal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileView(APIView):
    """GET/PATCH /api/profile/ — user profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SettingsView(APIView):
    """GET/PATCH /api/settings/ — user settings."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        settings_obj, _ = UserSettings.objects.get_or_create(user=request.user)
        return Response(UserSettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj, _ = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
