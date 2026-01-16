from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Category, Event, Ticket, EventUser, EventLike


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class EventWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "start_datetime",
            "end_datetime",
            "location",
            "category",
            "tags",
            "capacity",
            "seats_left",
            "poster",
            "featured",
        ]
        read_only_fields = ["seats_left"]

    def create(self, validated_data):
        validated_data["organizer"] = self.context["request"].user
        return super().create(validated_data)


class EventReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    poster = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "start_datetime",
            "end_datetime",
            "location",
            "category",
            "tags",
            "capacity",
            "seats_left",
            "poster",
            "featured",
            "created_at",
        ]

    def get_poster(self, obj):
        if not obj.poster:
            return None
        request = self.context.get("request")
        url = obj.poster.url
        return request.build_absolute_uri(url) if request else url


class TicketSerializer(serializers.ModelSerializer):
    event = EventReadSerializer(read_only=True)
    qr_image = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ["id", "event", "status", "qr_image", "created_at", "scanned_at"]

    def get_qr_image(self, obj):
        if not obj.qr_image:
            return None
        request = self.context.get("request")
        url = obj.qr_image.url
        return request.build_absolute_uri(url) if request else url


class RSVPSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()


class EventUserSerializer(serializers.ModelSerializer):
    event = EventReadSerializer(read_only=True)

    class Meta:
        model = EventUser
        fields = ["id", "event", "created_at"]


class EventLikeSerializer(serializers.ModelSerializer):
    event = EventReadSerializer(read_only=True)

    class Meta:
        model = EventLike
        fields = ["id", "event", "created_at"]


# User serializers moved from users app
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # exclude role from serializer: backend retains role field but we don't expose it
        fields = ["id", "username", "email", "first_name", "last_name", "avatar", "is_staff"]
        read_only_fields = ["id", "username", "email", "is_staff"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        # role removed from registration payload
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


