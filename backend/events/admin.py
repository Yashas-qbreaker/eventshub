from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth import get_user_model
from .models import Category, Event, Ticket, EventUser, UserAuthProxy


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "organizer", "start_datetime", "location", "capacity", "seats_left", "featured")
    list_filter = ("featured", "category")
    search_fields = ("title", "location", "tags")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "attendee", "status", "created_at", "scanned_at")
    list_filter = ("status",)
    search_fields = ("id", "event__title", "attendee__username")


User = get_user_model()


@admin.register(EventUser)
class EventUserAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "get_user_role", "created_at")
    search_fields = ("event__title", "user__username", "user__email")

    def get_user_role(self, obj):
        return getattr(obj.user, "role", "")

    get_user_role.short_description = "Role"


# Register proxy under Authentication and Authorization group
@admin.register(UserAuthProxy)
class UserAuthProxyAdmin(DjangoUserAdmin):
    list_display = ("username", "email", "role", "is_staff")


