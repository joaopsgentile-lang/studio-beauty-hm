# StudioBeautyHM

Site institucional e sistema de agendamento online do StudioBeautyHM, estúdio de design de sobrancelhas em Santa Bárbara D'Oeste - SP.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Supabase](https://supabase.com) (Postgres, Auth, RLS)
- Tailwind CSS
- Vitest (testes unitários) + Playwright (testes E2E)

## Infraestrutura

| O quê | Onde |
|---|---|
| Site em produção | https://studiobeautyhm.vercel.app |
| Projeto Vercel | `gentile-it/studiobeautyhm` |
| Repositório | https://github.com/joaopsgentile-lang/studio-beauty-hm |
| Projeto Supabase | `juvjmddnfbkqbliwgxym` (Postgres + Auth) |

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role (secreta — nunca expor no client) |

O schema do banco está em `supabase/migrations/` — aplique na ordem em um projeto Supabase novo (via SQL Editor ou `psql`).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes end-to-end (Playwright) |

## Estrutura

- `app/(public)` — páginas públicas (Home, Serviços, Contato)
- `app/(auth)` — login e cadastro
- `app/(cliente)` — área logada do cliente (agendar, minha conta)
- `app/admin` — painel administrativo
- `app/api` — Route Handlers (disponibilidade, agendamentos, bloqueios)
- `supabase/migrations` — schema SQL versionado (tabelas, RLS, triggers)
- `lib/` — constantes, validações (zod), utilitários, clients Supabase

## Operação

### Regras de negócio
- Atendimento apenas aos **sábados, 07h às 16h**, em slots de 40 minutos (`lib/constants.ts`)
- Cancelamento (pela cliente) exige **12h de antecedência** — aplicado tanto na interface quanto por trigger no banco (`enforce_cancelamento_12h`)
- Só existe um papel `admin` por vez de forma prática (a profissional); qualquer conta nova criada via `/cadastro` nasce como `cliente`

### Promover uma conta a admin
Não existe fluxo de auto-promoção (por segurança). Para promover manualmente, rode no SQL Editor do Supabase, autenticado como owner do projeto:

```sql
update public.profiles set role = 'admin' where id = '<uuid-do-usuario>';
```

### Deploy manual (enquanto o GitHub não estiver conectado à Vercel)

```bash
npx vercel deploy --prod --token <SEU_TOKEN_VERCEL>
```

## Pendências conhecidas

- **Domínio `studiobeautyhm.com.br`**: ainda não conectado. Quando registrado, apontar em Vercel → Project Settings → Domains.
- **GitHub ↔ Vercel**: a conexão automática (deploy a cada push) não foi concluída — autorizar o GitHub App da Vercel para habilitar CI/CD.
- **Identidade visual**: logo, paleta e fontes oficiais da marca ainda não foram enviadas pela cliente; o visual atual (mármore/terracota) é um placeholder baseado no catálogo de procedimentos.
- **Fotos**: nenhuma foto real do espaço/procedimentos foi adicionada ainda. Ao incluir, sempre usar `next/image` (padrão já configurado no projeto).
- **`npm audit`**: acusa 2 vulnerabilidades em `sharp`/`postcss`, dependências internas do próprio Next.js 16.2.11 — não há ação segura a tomar agora (o fix automático rebaixaria o Next para uma versão antiga); resolve com um patch futuro do Next.js.
