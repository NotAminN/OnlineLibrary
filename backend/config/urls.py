"""
URL configuration for Lumina backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.shortcuts import render
from django.http import Http404, HttpResponse
from pathlib import Path
from django.views.decorators.cache import never_cache

@never_cache
def serve_frontend(request, page=''):
    if not page:
        page = 'index'

    # Optional: if page doesn't end with .html, try adding it,
    # but Vite links usually include .html for multi-page apps.
    template_name = page if page.endswith('.html') else f"{page}.html"

    # Read the file straight from disk on every request (bypassing the
    # Django template cached loader) so that a fresh `npm run build`
    # becomes visible immediately without restarting the dev server.
    file_path = Path(settings.TEMPLATES[0]['DIRS'][0]) / template_name
    if not file_path.is_file():
        raise Http404(f"Frontend page {template_name} not found")

    html = file_path.read_text(encoding='utf-8')
    # HTML shells reference hashed assets that change on every build,
    # so never let the browser cache the shell itself.
    response = HttpResponse(html, content_type='text/html; charset=utf-8')
    response['Cache-Control'] = 'no-store, must-revalidate, max-age=0, no-cache, private'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/', include('apps.books.urls')),
    path('api/', include('apps.library.urls')),
    path('api/', include('apps.reader.urls')),
    path('api/', include('apps.notifications.urls')),
    path('api/', include('apps.core.urls')),
    
    # Catch-all for frontend HTML pages
    path('', serve_frontend, name='home'),
    path('<path:page>', serve_frontend, name='frontend-pages'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
