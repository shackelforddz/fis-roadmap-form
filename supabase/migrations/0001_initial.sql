-- CLS Roadmap Feedback submissions schema.
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Intro (step 1)
  name text,
  role text,
  employer text,

  priorities text[] not null default '{}',
  priorities_write_in text,

  -- Per-priority answers; free-form shape keyed by question id (e.g. "A1", "C1").
  -- Single-select: string; multi-select: string[]; open-ended: string.
  answers jsonb not null default '{}'::jsonb,

  -- Write-in text for options that allow "Other", keyed by question id.
  write_ins jsonb not null default '{}'::jsonb,

  -- Wrap-up
  wrap_up text,

  -- Optional follow-up contact (offered on the wrap-up step)
  contact_email text
);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

-- Row-level security: allow anonymous inserts (kiosk use case).
-- Reads are disabled for anon; use the service role or a dashboard to view.
alter table public.submissions enable row level security;

drop policy if exists "anon can insert submissions" on public.submissions;
create policy "anon can insert submissions"
  on public.submissions
  for insert
  to anon
  with check (true);

-- No select/update/delete policies -> anon cannot read or modify rows.
