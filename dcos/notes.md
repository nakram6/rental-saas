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