create or replace function public.create_budget_invite(p_budget_id uuid, p_email text, p_role text default 'editor')
returns public.budget_invites
language plpgsql
security definer
set search_path = public, extensions
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
    encode(extensions.gen_random_bytes(16), 'hex'),
    'pending'
  )
  returning * into new_invite;

  return new_invite;
end;
$function$;
