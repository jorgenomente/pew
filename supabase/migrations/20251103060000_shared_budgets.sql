create extension if not exists "pgcrypto";

-- Budgets that can be shared between users
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default timezone('utc', now())
);

alter table public.budgets enable row level security;

-- Members that belong to a budget
create table public.budget_members (
  budget_id uuid not null references public.budgets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz default timezone('utc', now()),
  primary key (budget_id, user_id)
);

alter table public.budget_members enable row level security;

-- Invitations to share a budget with another email
create table public.budget_invites (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  email text not null,
  invited_by uuid not null references auth.users(id) on delete cascade,
  budget_name text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  token text not null unique,
  created_at timestamptz default timezone('utc', now()),
  accepted_at timestamptz,
  expires_at timestamptz default (timezone('utc', now()) + interval '14 days')
);

alter table public.budget_invites enable row level security;

create unique index budget_invites_unique_pending on public.budget_invites (budget_id, lower(email))
where status = 'pending';

-- Helper functions to evaluate permissions
create or replace function public.is_budget_member(p_budget_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.budget_members bm
    where bm.budget_id = p_budget_id
      and bm.user_id = auth.uid()
  );
$$;

create or replace function public.is_budget_admin(p_budget_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.budget_members bm
    where bm.budget_id = p_budget_id
      and bm.user_id = auth.uid()
      and bm.role = 'owner'
  );
$$;

-- RLS policies
create policy "budgets: members can read"
on public.budgets
for select
to authenticated
using (public.is_budget_member(id));

create policy "budgets: owner create"
on public.budgets
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "budgets: owner update"
on public.budgets
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "budgets: owner delete"
on public.budgets
for delete
to authenticated
using (auth.uid() = owner_id);

create policy "budget_members: read"
on public.budget_members
for select
to authenticated
using (public.is_budget_member(budget_id));

create policy "budget_members: owner insert"
on public.budget_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.budgets b
    where b.id = budget_id
      and b.owner_id = auth.uid()
  )
);

create policy "budget_members: owners update"
on public.budget_members
for update
to authenticated
using (public.is_budget_admin(budget_id))
with check (public.is_budget_admin(budget_id));

create policy "budget_members: owners delete"
on public.budget_members
for delete
to authenticated
using (public.is_budget_admin(budget_id));

create policy "budget_invites: owners manage"
on public.budget_invites
for select
to authenticated
using (public.is_budget_admin(budget_id));

create policy "budget_invites: owners insert"
on public.budget_invites
for insert
to authenticated
with check (public.is_budget_admin(budget_id));

create policy "budget_invites: owners update"
on public.budget_invites
for update
to authenticated
using (public.is_budget_admin(budget_id))
with check (public.is_budget_admin(budget_id));

create policy "budget_invites: owners delete"
on public.budget_invites
for delete
to authenticated
using (public.is_budget_admin(budget_id));

