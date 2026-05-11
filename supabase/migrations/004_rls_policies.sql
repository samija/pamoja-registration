-- Row-Level Security Policies

-- Enable RLS on all tables
alter table countries enable row level security;
alter table conferences enable row level security;
alter table country_conferences enable row level security;
alter table registrants enable row level security;
alter table payments enable row level security;
alter table groups enable row level security;
alter table documents enable row level security;
alter table checkins enable row level security;

-- Public read access for countries and conferences (needed for landing pages)
create policy "Countries are publicly readable"
  on countries for select using (true);

create policy "Conferences are publicly readable"
  on conferences for select using (true);

create policy "Country conferences are publicly readable"
  on country_conferences for select using (true);

-- Registrants: public can insert (registration), only authenticated can read all
create policy "Anyone can register"
  on registrants for insert with check (true);

create policy "Authenticated users can read registrants"
  on registrants for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update registrants"
  on registrants for update using (auth.role() = 'authenticated');

-- Payments: service role inserts, authenticated reads
create policy "Anyone can create payments"
  on payments for insert with check (true);

create policy "Authenticated users can read payments"
  on payments for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update payments"
  on payments for update using (auth.role() = 'authenticated');

-- Groups: public insert, authenticated read
create policy "Anyone can create groups"
  on groups for insert with check (true);

create policy "Authenticated users can read groups"
  on groups for select using (auth.role() = 'authenticated');

-- Documents: registrant uploads, authenticated reviews
create policy "Anyone can upload documents"
  on documents for insert with check (true);

create policy "Authenticated users can read documents"
  on documents for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update documents"
  on documents for update using (auth.role() = 'authenticated');

-- Checkins: only authenticated
create policy "Authenticated users can create checkins"
  on checkins for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read checkins"
  on checkins for select using (auth.role() = 'authenticated');

-- Storage: documents bucket
-- Run manually if bucket exists:
-- create policy "Anyone can upload to documents" on storage.objects for insert with check (bucket_id = 'documents');
-- create policy "Authenticated can read documents" on storage.objects for select using (bucket_id = 'documents' and auth.role() = 'authenticated');
