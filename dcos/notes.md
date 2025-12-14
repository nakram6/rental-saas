# Rental SaaS – Developer Notes

## 2025-01-20
- Installed Laravel 11 project
- Added Breeze React SPA
- GitHub repo created and pushed
- Created `dev` branch for development workflow

## 2025-01-21
- Planned universal SaaS architecture
- Added migrations: tenants, items, bookings, customers
- Started Item API controller




Project Log — 10 Dec 2025

Setup Laravel + React monorepo

Created .env, .env.production, .gitignore

Configured MySQL connection

Fixed migrations ordering (tenants before domains)

Created TenantSeeder

Verified tenant resolution via /test-tenant

Fixed Laravel 11 middleware routing via bootstrap/app.php

Implemented multi-tenant middleware: SetCurrentTenant

Created Item model & migration

Created ItemController (full CRUD)

Registered API routes (routes/api.php)

Tested API via Postman — all endpoints working 🎉






On the computer that has the original rental_saas:

mysqldump -u root -p rental_saas > rental_saas.sql

mysql -u root -p -e "CREATE DATABASE rental_saas;"

mysql -u root -p rental_saas < /Users/nakram/Desktop/rental_saas.sql



npm install html2canvas jspdf





Mailpit listening on http://localhost:8025
SMTP listening on 127.0.0.1:1025


php artisan tinker

Mail::raw('Catalog test via Mailpit', function ($m) {
    $m->to('customer@example.com')->subject('Catalog Preview');
});
