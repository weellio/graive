# Self-Hosting Supabase on Your VPS (with Traefik)

This guide walks through adding a self-hosted Supabase instance to an existing VPS that already runs Docker, Traefik, and other services (e.g. n8n). The result is a single Supabase instance you can use across all your projects — no quotas, no monthly bills from Supabase.com.

---

## Prerequisites

- VPS running Ubuntu with Docker and Docker Compose installed
- Traefik running as a reverse proxy (with Let's Encrypt for SSL)
- A domain you control (e.g. `yourdomain.com`)
- Two subdomains pointed at your VPS IP (A records):
  - `api.yourdomain.com` → Supabase API (what your apps connect to)
  - `studio.yourdomain.com` → Supabase Studio dashboard

---

## Step 1: Clone the Supabase Docker repo

SSH into your VPS:

```bash
cd /opt
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
```

---

## Step 2: Generate secrets

You need three values: a JWT secret, an anon key, and a service role key.

**Generate the JWT secret:**

```bash
openssl rand -base64 32
```

Copy the output — this is your `JWT_SECRET`.

**Generate the anon and service role keys:**

Go to: https://supabase.com/docs/guides/self-hosting/docker#api-keys

Paste your `JWT_SECRET` into the generator. It will output:
- `anon` key → this is your `ANON_KEY`
- `service_role` key → this is your `SERVICE_ROLE_KEY`

Keep these safe. The service role key has full database access.

---

## Step 3: Configure the `.env` file

Edit `/opt/supabase/docker/.env`:

```bash
nano .env
```

Set the following values (leave everything else as default for now):

```env
# Database
POSTGRES_PASSWORD=choose-a-strong-password

# JWT
JWT_SECRET=your-generated-jwt-secret
ANON_KEY=eyJ...your-anon-key...
SERVICE_ROLE_KEY=eyJ...your-service-role-key...

# URLs — replace yourdomain.com with your actual domain
SITE_URL=https://studio.yourdomain.com
API_EXTERNAL_URL=https://api.yourdomain.com
SUPABASE_PUBLIC_URL=https://api.yourdomain.com

# Studio dashboard login
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=choose-a-strong-password

# Optional: SMTP for auth emails (magic links, password reset etc.)
SMTP_ADMIN_EMAIL=admin@yourdomain.com
SMTP_HOST=smtp.yourmailprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SENDER_NAME=YourAppName
```

---

## Step 4: Add Traefik integration to `docker-compose.yml`

Open the compose file:

```bash
nano docker-compose.yml
```

### 4a. Add your Traefik network

At the very bottom of the file, in the `networks:` section, add your external Traefik network:

```yaml
networks:
  default:
    name: supabase_default
  # Add this block — use the same network name Traefik uses
  traefik_default:
    external: true
```

> To find your Traefik network name run: `docker network ls | grep traefik`

### 4b. Add labels to the `kong` service (the API gateway)

Find the `kong:` service block and add `networks` and `labels`:

```yaml
  kong:
    # ... existing config, don't change it ...
    networks:
      - default
      - traefik_default
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.supabase-api.rule=Host(`api.yourdomain.com`)"
      - "traefik.http.routers.supabase-api.entrypoints=websecure"
      - "traefik.http.routers.supabase-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.supabase-api.loadbalancer.server.port=8000"
      - "traefik.docker.network=traefik_default"
```

### 4c. Add labels to the `studio` service (the dashboard)

Find the `studio:` service block and add:

```yaml
  studio:
    # ... existing config, don't change it ...
    networks:
      - default
      - traefik_default
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.supabase-studio.rule=Host(`studio.yourdomain.com`)"
      - "traefik.http.routers.supabase-studio.entrypoints=websecure"
      - "traefik.http.routers.supabase-studio.tls.certresolver=letsencrypt"
      - "traefik.http.services.supabase-studio.loadbalancer.server.port=3000"
      - "traefik.docker.network=traefik_default"
```

> **Note:** Replace `letsencrypt` with the name of your Traefik cert resolver. Check your existing n8n labels to confirm the name.

---

## Step 5: Start Supabase

```bash
cd /opt/supabase/docker
docker compose up -d
```

First start takes 1–2 minutes while Postgres initialises.

**Check everything is running:**

```bash
docker compose ps
```

All services should show `Up`. If something is unhealthy:

```bash
docker compose logs kong --tail 30
docker compose logs db --tail 30
```

**Test the API:**

```bash
curl https://api.yourdomain.com/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
# Should return a JSON response, not a 502
```

**Open the Studio:**

Go to `https://studio.yourdomain.com` — log in with your `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD`.

---

## Step 6: Apply your app's database schema

If you're starting fresh (no data to migrate), run your migrations in the Studio SQL editor:

`studio.yourdomain.com` → SQL Editor → paste and run your schema SQL.

For the GRAIVE project, the schema is in `docs/` or can be exported from Supabase.com first (see migration section below).

---

## Step 7: Update your app's environment variables

In each project that uses this Supabase instance, update the `.env` / `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

For Vercel deployments: update the environment variables in the Vercel project settings and redeploy.

---

## Migrating Data from Supabase.com

### Option A: Using the Supabase CLI (recommended)

Install the Supabase CLI on your local machine if you don't have it:

```bash
npm install -g supabase
```

**Export schema + data from Supabase.com:**

Find your database connection string in Supabase.com → Project Settings → Database → Connection string (use the "URI" format with your password filled in).

```bash
# Export everything (schema + data)
pg_dump \
  "postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --no-owner \
  --no-acl \
  -F plain \
  -f supabase_export.sql
```

> You need `pg_dump` installed locally. On Mac: `brew install libpq`. On Ubuntu: `sudo apt install postgresql-client`.

**Copy the dump to your VPS:**

```bash
scp supabase_export.sql user@your.vps.ip:/opt/supabase/docker/
```

**Import into your self-hosted Postgres:**

```bash
# SSH into your VPS
ssh user@your.vps.ip

cd /opt/supabase/docker

# Find your Postgres container name
docker compose ps | grep db

# Import (the db container is usually called supabase-db-1)
docker exec -i supabase-db-1 psql \
  -U postgres \
  -d postgres \
  < supabase_export.sql
```

### Option B: Using Supabase Studio (small databases)

1. On **Supabase.com**: go to Studio → SQL Editor → run:
   ```sql
   -- Export table by table as INSERT statements
   -- Do this for each table you need
   SELECT * FROM your_table;
   ```
   Copy the results.

2. On your **self-hosted Studio**: SQL Editor → paste and run the INSERT statements.

This is tedious for large datasets — use Option A for anything with more than a few hundred rows.

### Option C: Supabase CLI db push (schema only)

If you use Supabase migrations:

```bash
supabase db dump -f schema.sql --db-url "postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres"
supabase db push --db-url "postgresql://postgres:SELF-HOSTED-PASSWORD@your.vps.ip:5432/postgres"
```

---

## Row Level Security policies

After migrating, check that your RLS policies came across correctly:

`studio.yourdomain.com` → Table Editor → select a table → Policies tab

They should match what you had on Supabase.com. If not, re-apply them from your schema SQL.

---

## Keeping Supabase updated

```bash
cd /opt/supabase/docker
git pull
docker compose pull
docker compose up -d
```

Run this periodically (monthly is fine for a stable app).

---

## Backups

Supabase.com does automated backups. Self-hosted, you manage this yourself. A simple cron:

```bash
# Add to crontab: crontab -e
0 2 * * * docker exec supabase-db-1 pg_dump -U postgres postgres | gzip > /opt/backups/supabase-$(date +\%Y\%m\%d).sql.gz
```

Keep at least 7 days of backups. Rotate old ones:

```bash
# Add alongside the backup cron
0 3 * * * find /opt/backups -name "supabase-*.sql.gz" -mtime +7 -delete
```

---

## Useful commands

```bash
# View all service status
docker compose -f /opt/supabase/docker/docker-compose.yml ps

# Restart a single service
docker compose -f /opt/supabase/docker/docker-compose.yml restart auth

# View logs
docker compose -f /opt/supabase/docker/docker-compose.yml logs -f kong

# Connect to Postgres directly
docker exec -it supabase-db-1 psql -U postgres

# Stop everything
docker compose -f /opt/supabase/docker/docker-compose.yml down

# Stop and wipe all data (destructive!)
docker compose -f /opt/supabase/docker/docker-compose.yml down -v
```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| 502 Bad Gateway on API | `docker compose logs kong` — is Kong up? Is the port 8000? |
| Studio not loading | `docker compose logs studio` — check for env var errors |
| Auth emails not sending | Check `SMTP_*` vars in `.env`, restart with `docker compose up -d` |
| Database connection refused | `docker compose logs db` — Postgres may still be initialising |
| Traefik not routing | Confirm network name matches, check `docker network inspect traefik_default` |
| Permission denied on tables | RLS is on — check policies in Studio or use service role key |