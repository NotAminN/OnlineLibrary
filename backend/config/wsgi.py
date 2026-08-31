"""WSGI config for Lumina backend (also used as the Vercel entry point)."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()

# Vercel's Python runtime expects a module-level `app` variable.
app = application
