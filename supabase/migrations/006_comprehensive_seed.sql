-- Comprehensive demo seed — Kenya, Nigeria registrants, groups, check-ins
-- Run AFTER migrations 001-005

do $$
declare
  eth_id uuid;
  ken_id uuid;
  ngr_id uuid;
  pamoja_id uuid;
  staff_id uuid;
  -- Kenya registrants
  k1 uuid; k2 uuid; k3 uuid; k4 uuid; k5 uuid; k6 uuid; k7 uuid; k8 uuid;
  -- Nigeria registrants
  n1 uuid; n2 uuid; n3 uuid; n4 uuid; n5 uuid; n6 uuid; n7 uuid;
  -- Groups
  g1 uuid; g2 uuid; g3 uuid;
  -- Additional Ethiopia
  e11 uuid; e12 uuid; e13 uuid; e14 uuid; e15 uuid;
begin
  select id into eth_id from countries where slug = 'ethiopia';
  select id into ken_id from countries where slug = 'kenya';
  select id into ngr_id from countries where slug = 'nigeria';
  select id into pamoja_id from conferences where slug = 'pamoja-v';
  select id into staff_id from conferences where slug = 'staff-conference';

  -- =============================================
  -- KENYA REGISTRANTS (8)
  -- =============================================
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale, directory_opt_in, bio)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'James', 'Ochieng', 'james.ochieng@gmail.com', '+254711223344', 'male', 'University of Nairobi', 'Student', 'Nairobi', 'confirmed', 'en-KE', true, 'Law student and campus fellowship president. Passionate about justice and faith.')
    returning id into k1;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale, directory_opt_in, bio)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'Faith', 'Wanjiku', 'faith.wanjiku@yahoo.com', '+254722334455', 'female', 'Strathmore University', 'Student', 'Nairobi', 'confirmed', 'en-KE', true, 'Business student and worship team leader.')
    returning id into k2;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'Peter', 'Kiprop', 'peter.kiprop@outlook.com', '+254733445566', 'male', 'Moi University', 'Student', 'Eldoret', 'confirmed', 'en-KE')
    returning id into k3;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'Mercy', 'Akinyi', 'mercy.akinyi@gmail.com', '+254744556677', 'female', 'Nairobi Chapel', 'Young Professional', 'Nairobi', 'pending', 'en-KE')
    returning id into k4;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'Daniel', 'Mutua', 'daniel.mutua@gmail.com', '+254755667788', 'male', 'JKUAT', 'Student', 'Juja', 'confirmed', 'en-KE')
    returning id into k5;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, pamoja_id, 'Grace', 'Wambui', 'grace.wambui@gmail.com', '+254766778899', 'female', 'Kenyatta University', 'Student', 'Nairobi', 'waitlisted', 'en-KE')
    returning id into k6;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, staff_id, 'Rev. John', 'Kamau', 'john.kamau@cru.org', '+254777889900', 'male', 'CCC Kenya', 'Staff', 'Nairobi', 'confirmed', 'en-KE')
    returning id into k7;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ken_id, staff_id, 'Sarah', 'Njeri', 'sarah.njeri@cru.org', '+254788990011', 'female', 'CCC Kenya', 'Staff', 'Mombasa', 'confirmed', 'en-KE')
    returning id into k8;

  -- Kenya payments
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status, paid_at) values
    (k1, 'mpesa', 'pamoja-ken-demo-001', 18000, 'KES', 153.50, 117.26, 'completed', now() - interval '9 days'),
    (k2, 'mpesa', 'pamoja-ken-demo-002', 18000, 'KES', 153.50, 117.26, 'completed', now() - interval '7 days'),
    (k3, 'mpesa', 'pamoja-ken-demo-003', 18000, 'KES', 153.50, 117.26, 'completed', now() - interval '6 days'),
    (k5, 'mpesa', 'pamoja-ken-demo-005', 18000, 'KES', 153.50, 117.26, 'completed', now() - interval '4 days'),
    (k7, 'mpesa', 'pamoja-ken-demo-007', 12000, 'KES', 153.50, 78.18, 'completed', now() - interval '11 days'),
    (k8, 'mpesa', 'pamoja-ken-demo-008', 12000, 'KES', 153.50, 78.18, 'completed', now() - interval '10 days');
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status) values
    (k4, 'mpesa', 'pamoja-ken-demo-004', 18000, 'KES', 153.50, 117.26, 'pending'),
    (k6, 'mpesa', 'pamoja-ken-demo-006', 18000, 'KES', 153.50, 117.26, 'initiated');

  -- =============================================
  -- NIGERIA REGISTRANTS (7)
  -- =============================================
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale, directory_opt_in, bio)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Chidi', 'Okonkwo', 'chidi.okonkwo@gmail.com', '+2348011223344', 'male', 'University of Lagos', 'Student', 'Lagos', 'confirmed', 'en-NG', true, 'Engineering student and campus movement leader. Building bridges across Nigeria.')
    returning id into n1;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale, directory_opt_in, bio)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Amara', 'Adebayo', 'amara.adebayo@yahoo.com', '+2348022334455', 'female', 'Covenant University', 'Student', 'Ota', 'confirmed', 'en-NG', true, 'Medical student. Believe in healing bodies and souls.')
    returning id into n2;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Emmanuel', 'Nnamdi', 'emmanuel.nnamdi@gmail.com', '+2348033445566', 'male', 'RCCG Lagos', 'Pastor', 'Lagos', 'confirmed', 'en-NG')
    returning id into n3;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Blessing', 'Eze', 'blessing.eze@gmail.com', '+2348044556677', 'female', 'University of Ibadan', 'Student', 'Ibadan', 'pending', 'en-NG')
    returning id into n4;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Tunde', 'Bakare', 'tunde.bakare@outlook.com', '+2348055667788', 'male', 'Obafemi Awolowo University', 'Student', 'Ile-Ife', 'confirmed', 'en-NG')
    returning id into n5;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ngr_id, staff_id, 'Pst. Ngozi', 'Adekunle', 'ngozi.adekunle@cru.org', '+2348066778899', 'female', 'CCC Nigeria', 'Staff', 'Abuja', 'confirmed', 'en-NG')
    returning id into n6;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), ngr_id, pamoja_id, 'Oluwaseun', 'Afolabi', 'seun.afolabi@gmail.com', '+2348077889900', 'male', 'Winners Chapel Abuja', 'Young Professional', 'Abuja', 'cancelled', 'en-NG')
    returning id into n7;

  -- Nigeria payments
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status, paid_at) values
    (n1, 'paystack', 'pamoja-ngr-demo-001', 150000, 'NGN', 1550.00, 96.77, 'completed', now() - interval '8 days'),
    (n2, 'paystack', 'pamoja-ngr-demo-002', 150000, 'NGN', 1550.00, 96.77, 'completed', now() - interval '6 days'),
    (n3, 'paystack', 'pamoja-ngr-demo-003', 150000, 'NGN', 1550.00, 96.77, 'completed', now() - interval '5 days'),
    (n5, 'paystack', 'pamoja-ngr-demo-005', 150000, 'NGN', 1550.00, 96.77, 'completed', now() - interval '3 days'),
    (n6, 'paystack', 'pamoja-ngr-demo-006', 100000, 'NGN', 1550.00, 64.52, 'completed', now() - interval '12 days');
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status) values
    (n4, 'paystack', 'pamoja-ngr-demo-004', 150000, 'NGN', 1550.00, 96.77, 'pending'),
    (n7, 'paystack', 'pamoja-ngr-demo-007', 150000, 'NGN', 1550.00, 96.77, 'failed');

  -- =============================================
  -- ADDITIONAL ETHIOPIA REGISTRANTS (5 more = 15 total)
  -- =============================================
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale, directory_opt_in, bio)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Nahom', 'Girma', 'nahom.girma@gmail.com', '+251912345678', 'male', 'Addis Ababa Science and Technology University', 'Student', 'Addis Ababa', 'confirmed', 'am-ET', true, 'Computer engineering student and digital ministry enthusiast.')
    returning id into e11;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Liya', 'Teshome', 'liya.teshome@gmail.com', '+251923456789', 'female', 'Kidist Selassie Church', 'Young Professional', 'Addis Ababa', 'confirmed', 'am-ET')
    returning id into e12;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Kaleb', 'Worku', 'kaleb.worku@gmail.com', '+251934567890', 'male', 'Bahir Dar University', 'Student', 'Bahir Dar', 'confirmed', 'am-ET')
    returning id into e13;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, pamoja_id, 'Hanna', 'Bekele', 'hanna.bekele@outlook.com', '+251945678901', 'female', 'Debre Markos University', 'Student', 'Debre Markos', 'pending', 'am-ET')
    returning id into e14;
  insert into registrants (id, country_id, conference_id, first_name, last_name, email, phone, gender, organization, role, city, status, locale)
  values
    (gen_random_uuid(), eth_id, staff_id, 'Pst. Tewodros', 'Mekonnen', 'tewodros.m@cru.org', '+251956789012', 'male', 'CCC Ethiopia', 'Staff', 'Dire Dawa', 'confirmed', 'am-ET')
    returning id into e15;

  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status, paid_at) values
    (e11, 'chapa', 'pamoja-eth-demo-011', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '3 days'),
    (e12, 'chapa', 'pamoja-eth-demo-012', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '2 days'),
    (e13, 'chapa', 'pamoja-eth-demo-013', 9000, 'ETB', 57.50, 156.52, 'completed', now() - interval '1 day'),
    (e15, 'chapa', 'pamoja-eth-demo-015', 6000, 'ETB', 57.50, 104.35, 'completed', now() - interval '4 days');
  insert into payments (registrant_id, gateway, gateway_tx_ref, amount_local, currency_local, exchange_rate, amount_usd, status) values
    (e14, 'chapa', 'pamoja-eth-demo-014', 9000, 'ETB', 57.50, 156.52, 'initiated');

  -- =============================================
  -- GROUP DELEGATIONS (3 groups)
  -- =============================================
  insert into groups (id, country_id, name, leader_name, leader_email, leader_phone, organization, size)
  values (gen_random_uuid(), eth_id, 'AAU Campus Fellowship', 'Abebe Tadesse', 'abebe.tadesse@gmail.com', '+251911223344', 'Addis Ababa University', 5)
  returning id into g1;

  insert into groups (id, country_id, name, leader_name, leader_email, leader_phone, organization, size)
  values (gen_random_uuid(), ken_id, 'Nairobi Chapel Youth', 'James Ochieng', 'james.ochieng@gmail.com', '+254711223344', 'Nairobi Chapel', 4)
  returning id into g2;

  insert into groups (id, country_id, name, leader_name, leader_email, leader_phone, organization, size)
  values (gen_random_uuid(), ngr_id, 'UNILAG CCC Chapter', 'Chidi Okonkwo', 'chidi.okonkwo@gmail.com', '+2348011223344', 'University of Lagos', 3)
  returning id into g3;

  -- Link some existing registrants to groups
  update registrants set group_id = g1 where email in ('abebe.tadesse@gmail.com', 'nahom.girma@gmail.com', 'liya.teshome@gmail.com');
  update registrants set group_id = g2 where email in ('james.ochieng@gmail.com', 'faith.wanjiku@yahoo.com', 'peter.kiprop@outlook.com', 'daniel.mutua@gmail.com');
  update registrants set group_id = g3 where email in ('chidi.okonkwo@gmail.com', 'amara.adebayo@yahoo.com', 'tunde.bakare@outlook.com');

  -- =============================================
  -- CHECK-INS (simulate some arrivals)
  -- =============================================
  insert into checkins (registrant_id, method, notes) values
    (k1, 'qr', 'Checked in at main gate'),
    (k2, 'qr', null),
    (n1, 'manual', 'QR scanner issue, manual entry'),
    (n2, 'qr', null);

  update registrants set checked_in = true where id in (k1, k2, n1, n2);

end $$;
