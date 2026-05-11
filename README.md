# PAMOJA Africa V — Registration System

Multi-tenant conference registration platform for Pamoja Africa V (2028), built for Campus Crusade for Christ Africa.

**Live:** https://pamoja-fzm97paly-samijas-projects.vercel.app
**Repo:** https://github.com/samija/pamoja-registration

---

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Database](#database)
- [All Routes](#all-routes)
- [Public Pages](#public-pages)
- [Registration Flow](#registration-flow)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Payment Gateways](#payment-gateways)
- [Notifications](#notifications)
- [Credentials & Access](#credentials--access)
- [Demo Data](#demo-data)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)

---

## Quick Start

```bash
# Clone
git clone https://github.com/samija/pamoja-registration.git
cd pamoja-registration

# Install
npm install

# Configure (copy and fill in your keys)
cp .env.local.example .env.local

# Run database migrations (in order)
# Paste each file into Supabase SQL Editor, or use psql:
psql "$DATABASE_URL" -f supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_seed_demo_data.sql
psql "$DATABASE_URL" -f supabase/migrations/003_groups_documents_checkin.sql
psql "$DATABASE_URL" -f supabase/migrations/004_rls_policies.sql
psql "$DATABASE_URL" -f supabase/migrations/005_directory_and_i18n.sql
psql "$DATABASE_URL" -f supabase/migrations/006_comprehensive_seed.sql

# Run dev server
npm run dev
# Opens at http://localhost:3000
```

---

## Architecture

```
Next.js 16 (App Router) + Supabase (Postgres + Auth + Storage) + Tailwind CSS v4
```

### Multi-Tenancy Model

Each country is a tenant identified by URL path:

| URL | Tenant | Currency | Payment Gateway |
|-----|--------|----------|-----------------|
| `/ethiopia` | Ethiopia | ETB (Br) | Chapa (Telebirr, bank, card) |
| `/kenya` | Kenya | KES (KSh) | M-Pesa (Daraja STK Push) |
| `/nigeria` | Nigeria | NGN (₦) | Paystack (card, bank) |

### Currency Strategy

Every payment stores both local and USD amounts:
- `amount_local` — what the user pays (ETB, KES, NGN)
- `exchange_rate` — captured from open API at payment time
- `amount_usd` — computed: `amount_local / exchange_rate`
- Reports always aggregate on `amount_usd`
- Rates are **never retroactively recalculated**

---

## Database

**8 tables** across 6 migrations:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `countries` | Tenant configuration | slug, currency, payment_gateway, locale |
| `conferences` | Event definitions | slug, name, dates, location |
| `country_conferences` | Pricing per country per conference | price_local, currency |
| `registrants` | All registrations | name, email, phone, status, group_id, qr_code, checked_in, directory_opt_in |
| `payments` | Transaction records | gateway, amount_local, amount_usd, exchange_rate, status, tx_ref |
| `groups` | Delegation/group registrations | leader info, organization, size |
| `documents` | Uploaded ID/passport for verification | file_path, status (pending/approved/rejected) |
| `checkins` | Event day check-in records | method (qr/manual), checked_in_by |
| `rate_limits` | API rate limiting | key, count, window_start |

### Row-Level Security

All tables have RLS enabled:
- **Public read:** countries, conferences, country_conferences
- **Public insert:** registrants, payments, groups, documents (for registration)
- **Authenticated read/write:** all tables (for admin)
- **Directory:** only `directory_opt_in = true AND status = 'confirmed'` registrants are publicly visible

### Migrations (run in order)

| File | What it does |
|------|-------------|
| `001_initial_schema.sql` | Core tables + Ethiopia seed |
| `002_seed_demo_data.sql` | Kenya/Nigeria countries + 10 Ethiopian registrants |
| `003_groups_documents_checkin.sql` | Groups, documents, checkins tables |
| `004_rls_policies.sql` | 24 RLS policies on all tables |
| `005_directory_and_i18n.sql` | Directory opt-in columns, rate_limits table |
| `006_comprehensive_seed.sql` | Full demo: 30 registrants, 3 groups, check-ins |

---

## All Routes

### Public Pages (15)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page — hero with countdown, about, conferences, countries, testimonials, history, CTA |
| `/speakers` | Static | Speaker profiles with photo cards |
| `/agenda` | Static | Full 7-day Pamoja + 5-day Staff Conference agenda with session types |
| `/venue` | Static | AACC venue — specs, facilities, logistics, hero image |
| `/faq` | Static | Accordion FAQ |
| `/accommodation` | Static | 6 partner hotels with pricing tiers |
| `/directory` | Static | Searchable attendee directory (opt-in confirmed registrants only) |
| `/status` | Static | Registration status lookup by email or payment reference |
| `/ethiopia` | SSG | Ethiopia country page with ETB pricing |
| `/kenya` | SSG | Kenya country page with KES pricing |
| `/nigeria` | SSG | Nigeria country page with NGN pricing |
| `/ethiopia/register` | Dynamic | Multi-step registration form |
| `/ethiopia/register/group` | SSG | Group/delegation registration |
| `/ethiopia/register/success` | Dynamic | Post-payment confirmation |
| `/sitemap.xml` | Generated | SEO sitemap |
| `/robots.txt` | Generated | Search engine directives |

### Admin Pages (10) — auth required

| Route | Description |
|-------|-------------|
| `/admin/login` | Email/password login (Supabase Auth) |
| `/admin` | Live dashboard — stats, revenue, by-country breakdown, recent registrations |
| `/admin/registrants` | Searchable/filterable list, checkbox bulk actions (confirm/cancel/export), real-time updates |
| `/admin/registrants/[id]` | Detail view — personal info, conference, payment history, print badge button |
| `/admin/groups` | Delegation list with member counts and confirmation rates |
| `/admin/checkin` | QR scanner / manual check-in with result feed |
| `/admin/verification` | Document review queue — approve/reject with filter tabs |
| `/admin/analytics` | Charts: status, country, gender, role, conference, revenue, 30-day trend |
| `/admin/settings` | Country enable/disable, pricing matrix with inline editing |
| `/admin/email` | Email blast — compose, filter by status, preview with personalization |

### API Routes (12)

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/register` | POST | Public | Create registration + initiate payment |
| `/api/register/group` | POST | Public | Group registration + single payment |
| `/api/payments/webhook` | POST | Public | Chapa/M-Pesa/Paystack callback |
| `/api/status` | GET | Public | Lookup by `?email=` or `?tx_ref=` |
| `/api/invitation` | GET | Public | Visa invitation letter HTML `?id=` |
| `/api/checkin` | POST | Admin | Check in a registrant by ID |
| `/api/documents` | POST | Public | Upload document for verification |
| `/api/documents` | PATCH | Admin | Approve/reject a document |
| `/api/admin/bulk` | POST | Admin | Bulk confirm/cancel/export selected |
| `/api/admin/badge` | GET | Admin | Printable conference badge HTML |
| `/api/admin/export` | GET | Admin | CSV export of all registrants |
| `/api/admin/email` | POST | Admin | Send email blast to filtered registrants |
| `/api/admin/logout` | POST | Admin | Sign out and redirect |

---

## Public Pages

### Landing Page (`/`)
- **Hero:** Conference title, tagline, live countdown timer (days:hours:min:sec), Register CTA
- **About:** What is Pamoja?
- **Conferences:** Pamoja Conference + Staff Conference cards
- **National Offices:** Ethiopia, Kenya, Nigeria with localized payment info
- **Testimonials:** 3 delegate quotes with photos
- **History:** Pamoja I-V timeline with images
- **CTA:** Final registration call-to-action
- **Dark mode toggle** in navbar

### Speakers (`/speakers`)
6 speaker cards with photos, roles, countries, scheduled dates. Color-coded backgrounds.

### Agenda (`/agenda`)
Tabbed view: Pamoja Conference (7 days) / Staff Conference (5 days). Each day shows sessions with time, title, venue, speaker, and color-coded type badges (Plenary, Workshop, Worship, Fellowship, etc.).

### Venue (`/venue`)
Hero image, venue description, 4 spec cards (3,500 auditorium, 2,000 hall, 20+ rooms, 6 dining halls), facilities checklist, logistics (air, accommodation, ground transport).

### Accommodation (`/accommodation`)
6 partner hotels in 4 tiers (Premium $95/night, Standard $68-72, Budget $42-48, Group $22). Star ratings, distance from venue, features, reserve buttons.

### Directory (`/directory`)
Grid of profile cards showing name, initials avatar, role, bio, organization, city, country, conference. Searchable by name/org/city. Filterable by country. Only shows confirmed registrants who opted in.

### Status Lookup (`/status`)
Enter email or payment reference. Shows: registration status (confirmed/pending/cancelled/waitlisted), payment status, conference, country, check-in status. Confirmed registrants get a "Download Invitation Letter" button.

### FAQ (`/faq`)
6 accordion items covering conference differences, eligibility, dates, costs, groups, visa.

---

## Registration Flow

### Individual Registration (`/[country]/register`)

**Step 1 — Conference Selection:**
Choose between Pamoja Conference and Staff Conference. Prices shown in local currency.

**Step 2 — Personal Details:**
First name, last name, email (validated), phone, gender, organization, role, city, directory opt-in checkbox.

**Step 3 — Review & Pay:**
Summary of all details + total amount. "Pay" button redirects to payment gateway (Chapa/M-Pesa/Paystack).

**After payment:**
1. Gateway webhook hits `/api/payments/webhook`
2. Payment verified with gateway API
3. Payment status updated in DB
4. Registrant status updated to "confirmed"
5. Redirected to `/[country]/register/success`

### Group Registration (`/[country]/register/group`)

1. Select conference
2. Enter group name, leader info, organization
3. Add members (2+ with name, email, phone, gender, role)
4. Total calculated: members × per-person price
5. Single payment for entire group
6. All members registered with `group_id` linked

### Protections
- **Rate limiting:** 5 registrations/minute per IP
- **Duplicate detection:** confirmed emails cannot re-register
- **Validation:** email format, required fields

---

## Admin Panel

### Access
- **URL:** `/admin/login`
- **Email:** `samson@pamoja.org`
- **Password:** `Pamoja@2207`
- Protected by middleware — unauthenticated requests redirect to login

### Dashboard (`/admin`)
- 4 stat cards: Total registrants, Confirmed, Pending, Revenue (USD)
- By-country breakdown with counts
- Recent 5 registrations with status badges and links

### Registrants (`/admin/registrants`)
- Table: name, email, phone, status badge, payment badge, date, view link
- **Search:** by name, email, phone
- **Filter:** by status (confirmed/pending/cancelled/waitlisted)
- **Bulk actions:** checkbox selection → Confirm / Cancel / Export Selected (CSV)
- **Real-time:** new registrations trigger toast notifications via Supabase Realtime
- **Export:** "Export CSV" button downloads all registrants

### Registrant Detail (`/admin/registrants/[id]`)
- Personal details card (name, phone, gender, org, role, city, date)
- Registration card (conference, country, locale, status)
- Payment history table (reference, gateway, local amount, USD, status, date)
- **Print Badge** button (for confirmed registrants) → opens printable badge in new tab

### Groups (`/admin/groups`)
- Each group shows: name, leader, organization, country, registration date
- Member count with confirmation rate badge (e.g., "3/4 confirmed")
- Member list with links to individual detail pages

### Check-In (`/admin/checkin`)
- Input field for QR scan or manual UUID entry
- Press Enter or click "Check In" to process
- Result feed shows: name, conference, status (Checked In / Already In / Failed)
- Validates: registrant must be "confirmed" to check in
- Prevents double check-in

### Verification (`/admin/verification`)
- Tab filters: Pending / Approved / Rejected / All
- Each document shows: registrant name, email, document type, filename
- Approve / Reject buttons for pending documents
- Review notes supported

### Analytics (`/admin/analytics`)
- Top stats: Total, Checked In, Revenue (USD), Check-in Rate %
- Bar charts: By Status, By Country, By Gender, By Conference, By Role
- Revenue by Currency with USD total
- 30-day registration trend (bar chart)

### Settings (`/admin/settings`)
- **Countries:** Enable/disable each country tenant
- **Pricing Matrix:** Click any cell to edit price inline. All countries × all conferences. Saves immediately.

### Email Blast (`/admin/email`)
- Subject line input
- HTML body editor with `{{name}}` personalization
- Filter: All / Confirmed / Pending / Waitlisted
- Preview button shows rendered email
- Send button dispatches to all matching registrants

---

## API Reference

### POST `/api/register`

Creates a registration and initiates payment.

**Body:**
```json
{
  "countrySlug": "ethiopia",
  "conferenceId": "pamoja-v",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+251911000000",
  "gender": "male",
  "organization": "AAU",
  "role": "Student",
  "city": "Addis Ababa"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.chapa.co/...",
  "txRef": "pamoja-ethiopia-abc12345-1234567890"
}
```

**Errors:** 400 (invalid country/conference/fields), 409 (duplicate email), 429 (rate limited), 500 (server error)

### POST `/api/register/group`

**Body:**
```json
{
  "countrySlug": "kenya",
  "conferenceId": "pamoja-v",
  "groupName": "Nairobi Chapel Youth",
  "leaderName": "James Ochieng",
  "leaderEmail": "james@example.com",
  "leaderPhone": "+254711000000",
  "organization": "Nairobi Chapel",
  "members": [
    { "firstName": "John", "lastName": "Doe", "email": "john@example.com", "phone": "", "gender": "male", "role": "Student" }
  ]
}
```

### POST `/api/payments/webhook`

Called by payment gateways after transaction. Verifies payment, updates status.

**Body (from Chapa):** `{ "tx_ref": "pamoja-eth-..." }`

### GET `/api/status?email=john@example.com`

Returns registration and payment status. Also accepts `?tx_ref=`.

### GET `/api/invitation?id=<registrant-uuid>`

Returns printable HTML invitation letter for visa applications. Only works for confirmed registrants.

### POST `/api/checkin`

**Body:** `{ "registrantId": "<uuid>", "method": "qr" }`
**Auth:** Requires authenticated session.
**Errors:** 401 (unauthorized), 404 (not found), 400 (not confirmed), 409 (already checked in)

### POST `/api/documents`

Multipart form upload: `file` (binary), `registrantId`, `type` (id_card/passport/student_id).

### PATCH `/api/documents`

**Body:** `{ "documentId": "<uuid>", "status": "approved", "reviewNote": "Looks good" }`

### POST `/api/admin/bulk`

**Body:** `{ "action": "confirm|cancel|export", "ids": ["uuid1", "uuid2"] }`

### GET `/api/admin/badge?id=<uuid>`

Returns printable HTML conference badge with QR code.

### GET `/api/admin/export`

Downloads CSV of all registrants with payment data.

### POST `/api/admin/email`

**Body:**
```json
{
  "subject": "Update from Pamoja",
  "body": "<p>Dear {{name}}, ...</p>",
  "filter": { "status": "confirmed" }
}
```

---

## Payment Gateways

### Chapa (Ethiopia)

| Field | Value |
|-------|-------|
| API | `https://api.chapa.co/v1` |
| Flow | Redirect to Chapa checkout → webhook callback |
| Supports | Telebirr, CBE, bank transfer, Visa/Mastercard |
| Env var | `CHAPA_SECRET_KEY` |
| Dashboard | https://dashboard.chapa.co |

### M-Pesa Daraja (Kenya)

| Field | Value |
|-------|-------|
| API | `https://sandbox.safaricom.co.ke` (sandbox) / `https://api.safaricom.co.ke` (prod) |
| Flow | STK Push to user's phone → callback |
| Env vars | `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_ENV` |
| Dashboard | https://developer.safaricom.co.ke |

### Paystack (Nigeria)

| Field | Value |
|-------|-------|
| API | `https://api.paystack.co` |
| Flow | Redirect to Paystack checkout → return URL |
| Supports | Card, bank transfer, USSD |
| Env var | `PAYSTACK_SECRET_KEY` |
| Dashboard | https://dashboard.paystack.com |

### Gateway Router

`src/lib/payments/router.ts` — automatically selects the correct gateway based on `country.payment_gateway` config. All gateways implement the `PaymentGateway` interface with `initiate()` and `verify()` methods.

---

## Notifications

### Email (Resend-ready)
- `src/lib/notifications/email.ts`
- Currently logs to console. Wire to Resend by uncommenting the SDK code and setting `RESEND_API_KEY`.
- HTML templates with PAMUJA branding.

### WhatsApp (Twilio)
- `src/lib/notifications/whatsapp.ts`
- Sends via Twilio WhatsApp API.
- Confirmation message template with name, conference, amount, reference.
- Env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`

### Telegram
- `src/lib/notifications/telegram.ts`
- Bot API for sending messages to individual chats.
- Admin channel notifications for new registrations.
- Env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHANNEL_ID`

---

## Credentials & Access

### Admin Login
| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | `samson@pamoja.org` |
| Password | `Pamoja@2207` |

### Supabase
| Field | Value |
|-------|-------|
| Dashboard | https://supabase.com/dashboard/project/oabpfkxqgshsexqatcvs |
| API URL | `https://oabpfkxqgshsexqatcvs.supabase.co` |
| Anon Key | `sb_publishable_T-Ftt588lvsiZ2-Yd4erGg_naoMxiJd` |
| DB Host | `aws-0-eu-west-1.pooler.supabase.com:6543` |
| DB User | `postgres.oabpfkxqgshsexqatcvs` |
| DB Password | `Pamoja@2207` |
| DB Name | `postgres` |

### psql Connection
```bash
/opt/homebrew/opt/libpq/bin/psql "postgresql://postgres.oabpfkxqgshsexqatcvs:Pamoja%402207@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

---

## Demo Data

After running all 6 migrations, the database contains:

| Entity | Count | Details |
|--------|-------|---------|
| Countries | 3 | Ethiopia, Kenya, Nigeria |
| Conferences | 2 | Pamoja Africa V, Staff Conference |
| Pricing | 6 | 2 per country |
| Registrants | 30 | 15 Ethiopia, 8 Kenya, 7 Nigeria |
| Payments | 29 | Completed, pending, initiated, failed |
| Groups | 3 | AAU Fellowship (5), Nairobi Chapel Youth (4), UNILAG CCC (3) |
| Check-ins | 4 | 2 Kenya, 2 Nigeria |
| Directory profiles | 6 | With bios and opt-in |

### Status Breakdown
- Confirmed: 21
- Pending: 5
- Waitlisted: 2
- Cancelled: 2

### Sample Registrants

**Ethiopia (15):**
| Name | Email | Status | Conference |
|------|-------|--------|------------|
| Abebe Tadesse | abebe.tadesse@gmail.com | confirmed | Pamoja V |
| Tigist Hailu | tigist.hailu@yahoo.com | confirmed | Pamoja V |
| Dawit Kebede | dawit.kebede@outlook.com | confirmed | Pamoja V |
| Sara Mengistu | sara.mengistu@gmail.com | pending | Pamoja V |
| Yohannes Gebremedhin | yohannes.g@gmail.com | confirmed | Pamoja V |
| Bethlehem Assefa | bethlehem.a@gmail.com | pending | Pamoja V |
| Solomon Bekele | solomon.bekele@cru.org | confirmed | Staff |
| Meron Alemu | meron.alemu@cru.org | confirmed | Staff |
| Henok Tesfaye | henok.tesfaye@gmail.com | cancelled | Pamoja V |
| Frehiwot Demissie | frehiwot.d@hotmail.com | waitlisted | Pamoja V |
| Nahom Girma | nahom.girma@gmail.com | confirmed | Pamoja V |
| Liya Teshome | liya.teshome@gmail.com | confirmed | Pamoja V |
| Kaleb Worku | kaleb.worku@gmail.com | confirmed | Pamoja V |
| Hanna Bekele | hanna.bekele@outlook.com | pending | Pamoja V |
| Pst. Tewodros Mekonnen | tewodros.m@cru.org | confirmed | Staff |

**Kenya (8):**
| Name | Email | Status | Conference |
|------|-------|--------|------------|
| James Ochieng | james.ochieng@gmail.com | confirmed | Pamoja V |
| Faith Wanjiku | faith.wanjiku@yahoo.com | confirmed | Pamoja V |
| Peter Kiprop | peter.kiprop@outlook.com | confirmed | Pamoja V |
| Mercy Akinyi | mercy.akinyi@gmail.com | pending | Pamoja V |
| Daniel Mutua | daniel.mutua@gmail.com | confirmed | Pamoja V |
| Grace Wambui | grace.wambui@gmail.com | waitlisted | Pamoja V |
| Rev. John Kamau | john.kamau@cru.org | confirmed | Staff |
| Sarah Njeri | sarah.njeri@cru.org | confirmed | Staff |

**Nigeria (7):**
| Name | Email | Status | Conference |
|------|-------|--------|------------|
| Chidi Okonkwo | chidi.okonkwo@gmail.com | confirmed | Pamoja V |
| Amara Adebayo | amara.adebayo@yahoo.com | confirmed | Pamoja V |
| Emmanuel Nnamdi | emmanuel.nnamdi@gmail.com | confirmed | Pamoja V |
| Blessing Eze | blessing.eze@gmail.com | pending | Pamoja V |
| Tunde Bakare | tunde.bakare@outlook.com | confirmed | Pamoja V |
| Pst. Ngozi Adekunle | ngozi.adekunle@cru.org | confirmed | Staff |
| Oluwaseun Afolabi | seun.afolabi@gmail.com | cancelled | Pamoja V |

### Test the Status Lookup

Go to `/status` and try:
- `abebe.tadesse@gmail.com` — confirmed Ethiopian registrant
- `mercy.akinyi@gmail.com` — pending Kenyan registrant
- `pamoja-eth-demo-001` — payment reference lookup

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Payment Gateways (at least one required for payments to work)
CHAPA_SECRET_KEY=CHASECK_TEST-xxx          # Ethiopia
MPESA_CONSUMER_KEY=                         # Kenya
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_ENV=sandbox                           # sandbox or production
PAYSTACK_SECRET_KEY=                        # Nigeria

# Notifications (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHANNEL_ID=

# Optional
NEXT_PUBLIC_SITE_URL=https://runpamoja.org  # For sitemap generation
```

---

## Deployment

### Vercel (current)

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

Auto-deploys on push to `main` via GitHub integration.

### Other platforms

Standard Next.js 16 build:
```bash
npm run build   # Creates .next/
npm start       # Production server on port 3000
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript 5 |
| Database | Supabase PostgreSQL + Row-Level Security |
| Auth | Supabase Auth (email/password for admin) |
| Storage | Supabase Storage (document uploads) |
| Styling | Tailwind CSS v4 with custom design tokens |
| Fonts | Montserrat (headings), Inter (body), Fraunces (decorative) |
| Payments | Chapa, M-Pesa Daraja, Paystack |
| QR Codes | `qrcode` npm package |
| Notifications | Twilio (WhatsApp), Telegram Bot API, Email (Resend-ready) |
| Hosting | Vercel (Edge Functions, ISR) |
| Real-time | Supabase Realtime (postgres_changes) |

### Design System — "Quiet Luxury"

| Token | Value | Usage |
|-------|-------|-------|
| Deep Green | `#0A1002` | Backgrounds, headers |
| Dark Green | `#1A2B0A` | Gradients |
| Mid Green | `#5C8727` | Success states, links |
| Lime | `#8DCF3D` | Primary accent, CTAs |
| Orange | `#EA7F1D` | Secondary accent, warnings |
| Cream | `#FAF7F2` | Page backgrounds |
| Charcoal | `#2C2C2C` | Body text |
| Border | `#E5E2DC` | Dividers, card borders |

### File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [country]/                # Multi-tenant country pages
│   │   ├── register/             # Registration + group + success
│   │   ├── layout.tsx            # Country layout with metadata
│   │   └── page.tsx              # Country landing
│   ├── admin/                    # Admin panel (auth-protected)
│   │   ├── analytics/            # Charts and demographics
│   │   ├── checkin/              # QR check-in
│   │   ├── email/                # Email blast
│   │   ├── groups/               # Delegation management
│   │   ├── login/                # Admin login
│   │   ├── registrants/          # List + [id] detail
│   │   ├── settings/             # Country/pricing CRUD
│   │   ├── verification/         # Document review
│   │   └── layout.tsx            # Admin sidebar
│   ├── api/                      # API routes
│   ├── accommodation/
│   ├── agenda/
│   ├── directory/
│   ├── faq/
│   ├── speakers/
│   ├── status/
│   ├── venue/
│   ├── globals.css               # Design tokens + dark mode
│   ├── layout.tsx                # Root layout + SEO
│   └── page.tsx                  # Landing page
├── components/
│   ├── registration/             # Multi-step + group forms
│   └── ui/                       # Design system primitives
├── config/                       # Static configuration
│   ├── conferences.ts
│   ├── content.ts                # Speakers, agenda, venue, FAQ, history
│   └── countries.ts
├── hooks/
│   └── use-realtime.ts           # Supabase Realtime hook
└── lib/
    ├── exchange/                 # Currency conversion
    ├── i18n/                     # EN + Amharic dictionaries
    ├── notifications/            # Email, WhatsApp, Telegram
    ├── payments/                 # Gateway interface + 3 adapters + router
    ├── qr/                       # QR code generation
    ├── rate-limit/               # In-memory rate limiter
    └── supabase/                 # Client, server, types
```
