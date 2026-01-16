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
            # Music Category
            {
                "title": "Summer Music Festival 2025",
                "description": "Join us for an electrifying music festival featuring top artists and bands. Experience live performances across multiple stages with food, drinks, and amazing vibes.",
                "start": now + timedelta(days=7, hours=18),
                "end": now + timedelta(days=7, hours=23),
                "location": "Central Park, Bengaluru",
                "category": categories["Music"],
                "capacity": 5000,
                "featured": True,
            },
            # Nightlife Category
            {
                "title": "Neon Nights - Rooftop Party",
                "description": "Experience the best nightlife in the city with DJ sets, cocktails, and stunning city views. Dress to impress and dance the night away!",
                "start": now + timedelta(days=2, hours=20),
                "end": now + timedelta(days=3, hours=2),
                "location": "Sky Lounge, MG Road, Bengaluru",
                "category": categories["Nightlife"],
                "capacity": 300,
                "featured": False,
            },
            # Performing & Visual Category
            {
                "title": "Contemporary Dance Showcase",
                "description": "A mesmerizing evening of contemporary dance performances by renowned artists. Experience the art of movement and expression.",
                "start": now + timedelta(days=9, hours=19),
                "end": now + timedelta(days=9, hours=21),
                "location": "Ranga Shankara Theatre, Bengaluru",
                "category": categories["Performing & Visual"],
                "capacity": 400,
                "featured": True,
            },
            # Business Category
            {
                "title": "Investors Lunch | B2B Networking (Bengaluru)",
                "description": "Exclusive networking lunch with investors and founders.",
                "start": now + timedelta(days=3, hours=12),
                "end": now + timedelta(days=3, hours=15),
                "location": "Bengaluru",
                "category": categories["Business"],
                "capacity": 120,
                "featured": True,
            },
            {
                "title": "Women in Tech Bengaluru - OutGeekWomen",
                "description": "Celebrating women in tech with talks, mentorship and networking.",
                "start": now + timedelta(days=5, hours=16),
                "end": now + timedelta(days=5, hours=20),
                "location": "Bengaluru",
                "category": categories["Business"],
                "capacity": 200,
                "featured": True,
            },
            {
                "title": "Upcoming Dubai Property Expo in Bangalore – October 2025",
                "description": "Meet developers and explore investment opportunities.",
                "start": now + timedelta(days=12, hours=14),
                "end": now + timedelta(days=12, hours=19),
                "location": "JW Marriott Hotel Bengaluru",
                "category": categories["Business"],
                "capacity": 250,
                "featured": False,
            },
            # Food & Drink Category
            {
                "title": "Wine Tasting & Food Pairing Experience",
                "description": "Discover fine wines from around the world paired with exquisite cuisine. Learn from sommeliers and chefs in an intimate setting.",
                "start": now + timedelta(days=6, hours=18),
                "end": now + timedelta(days=6, hours=21),
                "location": "The Leela Palace, Bengaluru",
                "category": categories["Food & Drink"],
                "capacity": 80,
                "featured": False,
            },
            # Hobbies Category
            {
                "title": "OWASP AppSec Days Bangalore 2025",
                "description": "A day full of application security talks and workshops.",
                "start": now + timedelta(days=10, hours=9),
                "end": now + timedelta(days=10, hours=17),
                "location": "Indian Institute of Science (Bengaluru)",
                "category": categories["Hobbies"],
                "capacity": 300,
                "featured": False,
            },
            {
                "title": "Open Source India 2025",
                "description": "Asia's leading open source event.",
                "start": now + timedelta(days=18, hours=9),
                "end": now + timedelta(days=18, hours=18),
                "location": "NIMHANS Convention Centre - Bengaluru",
                "category": categories["Hobbies"],
                "capacity": 500,
                "featured": False,
            },
            {
                "title": "Photography Workshop: Street Photography",
                "description": "Learn the art of street photography from professional photographers. Hands-on session with camera techniques and composition tips.",
                "start": now + timedelta(days=11, hours=10),
                "end": now + timedelta(days=11, hours=16),
                "location": "Cubbon Park, Bengaluru",
                "category": categories["Hobbies"],
                "capacity": 50,
                "featured": False,
            },
            # Dating Category
            {
                "title": "Speed Dating Night - Singles Mixer",
                "description": "Meet interesting people in a fun, relaxed environment. Multiple rounds of speed dating followed by socializing. Ages 25-40.",
                "start": now + timedelta(days=4, hours=19),
                "end": now + timedelta(days=4, hours=22),
                "location": "The Social, Indiranagar, Bengaluru",
                "category": categories["Dating"],
                "capacity": 60,
                "featured": False,
            },
            # Halloween Category
            {
                "title": "Halloween Costume Party 2025",
                "description": "Get ready for a spooktacular Halloween party! Best costume contest, themed cocktails, haunted house experience, and DJ music. Come in your scariest costume!",
                "start": now + timedelta(days=15, hours=20),
                "end": now + timedelta(days=16, hours=1),
                "location": "Hard Rock Cafe, Bengaluru",
                "category": categories["Halloween"],
                "capacity": 350,
                "featured": True,
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


