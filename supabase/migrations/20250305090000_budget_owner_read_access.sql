-- Allow budget owners to read their recently created budgets even before membership rows exist.
create policy "budgets: owners can read"
on public.budgets
for select
to authenticated
using (owner_id = auth.uid());

