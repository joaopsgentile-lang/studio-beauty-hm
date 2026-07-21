-- Garante a regra de negócio de cancelamento com 12h de antecedência quando
-- quem cancela é a própria cliente (admin pode cancelar a qualquer momento).
create function public.enforce_cancelamento_12h()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'cancelado' and old.status != 'cancelado' and not public.is_admin() then
    if (new.data + new.hora_inicio) - (now() at time zone 'America/Sao_Paulo') < interval '12 hours' then
      raise exception 'O cancelamento deve ser feito com ao menos 12 horas de antecedência.';
    end if;
  end if;
  return new;
end;
$$;

create trigger appointments_cancel_12h
  before update on public.appointments
  for each row execute function public.enforce_cancelamento_12h();
