-- Allow viewer role for shared budgets and restrict edit permissions

-- Extend role constraints to include viewer
alter table public.budget_members
  drop constraint if exists budget_members_role_check;

alter table public.budget_members
  add constraint budget_members_role_check
  check (role in ('owner', 'editor', 'viewer'));

alter table public.budget_invites
  drop constraint if exists budget_invites_role_check;

alter table public.budget_invites
  add constraint budget_invites_role_check
  check (role in ('owner', 'editor', 'viewer'));

-- Helper to decide who can edit a shared budget
create or replace function public.can_edit_budget(p_budget_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.budget_members bm
    where bm.budget_id = p_budget_id
      and bm.user_id = auth.uid()
      and bm.role in ('owner', 'editor')
  );
$$;

-- Update policies so only editors/owners can modify budget state
drop policy if exists "budget_states: upsert members" on public.budget_states;
create policy "budget_states: upsert editors"
on public.budget_states
for insert
to authenticated
with check (public.can_edit_budget(budget_id));

drop policy if exists "budget_states: update members" on public.budget_states;
create policy "budget_states: update editors"
on public.budget_states
for update
to authenticated
using (public.can_edit_budget(budget_id))
with check (public.can_edit_budget(budget_id));
