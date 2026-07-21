create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text,
  duracao_minutos int not null default 40,
  preco numeric(10, 2) not null,
  ativo boolean not null default true,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

insert into public.services (slug, nome, descricao, duracao_minutos, preco, ordem) values
  ('design-personalizado', 'Design personalizado', 'Modelagem de sobrancelhas sob medida para o formato do seu rosto.', 40, 25.00, 1),
  ('design-henna-coloracao', 'Design henna/coloração', 'Design com aplicação de henna ou coloração para preenchimento e definição.', 40, 35.00, 2),
  ('brow-lamination', 'Brow lamination', 'Alinhamento e alisamento dos fios para um efeito uniforme e alinhado.', 40, 90.00, 3),
  ('micropigmentacao-shadow', 'Micropigmentação shadow', 'Técnica de sombreamento para um efeito preenchido e natural.', 40, 480.00, 4),
  ('micropigmentacao-fio-a-fio', 'Micropigmentação fio a fio', 'Fios desenhados um a um para um resultado extremamente natural.', 40, 480.00, 5),
  ('buco', 'Buço', 'Remoção de pelos da região do buço.', 40, 10.00, 6);
