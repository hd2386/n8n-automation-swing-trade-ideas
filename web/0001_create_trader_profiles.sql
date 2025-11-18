create extension if not exists "uuid-ossp";

create table if not exists public.trader_profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  selected_stocks text[] not null default '{}',
  preferences jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trader_profiles_set_updated_at on public.trader_profiles;

create trigger trader_profiles_set_updated_at
before update on public.trader_profiles
for each row
execute procedure public.set_updated_at();

