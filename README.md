# lumaspace-shop

Next.js 16 storefront. Clerk auth, Prisma 7 + Postgres, Tailwind 4.

## Stack

- Next.js 16 (App Router, React 19)
- Clerk (auth)
- Prisma 7 with `@prisma/adapter-pg`
- PostgreSQL 16
- Tailwind CSS 4

## Prerequisites

- Node 20+
- Docker (for local Postgres)
- A Clerk account (free tier is fine) — [clerk.com](https://clerk.com)

## Setup

### 1. Clone + install

```bash
git clone <repo-url> lumaspace-shop
cd lumaspace-shop
npm install
```

### 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Required:

- `DATABASE_URL` — Postgres connection string. Use the local Docker default below, or a remote Prisma Postgres / Supabase URL.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` — from your Clerk dashboard (Application → API Keys).

Local default for Docker Postgres:

```
DATABASE_URL="postgres://lumaspace:lumaspace@localhost:5432/lumaspace"
```

### 3. Start Postgres (Docker)

```bash
docker compose up -d
```

Starts a `postgres:16-alpine` container named `lumaspace-postgres` on port `5432`. Data persists in the `lumaspace-pgdata` volume.

Verify it's healthy:

```bash
docker compose ps
```

### 4. Run migrations + generate client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common tasks

| Task | Command |
|------|---------|
| Start DB | `docker compose up -d` |
| Stop DB | `docker compose down` |
| Reset DB (destroys data) | `npx prisma migrate reset` |
| Apply pending migrations | `npx prisma migrate deploy` |
| Open Prisma Studio | `npx prisma studio` |
| Lint | `npm run lint` |
| Build | `npm run build` |

## Project layout

```
app/                  Next.js App Router routes + layouts
  generated/prisma/   Prisma client (generated, gitignored)
lib/
  prisma.ts           Reusable Prisma client (singleton + pg adapter)
prisma/
  schema.prisma       Data model
  migrations/         Migration history
middleware.ts         Clerk auth middleware
docker-compose.yml    Local Postgres
prisma.config.ts      Prisma 7 config (datasource URL lives here, not in schema)
```

## Clerk webhook (optional for local dev)

The app syncs Clerk users to the DB via `/api/webhooks/clerk`. For local development you can skip this — `lib/auth.ts` lazily creates the DB row on first authed request, so the app works fine without the webhook configured.

For production, or if you want full sync (including deletions and email updates):

1. Run a public tunnel to your dev server, e.g.:
   ```bash
   npx ngrok http 3000
   ```
2. In Clerk dashboard → **Webhooks** → **Add Endpoint**:
   - URL: `https://<your-tunnel>/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
3. Copy the **Signing Secret** into `.env` as `CLERK_WEBHOOK_SIGNING_SECRET`.

## Notes on Prisma 7

This project uses Prisma 7, which has breaking changes from earlier versions:

- `datasource.url` is **not** in `schema.prisma`. The connection string is read from `prisma.config.ts` (which loads `.env` via `dotenv/config`).
- `PrismaClient` requires a driver adapter for direct Postgres. We use `@prisma/adapter-pg`. See [`lib/prisma.ts`](lib/prisma.ts).
- The generator is `prisma-client` (not `prisma-client-js`) and outputs TypeScript sources to `app/generated/prisma`.

## Troubleshooting

**`Can't reach database server at localhost:5432`** — Postgres container not running. `docker compose up -d`.

**Prisma migrate refuses to run, mentions "Claude Code"** — Prisma 7 blocks AI agents from destructive migrate commands. Run the command yourself in a normal terminal.

**`@prisma/cli-dev` import error when running `prisma dev`** — known issue with the bundled Prisma Postgres dev server. Use Docker Postgres (this setup) instead.
