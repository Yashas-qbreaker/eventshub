import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self) -> str:
        return self.name


class Event(models.Model):
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.CharField(max_length=200, blank=True)
    capacity = models.PositiveIntegerField(default=0)
    seats_left = models.PositiveIntegerField(default=0)
    poster = models.ImageField(upload_to="posters/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self._state.adding and self.seats_left == 0:
            self.seats_left = self.capacity
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title}"


class Ticket(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        USED = "used", "Used"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tickets")
    attendee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    qr_image = models.ImageField(upload_to="tickets/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    scanned_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ("event", "attendee")

    def __str__(self) -> str:
        return f"{self.id} - {self.event.title}"


class User(AbstractUser):
    class Role(models.TextChoices):
        ORGANIZER = "organizer", "Organizer"
        ATTENDEE = "attendee", "Attendee"

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.ATTENDEE)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"


class EventUser(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event_users")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="event_users")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("event", "user")

    def __str__(self) -> str:
        return f"{self.user} -> {self.event}"


class EventLike(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="liked_events")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("event", "user")

    def __str__(self) -> str:
        return f"{self.user} likes {self.event}"


class UserAuthProxy(User):
    class Meta:
        proxy = True
        app_label = "auth"
        verbose_name = "User"
        verbose_name_plural = "Users"


