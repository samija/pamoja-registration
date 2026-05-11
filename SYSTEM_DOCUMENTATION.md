# PAMOJA Africa V — Complete System Documentation

> **Version:** 1.0.0
> **Production URL:** https://pamoja-pi.vercel.app
> **Repository:** https://github.com/samija/pamoja-registration
> **Last Updated:** May 11, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Roadmap](#2-system-roadmap)
3. [Access Credentials](#3-access-credentials)
4. [Public Website — Feature Documentation](#4-public-website--feature-documentation)
5. [Registration System — Feature Documentation](#5-registration-system--feature-documentation)
6. [Admin Panel — Feature Documentation](#6-admin-panel--feature-documentation)
7. [API System — Feature Documentation](#7-api-system--feature-documentation)
8. [Payment Gateways — Feature Documentation](#8-payment-gateways--feature-documentation)
9. [Notification System — Feature Documentation](#9-notification-system--feature-documentation)
10. [Database Schema](#10-database-schema)
11. [Security Features](#11-security-features)
12. [Internationalization](#12-internationalization)
13. [Design System](#13-design-system)
14. [Demo Data Catalog](#14-demo-data-catalog)
15. [Infrastructure & Deployment](#15-infrastructure--deployment)
16. [Environment Variables Reference](#16-environment-variables-reference)
17. [File Structure](#17-file-structure)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Executive Summary

PAMOJA is a multi-tenant, global-scale conference registration platform built for Pamoja Africa V — the 5th continental gathering of Campus Crusade for Christ Africa, scheduled for December 2027 — January 2028 in Addis Ababa, Ethiopia.

### What the system does

- Allows **5,000+ delegates** from across Africa to register through their **national office** (Ethiopia, Kenya, Nigeria)
- Accepts **localized payments** in local currency (ETB via Telebirr/Chapa, KES via M-Pesa, NGN via Paystack)
- Converts all payments to **USD for unified reporting**
- Provides a full **admin panel** for managing registrants, check-ins, document verification, analytics, and communications
- Generates **QR-coded conference badges** and **visa invitation letters**
- Supports **individual and group registration** (church/campus delegations)
- Offers a **public attendee directory** for networking (opt-in)

### Key numbers

| Metric | Value |
|--------|-------|
| Total routes | 43 |
| Source files | 140+ |
| Lines of code | 19,000+ |
| Database tables | 8 |
| RLS security policies | 24 |
| Payment gateways | 3 |
| Notification channels | 3 |
| Supported languages | 2 (English, Amharic) |
| Demo registrants seeded | 30 |

---

## 2. System Roadmap

The system was built in 7 phases. Each phase is production-deployed.

### Phase 1 — MVP Foundation
**Goal:** Get the core registration flow working for Ethiopia.

| Feature | Status |
|---------|--------|
| Next.js 16 project with TypeScript and Tailwind CSS v4 | Done |
| PAMOJA design system (Button, Input, Select, Card, Badge) | Done |
| Supabase schema: countries, conferences, registrants, payments | Done |
| Global landing page with hero, about, conferences, country selector | Done |
| Ethiopia tenant with localized ETB pricing | Done |
| Multi-step registration form (3 steps) | Done |
| Chapa payment gateway integration (Telebirr, bank, card) | Done |
| Payment webhook handler with verification | Done |
| Exchange rate service (USD conversion, cached 1hr) | Done |
| Post-payment success page | Done |
| Basic admin dashboard with registrant list | Done |
| Email confirmation template (Resend-ready) | Done |

### Phase 2 — Multi-Tenant & Operations
**Goal:** Expand to Kenya and Nigeria. Secure the admin.

| Feature | Status |
|---------|--------|
| Admin authentication (Supabase Auth, login/logout) | Done |
| Admin sidebar layout with persistent navigation | Done |
| Live dashboard with real-time stats from Supabase | Done |
| Registrant detail view with payment history | Done |
| CSV export of all registrants | Done |
| Search and status filters on registrant list | Done |
| M-Pesa Daraja adapter (Kenya — STK Push) | Done |
| Paystack adapter (Nigeria — redirect checkout) | Done |
| Payment gateway router (auto-selects by country) | Done |
| WhatsApp notifications via Twilio | Done |
| Telegram Bot notifications + admin channel alerts | Done |
| Middleware: country validation + admin auth guard | Done |
| Demo seed data: 10 Ethiopian registrants | Done |

### Phase 3 — Operations & Scale
**Goal:** Group registration, QR check-in, document verification, analytics.

| Feature | Status |
|---------|--------|
| Group registration for church/campus delegations | Done |
| QR code generation per registrant | Done |
| Admin check-in page (QR scanner + manual) | Done |
| Document upload API (Supabase Storage) | Done |
| Admin document verification queue (approve/reject) | Done |
| Admin analytics: charts by status, country, gender, role, conference | Done |
| Revenue breakdown by currency + USD total | Done |
| 30-day registration trend chart | Done |
| Printable conference badge with QR code | Done |
| Admin group management page | Done |
| Row-Level Security policies on all 8 tables | Done |
| Database: groups, documents, checkins tables | Done |

### Phase 4 — Directory, i18n, Security
**Goal:** Attendee directory, Amharic support, rate limiting, error handling.

| Feature | Status |
|---------|--------|
| Public attendee directory (opt-in confirmed registrants) | Done |
| Searchable by name, organization, city | Done |
| Filterable by country | Done |
| Internationalization: English + Amharic dictionaries | Done |
| Rate limiting: 5 registrations/min per IP | Done |
| Duplicate email detection | Done |
| Custom 404 page | Done |
| Error boundary with retry | Done |
| Loading skeletons (spinner + admin skeleton) | Done |
| Git repository initialized + pushed to GitHub | Done |

### Phase 5 — Content Pages, SEO
**Goal:** Migrate all content from original site. Full SEO.

| Feature | Status |
|---------|--------|
| Speakers page with photo cards (6 speakers) | Done |
| Full agenda: 7-day Pamoja + 5-day Staff Conference | Done |
| Venue page with specs, facilities, logistics | Done |
| FAQ page with accordion (6 questions) | Done |
| History timeline on homepage (Pamoja I-V) | Done |
| Directory opt-in checkbox on registration form | Done |
| Sitemap.xml generation | Done |
| Robots.txt generation | Done |
| Open Graph + Twitter Card meta tags | Done |
| Per-page SEO metadata | Done |
| Updated navbar with all content pages | Done |

### Phase 6 — Real-time, Bulk Actions, Admin Tools
**Goal:** Live updates, bulk operations, countdown, admin CRUD.

| Feature | Status |
|---------|--------|
| Live countdown timer on hero (to Dec 27, 2027) | Done |
| Scroll-reveal animations on landing sections | Done |
| Testimonials section with delegate quotes | Done |
| Real-time admin via Supabase Realtime subscriptions | Done |
| Toast notification system (slide-in, auto-dismiss) | Done |
| Bulk actions: checkbox select + confirm/cancel/export | Done |
| Admin settings: country enable/disable | Done |
| Admin settings: pricing matrix with inline editing | Done |
| useRealtime hook for postgres_changes | Done |

### Phase 7 — Status, Invitations, Dark Mode, Communications
**Goal:** Self-service for registrants. Dark mode. Admin email.

| Feature | Status |
|---------|--------|
| Registration status lookup page (by email or tx_ref) | Done |
| Visa invitation letter generator (printable HTML) | Done |
| Dark mode with system preference detection | Done |
| Dark mode toggle in navbar with localStorage persistence | Done |
| Accommodation page (6 partner hotels, 4 tiers) | Done |
| Admin email blast with personalization + filtering | Done |
| Comprehensive demo seed: 30 registrants, 3 countries | Done |
| Full documentation (this file) | Done |
| Vercel production deployment | Done |

---

## 3. Access Credentials

### Production Website
| | |
|---|---|
| **URL** | https://pamoja-pi.vercel.app |
| **All pages are public** | No login required for browsing |

### Admin Panel
| | |
|---|---|
| **Login URL** | https://pamoja-pi.vercel.app/admin/login |
| **Email** | `samson@pamoja.org` |
| **Password** | `Pamoja@2207` |

### Supabase Database
| | |
|---|---|
| **Dashboard** | https://supabase.com/dashboard/project/oabpfkxqgshsexqatcvs |
| **API URL** | `https://oabpfkxqgshsexqatcvs.supabase.co` |
| **Anon Key** | `sb_publishable_T-Ftt588lvsiZ2-Yd4erGg_naoMxiJd` |
| **DB Host** | `aws-0-eu-west-1.pooler.supabase.com:6543` |
| **DB User** | `postgres.oabpfkxqgshsexqatcvs` |
| **DB Password** | `Pamoja@2207` |
| **DB Name** | `postgres` |

### psql Connection
```
psql "postgresql://postgres.oabpfkxqgshsexqatcvs:Pamoja%402207@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

### GitHub Repository
| | |
|---|---|
| **URL** | https://github.com/samija/pamoja-registration |
| **Branch** | `main` |
| **Auto-deploy** | Yes (Vercel GitHub integration) |

---

## 4. Public Website — Feature Documentation

### 4.1 Landing Page (`/`)

**URL:** https://pamoja-pi.vercel.app

**Functionality:**
- **Hero Section:** Full-width dark green gradient background. Conference title "Arise, Shine. Africa Together." with lime accent. Subtitle "July 2028 — Addis Ababa." Two CTA buttons: "Register Now" (links to Ethiopia registration) and "View Conferences" (scrolls to section). Live countdown timer showing days, hours, minutes, seconds until December 27, 2027.
- **About Section:** "What is Pamoja?" — history and mission description. Scroll-reveal animation on entry.
- **Conferences Section:** Two cards for Pamoja Conference and Staff Conference showing dates, location, and description.
- **National Offices Section:** Three cards (Ethiopia, Kenya, Nigeria) with flags, local names, currency, and payment method. Each links to the country page.
- **Testimonials Section:** Three delegate quote cards with photos, names, roles, and countries.
- **History Section:** Visual timeline grid of Pamoja I through V with images, years, locations, and delegate counts. Pamoja V highlighted with lime ring.
- **CTA Section:** Dark green banner with "Ready to Arise?" and Register button.

**Technical:** Static page (pre-rendered). Countdown is client-side. ScrollReveal uses IntersectionObserver.

---

### 4.2 Speakers Page (`/speakers`)

**URL:** https://pamoja-pi.vercel.app/speakers

**Functionality:**
- Grid of 6 speaker cards, each showing:
  - Photo with color-coded background
  - Name, role (e.g., "Plenary — Arise"), country
  - Scheduled date
  - "TBA" placeholder for unannounced speakers
- Responsive: 3 columns on desktop, 2 on tablet, 1 on mobile

**Speakers listed:**
1. Dr. Samuel Mwangi (Kenya) — Keynote, Dec 27
2. Pst. Marco Oliveira (Mozambique) — Plenary Arise, Dec 28
3. Rev. David Okafor (Nigeria) — Plenary Shine, Dec 29
4. Dr. Emmanuel Adisa (Ghana) — Plenary Go, Jan 1
5. Bp. Joseph Kamau (Tanzania) — Evening worship, Dec 28 & Jan 2
6. To be announced — Closing keynote, Jan 2

---

### 4.3 Agenda Page (`/agenda`)

**URL:** https://pamoja-pi.vercel.app/agenda

**Functionality:**
- **Tab switcher:** Toggle between Pamoja Conference (7 days) and Staff Conference (5 days). Active tab styled with conference color (lime for Pamoja, orange for Staff).
- **Day cards:** Each day shows:
  - Day number, date, weekday, tagline (e.g., "Arise — A Spirit-filled life")
  - Left color border matching conference
  - Session list with: time slot, title, venue, speaker (if any), type badge
- **Session types** (color-coded): Plenary (green), Workshop (blue), Worship (purple), Fellowship (orange), Discussion (yellow), Panel (cyan), Cultural (pink), Mission (emerald), Logistics (gray), Track (indigo), Family (rose)

**Pamoja Conference (7 days, 33 sessions):**
- Day 01 (Dec 27): Arrival & Opening — 4 sessions
- Day 02 (Dec 28): Arise — A Spirit-filled life — 6 sessions
- Day 03 (Dec 29): Shine — Integrity & calling — 5 sessions
- Day 04 (Dec 30): Go — Cousin engagement — 5 sessions
- Day 05 (Dec 31): Movement multiplication — 4 sessions
- Day 06 (Jan 1): Collaboration & partnerships — 4 sessions
- Day 07 (Jan 2): Commissioning & departure — 4 sessions

**Staff Conference (5 days, 19 sessions):**
- Day 01 (Jan 2): Arrival & welcome — 2 sessions
- Day 02 (Jan 3): Renewal — 5 sessions
- Day 03 (Jan 4): Vision-casting — 4 sessions
- Day 04 (Jan 5): Equipping & appointments — 4 sessions
- Day 05 (Jan 6): Sending & departure — 3 sessions

---

### 4.4 Venue Page (`/venue`)

**URL:** https://pamoja-pi.vercel.app/venue

**Functionality:**
- **Hero image** with gradient overlay, venue name, tagline
- **Description:** Purpose and scale of the Addis Ababa Convention Center
- **Spec cards** (4): 3,500 main auditorium, 2,000 plenary hall, 20+ breakout rooms, 6 dining halls
- **Facilities checklist** (6 items): simultaneous interpretation (5 languages), prayer rooms, health clinic, childcare, parking, Wi-Fi
- **Getting There** (3 sections): By air (Bole Airport, shuttle), Accommodation (partner hotels from $48/night), Ground transport (15-min shuttle loop)

---

### 4.5 Accommodation Page (`/accommodation`)

**URL:** https://pamoja-pi.vercel.app/accommodation

**Functionality:**
- Grid of 6 partner hotels with scroll-reveal animation
- Each card shows: hotel name, star rating, distance from venue, tier badge (Premium/Standard/Budget/Group), features checklist, price per night, reserve button
- **Hotels:**
  1. Skylight Hotel — 5 stars, 0.5 km, $95/night (Premium)
  2. Capital Hotel & Spa — 4 stars, 1.2 km, $68/night (Standard)
  3. Monarch Hotel — 4 stars, 0.8 km, $72/night (Standard)
  4. Zola International Hotel — 3 stars, 1.5 km, $48/night (Budget)
  5. Bole Ambassador Hotel — 3 stars, 2.0 km, $42/night (Budget)
  6. Shared Group Housing — On-site, $22/night (Group)
- Note about group block booking discounts

---

### 4.6 FAQ Page (`/faq`)

**URL:** https://pamoja-pi.vercel.app/faq

**Functionality:**
- Accordion with 6 questions. Click to expand/collapse. Only one open at a time.
- **Questions covered:**
  1. What is the difference between Pamoja Conference and Staff Conference?
  2. Who is the Pamoja Conference for?
  3. What are the dates?
  4. How much does it cost?
  5. Can I come as a student group or church group?
  6. Is there a visa process for Ethiopia?

---

### 4.7 Attendee Directory (`/directory`)

**URL:** https://pamoja-pi.vercel.app/directory

**Functionality:**
- Shows only **confirmed registrants who opted in** to the directory
- **Search:** by name, organization, or city
- **Filter:** dropdown by country
- **Profile cards** show: initials avatar (colored circle), full name, role, bio (line-clamped to 3 lines), badges for organization, city, country, conference
- Count of displayed attendees
- Data fetched from Supabase with RLS policy: `directory_opt_in = true AND status = 'confirmed'`

**Currently seeded:** 6 directory profiles with bios (4 Ethiopia, 1 Kenya, 1 Nigeria)

---

### 4.8 Status Lookup (`/status`)

**URL:** https://pamoja-pi.vercel.app/status

**Functionality:**
- Input field accepts **email address** or **payment reference** (tx_ref)
- Searches the database and returns matching registrations
- **Result card shows:**
  - Name, email, registration status badge (confirmed/pending/cancelled/waitlisted)
  - Conference, country, registration date, check-in status
  - Payment history: reference, amount (local currency + symbol), payment status badge
- **For confirmed registrants:** "Download Invitation Letter" button opens printable visa letter

**Test with demo data:**
- `abebe.tadesse@gmail.com` — confirmed Ethiopian, Pamoja V
- `james.ochieng@gmail.com` — confirmed Kenyan, Pamoja V
- `mercy.akinyi@gmail.com` — pending Kenyan
- `pamoja-eth-demo-001` — payment reference lookup

---

### 4.9 Dark Mode

**Functionality:**
- Toggle button (sun/moon icon) in the navbar, visible on all pages
- Detects system preference (`prefers-color-scheme: dark`) on first visit
- Persists choice to `localStorage` under key `pamoja-theme`
- Swaps CSS custom properties on `.dark` class:
  - Cream backgrounds → deep green
  - Charcoal text → light cream
  - Borders → dark green
  - Muted text → olive
- All components respond to dark mode through CSS variables

---

## 5. Registration System — Feature Documentation

### 5.1 Individual Registration (`/[country]/register`)

**URLs:**
- https://pamoja-pi.vercel.app/ethiopia/register
- https://pamoja-pi.vercel.app/kenya/register
- https://pamoja-pi.vercel.app/nigeria/register

**Functionality — 3-Step Form:**

**Step 1 — Conference Selection:**
- Two options: Pamoja Conference and Staff Conference
- Each shows name, dates, and price in local currency with currency symbol
- Click to select (highlighted with lime border)
- "Continue" button (disabled until selection made)

**Step 2 — Personal Details:**
- Fields: First Name (required), Last Name (required), Email (required, validated), Phone (required, with country placeholder), Gender (required, dropdown), Organization/Church (optional), Role/Title (optional, with placeholder examples), City (optional)
- Directory opt-in checkbox: "List me in the public attendee directory so other delegates can connect with me."
- Validation: all required fields checked, email regex validated
- "Back" returns to Step 1, "Review" advances to Step 3

**Step 3 — Review & Pay:**
- Summary card showing: Conference, Name, Email, Phone, Organization (if provided)
- Total amount with currency symbol and code
- Note about payment redirect (gateway name shown)
- "Back" returns to Step 2, "Pay [amount]" submits to API

**Payment Flow:**
1. Form submits to `POST /api/register`
2. API validates, checks duplicates, checks rate limit
3. Creates registrant record (status: pending)
4. Fetches exchange rate, creates payment record
5. Initiates payment with country-specific gateway
6. Returns `checkoutUrl` — user redirected to gateway
7. After payment, gateway calls webhook
8. Webhook verifies payment, updates statuses
9. User redirected to success page

**Step indicator:** Visual progress bar showing current step (numbered circles with labels).

---

### 5.2 Group Registration (`/[country]/register/group`)

**URLs:**
- https://pamoja-pi.vercel.app/ethiopia/register/group
- https://pamoja-pi.vercel.app/kenya/register/group
- https://pamoja-pi.vercel.app/nigeria/register/group

**Functionality:**

**Conference Selection Card:**
- Dropdown with conference name and per-person price

**Delegation Info Card:**
- Group/Delegation Name (required)
- Organization/Church (optional)
- Leader Name (required), Leader Email (required), Leader Phone (optional)

**Members Card:**
- Starts with 2 empty member forms
- Each member: First Name, Last Name, Email, Phone, Gender, Role
- "+ Add Member" button adds another form
- "Remove" link on each member (minimum 1)
- Member count displayed in header

**Summary Card:**
- Shows: [count] members × [price] = [total]
- "Register Group" button submits all members + payment

**Technical:**
- Creates a `groups` record with leader info
- Creates individual `registrants` records for each member, linked via `group_id`
- Single payment for entire group amount
- QR code generated per member

---

### 5.3 Success Page (`/[country]/register/success`)

**Functionality:**
- Checkmark icon, "Registration Complete!" heading
- Confirmation message about email
- Payment reference displayed
- "Back to [Country]" button

---

## 6. Admin Panel — Feature Documentation

**Access:** All admin pages require authentication. Unauthenticated requests are redirected to `/admin/login` by the proxy middleware.

### 6.1 Login (`/admin/login`)

**URL:** https://pamoja-pi.vercel.app/admin/login

**Functionality:**
- Email and password fields
- Error message display for invalid credentials
- Loading state on submit button
- Redirects to `/admin` on success
- Dark green background with centered white card

---

### 6.2 Admin Layout

**All admin pages share:**
- **Desktop:** Fixed left sidebar (dark green, 224px wide) with navigation links + logo + logout button
- **Mobile:** Top bar with horizontal link row
- **Navigation items:** Dashboard, Registrants, Groups, Check-In, Verification, Analytics, Settings, Email Blast
- **Logout:** Form POST to `/api/admin/logout`, redirects to login

---

### 6.3 Dashboard (`/admin`)

**URL:** https://pamoja-pi.vercel.app/admin

**Functionality:**
- **4 stat cards:**
  - Total Registrants (all statuses)
  - Confirmed (green number)
  - Pending (orange number)
  - Revenue in USD (summed from completed payments' `amount_usd`)
- **By Country card:** List of countries with registration count badges
- **Recent Registrations card:** Last 5 registrants with name, email, status badge, date. Each links to detail view. "View all" link to full list.

**Technical:** Server component, `force-dynamic`. Queries Supabase on each load. Revenue calculated by summing `amount_usd` from payments where `status = 'completed'`.

---

### 6.4 Registrants (`/admin/registrants`)

**URL:** https://pamoja-pi.vercel.app/admin/registrants

**Functionality:**
- **Header:** Title, record count (filtered / total), "Export CSV" button
- **Search:** Text input searches across first name, last name, email, phone
- **Status filter:** Dropdown: All Statuses, Confirmed, Pending, Cancelled, Waitlisted
- **Table columns:** Checkbox, Name, Email, Phone, Status (badge), Payment (badge), Date, View link
- **Checkbox selection:**
  - Header checkbox selects/deselects all visible rows
  - Individual checkboxes per row
  - Selected count shown in bulk action bar
- **Bulk action bar** (appears when rows selected):
  - "Confirm" — sets selected registrants to confirmed status
  - "Cancel" — sets selected to cancelled
  - "Export Selected" — downloads CSV of only selected rows
  - "Clear" — deselects all
- **Real-time updates:** Supabase Realtime subscription on `registrants` table. New insertions trigger a toast notification ("New registration: [Name]") and automatic data reload.
- **Export CSV:** Downloads all registrants with: name, email, phone, gender, organization, role, city, country, conference, status, payment status, amounts, dates

---

### 6.5 Registrant Detail (`/admin/registrants/[id]`)

**Functionality:**
- **Breadcrumb:** Registrants / [Name]
- **Header:** Full name, email, status badge
- **Personal Details card:** Phone, Gender, Organization, Role, City, Registration date
- **Registration card:** Conference name, Country, Locale, Status badge
- **Payment History table:** Reference (monospace), Gateway, Local amount with currency symbol, USD amount, Status badge, Date
- **Actions:**
  - "Back to List" button
  - "Print Badge" button (only for confirmed registrants) — opens `/api/admin/badge?id=[id]` in new tab

---

### 6.6 Groups (`/admin/groups`)

**URL:** https://pamoja-pi.vercel.app/admin/groups

**Functionality:**
- List of all group delegations
- Each group card shows:
  - Group name (large heading)
  - Leader name and email
  - Organization (if set)
  - Country and registration date
  - Member count (large number) with "members" label
  - Confirmation rate badge (e.g., "3/4 confirmed")
  - Member list: two-column grid, each member links to their detail page with status badge

**Currently seeded:** 3 groups — AAU Campus Fellowship (5 members), Nairobi Chapel Youth (4), UNILAG CCC Chapter (3)

---

### 6.7 Check-In (`/admin/checkin`)

**URL:** https://pamoja-pi.vercel.app/admin/checkin

**Functionality:**
- **Input field:** Accepts QR code data (JSON) or raw registrant UUID. Press Enter or click "Check In" to process.
- **QR format:** `{"type":"pamoja-checkin","id":"[uuid]"}` — the system parses this automatically
- **Check-in logic:**
  1. Validates registrant exists
  2. Confirms status is "confirmed" (rejects pending/cancelled/waitlisted)
  3. Checks not already checked in (returns "Already In" warning)
  4. Creates `checkins` record with method (qr/manual) and timestamp
  5. Updates `registrants.checked_in = true`
- **Result feed:** Scrolling list of check-in results with:
  - Green card: "Checked In" — name and conference
  - Orange card: "Already In" — duplicate scan
  - Red card: "Failed" — error message (not found, not confirmed, etc.)
- **Instruction text:** "Use a barcode/QR scanner app to scan conference badges, or manually enter the registrant UUID."

---

### 6.8 Verification (`/admin/verification`)

**URL:** https://pamoja-pi.vercel.app/admin/verification

**Functionality:**
- **Tab filters:** Pending (default), Approved, Rejected, All
- **Document cards show:** Registrant name, email, document type badge (id_card, passport, student_id), filename, review note (if any)
- **Actions (for pending documents):**
  - "Approve" button — sets status to approved, records reviewer and timestamp
  - "Reject" button — sets status to rejected
- **Document types supported:** ID card, passport, student ID, other

**Technical:** Documents are uploaded via `POST /api/documents` (multipart form). Files stored in Supabase Storage bucket "documents". Review via `PATCH /api/documents`.

---

### 6.9 Analytics (`/admin/analytics`)

**URL:** https://pamoja-pi.vercel.app/admin/analytics

**Functionality:**
- **Top stat cards (4):** Total registrants, Checked In count, Revenue (USD), Check-in Rate (%)
- **Bar charts (5):**
  - By Status: confirmed, pending, waitlisted, cancelled — horizontal bars
  - By Country: Ethiopia, Kenya, Nigeria — orange bars
  - By Gender: male, female, unspecified — green bars
  - By Conference: Pamoja Africa V, Staff Conference — lime bars
  - By Role: Student, Staff, Pastor, Young Professional, etc. — orange bars
- **Revenue by Currency:** Table showing total per currency (ETB, KES, NGN) + USD total
- **Registration Trend:** 30-day bar chart showing daily registration count. Hover shows date and count.

**Technical:** Server component. All data fetched from Supabase in parallel. Bar charts are pure CSS (no chart library).

---

### 6.10 Settings (`/admin/settings`)

**URL:** https://pamoja-pi.vercel.app/admin/settings

**Functionality:**

**Countries section:**
- List of all countries with: name (local name), currency, payment gateway, contact email
- Active/Disabled badge
- Enable/Disable toggle button

**Pricing Matrix:**
- Table: rows = countries, columns = conferences
- Each cell shows current price with currency symbol
- Click any cell to edit inline (number input + Save button)
- New prices saved immediately to `country_conferences` table
- Toast notification on save

---

### 6.11 Email Blast (`/admin/email`)

**URL:** https://pamoja-pi.vercel.app/admin/email

**Functionality:**
- **Subject field:** Plain text input
- **Body field:** HTML textarea (monospace font) with `{{name}}` personalization placeholder
- **Filter dropdown:** All registrants, Confirmed only, Pending only, Waitlisted only
- **Preview button:** Renders the HTML body with "John" as sample name
- **Send button:** Dispatches email to all registrants matching the filter
- **Result toast:** Shows "Sent to X/Y recipients"

**Personalization:** `{{name}}` is replaced with each registrant's first name. `{{email}}` with their email.

**Technical:** Calls `POST /api/admin/email`. Currently logs emails to console (wire to Resend by uncommenting SDK code in `src/lib/notifications/email.ts`).

---

## 7. API System — Feature Documentation

### 7.1 Registration API

**`POST /api/register`** — Individual registration

| Field | Description |
|-------|-------------|
| Input | `countrySlug`, `conferenceId`, `firstName`, `lastName`, `email`, `phone`, `gender`, `organization`, `role`, `city` |
| Validations | Country exists, conference priced for country, required fields present, email format valid |
| Rate limit | 5 requests/minute per IP (returns 429) |
| Duplicate check | Confirmed email returns 409 |
| Output | `{ success, checkoutUrl, txRef }` or `{ error }` |

**`POST /api/register/group`** — Group registration

| Field | Description |
|-------|-------------|
| Input | `countrySlug`, `conferenceId`, `groupName`, `leaderName`, `leaderEmail`, `leaderPhone`, `organization`, `members[]` |
| Creates | 1 group record + N registrant records + 1 payment |
| Output | `{ success, checkoutUrl, txRef, membersRegistered }` |

### 7.2 Payment Webhook

**`POST /api/payments/webhook`** — Called by payment gateways

| Step | Action |
|------|--------|
| 1 | Extract `tx_ref` from webhook body |
| 2 | Call gateway `.verify(txRef)` to confirm with provider |
| 3 | Update `payments` record: status, gateway_response, paid_at |
| 4 | If completed: update `registrants.status` to "confirmed" |
| 5 | Return `{ success: true }` |

### 7.3 Status Lookup

**`GET /api/status?email=[email]`** or **`GET /api/status?tx_ref=[ref]`**

Returns: registrant details, conference, country, all payments. No authentication required.

### 7.4 Invitation Letter

**`GET /api/invitation?id=[uuid]`**

Returns printable HTML with: official PAMOJA letterhead, registrant details table, conference dates/location, visa request paragraph, organizing committee signature. Only works for confirmed registrants (404 otherwise).

### 7.5 Check-In

**`POST /api/checkin`** (admin auth required)

Input: `{ registrantId, method, notes }`
Validates: user authenticated, registrant exists, status is "confirmed", not already checked in.
Returns: `{ success, registrant: { id, name, conference } }` or error with specific reason.

### 7.6 Document Management

**`POST /api/documents`** (public) — Upload via multipart form: `file`, `registrantId`, `type`
**`PATCH /api/documents`** (admin auth) — Review: `{ documentId, status, reviewNote }`

### 7.7 Bulk Actions

**`POST /api/admin/bulk`** (admin auth)

| Action | What it does |
|--------|-------------|
| `confirm` | Updates all selected registrants to status "confirmed" |
| `cancel` | Updates all selected to "cancelled" |
| `export` | Returns CSV file of selected registrants |

### 7.8 Badge Generator

**`GET /api/admin/badge?id=[uuid]`** (admin auth)

Returns printable HTML conference badge with: PAMOJA header, registrant name, role, organization, conference, country, QR code (data URL), registration ID, "Scan QR at check-in" footer.

### 7.9 CSV Export

**`GET /api/admin/export`** (admin auth)

Downloads CSV: First Name, Last Name, Email, Phone, Gender, Organization, Role, City, Country, Conference, Status, Payment Status, Amount Local, Currency, Amount USD, Registered At.

### 7.10 Email Blast

**`POST /api/admin/email`** (admin auth)

Input: `{ subject, body, filter: { status?, countrySlug? } }`
Replaces `{{name}}` and `{{email}}` per recipient. Returns: `{ success, sent, total }`.

### 7.11 Logout

**`POST /api/admin/logout`** — Signs out Supabase session, redirects to login.

---

## 8. Payment Gateways — Feature Documentation

### 8.1 Gateway Interface

All gateways implement `PaymentGateway` from `src/lib/payments/gateway.ts`:

```typescript
interface PaymentGateway {
  name: string;
  initiate(req: PaymentInitRequest): Promise<PaymentInitResponse>;
  verify(txRef: string): Promise<PaymentVerifyResponse>;
}
```

### 8.2 Gateway Router

`src/lib/payments/router.ts` — `getGateway(name)` returns the correct adapter based on country's `payment_gateway` field. Called by `/api/register` and `/api/register/group`.

### 8.3 Chapa (Ethiopia)

| | |
|---|---|
| File | `src/lib/payments/chapa.ts` |
| API | `https://api.chapa.co/v1` |
| Env | `CHAPA_SECRET_KEY` |
| Flow | `initiate()` → returns `checkout_url` → user redirected → webhook callback |
| Supports | Telebirr, CBE Birr, bank transfer, Visa, Mastercard |
| Verify | `GET /transaction/verify/{txRef}` |

### 8.4 M-Pesa Daraja (Kenya)

| | |
|---|---|
| File | `src/lib/payments/mpesa.ts` |
| API | `https://sandbox.safaricom.co.ke` (sandbox) |
| Env | `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_ENV` |
| Flow | STK Push → prompt on user's phone → callback |
| Note | No checkout URL (push-based), `checkoutUrl` returns null |
| Verify | `POST /mpesa/stkpushquery/v1/query` |

### 8.5 Paystack (Nigeria)

| | |
|---|---|
| File | `src/lib/payments/paystack.ts` |
| API | `https://api.paystack.co` |
| Env | `PAYSTACK_SECRET_KEY` |
| Flow | `initiate()` → returns `authorization_url` → user redirected → return URL |
| Note | Amounts in kobo (NGN × 100) |
| Verify | `GET /transaction/verify/{reference}` |

### 8.6 Exchange Rate Service

| | |
|---|---|
| File | `src/lib/exchange/rates.ts` |
| Source | `https://open.er-api.com/v6/latest/USD` |
| Cache | In-memory, 1 hour TTL |
| Functions | `getExchangeRate(currency)` → rate, `convertToUsd(local, rate)` → USD |
| Strategy | Rate locked at payment time, stored in `payments.exchange_rate` |

---

## 9. Notification System — Feature Documentation

### 9.1 Email

| | |
|---|---|
| File | `src/lib/notifications/email.ts` |
| Status | Stub (logs to console). Ready for Resend SDK. |
| Template | `buildConfirmationEmail()` — HTML with PAMOJA branding, green header, cream detail box |
| To activate | Uncomment Resend SDK code, set `RESEND_API_KEY` env var |

### 9.2 WhatsApp (Twilio)

| | |
|---|---|
| File | `src/lib/notifications/whatsapp.ts` |
| API | Twilio REST API v2010 |
| Env | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` |
| Template | `buildConfirmationMessage()` — formatted with emojis: checkmark, name, conference, amount, reference |
| Phone format | Auto-prefixes `whatsapp:` if missing |

### 9.3 Telegram

| | |
|---|---|
| File | `src/lib/notifications/telegram.ts` |
| API | `https://api.telegram.org/bot{token}/sendMessage` |
| Env | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHANNEL_ID` |
| Functions | `sendTelegram(chatId, message)` — send to any chat. `notifyAdminChannel(data)` — formatted new registration alert to admin channel |
| Format | Markdown with emojis |

---

## 10. Database Schema

### 10.1 Tables

**`countries`** — Tenant configuration
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Auto-generated |
| slug | text UNIQUE | URL path segment (ethiopia, kenya, nigeria) |
| name | text | Display name |
| name_local | text | Localized name (e.g., ኢትዮጵያ) |
| currency | text | ISO currency code (ETB, KES, NGN) |
| currency_symbol | text | Display symbol (Br, KSh, ₦) |
| locale | text | Default locale (am-ET, en-KE, en-NG) |
| payment_gateway | text | Gateway name (chapa, mpesa, paystack) |
| timezone | text | IANA timezone |
| contact_email | text | Office email |
| contact_phone | text | Office phone |
| is_active | boolean | Enable/disable tenant |

**`conferences`** — Event definitions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| slug | text UNIQUE | pamoja-v, staff-conference |
| name | text | Pamoja Africa V, Staff Conference |
| year | integer | 2028 |
| start_date | date | 2028-07-15 |
| end_date | date | 2028-07-21 |
| location | text | Addis Ababa, Ethiopia |
| description | text | Conference description |
| is_active | boolean | |

**`country_conferences`** — Pricing join table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| country_id | uuid FK → countries | |
| conference_id | uuid FK → conferences | |
| price_local | numeric(12,2) | Price in local currency |
| currency | text | Currency code |
| UNIQUE | | (country_id, conference_id) |

**`registrants`** — All registrations
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| country_id | uuid FK → countries | |
| conference_id | uuid FK → conferences | |
| group_id | uuid FK → groups | NULL for individual registrations |
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| gender | text | male, female |
| date_of_birth | date | |
| organization | text | Church, university, etc. |
| role | text | Student, Staff, Pastor, etc. |
| city | text | |
| status | enum | pending, confirmed, cancelled, waitlisted |
| qr_code | text | Base64 data URL of QR code |
| checked_in | boolean | Default false |
| directory_opt_in | boolean | Default false |
| bio | text | For directory profile |
| profile_photo_path | text | Supabase Storage path |
| locale | text | Registrant's preferred locale |
| notes | text | Admin notes |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto (trigger) |

**`payments`** — Transaction records
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| registrant_id | uuid FK → registrants | |
| gateway | text | chapa, mpesa, paystack |
| gateway_tx_ref | text UNIQUE | Transaction reference |
| gateway_response | jsonb | Raw gateway response |
| amount_local | numeric(12,2) | Amount in local currency |
| currency_local | text | ETB, KES, NGN |
| exchange_rate | numeric(12,6) | USD rate at payment time |
| amount_usd | numeric(12,2) | Converted USD amount |
| status | enum | initiated, pending, completed, failed, refunded |
| paid_at | timestamptz | When payment completed |

**`groups`** — Delegation registrations
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| country_id | uuid FK → countries | |
| name | text | Delegation name |
| leader_name | text | |
| leader_email | text | |
| leader_phone | text | |
| organization | text | |
| size | integer | Member count |

**`documents`** — Uploaded files for verification
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| registrant_id | uuid FK → registrants | |
| type | text | id_card, passport, student_id, other |
| file_path | text | Supabase Storage path |
| file_name | text | Original filename |
| status | enum | pending, approved, rejected |
| reviewed_by | uuid FK → auth.users | Admin who reviewed |
| review_note | text | |
| reviewed_at | timestamptz | |

**`checkins`** — Event day attendance
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| registrant_id | uuid FK → registrants | UNIQUE (one check-in per person) |
| checked_in_by | uuid FK → auth.users | |
| checked_in_at | timestamptz | Auto |
| method | text | qr, manual |
| notes | text | |

### 10.2 Indexes

- `registrants`: country_id, conference_id, email, status, group_id
- `payments`: registrant_id, status, gateway_tx_ref
- `documents`: registrant_id, status
- `checkins`: registrant_id (unique)

### 10.3 Triggers

- `registrants_updated_at`: auto-updates `updated_at` on any change
- `payments_updated_at`: same for payments

---

## 11. Security Features

| Feature | Implementation |
|---------|---------------|
| Admin authentication | Supabase Auth (email/password). Proxy middleware redirects unauthenticated requests. |
| Row-Level Security | 24 policies across 8 tables. Public can read countries/conferences, insert registrations. Only authenticated (admin) can read all data. |
| Rate limiting | In-memory limiter: 5 requests/minute per IP on `/api/register`. Returns 429. |
| Duplicate prevention | Confirmed emails cannot re-register (409 response). |
| Input validation | Email regex, required field checks, country/conference existence verification. |
| Country slug validation | Proxy middleware redirects invalid country paths to `/`. |
| CORS | Default Next.js/Vercel CORS headers. |
| Env var protection | `.env.local` gitignored. Secrets never exposed to client. |
| Admin-only APIs | Check-in, documents review, bulk actions, badge, export, email all verify `auth.getUser()`. |

---

## 12. Internationalization

| | |
|---|---|
| File | `src/lib/i18n/dictionaries.ts` |
| Languages | English (`en`), Amharic (`am`) |
| Sections | nav, hero, registration (all form labels), success page, common (errors) |
| Country mapping | Ethiopia → Amharic, all others → English |
| Implementation | Dictionary objects with typed keys. `getDictionary(locale)` returns the right one. |

The Amharic dictionary includes complete translations for all registration form labels, navigation, hero text, success messages, and error messages.

---

## 13. Design System

### 13.1 Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--pamoja-green-deep` | `#0A1002` | `#0A1002` | Headers, hero, admin sidebar |
| `--pamoja-green-dark` | `#1A2B0A` | `#1A2B0A` | Gradients |
| `--pamoja-green-mid` | `#5C8727` | `#5C8727` | Success states, links |
| `--pamoja-lime` | `#8DCF3D` | `#8DCF3D` | Primary accent, CTAs, badges |
| `--pamoja-orange` | `#EA7F1D` | `#EA7F1D` | Secondary accent, warnings |
| `--pamoja-cream` | `#FAF7F2` | `#0F1A08` | Page backgrounds |
| `--pamoja-charcoal` | `#2C2C2C` | `#E8E8E0` | Body text |
| `--pamoja-border` | `#E5E2DC` | `#2A3A1A` | Dividers, borders |
| `--pamoja-muted` | `#9B9B8F` | `#7A7A6A` | Secondary text |

### 13.2 Typography

| Font | Usage | Import |
|------|-------|--------|
| Montserrat | Headings (h1-h6), buttons | Google Fonts, `--font-montserrat` |
| Inter | Body text, form labels | Google Fonts, `--font-inter` |
| Fraunces | Decorative quotes | Google Fonts, `--font-fraunces` |

### 13.3 Components

| Component | File | Variants |
|-----------|------|----------|
| Button | `ui/button.tsx` | primary, secondary, outline, ghost × sm, md, lg + loading state |
| Input | `ui/input.tsx` | With label, error message, all HTML input props |
| Select | `ui/select.tsx` | With label, error, placeholder, options array |
| Card | `ui/card.tsx` | default (bordered), elevated (shadow), glass (blur) |
| Badge | `ui/badge.tsx` | default, success, warning, error, info |
| Navbar | `ui/navbar.tsx` | Sticky, responsive, mobile hamburger, dark mode toggle |
| Footer | `ui/footer.tsx` | 3-column with brand, links, contact |
| Countdown | `ui/countdown.tsx` | Live timer with glass digit boxes |
| ScrollReveal | `ui/scroll-reveal.tsx` | Fade-up on scroll with configurable delay |
| Toast | `ui/toast.tsx` | success, info, error — slide-in, auto-dismiss 4s |
| ThemeToggle | `ui/theme-toggle.tsx` | Sun/moon icon, localStorage persistence |

---

## 14. Demo Data Catalog

### 14.1 Summary

| Entity | Count |
|--------|-------|
| Countries | 3 (Ethiopia, Kenya, Nigeria) |
| Conferences | 2 (Pamoja Africa V, Staff Conference) |
| Pricing entries | 6 (2 per country) |
| Registrants | 30 (15 ETH, 8 KEN, 7 NGR) |
| Payments | 29 |
| Groups | 3 |
| Check-ins | 4 |
| Directory profiles | 6 (with bios) |

### 14.2 Status Breakdown

| Status | Count |
|--------|-------|
| Confirmed | 21 |
| Pending | 5 |
| Waitlisted | 2 |
| Cancelled | 2 |

### 14.3 Pricing

| Country | Pamoja V | Staff Conference |
|---------|----------|-----------------|
| Ethiopia | Br 9,000 ETB | Br 6,000 ETB |
| Kenya | KSh 18,000 KES | KSh 12,000 KES |
| Nigeria | ₦150,000 NGN | ₦100,000 NGN |

### 14.4 All Registrants

**Ethiopia (15 registrants):**

| # | Name | Email | Organization | Role | City | Status | Conference | Group |
|---|------|-------|-------------|------|------|--------|------------|-------|
| 1 | Abebe Tadesse | abebe.tadesse@gmail.com | Addis Ababa University | Student | Addis Ababa | confirmed | Pamoja V | AAU Fellowship |
| 2 | Tigist Hailu | tigist.hailu@yahoo.com | Mekelle University | Student | Mekelle | confirmed | Pamoja V | — |
| 3 | Dawit Kebede | dawit.kebede@outlook.com | Hawassa University | Student | Hawassa | confirmed | Pamoja V | — |
| 4 | Sara Mengistu | sara.mengistu@gmail.com | Int'l Evangelical Church | Young Professional | Addis Ababa | pending | Pamoja V | — |
| 5 | Yohannes Gebremedhin | yohannes.g@gmail.com | Bole Medhane Alem Church | Pastor | Addis Ababa | confirmed | Pamoja V | — |
| 6 | Bethlehem Assefa | bethlehem.a@gmail.com | Jimma University | Student | Jimma | pending | Pamoja V | — |
| 7 | Solomon Bekele | solomon.bekele@cru.org | CCC Ethiopia | Staff | Addis Ababa | confirmed | Staff | — |
| 8 | Meron Alemu | meron.alemu@cru.org | CCC Ethiopia | Staff | Bahir Dar | confirmed | Staff | — |
| 9 | Henok Tesfaye | henok.tesfaye@gmail.com | Unity University | Student | Adama | cancelled | Pamoja V | — |
| 10 | Frehiwot Demissie | frehiwot.d@hotmail.com | Gondar University | Student | Gondar | waitlisted | Pamoja V | — |
| 11 | Nahom Girma | nahom.girma@gmail.com | AA Science & Tech Univ | Student | Addis Ababa | confirmed | Pamoja V | AAU Fellowship |
| 12 | Liya Teshome | liya.teshome@gmail.com | Kidist Selassie Church | Young Professional | Addis Ababa | confirmed | Pamoja V | AAU Fellowship |
| 13 | Kaleb Worku | kaleb.worku@gmail.com | Bahir Dar University | Student | Bahir Dar | confirmed | Pamoja V | — |
| 14 | Hanna Bekele | hanna.bekele@outlook.com | Debre Markos University | Student | Debre Markos | pending | Pamoja V | — |
| 15 | Pst. Tewodros Mekonnen | tewodros.m@cru.org | CCC Ethiopia | Staff | Dire Dawa | confirmed | Staff | — |

**Kenya (8 registrants):**

| # | Name | Email | Organization | Role | City | Status | Conference | Group |
|---|------|-------|-------------|------|------|--------|------------|-------|
| 1 | James Ochieng | james.ochieng@gmail.com | University of Nairobi | Student | Nairobi | confirmed | Pamoja V | Nairobi Chapel Youth |
| 2 | Faith Wanjiku | faith.wanjiku@yahoo.com | Strathmore University | Student | Nairobi | confirmed | Pamoja V | Nairobi Chapel Youth |
| 3 | Peter Kiprop | peter.kiprop@outlook.com | Moi University | Student | Eldoret | confirmed | Pamoja V | Nairobi Chapel Youth |
| 4 | Mercy Akinyi | mercy.akinyi@gmail.com | Nairobi Chapel | Young Professional | Nairobi | pending | Pamoja V | — |
| 5 | Daniel Mutua | daniel.mutua@gmail.com | JKUAT | Student | Juja | confirmed | Pamoja V | Nairobi Chapel Youth |
| 6 | Grace Wambui | grace.wambui@gmail.com | Kenyatta University | Student | Nairobi | waitlisted | Pamoja V | — |
| 7 | Rev. John Kamau | john.kamau@cru.org | CCC Kenya | Staff | Nairobi | confirmed | Staff | — |
| 8 | Sarah Njeri | sarah.njeri@cru.org | CCC Kenya | Staff | Mombasa | confirmed | Staff | — |

**Nigeria (7 registrants):**

| # | Name | Email | Organization | Role | City | Status | Conference | Group |
|---|------|-------|-------------|------|------|--------|------------|-------|
| 1 | Chidi Okonkwo | chidi.okonkwo@gmail.com | University of Lagos | Student | Lagos | confirmed | Pamoja V | UNILAG CCC |
| 2 | Amara Adebayo | amara.adebayo@yahoo.com | Covenant University | Student | Ota | confirmed | Pamoja V | UNILAG CCC |
| 3 | Emmanuel Nnamdi | emmanuel.nnamdi@gmail.com | RCCG Lagos | Pastor | Lagos | confirmed | Pamoja V | — |
| 4 | Blessing Eze | blessing.eze@gmail.com | University of Ibadan | Student | Ibadan | pending | Pamoja V | — |
| 5 | Tunde Bakare | tunde.bakare@outlook.com | Obafemi Awolowo Univ | Student | Ile-Ife | confirmed | Pamoja V | UNILAG CCC |
| 6 | Pst. Ngozi Adekunle | ngozi.adekunle@cru.org | CCC Nigeria | Staff | Abuja | confirmed | Staff | — |
| 7 | Oluwaseun Afolabi | seun.afolabi@gmail.com | Winners Chapel Abuja | Young Professional | Abuja | cancelled | Pamoja V | — |

### 14.5 Groups

| Group | Country | Leader | Organization | Members | Confirmed |
|-------|---------|--------|-------------|---------|-----------|
| AAU Campus Fellowship | Ethiopia | Abebe Tadesse | Addis Ababa University | 3 linked | 3/3 |
| Nairobi Chapel Youth | Kenya | James Ochieng | Nairobi Chapel | 4 linked | 4/4 |
| UNILAG CCC Chapter | Nigeria | Chidi Okonkwo | University of Lagos | 3 linked | 3/3 |

### 14.6 Check-ins

| Name | Country | Method |
|------|---------|--------|
| James Ochieng | Kenya | QR |
| Faith Wanjiku | Kenya | QR |
| Chidi Okonkwo | Nigeria | Manual |
| Amara Adebayo | Nigeria | QR |

### 14.7 Directory Profiles (opt-in with bios)

| Name | Country | Bio |
|------|---------|-----|
| Abebe Tadesse | Ethiopia | Computer Science student passionate about faith and technology. |
| Tigist Hailu | Ethiopia | Medical student and worship leader at campus fellowship. |
| Yohannes Gebremedhin | Ethiopia | Youth pastor dedicated to mentoring the next generation of African leaders. |
| Dawit Kebede | Ethiopia | Environmental science student and campus ministry coordinator. |
| James Ochieng | Kenya | Law student and campus fellowship president. Passionate about justice and faith. |
| Faith Wanjiku | Kenya | Business student and worship team leader. |
| Chidi Okonkwo | Nigeria | Engineering student and campus movement leader. Building bridges across Nigeria. |
| Amara Adebayo | Nigeria | Medical student. Believe in healing bodies and souls. |
| Nahom Girma | Ethiopia | Computer engineering student and digital ministry enthusiast. |

---

## 15. Infrastructure & Deployment

### 15.1 Hosting

| Service | Purpose |
|---------|---------|
| **Vercel** | Next.js hosting, auto-deploy from GitHub, edge functions |
| **Supabase** | PostgreSQL database, Auth, Storage, Realtime |
| **GitHub** | Source code repository |

### 15.2 Deploy Process

```bash
git push origin main        # Triggers auto-deploy on Vercel
# OR manual:
vercel --prod --yes          # Direct CLI deploy
```

### 15.3 Database Connection

```
Region: eu-west-1 (Ireland)
Host: aws-0-eu-west-1.pooler.supabase.com
Port: 6543
Database: postgres
```

---

## 16. Environment Variables Reference

```bash
# ===== REQUIRED =====
NEXT_PUBLIC_SUPABASE_URL=https://oabpfkxqgshsexqatcvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_T-Ftt588lvsiZ2-Yd4erGg_naoMxiJd

# ===== PAYMENT GATEWAYS (configure per country) =====
# Ethiopia — https://dashboard.chapa.co
CHAPA_SECRET_KEY=CHASECK_TEST-xxx

# Kenya — https://developer.safaricom.co.ke
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_ENV=sandbox

# Nigeria — https://dashboard.paystack.com
PAYSTACK_SECRET_KEY=

# ===== NOTIFICATIONS (optional) =====
# WhatsApp — https://console.twilio.com
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Telegram — https://t.me/BotFather
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHANNEL_ID=

# Email — https://resend.com
# RESEND_API_KEY=

# ===== OPTIONAL =====
NEXT_PUBLIC_SITE_URL=https://runpamoja.org
```

---

## 17. File Structure

```
pamoja/
├── public/assets/                    # Conference images, speaker photos
├── supabase/migrations/              # 6 SQL migration files
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout + SEO
│   │   ├── globals.css               # Design tokens + dark mode
│   │   ├── loading.tsx               # Global loading spinner
│   │   ├── error.tsx                 # Error boundary
│   │   ├── not-found.tsx             # Custom 404
│   │   ├── sitemap.ts                # Generated sitemap
│   │   ├── robots.ts                 # Generated robots.txt
│   │   ├── speakers/page.tsx         # Speaker profiles
│   │   ├── agenda/page.tsx           # Full conference agenda
│   │   ├── venue/page.tsx            # Venue details
│   │   ├── faq/page.tsx              # FAQ accordion
│   │   ├── accommodation/page.tsx    # Partner hotels
│   │   ├── directory/page.tsx        # Attendee directory
│   │   ├── status/page.tsx           # Registration status lookup
│   │   ├── [country]/
│   │   │   ├── layout.tsx            # Country metadata
│   │   │   ├── page.tsx              # Country landing
│   │   │   └── register/
│   │   │       ├── page.tsx          # Registration form
│   │   │       ├── group/page.tsx    # Group registration
│   │   │       └── success/page.tsx  # Payment confirmation
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Sidebar + auth
│   │   │   ├── loading.tsx           # Admin skeleton
│   │   │   ├── login/page.tsx        # Login form
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── registrants/
│   │   │   │   ├── page.tsx          # List with bulk actions
│   │   │   │   └── [id]/page.tsx     # Detail view
│   │   │   ├── groups/page.tsx       # Delegation management
│   │   │   ├── checkin/page.tsx      # QR check-in
│   │   │   ├── verification/page.tsx # Document review
│   │   │   ├── analytics/page.tsx    # Charts + demographics
│   │   │   ├── settings/page.tsx     # Country + pricing CRUD
│   │   │   └── email/page.tsx        # Email blast
│   │   └── api/
│   │       ├── register/
│   │       │   ├── route.ts          # Individual registration
│   │       │   └── group/route.ts    # Group registration
│   │       ├── payments/webhook/route.ts
│   │       ├── status/route.ts       # Public status lookup
│   │       ├── invitation/route.ts   # Visa letter generator
│   │       ├── checkin/route.ts
│   │       ├── documents/route.ts    # Upload + review
│   │       └── admin/
│   │           ├── bulk/route.ts     # Bulk actions
│   │           ├── badge/route.ts    # Badge generator
│   │           ├── export/route.ts   # CSV export
│   │           ├── email/route.ts    # Email blast
│   │           └── logout/route.ts
│   ├── components/
│   │   ├── registration/
│   │   │   ├── registration-form.tsx # 3-step individual form
│   │   │   └── group-registration-form.tsx
│   │   └── ui/
│   │       ├── button.tsx            # 4 variants × 3 sizes
│   │       ├── input.tsx             # With label + error
│   │       ├── select.tsx            # With options array
│   │       ├── card.tsx              # 3 variants
│   │       ├── badge.tsx             # 5 colors
│   │       ├── navbar.tsx            # Responsive + dark toggle
│   │       ├── footer.tsx            # 3-column
│   │       ├── countdown.tsx         # Live timer
│   │       ├── scroll-reveal.tsx     # Intersection observer
│   │       ├── toast.tsx             # Notification system
│   │       └── theme-toggle.tsx      # Dark mode
│   ├── config/
│   │   ├── countries.ts              # 3 country configs
│   │   ├── conferences.ts            # 2 conferences + pricing
│   │   └── content.ts               # Speakers, agenda, venue, FAQ, history
│   ├── hooks/
│   │   └── use-realtime.ts           # Supabase subscription hook
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts             # Browser client
│       │   ├── server.ts             # Server client (cookies)
│       │   └── types.ts              # All TypeScript interfaces
│       ├── payments/
│       │   ├── gateway.ts            # Interface definition
│       │   ├── chapa.ts              # Ethiopia adapter
│       │   ├── mpesa.ts              # Kenya adapter
│       │   ├── paystack.ts           # Nigeria adapter
│       │   └── router.ts             # Auto-select by country
│       ├── exchange/rates.ts         # USD conversion + cache
│       ├── notifications/
│       │   ├── email.ts              # Resend-ready stub
│       │   ├── whatsapp.ts           # Twilio WhatsApp
│       │   └── telegram.ts           # Telegram Bot API
│       ├── qr/generate.ts            # QR code generation
│       ├── rate-limit/index.ts       # In-memory rate limiter
│       └── i18n/dictionaries.ts      # EN + Amharic
├── .env.local.example                # Template env file
├── .gitignore
├── ARCHITECTURE.md                   # Technical architecture
├── CHANGELOG.md                      # Version history
├── README.md                         # Setup guide
├── SYSTEM_DOCUMENTATION.md           # This file
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 18. Future Roadmap

Features that can be added next:

### High Priority
- [ ] Wire email sending to Resend (uncomment SDK code, add API key)
- [ ] Wire notifications into webhook (send WhatsApp/email on payment confirmation)
- [ ] Add Stripe as a fallback gateway for international registrants
- [ ] PWA support for offline check-in at venue
- [ ] Admin audit log (who changed what, when)

### Medium Priority
- [ ] Multi-language UI (apply Amharic dictionary to actual form components)
- [ ] Admin role system (country admin vs. global admin)
- [ ] Bulk import registrants from CSV
- [ ] SMS notifications via Africa's Talking
- [ ] Early bird / group discount pricing rules
- [ ] Waitlist auto-promotion when spots open
- [ ] Registration deadline enforcement

### Nice to Have
- [ ] Mobile app (React Native) for check-in staff
- [ ] Live attendance counter dashboard for venue screens
- [ ] Integration with church management systems
- [ ] Feedback/survey collection post-event
- [ ] Photo gallery from past Pamoja events
- [ ] Social media sharing for confirmed registrants
- [ ] Calendar invite (.ics) download on confirmation

---

*This document was generated for the PAMOJA Africa V Registration System. For questions or updates, contact the development team or refer to the GitHub repository.*
