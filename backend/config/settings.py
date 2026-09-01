"""
Django settings for Lumina backend.
"""

import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv
import dj_database_url


# =========================================================
# Build paths
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(Path.cwd() / ".env")
load_dotenv(Path.cwd() / "backend" / ".env")


# =========================================================
# Security
# =========================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-change-me"
)

DEBUG = os.getenv(
    "DEBUG",
    "False"
).lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1"
    ).split(",")
    if host.strip()
]

VERCEL_URL = os.getenv("VERCEL_URL", "").strip()

if VERCEL_URL and VERCEL_URL not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(VERCEL_URL)


# =========================================================
# Application definition
# =========================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third party
    "rest_framework",
    "corsheaders",
    "django_filters",
    "rest_framework_simplejwt",

    # Local apps
    "apps.users",
    "apps.books",
    "apps.library",
    "apps.reader",
    "apps.notifications",
    "apps.core",
]


# =========================================================
# Middleware
# =========================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================================================
# URLs / WSGI / ASGI
# =========================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


# =========================================================
# Templates
# =========================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# =========================================================
# Database
# =========================================================



# Local development: SQLite
# Production (Vercel): PostgreSQL via DATABASE_URL

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL and DATABASE_URL.startswith(("postgres://", "postgresql://")):
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# =========================================================
# Custom user model
# =========================================================

AUTH_USER_MODEL = "users.CustomUser"


# =========================================================
# Password validation
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator"
    },
]


# =========================================================
# Internationalization
# =========================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True
USE_TZ = True


# =========================================================
# Static files
# =========================================================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# =========================================================
# Media files
# =========================================================

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# =========================================================
# Default primary key
# =========================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# =========================================================
# Django REST Framework
# =========================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),

    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),

    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.PageNumberPagination",

    "PAGE_SIZE": 20,

    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
}


# =========================================================
# Simple JWT
# =========================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": (
        "rest_framework_simplejwt.tokens.AccessToken",
    ),
}


# =========================================================
# CORS / CSRF
# =========================================================

DEFAULT_LOCAL_ORIGINS = (
    "http://localhost:5173,"
    "http://127.0.0.1:5173,"
    "http://localhost:8800,"
    "http://127.0.0.1:8800"
)

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        DEFAULT_LOCAL_ORIGINS
    ).split(",")
    if origin.strip()
]

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS",
        DEFAULT_LOCAL_ORIGINS
    ).split(",")
    if origin.strip()
]

if VERCEL_URL:
    production_origin = f"https://{VERCEL_URL}"

    if production_origin not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(production_origin)

    if production_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(production_origin)

CORS_ALLOW_CREDENTIALS = True