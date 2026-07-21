# StudioBeautyHM

Site institucional e sistema de agendamento online do StudioBeautyHM, estúdio de design de sobrancelhas em Santa Bárbara D'Oeste - SP.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Supabase](https://supabase.com) (Postgres, Auth, RLS)
- Tailwind CSS
- Vitest (testes unitários) + Playwright (testes E2E)

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

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
