# PAMUJA — Architecture Overview

> Distributed Registration System for Pamoja Africa Continental Conferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Database | Supabase (PostgreSQL 15 + Row-Level Security) |
| Auth | Supabase Auth (admin) + magic link (registrants) |
| Styling | Tailwind CSS v4 with PAMUJA design tokens |
| Payments | Chapa (Ethiopia), M-Pesa Daraja (Kenya), Paystack (Nigeria) |
| Notifications | Twilio WhatsApp, Telegram Bot API |
| Hosting | Vercel (Edge Functions, ISR) |
| CI/CD | GitHub Actions |

## Multi-Tenancy

Country offices are tenants identified by URL path (`/ethiopia`, `/kenya`). Each tenant has:
- Localized landing page and language
- Currency and payment gateway configuration
- Pricing tiers (stored in `country_conferences` join table)
- RLS policies scoping admin access to their country's data

## Data Model (Core)

```
countries        → id, slug, name, currency, locale, payment_config
conferences      → id, name, year, dates
country_conferences → country_id, conference_id, price_local
registrants      → id, country_id, conference_id, name, email, phone, status
payments         → id, registrant_id, gateway, amount_local, currency, exchange_rate, amount_usd, status, tx_ref
```

## Currency Strategy

All payments stored with both local amount and USD equivalent. Exchange rate is captured at payment confirmation time and never retroactively adjusted. Reports aggregate on `amount_usd`.

## Payment Flow

1. Registrant selects conference and fills form
2. Server Action creates `registrant` (status: pending) and `payment` (status: initiated)
3. Redirect to gateway (Chapa/M-Pesa/Paystack) with callback URL
4. Webhook confirms payment → update statuses → send confirmation (WhatsApp/SMS/email)

## Design System

PAMUJA "Quiet Luxury" aesthetic:
- Palette: Deep green (#0A1002), Lime accent (#8DCF3D), Orange (#EA7F1D), Cream, Charcoal
- Typography: Montserrat (headings), Inter (body), Fraunces (decorative)
- Principles: Generous whitespace, subtle glassmorphism, scroll-reveal animations
