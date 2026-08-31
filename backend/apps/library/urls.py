from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('library', views.LibraryItemViewSet, basename='library')
router.register('favorites', views.FavoriteViewSet, basename='favorite')
router.register('shelves', views.ShelfViewSet, basename='shelf')

urlpatterns = [
    path('', include(router.urls)),
]
