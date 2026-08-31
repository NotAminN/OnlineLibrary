from rest_framework import serializers
from .models import ReadingGoal


class ReadingGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingGoal
        fields = ['daily_minutes', 'daily_pages', 'monthly_books']
