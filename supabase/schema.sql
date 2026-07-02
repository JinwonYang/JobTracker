-- Run this in Supabase Dashboard → SQL Editor

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null,
  site text not null default '',
  salary text not null default '',
  position text not null default '',
  location text not null default '',
  stage text not null default 'Not Applied',
  memo text not null default '',
  source text,
  source_job_id uuid,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_posts (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  title text not null,
  company text not null default '',
  location text not null default '',
  salary text not null default '',
  work_type text not null default '',
  work_arrangement text not null default '',
  url text not null,
  summary text not null default '',
  posted_at timestamptz,
  fetched_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);

alter table public.applications
  add constraint applications_source_job_id_fkey
  foreign key (source_job_id)
  references public.job_posts (id)
  on delete set null;

create index applications_user_id_idx on public.applications (user_id);
create index applications_source_job_id_idx on public.applications (source_job_id);
create unique index job_posts_source_external_id_idx on public.job_posts (source, external_id);
create index job_posts_source_idx on public.job_posts (source);
create index job_posts_posted_at_idx on public.job_posts (posted_at desc);

alter table public.applications enable row level security;
alter table public.job_posts enable row level security;

create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

create policy "Authenticated users can read cached job posts"
  on public.job_posts for select
  using (auth.role() = 'authenticated');
