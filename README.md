# CREWMATE

A creator community & talent marketplace. Clients discover content creators, explore their work and ratings, select one or several, and send a project request. An admin dashboard manages creators, requests, reviews and contacts.

Built with **Next.js 15 (App Router)** · **React 19** · **TypeScript** · **Tailwind CSS** · **Framer Motion** · **Prisma** · **PostgreSQL** · **Auth.js (NextAuth v5)** · **Recharts** · **Resend**.

---

## Features

**Public site**
- Premium animated home, about, community and contact pages
- Community directory with live search + filters (service, city, language, rating), **auto-sorted by rating**
- Rich creator profiles: portfolio gallery with lightbox, reviews, rating distribution, services, skills
- Multi-creator selection (persisted in `localStorage`) with a floating selection bar
- Project request form (pre-filled with selected creators) and a general contact form
- Dynamic SEO metadata per creator, sitemap & robots

**Admin dashboard** (`/admin`, auth-protected)
- Overview with KPIs and charts (requests over time, status split, top content, creator ratings)
- Requests: table + filters + detail view with status workflow (`NEW → CONTACTED → IN_PROGRESS → COMPLETED / CANCELLED`) and internal notes
- Creators: full CRUD, activate/hide, services, and a portfolio manager
- Reviews: add / publish / delete — creator ratings **recompute automatically**
- Services, Contacts, and editable site Settings (stats + contact info)

---

## Prerequisites

- **Node.js 18.18+** (tested on Node 24)
- A **PostgreSQL** database (via Docker, local install, or a managed provider like Neon/Supabase)

---

## Quick start (currently configured: embedded database, no Docker)

This project is set up to run with an **embedded PostgreSQL (PGlite)** — no Docker,
no install, no credentials. You need **two terminals**:

```bash
# Terminal 1 — start the embedded Postgres (keep it running)
npm run db:embedded          # listens on 127.0.0.1:5434, data in ./.pglite-data

# Terminal 2 — (first time only) create schema + demo data, then run the app
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000 — and the admin at http://localhost:3000/admin.

**Demo admin login:** `admin@crewmate.studio` / `crewmate123`

Already seeded once? Just run the two terminals (`db:embedded` + `dev`); the data
persists in `./.pglite-data`.

> npm 11 blocks lifecycle scripts by default. If `@prisma/client` isn't generated, run `npx prisma generate` once.

### Switching to a "real" PostgreSQL (Docker / managed)

The app is 100% standard PostgreSQL — to use Docker or a managed DB instead of the
embedded one, just change `DATABASE_URL` in `.env`:

```bash
npm run db:up                # Docker Postgres on port 5433
# set DATABASE_URL to postgresql://crewmate:crewmate@localhost:5433/crewmate
npm run setup                # push schema + seed
npm run dev
```

---

## Database options

The app needs a PostgreSQL connection string in `DATABASE_URL`.

**Option A — Docker (default)**
`docker-compose.yml` runs Postgres 16 on host port **5433** (to avoid clashing with a local Postgres on 5432):
```bash
npm run db:up      # docker compose up -d
```
`.env` is already set to `postgresql://crewmate:crewmate@localhost:5433/crewmate`.

**Option B — Existing / managed Postgres**
Set `DATABASE_URL` in `.env` to your server (Neon, Supabase, RDS, or a local install), then:
```bash
npm run db:push && npm run db:seed
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run start` | Start the production server |
| `npm run db:up` / `db:down` | Start / stop the Postgres container |
| `npm run db:push` | Push the Prisma schema to the DB |
| `npm run db:seed` | Seed demo data |
| `npm run setup` | `db:push` + `db:seed` |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop, re-push and re-seed |

---

## Environment variables

See `.env.example`. Key ones:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — random string (`npx auth secret`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seeded admin credentials
- `RESEND_API_KEY` — optional; without it, emails are logged to the console
- `NEXT_PUBLIC_SITE_URL` — used for SEO metadata & sitemap

---

## Project structure

```
app/
  (public)/            # public site (home, about, community, contact)
    community/[slug]/   # dynamic creator profile (SEO metadata)
  admin/
    login/              # sign-in
    (panel)/            # protected dashboard (sidebar layout)
  actions/public.ts     # server actions: request + contact submissions
  admin/actions.ts      # server actions: admin CRUD + status changes
  api/auth/[...nextauth] # NextAuth route
components/
  layout/ selection/ creators/ forms/ home/ admin/ ui/
lib/
  prisma.ts auth.ts auth.config.ts data.ts email.ts validations.ts constants.ts utils.ts
prisma/
  schema.prisma seed.ts
middleware.ts           # protects /admin (edge-safe auth)
```

---

## Security notes

- `/admin` is protected by middleware **and** a server-side session check in the panel layout.
- All server actions call `requireAdmin()` before mutating.
- All public form input is validated server-side with Zod.
- API and admin routes are excluded from indexing via `robots`.

---

## Production

1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set a strong `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.
3. `npm run build && npm run start` (or deploy to Vercel — add a `RESEND_API_KEY` for real emails).
4. Run `prisma migrate deploy` (create migrations with `prisma migrate dev` first) or `prisma db push`.

> Demo images are loaded from Unsplash (see `next.config.mjs` `remotePatterns`). Swap for your own CDN in production.
