# API Design

Base URL: `/api`

## Authentication
- POST /login
- POST /logout
- GET /user

## Items
- GET /items
- POST /items
- GET /items/{id}
- PUT /items/{id}
- DELETE /items/{id}

## Bookings
- GET /bookings
- POST /bookings
- GET /bookings/{id}
- PUT /bookings/{id}
- DELETE /bookings/{id}

## Availability
- GET /items/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
