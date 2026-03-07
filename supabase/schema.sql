-- Schema for Sports Academy SaaS

-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. TABLES
-------------------------------------------------------------------------------

-- Organizations (Tenants)
create table public.organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organization Members
create table public.organization_members (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role text not null check (role in ('owner', 'admin', 'coach')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(organization_id, user_id)
);

-- Profiles (User details)
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text,
    last_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Students
create table public.students (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    first_name text not null,
    last_name text not null,
    phone text,
    email text,
    date_of_birth date,
    status text not null default 'active' check (status in ('active', 'inactive', 'lead')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coaches
create table public.coaches (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete set null, -- Optional link to auth
    first_name text not null,
    last_name text not null,
    specialty text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Classes
create table public.classes (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    description text,
    coach_id uuid references public.coaches(id) on delete set null,
    schedule_info text, -- e.g., "Mon, Wed, Fri 4:00 PM"
    capacity integer not null default 20,
    status text not null default 'active' check (status in ('active', 'inactive')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Class Sessions (Specific occurrences of a class)
create table public.class_sessions (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    class_id uuid references public.classes(id) on delete cascade not null,
    session_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Attendance
create table public.attendance (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    session_id uuid references public.class_sessions(id) on delete cascade not null,
    student_id uuid references public.students(id) on delete cascade not null,
    status text not null default 'present' check (status in ('present', 'absent', 'late')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(session_id, student_id)
);

-- Membership Plans
create table public.membership_plans (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    description text,
    price numeric(10, 2) not null,
    billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'yearly', 'weekly', 'one-time')),
    features text[],
    is_popular boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Memberships
create table public.student_memberships (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    student_id uuid references public.students(id) on delete cascade not null,
    plan_id uuid references public.membership_plans(id) on delete restrict not null,
    start_date date not null,
    end_date date,
    status text not null default 'active' check (status in ('active', 'canceled', 'expired')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments
create table public.payments (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations(id) on delete cascade not null,
    student_id uuid references public.students(id) on delete cascade not null,
    amount numeric(10, 2) not null,
    description text not null,
    payment_date timestamp with time zone not null default timezone('utc'::text, now()),
    status text not null default 'paid' check (status in ('paid', 'pending', 'failed', 'refunded')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-------------------------------------------------------------------------------

-- Helper function to check if the current user belongs to an organization
create or replace function public.is_member_of(org_uuid uuid)
returns boolean as $$
declare
  is_member boolean;
begin
  select exists(
    select 1 
    from public.organization_members 
    where organization_id = org_uuid and user_id = auth.uid()
  ) into is_member;
  return is_member;
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.coaches enable row level security;
alter table public.classes enable row level security;
alter table public.class_sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.membership_plans enable row level security;
alter table public.student_memberships enable row level security;
alter table public.payments enable row level security;

-- Policies for organizations
create policy "Users can view organizations they belong to" 
  on public.organizations for select 
  using ( public.is_member_of(id) );

create policy "Users can create organizations" 
  on public.organizations for insert 
  with check ( true );

-- Policies for organization_members
create policy "Users can view members of their organization" 
  on public.organization_members for select 
  using ( public.is_member_of(organization_id) );

create policy "Users can insert their own initial membership" 
  on public.organization_members for insert 
  with check ( user_id = auth.uid() );

-- Policies for profiles
create policy "Users can view and edit their own profile" 
  on public.profiles for all 
  using ( id = auth.uid() );

-- Generic policy generation for multi-tenant tables
-- This ensures users can only do CRUD operations if they belong to the organization
create policy "Tenant isolation for students" on public.students for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for coaches" on public.coaches for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for classes" on public.classes for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for class_sessions" on public.class_sessions for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for attendance" on public.attendance for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for membership_plans" on public.membership_plans for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for student_memberships" on public.student_memberships for all using ( public.is_member_of(organization_id) );
create policy "Tenant isolation for payments" on public.payments for all using ( public.is_member_of(organization_id) );

-------------------------------------------------------------------------------
-- 3. TRIGGERS
-------------------------------------------------------------------------------
-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
