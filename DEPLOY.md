# Deploying Crewmate to production

Stack: **Vercel** (hosting) · **Neon** (PostgreSQL) · **Vercel Blob** (uploads) · **GitHub** (code).
All have free tiers.

---

## 1. Create a Neon database (PostgreSQL)

1. Go to https://neon.tech → sign up (free).
2. Create a project (any name, e.g. `crewmate`).
3. Copy the **pooled** connection string. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```
4. Add Prisma params → this is your production `DATABASE_URL`:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler...neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15
   ```

## 2. Load the schema + starter data into Neon (run once, from your machine)

```bash
# temporarily point at Neon and push the schema + seed
DATABASE_URL="<your neon url from step 1>" npx prisma db push
DATABASE_URL="<your neon url from step 1>" npm run db:seed
```
This creates all tables, the admin user, services, settings and demo creators.
(Delete the demo creators later from the admin, or edit `prisma/seed.ts` first.)

## 3. Push the code to GitHub

```bash
git add -A
git commit -m "Crewmate"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<you>/crewmate.git
git branch -M main
git push -u origin main
```

## 4. Import the project on Vercel

1. Go to https://vercel.com → sign in with GitHub.
2. **Add New → Project** → import your `crewmate` repo.
3. Framework is auto-detected as **Next.js**. Don't deploy yet — add env vars first (step 5).

## 5. Add environment variables on Vercel

In the import screen (or Project → Settings → Environment Variables) add:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | your Neon pooled URL (step 1) |
| `AUTH_SECRET` | run `npx auth secret` and paste the value |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` |
| `RESEND_API_KEY` | (optional) from resend.com for real emails |

## 6. Enable Blob storage (uploads)

1. In your Vercel project → **Storage** tab → **Create → Blob**.
2. Connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
   (If not, copy the token into Environment Variables with that exact name.)

## 7. Deploy

Click **Deploy**. When it finishes, open the URL → your site is live.
Admin is at `https://<your-project>.vercel.app/admin`.

---

### Updating the site later
Just `git push` — Vercel redeploys automatically.

### Custom domain
Vercel project → **Settings → Domains** → add your domain and follow the DNS steps.
Then update `NEXT_PUBLIC_SITE_URL` to the custom domain.

### Notes
- Uploads: with `BLOB_READ_WRITE_TOKEN` set, files go to Vercel Blob (persistent).
  Without it (local dev), they save to `/public/uploads`.
- The embedded PGlite DB (`npm run db:embedded`) is for **local development only**.
