from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, EventViewSet, verify_ticket, my_tickets, my_registrations, event_registrations, my_likes

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"events", EventViewSet, basename="event")

urlpatterns = [
    path("", include(router.urls)),
    path("tickets/verify/", verify_ticket, name="ticket-verify"),
    path("tickets/mine/", my_tickets, name="ticket-mine"),
    path("registrations/mine/", my_registrations, name="registrations-mine"),
    path("registrations/event/<int:event_id>/", event_registrations, name="registrations-event"),
    path("likes/mine/", my_likes, name="likes-mine"),
]


