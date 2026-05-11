-- Phase 4: Directory opt-in, rate limiting

-- Directory opt-in for registrants
alter table registrants add column directory_opt_in boolean not null default false;
alter table registrants add column bio text;
alter table registrants add column profile_photo_path text;

-- Public directory policy (only opt-in confirmed registrants)
create policy "Public can view directory profiles"
  on registrants for select
  using (directory_opt_in = true and status = 'confirmed');

-- Rate limiting table
create table rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

-- Update some demo registrants to opt-in
update registrants set directory_opt_in = true, bio = 'Computer Science student passionate about faith and technology.'
  where first_name = 'Abebe' and last_name = 'Tadesse';

update registrants set directory_opt_in = true, bio = 'Medical student and worship leader at campus fellowship.'
  where first_name = 'Tigist' and last_name = 'Hailu';

update registrants set directory_opt_in = true, bio = 'Youth pastor dedicated to mentoring the next generation of African leaders.'
  where first_name = 'Yohannes' and last_name = 'Gebremedhin';

update registrants set directory_opt_in = true, bio = 'Environmental science student and campus ministry coordinator.'
  where first_name = 'Dawit' and last_name = 'Kebede';
