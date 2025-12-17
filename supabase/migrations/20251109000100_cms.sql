-- CMS tables for services and media_items

-- Services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10,2),
  currency text default 'EUR',
  price_text text,
  images text[] default '{}', -- array of image URLs
  order_index int default 0,
  published boolean default false
);

-- Media library items (URL-based)
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  url text not null unique,
  title text,
  tags text[] default '{}',
  order_index int default 0
);

-- Indexes
create index if not exists idx_services_published on public.services(published);
create index if not exists idx_services_order on public.services(order_index);
create index if not exists idx_media_items_order on public.media_items(order_index);

-- RLS
alter table public.services enable row level security;
alter table public.media_items enable row level security;

-- Policies for services
-- Public can read only published services
drop policy if exists services_public_select on public.services;
create policy services_public_select on public.services
  for select to anon using (published = true);

-- Authenticated can read all
drop policy if exists services_auth_select on public.services;
create policy services_auth_select on public.services
  for select to authenticated using (true);

-- Authenticated can modify
drop policy if exists services_auth_modify on public.services;
create policy services_auth_modify on public.services
  for all to authenticated using (true) with check (true);

-- Policies for media_items (authenticated only)
drop policy if exists media_items_auth_select on public.media_items;
create policy media_items_auth_select on public.media_items
  for select to authenticated using (true);

drop policy if exists media_items_auth_modify on public.media_items;
create policy media_items_auth_modify on public.media_items
  for all to authenticated using (true) with check (true);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();
