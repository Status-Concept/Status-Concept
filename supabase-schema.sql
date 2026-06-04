-- Tabela de perfis (estende o auth.users do Supabase)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de favoritos persistentes
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- RLS (Row Level Security) - OBRIGATORIO
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

-- Policies: users so acedem aos seus proprios dados
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on public.favorites for delete using (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente no registo
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
