-- ==============================================================
-- CareerAI Database Schema for Supabase
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================

-- 1. Profiles Table (Stores user assessment and preferences)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  interest text,
  skills text[] default array[]::text[],
  education text,
  experience text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Roadmap Progress Table (Stores completed weeks & milestones)
create table if not exists public.roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  track text unique not null,
  completed_milestones text[] default array[]::text[],
  completed_weeks text[] default array[]::text[],
  completed_tasks text[] default array[]::text[],
  updated_at timestamptz default now()
);

-- 3. Candidate Resumes Table (Stores uploaded resume metadata)
create table if not exists public.candidate_resumes (
  id uuid primary key default gen_random_uuid(),
  file_name text unique not null,
  file_size text,
  file_type text,
  uploaded_at text,
  created_at timestamptz default now()
);

-- 4. Saved Jobs Table
create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  job_id text unique not null,
  title text,
  company text,
  platform text,
  saved_at timestamptz default now()
);

-- Enable Row Level Security (RLS) with open read/write policies for public key
alter table public.profiles enable row level security;
alter table public.roadmap_progress enable row level security;
alter table public.candidate_resumes enable row level security;
alter table public.saved_jobs enable row level security;

-- Policies for public anonymous / publishable key access
create policy "Allow all operations on profiles"
  on public.profiles for all
  using (true)
  with check (true);

create policy "Allow all operations on roadmap_progress"
  on public.roadmap_progress for all
  using (true)
  with check (true);

create policy "Allow all operations on candidate_resumes"
  on public.candidate_resumes for all
  using (true)
  with check (true);

create policy "Allow all operations on saved_jobs"
  on public.saved_jobs for all
  using (true)
  with check (true);
