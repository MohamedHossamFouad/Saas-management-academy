-- Sports Academy SaaS — Feature Expansion Migration
-- Run this on your Supabase SQL Editor

-------------------------------------------------------------------------------
-- 1. NEW TABLES
-------------------------------------------------------------------------------

-- Branches
create table if not exists public.branches (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    location text,
    manager text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coach Attendance
create table if not exists public.coach_attendance (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    coach_id uuid references public.coaches(id) on delete cascade not null,
    date date not null,
    status text not null default 'present' check (status in ('present', 'absent', 'late')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(coach_id, date)
);

-- Payroll
create table if not exists public.payroll (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    coach_id uuid references public.coaches(id) on delete cascade not null,
    month text not null, -- e.g. '2026-03'
    base_salary numeric(10, 2) not null default 0,
    pt_sessions integer not null default 0,
    pt_rate numeric(10, 2) not null default 0,
    total numeric(10, 2) not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(coach_id, month)
);

-------------------------------------------------------------------------------
-- 2. EXTEND EXISTING TABLES
-------------------------------------------------------------------------------

-- Extend students
alter table public.students
add column if not exists branch_id uuid references public.branches(id) on delete set null,
add column if not exists remaining_classes integer not null default 0;

-- Extend coaches
alter table public.coaches
add column if not exists salary numeric(10, 2) default 0,
add column if not exists pt_session_rate numeric(10, 2) default 0,
add column if not exists working_days_per_month integer default 22,
add column if not exists branch_id uuid references public.branches(id) on delete set null;

-- Extend attendance
alter table public.attendance
add column if not exists trainer_id uuid references public.coaches(id) on delete set null,
add column if not exists check_in_time timestamp with time zone;

-- Extend membership_plans
alter table public.membership_plans
add column if not exists number_of_classes integer default 0,
add column if not exists duration_days integer default 30;

-- Extend student_memberships
alter table public.student_memberships
add column if not exists remaining_classes integer default 0;

-- Extend payments
alter table public.payments
add column if not exists discount numeric(10, 2) default 0,
add column if not exists paid_for_month text,
add column if not exists invoice_number text;

-- Extend organizations
alter table public.organizations
add column if not exists attendance_rules jsonb default '{"blocked_days": [], "grace_period_days": 7}'::jsonb;

-------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY FOR NEW TABLES
-------------------------------------------------------------------------------

alter table public.branches enable row level security;
alter table public.coach_attendance enable row level security;
alter table public.payroll enable row level security;

create policy "Tenant isolation for branches" on public.branches for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for coach_attendance" on public.coach_attendance for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for payroll" on public.payroll for all using ( public.is_member_of(organization_id) );
