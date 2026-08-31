from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('apps.users.urls')),
    path('api/', include('apps.books.urls')),
    path('api/', include('apps.library.urls')),
    path('api/', include('apps.reader.urls')),
    path('api/', include('apps.notifications.urls')),
    path('api/', include('apps.core.urls')),
]