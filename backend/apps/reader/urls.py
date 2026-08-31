from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('reading-progress', views.ReadingProgressViewSet, basename='reading-progress')
router.register('bookmarks', views.BookmarkViewSet, basename='bookmark')
router.register('notes', views.NoteViewSet, basename='note')
router.register('history', views.ReadingHistoryViewSet, basename='history')

urlpatterns = [
    path('', include(router.urls)),
]
