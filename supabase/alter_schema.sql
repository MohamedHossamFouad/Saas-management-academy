-- Add new fields to coaches table
alter table public.coaches 
add column if not exists phone text,
add column if not exists email text,
add column if not exists status text not null default 'active' check (status in ('active', 'inactive'));

-- Add new fields to organizations table for Settings page
alter table public.organizations
add column if not exists logo_url text,
add column if not exists language text not null default 'en',
add column if not exists currency text not null default 'USD',
add column if not exists timezone text not null default 'UTC';
