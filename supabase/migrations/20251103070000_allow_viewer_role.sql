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
