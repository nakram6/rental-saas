# System Architecture

## Backend
- Laravel 11 API
- Sanctum authentication
- Multi-tenancy (domain-based)
- Models: Tenant, User, Customer, Item, Booking

## Frontend
- React + Vite SPA
- axios client for API calls
- React Router for pages

## Multi-Tenancy Key Concepts
- Each request belongs to a tenant.
- Tenant identified by domain or subdomain.
- All models include tenant_id.
- Global scope ensures data isolation.

## Future Enhancements
- Webhooks
- Package builder
- Inventory availability engine
