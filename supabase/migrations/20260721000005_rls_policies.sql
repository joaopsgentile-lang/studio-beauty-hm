-- Função auxiliar (security definer) para checar se o usuário logado é admin,
-- sem disparar recursão de RLS ao consultar a própria tabela profiles.
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

-- Apenas o service role (ações de backend/admin) pode alterar o campo role,
-- evitando que a própria cliente se autopromova a admin.
create function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and auth.role() != 'service_role' then
    raise exception 'Não é permitido alterar o papel do usuário.';
  end if;
  return new;
end;
$$;

create trigger profiles_block_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- services: leitura pública, escrita restrita ao admin
create policy "services_select_public"
  on public.services for select
  using (true);

create policy "services_write_admin"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

-- appointments
create policy "appointments_select_own_or_admin"
  on public.appointments for select
  using (cliente_id = auth.uid() or public.is_admin());

create policy "appointments_insert_own"
  on public.appointments for insert
  with check (cliente_id = auth.uid());

create policy "appointments_cancel_own"
  on public.appointments for update
  using (cliente_id = auth.uid() and status = 'confirmado')
  with check (status = 'cancelado');

create policy "appointments_admin_full_update"
  on public.appointments for update
  using (public.is_admin())
  with check (public.is_admin());

-- blocked_slots: uso exclusivo do admin (leitura ampla é feita via service role nas APIs)
create policy "blocked_slots_admin_all"
  on public.blocked_slots for all
  using (public.is_admin())
  with check (public.is_admin());
