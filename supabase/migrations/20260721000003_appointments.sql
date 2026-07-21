create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id),
  service_id uuid not null references public.services(id),
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  status text not null default 'confirmado' check (status in ('confirmado', 'cancelado', 'concluido')),
  observacoes text,
  created_at timestamptz not null default now()
);

-- Impede dois agendamentos ativos no mesmo horário.
create unique index appointments_horario_unico
  on public.appointments (data, hora_inicio)
  where status != 'cancelado';

alter table public.appointments enable row level security;
