# PAMOJA — Architecture Overview

> Distributed Registration System for Pamoja Africa Continental Conferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components, Turbopack) |
| Database | Supabase (PostgreSQL + Row-Level Security + Realtime) |
| Auth | Supabase Auth (email/password for admin) |
| Storage | Supabase Storage (document uploads) |
| Styling | Tailwind CSS v4 with PAMUJA design tokens + dark mode |
| Payments | Chapa (Ethiopia), M-Pesa Daraja (Kenya), Paystack (Nigeria) |
| QR | `qrcode` package for check-in badges |
| Notifications | Twilio WhatsApp, Telegram Bot API, Email (Resend-ready) |
| Real-time | Supabase postgres_changes subscriptions |
| i18n | Custom dictionary system (EN + Amharic) |
| Hosting | Vercel (auto-deploy from GitHub) |

## Multi-Tenancy

Country offices are tenants identified by URL path (`/ethiopia`, `/kenya`, `/nigeria`). Each tenant has:
- Localized landing page and language
- Currency and payment gateway configuration
- Pricing tiers (stored in `country_conferences` join table)
- RLS policies for data isolation
- Middleware validates country slugs, redirects invalid paths

## Data Model (8 tables)

```
countries            → slug, name, currency, payment_gateway, locale, is_active
conferences          → slug, name, year, dates, location
country_conferences  → country_id, conference_id, price_local, currency
registrants          → country_id, conference_id, group_id, name, email, phone, status,
                       qr_code, checked_in, directory_opt_in, bio
payments             → registrant_id, gateway, tx_ref, amount_local, currency_local,
                       exchange_rate, amount_usd, status
groups               → country_id, leader_name, leader_email, organization, size
documents            → registrant_id, type, file_path, status (pending/approved/rejected)
checkins             → registrant_id, checked_in_by, method, notes
```

## Security

- **RLS:** 24 policies across all 8 tables
- **Auth:** Supabase Auth middleware protects /admin routes
- **Rate limiting:** 5 req/min per IP on registration API
- **Duplicate detection:** confirmed emails cannot re-register
- **Input validation:** email format, required fields, country/conference existence

## Payment Flow

```
User fills form → POST /api/register
  ├── Validate country, conference, fields
  ├── Check duplicate email
  ├── Create registrant (status: pending)
  ├── Fetch exchange rate (cached 1hr)
  ├── Create payment record (status: initiated)
  ├── Route to correct gateway (Chapa/M-Pesa/Paystack)
  └── Return checkout URL → redirect user

Gateway callback → POST /api/payments/webhook
  ├── Verify payment with gateway API
  ├── Update payment status
  ├── Update registrant status to "confirmed"
  └── (TODO) Send confirmation via email/WhatsApp/Telegram
```

## Currency Strategy

All payments stored with both local amount and USD equivalent:
- `amount_local`: what the user pays (ETB, KES, NGN)
- `exchange_rate`: from open API, captured at payment time
- `amount_usd`: `amount_local / exchange_rate`
- Rates are never retroactively recalculated
- Admin reports aggregate on `amount_usd`

## Real-time

Admin dashboard subscribes to `registrants` table via Supabase Realtime. New registrations trigger toast notifications and automatic data reload. Uses custom `useRealtime` hook.

## Design System — "Quiet Luxury"

- **Palette:** Deep green (#0A1002), Lime (#8DCF3D), Orange (#EA7F1D), Cream (#FAF7F2)
- **Typography:** Montserrat (headings), Inter (body), Fraunces (decorative)
- **Components:** Button, Input, Select, Card, Badge, Navbar, Footer, Countdown, ScrollReveal, Toast
- **Dark mode:** CSS custom properties swap on `.dark` class, system preference detection
- **Animations:** Scroll-reveal on sections, slide-in toasts, countdown timer
