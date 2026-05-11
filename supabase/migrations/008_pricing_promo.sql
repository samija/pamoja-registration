-- Phase 9: Pricing tiers, promo codes

-- Pricing tiers (early bird, regular, late)
create table pricing_tiers (
  id uuid primary key default uuid_generate_v4(),
  country_conference_id uuid not null references country_conferences(id) on delete cascade,
  name text not null, -- 'early_bird', 'regular', 'late'
  label text not null, -- 'Early Bird', 'Regular', 'Late Registration'
  price_local numeric(12, 2) not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true
);

create index idx_pricing_tiers_cc on pricing_tiers(country_conference_id);

-- Promo codes
create table promo_codes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null default 'percentage', -- 'percentage' or 'fixed'
  discount_value numeric(10, 2) not null, -- e.g., 10 for 10% or 500 for 500 ETB off
  max_uses integer,
  used_count integer not null default 0,
  country_id uuid references countries(id), -- null = all countries
  conference_id uuid references conferences(id), -- null = all conferences
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Track promo usage on payments
alter table payments add column promo_code_id uuid references promo_codes(id);
alter table payments add column discount_amount numeric(12, 2) default 0;

-- RLS
alter table pricing_tiers enable row level security;
alter table promo_codes enable row level security;

create policy "Pricing tiers are publicly readable" on pricing_tiers for select using (true);
create policy "Promo codes readable by authenticated" on promo_codes for select using (auth.role() = 'authenticated');
create policy "Promo codes writable by authenticated" on promo_codes for all using (auth.role() = 'authenticated');

-- Seed pricing tiers for Ethiopia/Pamoja V
insert into pricing_tiers (country_conference_id, name, label, price_local, starts_at, ends_at)
select cc.id, 'early_bird', 'Early Bird', 7000, '2026-01-01', '2027-06-30'
from country_conferences cc
join countries c on cc.country_id = c.id
join conferences conf on cc.conference_id = conf.id
where c.slug = 'ethiopia' and conf.slug = 'pamoja-v';

insert into pricing_tiers (country_conference_id, name, label, price_local, starts_at, ends_at)
select cc.id, 'regular', 'Regular', 9000, '2027-07-01', '2027-11-30'
from country_conferences cc
join countries c on cc.country_id = c.id
join conferences conf on cc.conference_id = conf.id
where c.slug = 'ethiopia' and conf.slug = 'pamoja-v';

insert into pricing_tiers (country_conference_id, name, label, price_local, starts_at, ends_at)
select cc.id, 'late', 'Late Registration', 11000, '2027-12-01', '2027-12-26'
from country_conferences cc
join countries c on cc.country_id = c.id
join conferences conf on cc.conference_id = conf.id
where c.slug = 'ethiopia' and conf.slug = 'pamoja-v';

-- Seed promo codes
insert into promo_codes (code, discount_type, discount_value, max_uses, valid_until) values
  ('ARISE2028', 'percentage', 15, 100, '2027-12-26'),
  ('EARLYBIRD', 'percentage', 20, 50, '2027-06-30'),
  ('STAFF50', 'fixed', 3000, 200, '2027-12-26');
