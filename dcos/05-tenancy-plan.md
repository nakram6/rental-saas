# Tenancy Plan

## Phase 1: Simple tenancy
- Hardcode tenant_id = 1 for development
- Add tenant_id to models
- Scope all queries manually

## Phase 2: Domain-based tenancy
- domains table
- middleware: resolve tenant from request host
- set current tenant instance in container
- global scope auto-applied to each model

## Phase 3: Full SaaS features
- Tenant settings
- Branding
- Subscriptions (Stripe)
- Custom domains per tenant

## Notes
- Data must NEVER mix between tenants
