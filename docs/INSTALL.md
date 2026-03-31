# GRAIVE — Installation & Deployment Guide

This guide covers local development setup and production deployment to a VPS with Docker and Traefik.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Supabase Setup](#supabase-setup)
5. [Stripe Setup](#stripe-setup)
6. [AI Provider Setup](#ai-provider-setup)
7. [Environment Variables](#environment-variables)
8. [Production Deployment (Docker + Traefik)](#production-deployment-docker--traefik)
9. [First Run: Admin Setup](#first-run-admin-setup)
10. [Importing the Curriculum](#importing-the-curriculum)
11. [Updating the App](#updating-the-app)
12. [Optional: n8n Automations](#optional-n8n-automations)
13. [Common Issues](#common-issues)

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

### External services

| Service | Used for | Free tier |
|---------|----------|-----------|
| [Supabase](https://supabase.com) | Database + Auth | Yes — generous free tier |
| [Stripe](https://stripe.com) | Payments | Yes — free (pay per transaction) |
| [Anthropic](https://console.anthropic.com) | Claude AI (default) | Pay per token |
| [OpenAI](https://platform.openai.com) | Optional AI fallback | Pay per token |
| [Google AI](https://aistudio.google.com) | Optional AI fallback | Pay per token |

---

## Project Structure

```
Claude_job2/
├── curriculum/              ← Lesson markdown files (54 modules + current events)
│   ├── curriculum.json      ← Curriculum manifest
│   ├── ages-10-11/          ← Explorer tier (12 modules)
│   ├── ages-12-13/          ← Builder tier (12 modules)
│   ├── ages-14-15/          ← Thinker tier (12 modules)
│   ├── ages-16-18/          ← Innovator tier (12 modules)
│   └── ages-18-plus/        ← Creator tier (6 modules)
├── web/                     ← Next.js application
│   ├── src/
│   │   ├── app/             ← App Router pages and API routes
│   │   ├── components/      ← React components
│   │   ├── lib/             ← Supabase, Stripe, LLM clients
│   │   └── types/           ← TypeScript types
│   ├── public/              ← Static files (put logo.png here)
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── supabase-schema.sql  ← Run this in Supabase SQL Editor to set up the DB
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
git clone https://github.com/weellio/graive.git
cd graive/web
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values (see [Environment Variables](#environment-variables) below).

### 3. Set up Supabase

You need a Supabase project before the app will run. See the [Supabase Setup](#supabase-setup) section.

### 4. Start the dev server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Changes to `src/` hot-reload automatically.

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
3. Name it (e.g. `graive`), set a strong database password, pick a region close to your users
4. Wait ~2 minutes for the project to initialise

### 2. Run the database schema

1. In your Supabase project, go to **SQL Editor → New Query**
2. Open `web/supabase-schema.sql` from this repo
3. Paste the entire contents and click **Run**

This creates all tables, row-level security policies, and seeds the default site settings including all 54 core module rows.

### 3. Run migrations (upgrading an existing DB only)

If you ran a previous version of the schema, run these migrations in the SQL Editor:

```sql
-- Streak tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak int NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak int NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_date date;

-- Module enhancements
ALTER TABLE modules ADD COLUMN IF NOT EXISTS video_script text;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_current_events boolean NOT NULL DEFAULT false;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS publish_date date;

-- Creator tier
ALTER TABLE modules DROP CONSTRAINT IF EXISTS modules_tier_slug_check;
ALTER TABLE modules ADD CONSTRAINT modules_tier_slug_check
  CHECK (tier_slug IN ('explorer','builder','thinker','innovator','creator'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_tier_check
  CHECK (age_tier IN ('explorer','builder','thinker','innovator','creator'));

-- Group plans (Family + Classroom)
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free','monthly','annual','beta','family','classroom'));

CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('family','classroom')),
  max_members int NOT NULL DEFAULT 4,
  invite_code text NOT NULL UNIQUE DEFAULT upper(substring(md5(random()::text),1,8)),
  stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive')),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);
CREATE TABLE IF NOT EXISTS group_ai_usage (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  message_count integer NOT NULL DEFAULT 0,
  UNIQUE(group_id, date)
);
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON notes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI usage limit setting
INSERT INTO site_settings (key, value)
  VALUES ('paid_tier_daily_message_limit', '200')
  ON CONFLICT (key) DO NOTHING;
```

### 4. Get your API keys

In your Supabase project, go to **Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` — keep this secret, never expose client-side

### 5. Configure Auth

Go to **Authentication → Settings**:

- **Site URL:** `https://graive.com` (or `http://localhost:3000` for local dev)
- **Redirect URLs:** Add `https://graive.com/**` and `http://localhost:3000/**`
- Enable **Confirm email**

For faster local testing, you can temporarily disable email confirmation under **Authentication → Settings → Email**.

---

## Stripe Setup

### 1. Create an account

Go to [stripe.com](https://stripe.com) and sign up. Use **test mode** keys during development.

### 2. Create your products

In the Stripe Dashboard, go to **Products → Add product** and create all four plans:

| Product | Billing | Price | Env var |
| ------- | ------- | ----- | ------- |
| GRAIVE Pro — Monthly | Recurring monthly | $24.99/mo | `STRIPE_MONTHLY_PRICE_ID` |
| GRAIVE Pro — Annual | Recurring annual | $199.99/yr | `STRIPE_ANNUAL_PRICE_ID` |
| GRAIVE Family | Recurring monthly | $59.99/mo | `STRIPE_FAMILY_PRICE_ID` |
| GRAIVE Classroom | Recurring monthly | $149.99/mo | `STRIPE_CLASSROOM_PRICE_ID` |

Copy the **Price ID** (starts with `price_`) from each product into your `.env.local`.

### 3. Get your API keys

Go to **Developers → API Keys**:

- **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Secret key** → `STRIPE_SECRET_KEY`

### 4. Set up the webhook

**For local development**, use the Stripe CLI:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret printed → STRIPE_WEBHOOK_SECRET
```

**For production:**

1. Go to **Developers → Webhooks → Add endpoint**
2. URL: `https://graive.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

The webhook handler creates the `groups` row automatically when a Family or Classroom checkout completes, and deactivates it when the subscription is cancelled.

### 5. Enable the Customer Portal

Go to **Settings → Billing → Customer portal** and enable it. This allows subscribers to manage or cancel their own subscriptions.

---

## AI Provider Setup

The platform supports Claude (default), OpenAI, and Google Gemini. Only the active provider's key is required. The active provider is set in the admin panel at `/admin/ai` — the DB value takes precedence over env vars.

### Anthropic Claude (default)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account, add billing, and create an API key
3. Copy the key → `ANTHROPIC_API_KEY`

Default models:

- Explorer & Builder → `claude-haiku-4-5-20251001` (fast, economical)
- Thinker, Innovator & Creator → `claude-sonnet-4-6` (more capable)

### OpenAI (optional)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key → `OPENAI_API_KEY`

### Google Gemini (optional)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Create an API key → `GEMINI_API_KEY`

Switch the active provider any time from `/admin/ai` without redeploying.

### AI usage and cost

Daily message limits prevent runaway API costs:

| Plan | Daily limit | Tracking |
| ---- | ----------- | -------- |
| Free | 10 msgs/day | Per user |
| Monthly / Annual / Beta | 200 msgs/day | Per user |
| Family | 200 msgs/day | Per member |
| Classroom | 500 msgs/day | Shared pool across all students |

Limits are configurable in `/admin/ai`. The free limit is stored as `free_tier_daily_message_limit` in `site_settings`; the paid limit as `paid_tier_daily_message_limit`.

---

## Environment Variables

Copy `web/.env.local.example` to `web/.env.local` and fill in every value:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_ANNUAL_PRICE_ID=
STRIPE_FAMILY_PRICE_ID=
STRIPE_CLASSROOM_PRICE_ID=

# AI providers — only the active provider key is required
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=

# App URL (used for Stripe redirects and invite links)
NEXT_PUBLIC_APP_URL=https://graive.com
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `ANTHROPIC_API_KEY` | Yes (if using Claude) | Claude API key |
| `OPENAI_API_KEY` | Optional | Only if using OpenAI provider |
| `GEMINI_API_KEY` | Optional | Only if using Gemini provider |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_MONTHLY_PRICE_ID` | Yes | Price ID for monthly plan |
| `STRIPE_ANNUAL_PRICE_ID` | Yes | Price ID for annual plan |
| `STRIPE_FAMILY_PRICE_ID` | Yes | Price ID for Family plan |
| `STRIPE_CLASSROOM_PRICE_ID` | Yes | Price ID for Classroom plan |
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL (`https://graive.com` in prod) |

---

## Production Deployment (Docker + Traefik)

This assumes Traefik is already running on your VPS with a `traefik-public` network and a `letsencrypt` cert resolver.

### 1. Clone the repo on your VPS

```bash
git clone https://github.com/weellio/graive.git /srv/graive
cd /srv/graive
```

### 2. Create the environment file

```bash
cp web/.env.local.example web/.env.local
nano web/.env.local   # fill in all values
```

Set `NEXT_PUBLIC_APP_URL=https://graive.com` (your actual domain).

### 3. Add your logo (optional)

```bash
cp /path/to/logo.png web/public/logo.png
```

Or set a logo URL from the admin panel at `/admin/theme` after first login.

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

The AI chat uses server-sent events (streaming). Without this, Traefik may buffer responses and the chat will freeze then dump all text at once.

Add to your `docker-compose.yml` labels:

```yaml
- "traefik.http.middlewares.graive-nobuffer.buffering.maxResponseBodyBytes=0"
- "traefik.http.routers.graive.middlewares=graive-nobuffer"
```

---

## First Run: Admin Setup

### 1. Sign up

Go to `https://graive.com/auth/signup` and create an account with your email.

### 2. Promote to admin

In your Supabase project, go to **SQL Editor** and run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 3. Access the admin panel

Go to `https://graive.com/admin`. You'll see the admin sidebar with:

- **Overview** — active users, AI usage, conversion rate, recent completions
- **Modules** — enable/disable per tier, edit content and metadata
- **Current Events** — create monthly AI news modules with scheduled publish dates
- **Video Scripts** — AI-generate teleprompter scripts per module, export all as .txt
- **Curriculum** — bulk import via ZIP
- **Theme** — brand name, logo, primary and accent colours, font
- **AI Config** — LLM provider, model per tier, daily message limits
- **Users** — view users, manage plans (grant beta access, override subscriptions)

### 4. Configure your brand

Go to `/admin/theme` and set:

- **Brand Name:** `GRAIVE` (or your white-label name)
- **Logo URL:** `/logo.png` if you placed a file in `web/public/`, or an external HTTPS URL
- **Primary Colour:** e.g. `#e040fb`
- **Accent Colour:** e.g. `#00e5ff`

Click **Save Theme**. Changes apply immediately without redeploying.

### 5. Grant beta access (optional)

To give yourself or a tester full paid access without going through Stripe:

Go to `/admin/users`, find the user, and set their plan to **Beta**. Beta users get full access with no Stripe requirement.

---

## Group Plans (Family & Classroom)

Group plans work automatically via Stripe webhooks. Here is how the full flow works:

### Setup

1. A parent or teacher pays for the Family or Classroom plan via Stripe Checkout
2. The Stripe webhook fires `checkout.session.completed`
3. The app creates a `groups` row in the DB and generates an 8-character `invite_code`
4. The owner (buyer) shares the link: `https://graive.com/join/XXXX`
5. Members visit the link, sign in (or create an account), and click **Join**
6. The system checks capacity, then inserts them into `group_members` and upserts their `subscriptions` row to grant paid-tier access

### Capacity limits

- Family plan: up to 4 members (including owner)
- Classroom plan: up to 30 members (including teacher)

### Admin override

Admins can manually create groups or grant individual beta access from `/admin/users` without requiring Stripe payment.

### Group dashboard

The group owner/teacher can go to `/account/group` to see:

- Member list with progress, streaks, and AI messages used today
- Invite code and shareable link (one-click copy)
- Shared AI usage pool for Classroom (500 msgs/day)

---

## Importing the Curriculum

The repo ships with 54 core modules across 5 tiers.

### Option A: Import via admin panel

1. Go to `/admin/curriculum`
2. Upload the curriculum ZIP from the project root
3. Click **Import** — modules appear in the DB in seconds
4. Go to `/admin/modules` to confirm they're all enabled

### Option B: Filesystem-based (local dev and Docker)

The app reads markdown from the `curriculum/` folder relative to the project root. As long as the modules are seeded in the DB (done by `supabase-schema.sql`) and the markdown files exist on disk, no import is needed.

### Creating custom curriculum

See [CURRICULUM_FORMAT.md](../CURRICULUM_FORMAT.md) for the authoring spec.

---

## Updating the App

### Pull and rebuild

```bash
cd /srv/graive
git pull
docker compose up -d --build
```

Docker rebuilds and restarts the container. Traefik handles routing during the restart with no downtime.

### Database migrations

Migration SQL is provided in release notes and in the [Supabase Setup](#supabase-setup) section above. Run it in the SQL Editor before or after deploying — the app tolerates running on a previous schema version briefly.

---

## Optional: n8n Automations

n8n handles background automation — welcome emails, weekly progress digests, and payment dunning. It is **not** required for the core platform.

### What n8n automates

| Workflow | Trigger | Action |
|----------|---------|--------|
| Welcome email | New user signup | Send onboarding email |
| Weekly digest | Every Monday 8am | Query completions → personalised summary email |
| Dunning | Failed payment | Email reminder |

Note: Stripe → Supabase subscription sync is handled directly by `/api/webhooks/stripe`, not n8n.

### n8n Setup

Add to your `docker-compose.yml` or run separately:

```yaml
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

---

## Common Issues

### Build fails: `Module not found`

```bash
cd web && npm install
```

### App starts but shows a blank page

Check that your Supabase URL and anon key are correct in `.env.local`. Open browser devtools → Console for errors.

### AI chat returns an error or no response

- Verify `ANTHROPIC_API_KEY` (or your active provider key) is set and the account has credit
- Check `docker compose logs graive` for the actual error message

### Stripe checkout redirects back with an error

- Verify all four `STRIPE_*_PRICE_ID` variables match your Stripe dashboard
- Make sure the Price IDs are from the correct mode (test vs live)
- Check that `NEXT_PUBLIC_APP_URL` is set correctly (used for Stripe redirect URLs)

### Group join link says "Group not found"

- Confirm the Stripe webhook fired successfully: check **Developers → Webhooks → Recent deliveries** in Stripe
- Confirm `STRIPE_FAMILY_PRICE_ID` and `STRIPE_CLASSROOM_PRICE_ID` match the price IDs in your Stripe products

### Webhook signature verification failed

- The signing secret for a webhook endpoint is different from your API key
- For production: copy the secret from **Stripe → Webhooks → [your endpoint] → Signing secret**

### Docker container keeps restarting

```bash
docker compose logs graive --tail=50
```

Most common causes: missing env var, unreachable Supabase URL, or port 3000 in use on the host.

### Certificate page redirects back to the tier

The completion certificate only unlocks when all modules in the tier are marked complete. Finish all modules first.

---

*GRAIVE — AI Literacy Platform*
*Last updated: 2026-03-30*
