import io
from datetime import datetime

import qrcode
from django.db import transaction
from django.utils.timezone import now
from django.core.files.images import ImageFile
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .permissions import IsOrganizer
from .models import Category, Event, Ticket, EventUser, EventLike
from .serializers import (
    CategorySerializer,
    EventReadSerializer,
    EventWriteSerializer,
    RSVPSerializer,
    TicketSerializer,
    EventLikeSerializer,
)
from .filters import EventFilter


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related("category", "organizer").all().order_by("-created_at")
    filterset_class = EventFilter
    search_fields = ["title", "description", "tags", "location", "category__name"]
    ordering_fields = ["start_datetime", "created_at"]

    def get_permissions(self):
        # Allow any authenticated user to create/update their own events.
        if self.action in ["create", "update", "partial_update", "destroy", "mine"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return EventWriteSerializer
        return EventReadSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "mine" and self.request.user.is_authenticated:
            return qs.filter(organizer=self.request.user)
        featured = self.request.query_params.get("featured")
        if featured == "true":
            return qs.filter(featured=True).order_by("start_datetime")[:8]
        return qs

    @action(detail=False, methods=["get"], url_path="mine")
    def mine(self, request):
        queryset = self.get_queryset().filter(organizer=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EventReadSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        serializer = EventReadSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="rsvp", permission_classes=[permissions.IsAuthenticated])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        user = request.user
        # Prevent the event organizer from RSVPing to their own event
        if event.organizer_id == user.id:
            return Response({"detail": "Organizers cannot RSVP to their own event."}, status=400)
        with transaction.atomic():
            event = Event.objects.select_for_update().get(pk=event.pk)
            if event.seats_left <= 0:
                return Response({"detail": "Event is full"}, status=400)
            ticket, created = Ticket.objects.get_or_create(event=event, attendee=user)
            EventUser.objects.get_or_create(event=event, user=user)
            if created:
                # generate QR
                img = qrcode.make(str(ticket.id))
                buf = io.BytesIO()
                img.save(buf, format="PNG")
                buf.seek(0)
                ticket.qr_image.save(f"{ticket.id}.png", ImageFile(buf), save=True)
                event.seats_left -= 1
                event.save()
        return Response(TicketSerializer(ticket, context={"request": request}).data, status=status.HTTP_201_CREATED if created else 200)

    @action(detail=True, methods=["post"], url_path="like", permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        event = self.get_object()
        user = request.user
        like, created = EventLike.objects.get_or_create(event=event, user=user)
        if not created:
            like.delete()
            return Response({"liked": False}, status=200)
        return Response({"liked": True}, status=201)


@api_view(["post"])
@permission_classes([permissions.IsAuthenticated])
def verify_ticket(request):
    ticket_id = request.data.get("ticket_id")
    try:
        ticket = Ticket.objects.select_related("event").get(pk=ticket_id)
    except Ticket.DoesNotExist:
        return Response({"valid": False, "detail": "Ticket not found"}, status=404)
    # Ensure user has access to verify tickets for this event (allow organizer/owner)
    # If you want to restrict verification to the event owner only, keep this check.
    if ticket.event.organizer_id != request.user.id:
        return Response({"valid": False, "detail": "Not your event"}, status=403)
    if ticket.status == Ticket.Status.USED:
        return Response({"valid": False, "detail": "Already used"}, status=400)
    ticket.status = Ticket.Status.USED
    ticket.scanned_at = now()
    ticket.save(update_fields=["status", "scanned_at"])
    return Response({"valid": True, "ticket": TicketSerializer(ticket, context={"request": request}).data})


@api_view(["get"])
@permission_classes([permissions.IsAuthenticated])
def my_tickets(request):
    tickets = Ticket.objects.select_related("event").filter(attendee=request.user).order_by("-created_at")
    data = TicketSerializer(tickets, many=True, context={"request": request}).data
    return Response(data)


@api_view(["get"]) 
@permission_classes([permissions.IsAuthenticated])
def my_registrations(request):
    registrations = EventUser.objects.select_related("event").filter(user=request.user).order_by("-created_at")
    from .serializers import EventUserSerializer
    data = EventUserSerializer(registrations, many=True, context={"request": request}).data
    return Response(data)


@api_view(["get"])
@permission_classes([permissions.IsAuthenticated, IsOrganizer])
def event_registrations(request, event_id):
    try:
        event = Event.objects.get(pk=event_id, organizer=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)
    registrations = EventUser.objects.select_related("user").filter(event=event).order_by("-created_at")
    # Simple inline serializer to avoid exposing unnecessary fields
    data = [
        {"user_id": eu.user_id, "username": eu.user.username, "email": eu.user.email, "created_at": eu.created_at}
        for eu in registrations
    ]
    return Response({"event_id": event.id, "event": event.title, "registrations": data})


@api_view(["get"])
@permission_classes([permissions.IsAuthenticated])
def my_likes(request):
    likes = EventLike.objects.select_related("event").filter(user=request.user).order_by("-created_at")
    data = EventLikeSerializer(likes, many=True, context={"request": request}).data
    return Response(data)


