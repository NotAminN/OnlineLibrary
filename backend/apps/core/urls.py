from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),
    path('search/', views.SearchView.as_view(), name='search'),
    path('recommendations/', views.RecommendationsView.as_view(), name='recommendations'),
    path('statistics/', views.StatisticsView.as_view(), name='statistics'),
    path('goals/', views.GoalsView.as_view(), name='goals'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('settings/', views.SettingsView.as_view(), name='settings'),
]