-- Allow invited users to read their pending invites
create policy "budget_invites: invited user can read"
on public.budget_invites
for select
to authenticated
using (
  status = 'pending'
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- Allow invited users to mark their invite as accepted/revoked through RPC
create policy "budget_invites: invited user can update own"
on public.budget_invites
for update
to authenticated
using (
  status = 'pending'
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- Extend budget state to belong to a shared budget
alter table public.budget_states
add column if not exists budget_id uuid references public.budgets(id) on delete cascade;

alter table public.budget_states
add column if not exists updated_by uuid references auth.users(id);

-- Seed data: create a personal budget for existing rows
do $$
declare
  record_state record;
  new_budget_id uuid;
  owner_email text;
begin
  for record_state in
    select ctid, user_id, state
    from public.budget_states
    where budget_id is null
  loop
    new_budget_id := gen_random_uuid();
    owner_email := (
      select email
      from public.profiles p
      where p.user_id = record_state.user_id
      limit 1
    );

    insert into public.budgets (id, owner_id, name)
    values (
      new_budget_id,
      record_state.user_id,
      coalesce(record_state.state ->> 'budgetName', 'Tu presupuesto')
    )
    on conflict (id) do nothing;

    insert into public.budget_members (budget_id, user_id, email, role)
    values (new_budget_id, record_state.user_id, owner_email, 'owner')
    on conflict (budget_id, user_id) do update
      set role = excluded.role,
          email = coalesce(excluded.email, public.budget_members.email);

    update public.budget_states
    set budget_id = new_budget_id,
        updated_by = record_state.user_id
    where ctid = record_state.ctid;
  end loop;
end $$;

alter table public.budget_states
alter column budget_id set not null;

alter table public.budget_states
alter column updated_by set not null;

-- Replace primary key from user_id to budget_id
alter table public.budget_states
drop constraint if exists budget_states_pkey;

alter table public.budget_states
add constraint budget_states_pkey primary key (budget_id);

-- Remove old policies before dropping user_id
drop policy if exists "budget_states: read own" on public.budget_states;
drop policy if exists "budget_states: insert own" on public.budget_states;
drop policy if exists "budget_states: update own" on public.budget_states;
drop policy if exists "budget_states: delete own" on public.budget_states;

alter table public.budget_states
drop column if exists user_id;

-- Renew metadata trigger to store updated_by
create or replace function public.set_budget_state_metadata()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = timezone('utc', now());
  if auth.uid() is not null then
    new.updated_by = auth.uid();
  end if;
  return new;
end;
$function$;

drop trigger if exists budget_states_set_updated_at on public.budget_states;
drop function if exists public.handle_updated_at();
create trigger budget_states_set_metadata
before insert or update on public.budget_states
for each row execute function public.set_budget_state_metadata();

-- Update RLS policies for budget_states
create policy "budget_states: read members"
on public.budget_states
for select
to authenticated
using (public.is_budget_member(budget_id));

create policy "budget_states: upsert members"
on public.budget_states
for insert
to authenticated
with check (public.is_budget_member(budget_id));

create policy "budget_states: update members"
on public.budget_states
for update
to authenticated
using (public.is_budget_member(budget_id))
with check (public.is_budget_member(budget_id));

create policy "budget_states: delete owners"
on public.budget_states
for delete
to authenticated
using (public.is_budget_admin(budget_id));

-- RPC helpers --------------------------------------------------------------

create or replace function public.create_budget_invite(p_budget_id uuid, p_email text, p_role text default 'editor')
returns public.budget_invites
language plpgsql
security definer
set search_path = public
as $function$
declare
  normalized_email text;
  budget_label text;
  new_invite public.budget_invites%rowtype;
  invite_role text := coalesce(p_role, 'editor');
begin
  normalized_email := lower(trim(p_email));

  if normalized_email is null or normalized_email = '' then
    raise exception 'El correo es obligatorio.';
  end if;

  if not public.is_budget_admin(p_budget_id) then
    raise exception 'No tenés permisos para invitar personas a este presupuesto.';
  end if;

  select coalesce(name, 'Tu presupuesto')
  into budget_label
  from public.budgets
  where id = p_budget_id;

  delete from public.budget_invites
  where budget_id = p_budget_id
    and lower(email) = normalized_email
    and status = 'pending';

  insert into public.budget_invites (budget_id, email, invited_by, budget_name, role, token, status)
  values (
    p_budget_id,
    normalized_email,
    auth.uid(),
    budget_label,
    invite_role,
    encode(gen_random_bytes(16), 'hex'),
    'pending'
  )
  returning * into new_invite;

  return new_invite;
end;
$function$;

create or replace function public.accept_budget_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  invite_record public.budget_invites%rowtype;
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  select *
  into invite_record
  from public.budget_invites
  where token = p_token
    and status = 'pending'
    and (expires_at is null or expires_at > timezone('utc', now()))
  limit 1;

  if invite_record is null then
    raise exception 'La invitación no existe o está vencida.';
  end if;

  if current_email is null or current_email = '' or current_email <> lower(invite_record.email) then
    raise exception 'Esta invitación no corresponde a tu correo.';
  end if;

  insert into public.budget_members (budget_id, user_id, email, role)
  values (invite_record.budget_id, auth.uid(), current_email, invite_record.role)
  on conflict (budget_id, user_id) do update
    set role = excluded.role,
        email = coalesce(excluded.email, public.budget_members.email);

  update public.budget_invites
  set status = 'accepted',
      accepted_at = timezone('utc', now())
  where id = invite_record.id;

  return invite_record.budget_id;
end;
$function$;

create or replace function public.revoke_budget_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
  update public.budget_invites
  set status = 'revoked'
  where id = p_invite_id
    and status = 'pending'
    and public.is_budget_admin(budget_id);
end;
$function$;
