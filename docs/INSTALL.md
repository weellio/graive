# GRAIVE — Installation & Deployment Guide

This guide covers local development setup and production deployment to a VPS with Docker and Traefik.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Supabase Setup](#supabase-setup)
5. [Stripe Setup](#stripe-setup)
6. [Anthropic / OpenAI Setup](#anthropic--openai-setup)
7. [Environment Variables](#environment-variables)
8. [Production Deployment (Docker + Traefik)](#production-deployment-docker--traefik)
9. [First Run: Admin Setup](#first-run-admin-setup)
10. [Importing the Curriculum](#importing-the-curriculum)
11. [Updating the App](#updating-the-app)
12. [Optional: n8n Automations](#optional-n8n-automations)

---

## Prerequisites

### Local machine
- **Node.js** 20 or later — [nodejs.org](https://nodejs.org)
- **npm** 10 or later (comes with Node)
- **Git**

### VPS (production)
- **Docker** and **Docker Compose** v2
- **Traefik** running with a Let's Encrypt cert resolver named `letsencrypt`
- A network called `traefik-public` (or update the compose file to match your setup)
- Port 80 and 443 open
- DNS A record pointing your domain to the VPS IP

### External services (all have free tiers to start)
| Service | Used for | Free tier |
|---------|----------|-----------|
| [Supabase](https://supabase.com) | Database + Auth | ✅ Generous free tier |
| [Stripe](https://stripe.com) | Payments | ✅ Free (pay per transaction) |
| [Anthropic](https://console.anthropic.com) | Claude AI | Pay per token |
| [OpenAI](https://platform.openai.com) | Optional AI fallback | Pay per token |

---

## Project Structure

```
Claude_job2/
├── curriculum/              ← Lesson markdown files
│   ├── curriculum.json      ← Curriculum manifest (48 modules)
│   ├── ages-10-11/
│   ├── ages-12-13/
│   ├── ages-14-15/
│   └── ages-16-18/
├── web/                     ← Next.js application
│   ├── src/
│   │   ├── app/             ← App Router pages and API routes
│   │   ├── components/      ← React components
│   │   ├── lib/             ← Supabase, Stripe, LLM clients
│   │   └── types/           ← TypeScript types
│   ├── public/              ← Static files (put logo.png here)
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── supabase-schema.sql  ← Run this in Supabase to set up the DB
│   └── .env.local.example   ← Copy to .env.local and fill in
├── tools/
│   └── bundle-curriculum.mjs ← CLI tool for packaging curricula
├── docker-compose.yml        ← Production deployment
├── CURRICULUM_FORMAT.md      ← Spec for curriculum authors
└── docs/
    ├── USER_GUIDE.md
    └── INSTALL.md            ← This file
```

---

## Local Development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Claude_job2/web
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values (see [Environment Variables](#environment-variables) below).

### 3. Set up Supabase (see full section below)

You need a Supabase project before the app will run.

### 4. Start the dev server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Changes to files in `src/` hot-reload automatically.

### 5. Build for production (test locally)

```bash
npm run build
npm start
```

---

## Supabase Setup

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **New Project**
3. Choose a name (e.g. `graive`), set a strong database password, pick a region close to your users
4. Wait ~2 minutes for the project to initialise

### 2. Run the database schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Open `web/supabase-schema.sql` from this repo
4. Paste the entire contents into the editor
5. Click **Run**

This creates all tables, row-level security policies, and seeds the default site settings.

> **Important:** If you've already run this schema and need to add the new `content` column to an existing DB, run this migration separately:
> ```sql
> ALTER TABLE modules ADD COLUMN IF NOT EXISTS content text;
> ALTER TABLE modules ALTER COLUMN content_path SET DEFAULT '';
> ```

### 3. Get your API keys

In your Supabase project, go to **Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret — never expose it client-side

### 4. Configure Auth

Go to **Authentication → Settings**:

- **Site URL:** Set to your production URL (e.g. `https://graive.com`) — or `http://localhost:3000` for local dev
- **Redirect URLs:** Add `https://graive.com/**` and `http://localhost:3000/**`
- Under **Email**, make sure **Confirm email** is enabled

### 5. (Optional) Disable email confirmation for dev

For faster local testing, go to **Authentication → Settings → Email** and disable **Confirm email**. Re-enable before going live.

---

## Stripe Setup

### 1. Create an account

Go to [stripe.com](https://stripe.com) and sign up.

### 2. Create your products

In the Stripe Dashboard:

1. Go to **Products → Add product**
2. Create **"GRAIVE Pro — Monthly"**
   - Pricing: Recurring, £9.99/month (or your currency)
   - Copy the **Price ID** (starts with `price_`) → `STRIPE_MONTHLY_PRICE_ID`
3. Create **"GRAIVE Pro — Annual"**
   - Pricing: Recurring, £79.99/year
   - Copy the **Price ID** → `STRIPE_ANNUAL_PRICE_ID`

### 3. Get your API keys

Go to **Developers → API Keys**:
- **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Secret key** → `STRIPE_SECRET_KEY`

Use **test mode keys** during development (they start with `pk_test_` and `sk_test_`). Switch to live keys for production.

### 4. Set up the webhook

**For local development**, use the Stripe CLI:
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret it prints → STRIPE_WEBHOOK_SECRET
```

**For production:**
1. Go to **Developers → Webhooks → Add endpoint**
2. URL: `https://graive.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_failed`
4. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. Enable the Customer Portal

Go to **Settings → Billing → Customer portal** and enable it. This allows subscribers to manage their own subscriptions.

---

## Anthropic / OpenAI Setup

### Anthropic (Claude) — default AI provider

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add billing
3. Go to **API Keys → Create Key**
4. Copy the key → `ANTHROPIC_API_KEY`

Default models used:
- Explorer & Builder → `claude-haiku-4-5-20251001` (fast, cheap)
- Thinker & Innovator → `claude-sonnet-4-6` (more capable)

These can be changed per-tier in the admin panel at `/admin/ai`.

### OpenAI (optional)

If you want to offer OpenAI as an alternative provider:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key → `OPENAI_API_KEY`

Switch the active provider in the admin panel at `/admin/ai`.

---

## Environment Variables

Copy `web/.env.local.example` to `web/.env.local` and fill in every value.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `ANTHROPIC_API_KEY` | ✅ | Claude API key |
| `OPENAI_API_KEY` | Optional | Only needed if using OpenAI provider |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `STRIPE_MONTHLY_PRICE_ID` | ✅ | Stripe Price ID for monthly plan |
| `STRIPE_ANNUAL_PRICE_ID` | ✅ | Stripe Price ID for annual plan |
| `NEXT_PUBLIC_APP_URL` | ✅ | Full URL of the app (`https://graive.com` in prod) |

---

## Production Deployment (Docker + Traefik)

This assumes Traefik is already running on your VPS with a `traefik-public` network and a `letsencrypt` cert resolver.

### 1. Clone the repo on your VPS

```bash
git clone <your-repo-url> /srv/graive
cd /srv/graive
```

### 2. Create the environment file

```bash
cp web/.env.local.example web/.env.local
nano web/.env.local   # fill in all values
```

Set `NEXT_PUBLIC_APP_URL=https://graive.com` (your actual domain).

### 3. Add your logo

```bash
cp /path/to/logo.png web/public/logo.png
```

### 4. Deploy

```bash
docker compose up -d --build
```

The first build takes 3–5 minutes. After that, the app is live at `https://graive.com`.

### 5. Verify

```bash
docker compose logs -f graive
```

You should see `Ready on http://0.0.0.0:3000`. Check `https://graive.com` in a browser.

### Streaming fix for Traefik

The AI chat uses streaming responses. Without this, Traefik may buffer them and the chat will appear to freeze then dump all text at once.

Add to your Traefik static config (`traefik.yml`):

```yaml
# Already handled by the docker-compose labels if you added the buffering middleware.
# If not, add to your traefik.yml:
providers:
  docker:
    defaultRule: "Host(`{{ normalize .Name }}.graive.com`)"
```

Or add the buffering middleware label to `docker-compose.yml`:

```yaml
- "traefik.http.middlewares.graive-nobuffer.buffering.maxResponseBodyBytes=0"
- "traefik.http.routers.graive.middlewares=graive-nobuffer"
```

---

## First Run: Admin Setup

After deploying, you need to create your first admin user.

### 1. Sign up normally

Go to `https://graive.com/auth/signup` and create an account with your email.

### 2. Promote to admin in Supabase

In your Supabase project, go to **SQL Editor** and run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 3. Access the admin panel

Go to `https://graive.com/admin`. You'll see the admin sidebar with:

- **Overview** — user counts, completions, AI message stats
- **Modules** — toggle modules on/off per tier
- **Curriculum** — import/export curriculum bundles
- **Theme** — brand name, logo URL, primary and accent colours
- **AI Config** — LLM provider, model per tier, history toggle, daily message limit
- **Users** — view all registered users, their tier, plan, and join date

### 4. Configure your brand

Go to `/admin/theme` and set:
- **Brand Name:** `GRAIVE` (or your white-label name)
- **Logo URL:** either upload your logo to `web/public/logo.png` and set `/logo.png`, or use an external URL
- **Primary Colour:** `#e040fb` (magenta — matches the GRAIVE brand)
- **Accent Colour:** `#00e5ff` (cyan)

Click **Save Theme**.

---

## Importing the Curriculum

The app ships with a ready-to-use curriculum bundle containing 48 modules across 4 tiers.

### Option A: Import via admin panel (recommended)

1. Go to `/admin/curriculum`
2. Drag and drop `ai-literacy-v2.zip` from the project root onto the upload zone
3. Click import and wait — 48 modules import in seconds
4. Go to `/admin/modules` to confirm they're all enabled

### Option B: Keep filesystem-based content (no import needed)

The app automatically reads lesson markdown files from the `curriculum/` folder at `../curriculum/` relative to the `web/` directory. As long as the modules are in the DB (seeded by the schema SQL), and the markdown files exist on disk, it works without importing.

This works for local dev and Docker deployments where the filesystem is accessible. If you're deploying without the curriculum folder on the same machine, use Option A.

### Creating a custom curriculum

See [CURRICULUM_FORMAT.md](../CURRICULUM_FORMAT.md) for the full authoring spec.

Quick start:
```bash
# Generate a template
node tools/bundle-curriculum.mjs --template

# Edit content in ./my-curriculum/
# Bundle it
node tools/bundle-curriculum.mjs ./my-curriculum my-course.zip

# Import at /admin/curriculum
```

---

## Updating the App

### Pull and rebuild

```bash
cd /srv/graive
git pull
docker compose up -d --build
```

Docker will rebuild the image and restart the container with zero-downtime (Traefik handles routing during the restart).

### Database migrations

If a new version adds columns or tables, a migration SQL will be provided in the release notes. Run it in the Supabase SQL Editor before or after deploying — the app is designed to be backwards-compatible with a previous schema version.

---

## Optional: n8n Automations

n8n handles background automation — Stripe webhook processing, welcome emails, and weekly progress digests. It is **not** required for the core platform to function.

### What n8n automates

| Workflow | Trigger | Action |
|----------|---------|--------|
| Stripe sync | Subscription event | Update `subscriptions` table |
| Welcome email | New user signup | Send onboarding email |
| Weekly digest | Every Monday 8am | Query completions → email summary |
| Dunning | Failed payment | Email reminder |

### Setup

1. Install n8n on your VPS (Docker recommended):

```yaml
# Add to your docker-compose.yml or run separately
n8n:
  image: n8nio/n8n
  restart: unless-stopped
  environment:
    - N8N_BASIC_AUTH_ACTIVE=true
    - N8N_BASIC_AUTH_USER=admin
    - N8N_BASIC_AUTH_PASSWORD=your-password
    - WEBHOOK_URL=https://n8n.graive.com
  volumes:
    - n8n_data:/home/node/.n8n
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.n8n.rule=Host(`n8n.graive.com`)"
    - "traefik.http.routers.n8n.entrypoints=websecure"
    - "traefik.http.routers.n8n.tls.certresolver=letsencrypt"
    - "traefik.http.services.n8n.loadbalancer.server.port=5678"
  networks:
    - traefik-public
```

2. Access n8n at `https://n8n.graive.com`
3. Create workflows using the Supabase and SMTP nodes
4. The Stripe webhook endpoint for n8n: `https://n8n.graive.com/webhook/stripe`

> **Note:** The app's `/api/webhooks/stripe` route handles all subscription state changes directly. The n8n Stripe workflow is only needed if you want automated emails or other side effects on payment events.

---

## Common Issues

### Build fails: `Module not found`

```bash
cd web && npm install
```

### App starts but shows a blank page

Check that your Supabase URL and anon key are correct in `.env.local`. Open browser devtools → Console for errors.

### AI chat returns an error

- Verify `ANTHROPIC_API_KEY` is set correctly and the account has credit
- Check `docker compose logs graive` for the actual error

### Stripe checkout redirects back with an error

- Verify `STRIPE_SECRET_KEY` and `STRIPE_MONTHLY_PRICE_ID` / `STRIPE_ANNUAL_PRICE_ID` match your Stripe dashboard
- Make sure the Price IDs are from the correct mode (test vs live)

### Webhook signature verification failed

- For production: make sure the `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret in your Stripe dashboard
- The secret for a webhook endpoint is different from your API key

### Docker container keeps restarting

```bash
docker compose logs graive --tail=50
```

The most common causes: missing env vars, can't reach Supabase (check URL), or port 3000 already in use on the host.

---

*GRAIVE — Generative Robotic AI in Virtual Environments*
*Last updated: 2026-03-24*
