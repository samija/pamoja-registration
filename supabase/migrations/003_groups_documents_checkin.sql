-- Phase 3: Groups, Document Verification, Check-in

-- Delegations / Group Registration
create table groups (
  id uuid primary key default uuid_generate_v4(),
  country_id uuid not null references countries(id),
  name text not null,
  leader_name text not null,
  leader_email text not null,
  leader_phone text,
  organization text,
  size integer not null default 1,
  created_at timestamptz not null default now()
);

-- Link registrants to groups (optional)
alter table registrants add column group_id uuid references groups(id);
create index idx_registrants_group on registrants(group_id);

-- Document uploads for verification
create type verification_status as enum ('pending', 'approved', 'rejected');

create table documents (
  id uuid primary key default uuid_generate_v4(),
  registrant_id uuid not null references registrants(id) on delete cascade,
  type text not null, -- 'id_card', 'passport', 'student_id', 'other'
  file_path text not null, -- Supabase Storage path
  file_name text not null,
  status verification_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_documents_registrant on documents(registrant_id);
create index idx_documents_status on documents(status);

-- Check-in tracking
create table checkins (
  id uuid primary key default uuid_generate_v4(),
  registrant_id uuid not null references registrants(id) on delete cascade,
  checked_in_by uuid references auth.users(id),
  checked_in_at timestamptz not null default now(),
  method text not null default 'qr', -- 'qr', 'manual'
  notes text
);

create unique index idx_checkins_registrant on checkins(registrant_id);

-- Add QR code field to registrants
alter table registrants add column qr_code text;
alter table registrants add column checked_in boolean not null default false;

-- Create storage bucket for documents (run manually in Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
