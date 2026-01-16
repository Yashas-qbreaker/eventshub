from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.pk == request.user.pk


class IsOrganizer(BasePermission):
    def has_permission(self, request, view):
        # Role concept removed for permission; allow any authenticated user.
        return request.user.is_authenticated


