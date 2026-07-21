create table public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  motivo text,
  created_at timestamptz not null default now()
);

alter table public.blocked_slots enable row level security;
