-- Tabla para persistir el estado del presupuesto por usuario
create table if not exists public.budget_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.budget_states enable row level security;

create policy "budget_states: read own"
on public.budget_states for select
to authenticated
using (user_id = auth.uid());

create policy "budget_states: insert own"
on public.budget_states for insert
to authenticated
with check (user_id = auth.uid());

create policy "budget_states: update own"
on public.budget_states for update
to authenticated
using (user_id = auth.uid());

create policy "budget_states: delete own"
on public.budget_states for delete
to authenticated
using (user_id = auth.uid());

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $func$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$func$;

drop trigger if exists budget_states_set_updated_at on public.budget_states;
create trigger budget_states_set_updated_at
before update on public.budget_states
for each row execute function public.handle_updated_at();
