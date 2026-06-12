-- Status Concept Supabase schema
-- Apply in Supabase SQL editor or through the Supabase MCP/CLI.

create schema if not exists private;

-- Public product catalogue. The frontend still ships local product data, but
-- this table keeps the backend in sync for API/catalogue usage.
create table if not exists public.products (
  id text primary key,
  name text not null,
  collection text,
  collection_name text,
  category text not null,
  category_label text,
  img text,
  tag text,
  description text,
  supplier text,
  source_url text,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User profiles, extending Supabase Auth users.
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Persistent favourites.
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;

drop policy if exists "Anyone can view active products" on public.products;
create policy "Anyone can view active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can view own favorites" on public.favorites;
drop policy if exists "Users can insert own favorites" on public.favorites;
drop policy if exists "Users can delete own favorites" on public.favorites;

create policy "Users can view own favorites"
  on public.favorites
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own favorites"
  on public.favorites
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own favorites"
  on public.favorites
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep SECURITY DEFINER out of the exposed public schema and pin search_path.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update
    set name = excluded.name,
        phone = coalesce(excluded.phone, public.profiles.phone),
        updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

drop function if exists public.handle_new_user();
