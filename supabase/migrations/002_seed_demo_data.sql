-- PAMUJA Demo Seed Data
-- Adds Kenya & Nigeria countries, links conferences, and creates sample registrants + payments

-- Additional countries
insert into countries (slug, name, name_local, currency, currency_symbol, locale, payment_gateway, timezone, contact_email, contact_phone) values
  ('kenya',   'Kenya',   'Kenya',   'KES', 'KSh', 'en-KE', 'mpesa',    'Africa/Nairobi',    'kenya@runpamoja.org',   '+254700000000'),
  ('nigeria', 'Nigeria', 'Nigeria', 'NGN', '₦',   'en-NG', 'paystack', 'Africa/Lagos',      'nigeria@runpamoja.org', '+2348000000000');

-- Link Kenya to conferences
insert into country_conferences (country_id, conference_id, price_local, currency)
  select c.id, conf.id,
    case conf.slug
      when 'pamoja-v' then 18000
      when 'staff-conference' then 12000
    end,
    'KES'
  from countries c, conferences conf
  where c.slug = 'kenya';

-- Link Nigeria to conferences
insert into country_conferences (country_id, conference_id, price_local, currency)
  select c.id, conf.id,
    case conf.slug
      when 'pamoja-v' then 150000
      when 'staff-conference' then 100000
    end,
    'NGN'
  from countries c, conferences conf
  where c.slug = 'nigeria';

-- Demo registrants (Ethiopia)
do $$
declare
  eth_id uuid;
  pamoja_id uuid;
  staff_id uuid;
  r1 uuid; r2 uuid; r3 uuid; r4 uuid; r5 uuid;
  r6 uuid; r7 uuid; r8 uuid; r9 uuid; r10 uuid;
begin
  select id into eth_id from countries where slug = 'ethiopia';
  select id into pamoja_id from conferences where slug = 'pamoja-v';
  select id into staff_id from conferences where slug = 'staff-conference';

  -- 10 Ethiopian registrants with varied statuses
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Abebe',   'Tadesse',   'abebe.tadesse@gmail.com',     '+251911223344', 'male',   'Addis Ababa University',      'Student',        'Addis Ababa', 'confirmed', 'am-ET')
    returning id into r1;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Tigist',  'Hailu',     'tigist.hailu@yahoo.com',      '+251922334455', 'female', 'Mekelle University',          'Student',        'Mekelle',     'confirmed', 'am-ET')
    returning id into r2;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Dawit',   'Kebede',    'dawit.kebede@outlook.com',    '+251933445566', 'male',   'Hawassa University',          'Student',        'Hawassa',     'confirmed', 'am-ET')
    returning id into r3;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Sara',    'Mengistu',  'sara.mengistu@gmail.com',     '+251944556677', 'female', 'International Evangelical Church', 'Young Professional', 'Addis Ababa', 'pending', 'am-ET')
    returning id into r4;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Yohannes','Gebremedhin','yohannes.g@gmail.com',       '+251955667788', 'male',   'Bole Medhane Alem Church',    'Pastor',         'Addis Ababa', 'confirmed', 'am-ET')
    returning id into r5;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Bethlehem','Assefa',    'bethlehem.a@gmail.com',       '+251966778899', 'female', 'Jimma University',            'Student',        'Jimma',       'pending', 'am-ET')
    returning id into r6;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, staff_id,  'Solomon', 'Bekele',    'solomon.bekele@cru.org',      '+251977889900', 'male',   'CCC Ethiopia',                'Staff',          'Addis Ababa', 'confirmed', 'am-ET')
    returning id into r7;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, staff_id,  'Meron',   'Alemu',     'meron.alemu@cru.org',         '+251988990011', 'female', 'CCC Ethiopia',                'Staff',          'Bahir Dar',   'confirmed', 'am-ET')
    returning id into r8;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Henok',   'Tesfaye',   'henok.tesfaye@gmail.com',     '+251999001122', 'male',   'Unity University',            'Student',        'Adama',       'cancelled', 'am-ET')
    returning id into r9;

  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Frehiwot','Demissie',  'frehiwot.d@hotmail.com',      '+251900112233', 'female', 'Gondar University',           'Student',        'Gondar',      'waitlisted', 'am-ET')
    returning id into r10;

  -- Payments for confirmed registrants (Pamoja V @ 9000 ETB)
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status, paid_at)
  values
    (r1, 'chapa', 'pamoja-eth-demo-001', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '12 days'),
    (r2, 'chapa', 'pamoja-eth-demo-002', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '10 days'),
    (r3, 'chapa', 'pamoja-eth-demo-003', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '8 days'),
    (r5, 'chapa', 'pamoja-eth-demo-005', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '5 days');

  -- Payment for pending registrant (initiated but not completed)
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status)
  values
    (r4, 'chapa', 'pamoja-eth-demo-004', 9000, 'ETB', 57.50, 156.52, 'initiated'),
    (r6, 'chapa', 'pamoja-eth-demo-006', 9000, 'ETB', 57.50, 156.52, 'pending');

  -- Payments for staff conference (6000 ETB)
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status, paid_at)
  values
    (r7, 'chapa', 'pamoja-eth-demo-007', 6000, 'ETB', 57.50, 104.35, 'completed', now() - interval '15 days'),
    (r8, 'chapa', 'pamoja-eth-demo-008', 6000, 'ETB', 57.50, 104.35, 'completed', now() - interval '14 days');

  -- Failed payment for cancelled registrant
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status)
  values
    (r9, 'chapa', 'pamoja-eth-demo-009', 9000, 'ETB', 57.50, 156.52, 'failed');

end $$;
