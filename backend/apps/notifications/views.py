from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """CRUD /api/notifications/ — user's notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['patch'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """PATCH /api/notifications/mark-all-read/ — mark all as read."""
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({'success': True})

    @action(detail=True, methods=['patch'], url_path='read')
    def mark_read(self, request, pk=None):
        """PATCH /api/notifications/{id}/read/ — mark single as read."""
        notif = self.get_object()
        notif.read = True
        notif.save()
        return Response(NotificationSerializer(notif).data)
