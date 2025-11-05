-- Ensure permission helpers run with definer privileges to avoid recursive RLS checks.
create or replace function public.is_budget_member(p_budget_id uuid)
returns boolean
language sql
security definer
set search_path = public
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
security definer
set search_path = public
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

create or replace function public.can_edit_budget(p_budget_id uuid)
returns boolean
language sql
security definer
set search_path = public
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
