-- PAMUJA Registration System — Initial Schema
-- Run against Supabase PostgreSQL

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Countries (tenants)
create table countries (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  name_local text,
  currency text not null default 'USD',
  currency_symbol text not null default '$',
  locale text not null default 'en',
  payment_gateway text not null default 'chapa',
  timezone text not null default 'UTC',
  contact_email text,
  contact_phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Conferences
create table conferences (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  year integer not null,
  start_date date not null,
  end_date date not null,
  location text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Country-specific conference pricing
create table country_conferences (
  id uuid primary key default uuid_generate_v4(),
  country_id uuid not null references countries(id) on delete cascade,
  conference_id uuid not null references conferences(id) on delete cascade,
  price_local numeric(12, 2) not null,
  currency text not null,
  is_active boolean not null default true,
  unique (country_id, conference_id)
);

-- Registrants
create type registration_status as enum ('pending', 'confirmed', 'cancelled', 'waitlisted');

create table registrants (
  id uuid primary key default uuid_generate_v4(),
  country_id uuid not null references countries(id),
  conference_id uuid not null references conferences(id),

  -- Personal info
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  gender text,
  date_of_birth date,

  -- Affiliation
  organization text,
  role text,
  city text,

  -- Status
  status registration_status not null default 'pending',

  -- Metadata
  locale text default 'en',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_registrants_country on registrants(country_id);
create index idx_registrants_conference on registrants(conference_id);
create index idx_registrants_email on registrants(email);
create index idx_registrants_status on registrants(status);

-- Payments
create type payment_status as enum ('initiated', 'pending', 'completed', 'failed', 'refunded');

create table payments (
  id uuid primary key default uuid_generate_v4(),
  registrant_id uuid not null references registrants(id) on delete cascade,

  -- Gateway info
  gateway text not null,
  gateway_tx_ref text unique,
  gateway_response jsonb,

  -- Amounts
  amount_local numeric(12, 2) not null,
  currency_local text not null,
  exchange_rate numeric(12, 6),
  amount_usd numeric(12, 2),

  -- Status
  status payment_status not null default 'initiated',
  paid_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_registrant on payments(registrant_id);
create index idx_payments_status on payments(status);
create index idx_payments_tx_ref on payments(gateway_tx_ref);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger registrants_updated_at
  before update on registrants
  for each row execute function update_updated_at();

create trigger payments_updated_at
  before update on payments
  for each row execute function update_updated_at();

-- Seed data: Ethiopia
insert into countries (slug, name, name_local, currency, currency_symbol, locale, payment_gateway, timezone, contact_email) values
  ('ethiopia', 'Ethiopia', 'ኢትዮጵያ', 'ETB', 'Br', 'am-ET', 'chapa', 'Africa/Addis_Ababa', 'ethiopia@runpamoja.org');

insert into conferences (slug, name, year, start_date, end_date, location, description) values
  ('pamoja-v', 'Pamoja Africa V', 2028, '2028-07-15', '2028-07-21', 'Addis Ababa, Ethiopia', 'The 5th Pan-African gathering of students, young professionals, and church leaders.'),
  ('staff-conference', 'Staff Conference', 2028, '2028-07-12', '2028-07-14', 'Addis Ababa, Ethiopia', 'Pre-conference gathering for CCC Africa staff.');

-- Link Ethiopia to conferences with ETB pricing
insert into country_conferences (country_id, conference_id, price_local, currency)
  select c.id, conf.id,
    case conf.slug
      when 'pamoja-v' then 9000
      when 'staff-conference' then 6000
    end,
    'ETB'
  from countries c, conferences conf
  where c.slug = 'ethiopia';
