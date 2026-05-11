-- Phase 8: Audit log, capacity limits, waitlist

-- Audit log
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null, -- 'registrant', 'payment', 'document', 'group', 'country', 'conference'
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index idx_audit_log_entity on audit_log(entity_type, entity_id);
create index idx_audit_log_user on audit_log(user_id);
create index idx_audit_log_created on audit_log(created_at desc);

-- Capacity on conferences
alter table country_conferences add column capacity integer;
alter table country_conferences add column registered_count integer not null default 0;

-- Set demo capacities
update country_conferences set capacity = 500, registered_count = (
  select count(*) from registrants r
  where r.country_id = country_conferences.country_id
    and r.conference_id = country_conferences.conference_id
    and r.status in ('confirmed', 'pending')
);

-- RLS for audit log
alter table audit_log enable row level security;
create policy "Authenticated users can read audit log"
  on audit_log for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create audit entries"
  on audit_log for insert with check (auth.role() = 'authenticated');
