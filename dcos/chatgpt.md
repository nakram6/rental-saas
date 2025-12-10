This is a continuation of my SaaS rental project called "rental-saas". 

Tech stack: Laravel 11 + React (Breeze), MySQL, multi-tenant architecture.

What we already implemented:

1. Tenant system:
   - Tenant model, domains model, migrations fixed.
   - TenantSeeder created (Harbour Decor Rentals).
   - Middleware: SetCurrentTenant binds app('currentTenant').
   - Laravel 11 middleware added via bootstrap/app.php (web + api).

2. Items API:
   - Item model and migration with tenant_id.
   - ItemController with GET, POST, PUT, DELETE.
   - Routes added in routes/api.php
   - Tested with Postman — working.

3. Next step I want: React frontend Items page (list, add, edit, delete).

Please continue the development from here.







Second. reference


PROJECT REFERENCE – "rental-saas" (Laravel 11 + React + Inertia)

Stack:
- Laravel 11 backend (multi-tenant)
- React + Inertia (Breeze) frontend
- MySQL database
- Vite for assets

Multi-tenant setup:
- Tenant model + domains model (migrations fixed so tenants table before domains).
- TenantSeeder creates a default tenant: "Harbour Decor Rentals" with slug "harbour-decor".
- Middleware: App\Http\Middleware\SetCurrentTenant
  - Uses Tenant::where('slug', 'harbour-decor')->first() for now.
  - Bound in bootstrap/app.php using $middleware->web(append: [...]) and $middleware->api(append: [...]).
- Test route /test-tenant returns app('currentTenant') and works.

Backend API:
- Item model with fields: tenant_id, name, sku, description, rental_type, qty_total, price_per_day, security_deposit, is_active, meta (JSON).
- Items migration includes foreignId('tenant_id')->constrained() and indexes on (tenant_id, name).
- ItemController (API) with index, store, show, update, destroy.
- API routes in routes/api.php:
  - GET /api/items
  - POST /api/items
  - GET /api/items/{item}
  - PUT /api/items/{item}
  - DELETE /api/items/{item}
- All item queries scoped by tenant_id = currentTenant->id.
- Tested with Postman: all CRUD endpoints work.

Admin side (authenticated):
- Breeze React auth set up.
- routes/web.php has:
  - /dashboard → Inertia::render('Dashboard') with auth + verified.
  - /items → Inertia::render('Items/Index') inside auth middleware.
- React admin page at resources/js/Pages/Items/Index.jsx:
  - Uses axios to call /api/items.
  - Supports listing, adding, editing, and deleting items in a table.

Public/client side:
- PublicCatalogController:
  - home() → Inertia::render('Home', ['tenant' => $tenant, 'items' => featured subset])
  - index() → Inertia::render('Public/Catalog', ['tenant' => $tenant, 'items' => all active items])
- routes/web.php:
  - GET / → PublicCatalogController@home (client-facing home page)
  - GET /catalog → PublicCatalogController@index (client-facing catalog)
- GuestLayout.jsx has been updated:
  - If no tenant prop: old Breeze-style centered card for login/register.
  - If tenant prop provided: full-page layout with header (logo + nav) and footer (contact info).
- Home.jsx:
  - Uses GuestLayout tenant={tenant}.
  - Has a full-width hero slideshow with background images from /images/*.jpg.
  - Dark/luxury theme (slate + amber).
  - Featured items section and "Why choose us" strip + final CTA.
- Public/Catalog.jsx:
  - Uses GuestLayout tenant={tenant}.
  - Shows grid of items (4 columns on large screens).
  - Each card has an image (dummy image pool from /images), category chip, description, price/day, quantity, and "Add to quote" button.

What I want to do next:
- Continue building the public/client experience:
  - Improve Catalog filters (by category, price, etc.) and/or
  - Implement a simple "Add to Quote" cart for visitors and
  - Add item images upload on the admin side.

Please continue from this context.
