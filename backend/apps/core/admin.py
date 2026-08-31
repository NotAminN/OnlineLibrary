from django.contrib import admin
from .models import ReadingGoal


@admin.register(ReadingGoal)
class ReadingGoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'daily_minutes', 'daily_pages', 'monthly_books']
    search_fields = ['user__username']
    raw_id_fields = ['user']
