import django_filters
from .models import Event
from django.db import models


class EventFilter(django_filters.FilterSet):
    start_after = django_filters.IsoDateTimeFilter(field_name="start_datetime", lookup_expr="gte")
    start_before = django_filters.IsoDateTimeFilter(field_name="start_datetime", lookup_expr="lte")
    location = django_filters.CharFilter(field_name="location", lookup_expr="icontains")
    category = django_filters.CharFilter(field_name="category__name", lookup_expr="iexact")
    search = django_filters.CharFilter(method="search_filter")

    class Meta:
        model = Event
        fields = ["location", "category", "start_after", "start_before"]

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) | models.Q(description__icontains=value) | models.Q(tags__icontains=value)
        )


