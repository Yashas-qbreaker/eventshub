EventHub
========

Full-stack event management app (Django REST + React) with JWT auth, event discovery, RSVP with QR tickets, and an organizer dashboard. Styled using Bootswatch Morph CSS.

Quick start
-----------

Backend
- Create a virtualenv and install requirements:
  - cd backend
  - pip install -r requirements.txt
- Create .env from .env.example and adjust values
- Run migrations and start server:
  - python manage.py migrate
  - python manage.py runserver 8000

Frontend
- cd frontend
- npm install
- npm start

Environment
-----------

Backend (.env):
- SECRET_KEY=change-me
- DEBUG=true
- ALLOWED_HOSTS=*
- CORS_ALLOWED_ORIGINS=http://localhost:3000
- CSRF_TRUSTED_ORIGINS=http://localhost:3000

Frontend (.env):
- REACT_APP_API_BASE=http://localhost:8000

Features
--------
- JWT authentication (SimpleJWT)
- Roles: organizer, attendee
- Event CRUD for organizers
- Event discovery with search/filters/pagination
- RSVP with unique ticket UUID and QR image
- Ticket verification endpoint (organizer)
- Organizer dashboard and attendee ticket wallet

API Docs
--------
Swagger UI at /api/docs/ after backend is running.


