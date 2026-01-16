from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from events.models import Category, Event


class Command(BaseCommand):
    help = "Seed the database with sample categories, an organizer user, and sample events"

    def handle(self, *args, **options):
        User = get_user_model()

        # Create or get a default organizer
        organizer, created = User.objects.get_or_create(
            username="demo_organizer",
            defaults={
                "email": "organizer@example.com",
                "role": "organizer",
            },
        )
        if created:
            organizer.set_password("password123")
            organizer.save()
            self.stdout.write(self.style.SUCCESS("Created organizer user 'demo_organizer' (password: password123)"))
        else:
            self.stdout.write("Organizer user already exists: demo_organizer")

        # Categories
        category_names = [
            "Music",
            "Nightlife",
            "Performing & Visual",
            "Business",
            "Food & Drink",
            "Hobbies",
            "Dating",
            "Halloween",
        ]
        categories = {}
        for name in category_names:
            cat, _ = Category.objects.get_or_create(name=name)
            categories[name] = cat

        now = timezone.now()

        samples = [
            {
                "title": "Investors Lunch | B2B Networking (Bengaluru)",
                "description": "Exclusive networking lunch with investors and founders.",
                "start": now + timedelta(days=3, hours=2),
                "end": now + timedelta(days=3, hours=5),
                "location": "Bengaluru",
                "category": categories["Business"],
                "capacity": 120,
                "featured": True,
            },
            {
                "title": "OWASP AppSec Days Bangalore 2025",
                "description": "A day full of application security talks and workshops.",
                "start": now + timedelta(days=10, hours=1),
                "end": now + timedelta(days=10, hours=9),
                "location": "Indian Institute of Science (Bengaluru)",
                "category": categories["Hobbies"],
                "capacity": 300,
                "featured": False,
            },
            {
                "title": "Open Source India 2025",
                "description": "Asia's leading open source event.",
                "start": now + timedelta(days=18, hours=3),
                "end": now + timedelta(days=18, hours=10),
                "location": "NIMHANS Convention Centre - Bengaluru",
                "category": categories["Hobbies"],
                "capacity": 500,
                "featured": False,
            },
            {
                "title": "Women in Tech Bengaluru - OutGeekWomen",
                "description": "Celebrating women in tech with talks, mentorship and networking.",
                "start": now + timedelta(days=5, hours=4),
                "end": now + timedelta(days=5, hours=8),
                "location": "Bengaluru",
                "category": categories["Business"],
                "capacity": 200,
                "featured": True,
            },
            {
                "title": "Upcoming Dubai Property Expo in Bangalore – October 2025",
                "description": "Meet developers and explore investment opportunities.",
                "start": now + timedelta(days=12, hours=2),
                "end": now + timedelta(days=12, hours=7),
                "location": "JW Marriott Hotel Bengaluru",
                "category": categories["Business"],
                "capacity": 250,
                "featured": False,
            },
        ]

        created_count = 0
        for s in samples:
            event, was_created = Event.objects.get_or_create(
                organizer=organizer,
                title=s["title"],
                defaults={
                    "description": s["description"],
                    "start_datetime": s["start"],
                    "end_datetime": s["end"],
                    "location": s["location"],
                    "category": s["category"],
                    "capacity": s["capacity"],
                    "featured": s["featured"],
                },
            )
            if was_created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Seed complete. Created {created_count} events."))


