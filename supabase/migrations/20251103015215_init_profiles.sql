-- Tabla y políticas 'profiles'
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
on public.profiles for select
to authenticated
using (user_id = auth.uid());

create policy "profiles: upsert own"
on public.profiles for insert
to authenticated
with check (user_id = auth.uid());

create policy "profiles: update own"
on public.profiles for update
to authenticated
using (user_id = auth.uid());
