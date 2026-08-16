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

-- Public enquiry submissions from the contact form.
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  phone text check (char_length(phone) <= 40),
  interest text check (char_length(interest) <= 100),
  message text check (char_length(message) <= 4000),
  source text check (char_length(source) <= 60),
  -- Stamped when a logged-in user submits, so the account can later show its
  -- own enquiry history (see docs/design/enquiry-loop.md). Null for anonymous.
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Newsletter signups from the homepage.
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique check (char_length(email) <= 320),
  source text check (char_length(source) <= 60),
  created_at timestamptz not null default now()
);

-- User profiles, extending Supabase Auth users.
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  role text not null default 'client',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Staff permissions live in the database profile, not in user-editable
-- metadata. Existing profiles remain client accounts until an administrator
-- explicitly promotes them.
alter table public.profiles add column if not exists role text not null default 'client';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('client', 'delivery', 'admin'));

-- Persistent favourites.
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Internal delivery record. There is deliberately no client_id or public
-- read path in this MVP: the delivery team and administrators are the only
-- roles that can access these records.
create table if not exists public.deliveries (
  id uuid default gen_random_uuid() primary key,
  reference text not null unique check (char_length(reference) <= 80),
  customer_name text not null check (char_length(customer_name) <= 200),
  location text check (char_length(location) <= 500),
  delivery_date date,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'issue')),
  notes text check (char_length(notes) <= 4000),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete restrict not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_photos (
  id uuid default gen_random_uuid() primary key,
  delivery_id uuid references public.deliveries(id) on delete cascade not null,
  stage text not null check (stage in ('before', 'during', 'after', 'damage')),
  storage_path text not null unique check (char_length(storage_path) <= 500),
  caption text check (char_length(caption) <= 500),
  uploaded_by uuid references public.profiles(id) on delete restrict not null,
  invalidated_by uuid references public.profiles(id) on delete set null,
  invalidated_at timestamptz,
  invalidated_reason text check (char_length(invalidated_reason) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.enquiries enable row level security;
alter table public.subscribers enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_photos enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant insert on public.subscribers to anon, authenticated;
grant select, insert, update on public.deliveries to authenticated;
grant select, insert, update on public.delivery_photos to authenticated;

-- Newsletter is insert-only from the public site, like enquiries.
drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Enquiries are write-only from the public site: anyone may submit, nobody
-- (anon or authenticated) may read them back. No select/update/delete policy.
drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

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

-- Profile owners may edit their contact details, but role changes are
-- administrator-controlled. The column revoke protects direct table writes;
-- the trigger also protects deployments where broader grants already exist.
revoke update (role) on table public.profiles from anon, authenticated;

create or replace function private.prevent_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if new.role is distinct from old.role
    and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
  then
    raise exception 'Profile roles are managed by administrators';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_profile_role_change() from public, anon, authenticated;

drop trigger if exists prevent_profile_role_change on public.profiles;
create trigger prevent_profile_role_change
  before update of role on public.profiles
  for each row execute function private.prevent_profile_role_change();

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

-- Delivery records are staff-only. Delivery users can see/update deliveries
-- assigned to them; administrators can manage every record. There are no
-- delete policies, so the audit trail cannot be removed by the web client.
drop policy if exists "Staff can view assigned deliveries" on public.deliveries;
drop policy if exists "Admins can create deliveries" on public.deliveries;
drop policy if exists "Staff can update assigned deliveries" on public.deliveries;

create policy "Staff can view assigned deliveries"
  on public.deliveries
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and (p.role = 'admin' or (p.role = 'delivery' and deliveries.assigned_to = p.id))
    )
  );

create policy "Admins can create deliveries"
  on public.deliveries
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "Staff can update assigned deliveries"
  on public.deliveries
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and (p.role = 'admin' or (p.role = 'delivery' and deliveries.assigned_to = p.id))
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and (p.role = 'admin' or (p.role = 'delivery' and deliveries.assigned_to = p.id))
    )
  );

drop policy if exists "Staff can view delivery photos" on public.delivery_photos;
drop policy if exists "Staff can add delivery photos" on public.delivery_photos;
drop policy if exists "Admins can invalidate delivery photos" on public.delivery_photos;

create policy "Staff can view delivery photos"
  on public.delivery_photos
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.deliveries d
      join public.profiles p on p.id = (select auth.uid())
      where d.id = delivery_photos.delivery_id
        and (p.role = 'admin' or (p.role = 'delivery' and d.assigned_to = p.id))
    )
  );

create policy "Staff can add delivery photos"
  on public.delivery_photos
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.deliveries d
      join public.profiles p on p.id = (select auth.uid())
      where d.id = delivery_photos.delivery_id
        and (p.role = 'admin' or (p.role = 'delivery' and d.assigned_to = p.id))
    )
    and uploaded_by = (select auth.uid())
  );

create policy "Admins can invalidate delivery photos"
  on public.delivery_photos
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

-- Keep the completion rule true even if a future staff client bypasses the
-- current React validation.
create or replace function private.require_delivery_photos()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if new.status = 'completed' and not exists (
    select 1
    from public.delivery_photos photo
    where photo.delivery_id = new.id
      and photo.invalidated_at is null
      and photo.stage = 'before'
  ) then
    raise exception 'A completed delivery needs a before photo';
  end if;

  if new.status = 'completed' and not exists (
    select 1
    from public.delivery_photos photo
    where photo.delivery_id = new.id
      and photo.invalidated_at is null
      and photo.stage = 'after'
  ) then
    raise exception 'A completed delivery needs an after photo';
  end if;
  return new;
end;
$$;

revoke all on function private.require_delivery_photos() from public, anon, authenticated;
drop trigger if exists require_delivery_photos on public.deliveries;
create trigger require_delivery_photos
  before insert or update of status on public.deliveries
  for each row execute function private.require_delivery_photos();

-- Private storage bucket. Supabase Storage policies below only allow staff to
-- access paths whose first segment is the delivery UUID.
insert into storage.buckets (id, name, public)
values ('delivery-photos', 'delivery-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "Staff can read delivery photo objects" on storage.objects;
drop policy if exists "Staff can upload delivery photo objects" on storage.objects;

create policy "Staff can read delivery photo objects"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'delivery-photos'
    and exists (
      select 1
      from public.deliveries d
      join public.profiles p on p.id = (select auth.uid())
      where d.id::text = split_part(storage.objects.name, '/', 1)
        and (p.role = 'admin' or (p.role = 'delivery' and d.assigned_to = p.id))
    )
  );

create policy "Staff can upload delivery photo objects"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'delivery-photos'
    and exists (
      select 1
      from public.deliveries d
      join public.profiles p on p.id = (select auth.uid())
      where d.id::text = split_part(storage.objects.name, '/', 1)
        and (p.role = 'admin' or (p.role = 'delivery' and d.assigned_to = p.id))
    )
  );

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
