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











CONTEXT CAPSULE — Rental SaaS (Invoices + Accounting)
Project


Laravel 12 + Inertia + React (Vite)


Multi-tenant Rental SaaS (Harbour Decor Rentals)


Theme system (light / dark / gold)


Authenticated admin dashboard



🧾 Invoicing System (Current State)
Database
Tables


invoices


invoice_lines


journal_entries


journal_lines


accounts


tenant-scoped everywhere


Invoice status flow
draft → sent → paid (LOCKED)
void (allowed before paid)

Once paid, invoice cannot be modified.

📄 Invoice UI
Pages


Accounting/Invoices/Index.jsx


Accounting/Invoices/Create.jsx


Index page features


KPI cards (Total / Paid / Unpaid / Amount)


Search by invoice # or customer


Filter by status (all / unpaid / paid / sent / draft / void)


Status dropdown per invoice


Disabled when status = paid


Confirmation before marking paid




Toast notifications (success + error)


PDF preview & download buttons (routes exist)


Pagination


Create page


Customer selection


Line items


Discount + tax


Auto total calculation


Save invoice



🔐 Backend Logic
Invoice Model
public function isLocked(): bool {
    return $this->status === 'paid';
}

Status Update Controller
Method
PATCH /accounting/invoices/{invoice}/status

Behavior


Tenant safety enforced


If invoice is already paid → return back with flash error


On transition → paid


Create journal entry


Debit Cash


Credit Accounts Receivable


Prevent duplicate journal entries




Flash success message per status



📘 Accounting (Journal Entries)
When invoice is marked PAID


Create journal_entries record


Create 2 journal_lines


Debit: Cash


Credit: Accounts Receivable




Includes:


tenant_id


customer_id


booking_id


memo + description





🔔 Toast System


Uses usePage().props.flash


Shows:


flash.success


flash.error





⚠️ Key Fixes Done


Added memo + description to JournalLine::$fillable


Avoided abort(403) for paid invoices (use flash instead)


Fixed blank page caused by inv used outside .map()


Disabled dropdown when paid


Confirmation before marking paid



🔜 Next Possible Steps


Payment screen (instead of instant paid)


Reverse journal on VOID


Trial balance / AR aging


Fully branded PDF (logo, address, phone, GST/HST)


Invoice PDF modal preview



🧠 Instruction for new ChatGPT window
Paste everything above and say:

“Continue from this context. We are working on the Invoice + Accounting system. Invoice status locking, journals, and Inertia UI are already implemented.”


If you want, I can also:


Turn this into a README.md


Create an architecture diagram


Prepare a production accounting roadmap


Just tell me 😊


General Ledger screen

Trial Balance

Auto-posting revenue on invoice sent

Partial payments

Refund journals

Just say the wo




Invoice → Journal Entry → Journal Lines → General Ledger → Trial Balance

Journal Entries record each transaction

General Ledger shows movements per account

Trial Balance summarizes all account balances





ChatGPT is like Gmail, OpenAI API is like email protocols (SMTP/IMAP).


Simple analogy (best one)

OpenAI = Apple

ChatGPT = iPhone

OpenAI API = iOS S


brew install imagemagick
👉 This installs a trusted image processing tool
👉 It does NOT touch your images yet
👉 One-time install only