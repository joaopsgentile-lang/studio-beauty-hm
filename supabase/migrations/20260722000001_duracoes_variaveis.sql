-- Serviços passam a ter durações reais e variáveis (35min a 2h30min), não mais
-- um slot fixo de 40min. Isso exige trocar a proteção anti-conflito de "mesmo
-- horário de início" para "nenhuma sobreposição de intervalo".

create extension if not exists btree_gist;

drop index if exists appointments_horario_unico;

alter table public.appointments
  add column horario_range tsrange generated always as (
    tsrange((data + hora_inicio)::timestamp, (data + hora_fim)::timestamp, '[)')
  ) stored;

alter table public.appointments
  add constraint appointments_sem_sobreposicao
  exclude using gist (horario_range with &&) where (status != 'cancelado');

-- Atualiza catálogo de serviços com preços, durações e descrições reais.
update public.services set
  nome = 'Design personalizado',
  descricao = 'Modelagem de sobrancelhas sob medida para o formato do seu rosto.',
  duracao_minutos = 35,
  preco = 35.00
where slug = 'design-personalizado';

update public.services set
  nome = 'Henna / Coloração',
  descricao = 'Henna tinge a pele e os fios por até 15 dias, preenchendo falhas. Coloração tinge só os fios (cobre brancos), resultado mais natural por até 4 semanas.',
  duracao_minutos = 45,
  preco = 45.00
where slug = 'design-henna-coloracao';

update public.services set
  nome = 'Brow Lamination',
  descricao = 'Alinhamento e alisamento dos fios para um efeito uniforme e alinhado.',
  duracao_minutos = 60,
  preco = 110.00
where slug = 'brow-lamination';

update public.services set
  descricao = 'Fios desenhados um a um para um resultado extremamente natural.',
  duracao_minutos = 150,
  preco = 480.00
where slug = 'micropigmentacao-fio-a-fio';

update public.services set
  descricao = 'Técnica de sombreamento para um efeito preenchido e natural.',
  duracao_minutos = 150,
  preco = 480.00
where slug = 'micropigmentacao-shadow';

-- Buço saiu do catálogo atual — desativa em vez de apagar (preserva histórico).
update public.services set ativo = false where slug = 'buco';

insert into public.services (slug, nome, descricao, duracao_minutos, preco, ordem)
values (
  'reconstrucao-sobrancelhas',
  'Reconstrução de sobrancelhas',
  'Tratamento que reativa o crescimento dos fios, fortalece e preenche falhas naturalmente. Protocolo de 6 sessões para reconstrução completa.',
  50,
  95.00,
  6
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  duracao_minutos = excluded.duracao_minutos,
  preco = excluded.preco,
  ativo = true;

update public.services set ordem = 4 where slug = 'micropigmentacao-fio-a-fio';
update public.services set ordem = 5 where slug = 'micropigmentacao-shadow';
