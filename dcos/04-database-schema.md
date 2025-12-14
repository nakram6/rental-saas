# Database Schema

## Tenants
- id
- name
- slug
- industry_type
- settings (json)

## Users
- id
- tenant_id
- name
- email
- password
- role

## Items
- id
- tenant_id
- name
- sku
- description
- rental_type (bulk, trackable)
- qty_total
- price_per_day
- security_deposit
- meta (json)

## Bookings
- id
- tenant_id
- customer_id
- status
- start_date
- end_date
- totals
- notes

## Booking Items
- booking_id
- item_id
- qty
- unit_price
