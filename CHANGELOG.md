# Changelog

All notable changes to the PAMUJA Registration System.

## [0.3.0] — Phase 3 Operations & Scale

### Added
- **Group registration** — `/[country]/register/group` for church/campus delegations with multi-member form, group payment
- **QR code check-in** — QR generation per registrant, `/admin/checkin` scanner page with real-time results feed
- **Document verification** — Upload API (`/api/documents`), admin review queue (`/admin/verification`) with approve/reject
- **Admin analytics** — `/admin/analytics` with bar charts: by status, country, gender, role, conference; revenue by currency; 30-day registration trend
- **Printable badge** — `/api/admin/badge?id=` generates branded HTML badge with QR code, ready for print
- **Group management** — `/admin/groups` shows all delegations with member list and confirmation rates
- **Admin sidebar** — Expanded with Groups, Check-In, Verification, Analytics links
- **RLS policies** — Row-Level Security on all 8 tables; public read for countries/conferences, authenticated for everything else
- **Database schema** — `groups`, `documents`, `checkins` tables; `qr_code`, `checked_in`, `group_id` columns on registrants

## [0.2.0] — Phase 2 Multi-Tenant & Operations

### Added
- **Admin authentication** — Supabase Auth login/logout, middleware-protected `/admin` routes
- **Admin sidebar layout** — Persistent navigation with Dashboard and Registrants links
- **Live dashboard** — Real-time stats from Supabase (total, confirmed, pending, revenue USD, by-country breakdown, recent registrations)
- **Registrant detail view** — `/admin/registrants/[id]` with personal info, conference, payment history table
- **CSV export** — `/api/admin/export` generates downloadable CSV of all registrants with payment data
- **Status and search filters** — Registrant list now filters by status (confirmed/pending/cancelled/waitlisted) and search
- **M-Pesa Daraja adapter** — STK push for Kenya (initiate, query status)
- **Paystack adapter** — Nigeria payment gateway (initiate, verify)
- **Payment gateway router** — Auto-routes to correct gateway based on country config
- **WhatsApp notifications** — Twilio-based confirmation messages with formatted templates
- **Telegram notifications** — Bot API for registrant confirmations + admin channel alerts
- **Middleware** — Country slug validation (redirects invalid slugs), admin auth guard
- **Demo seed data** — 10 Ethiopian registrants, 9 payments across all statuses, Kenya & Nigeria countries with pricing
- **Admin user** — `samson@pamoja.org` / `Pamoja@2207`

## [0.1.0] — Phase 1 MVP

### Added
- **Next.js 16 project** with App Router, TypeScript, Tailwind CSS v4
- **PAMUJA Design System** — Button, Input, Select, Card, Badge components with Quiet Luxury tokens
- **Multi-tenant routing** — `[country]` dynamic segments with static generation for Ethiopia, Kenya, Nigeria
- **Global landing page** — Hero, About, Conferences, National Offices sections
- **Ethiopia tenant** — Country landing page with localized pricing in ETB
- **Multi-step registration form** — Conference selection → Personal details → Review & Pay
- **Supabase schema** — 5 tables with indexes, triggers, seed data
- **Chapa payment gateway** — Full adapter (initiate, verify)
- **Webhook handler** — Payment verification and status updates
- **Exchange rate service** — USD conversion with cached rates
- **Email confirmation template** — Resend-ready HTML email
- **Success page** — Post-payment confirmation
- **ARCHITECTURE.md** — Full system documentation
