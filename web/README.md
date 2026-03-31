# GRAIVE — Web Platform

AI literacy curriculum platform for kids and adults aged 10+. Built on Next.js + Supabase + Stripe with a white-label admin panel, age-gated AI chat, and a step-by-step interactive lesson engine.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS + shadcn/ui |
| Database / Auth | Supabase (Postgres + RLS) |
| Payments | Stripe (subscriptions + Customer Portal) |
| AI | Anthropic Claude / OpenAI / Google Gemini (switchable) |
| Hosting | Docker + Traefik on VPS |

---

## Local Development

```bash
cd web
npm install
cp .env.local.example .env.local   # fill in values
npm run dev                         # http://localhost:3000
```

### Required Environment Variables

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

# AI providers — only the active provider is required
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=

# App URL (used for Stripe redirects)
NEXT_PUBLIC_APP_URL=https://graive.com
```

All AI provider keys can also be overridden per-deployment from `/admin/ai` — the DB value takes precedence.

---

## Database Setup

Run `web/supabase-schema.sql` in your Supabase SQL Editor. This creates all tables, RLS policies, and seeds default settings.

**If upgrading an existing DB**, run these migrations:

```sql
-- Streak tracking
alter table profiles add column if not exists current_streak int not null default 0;
alter table profiles add column if not exists longest_streak int not null default 0;
alter table profiles add column if not exists last_active_date date;

-- Module enhancements
alter table modules add column if not exists video_script text;
alter table modules add column if not exists is_current_events boolean not null default false;
alter table modules add column if not exists publish_date date;

-- Creator tier + group plans
alter table modules drop constraint if exists modules_tier_slug_check;
alter table modules add constraint modules_tier_slug_check
  check (tier_slug in ('explorer','builder','thinker','innovator','creator'));

alter table profiles drop constraint if exists profiles_age_tier_check;
alter table profiles add constraint profiles_age_tier_check
  check (age_tier in ('explorer','builder','thinker','innovator','creator'));

alter table subscriptions drop constraint if exists subscriptions_plan_check;
alter table subscriptions add constraint subscriptions_plan_check
  check (plan in ('free','monthly','annual','beta','family','classroom'));

-- Group plans
create table if not exists groups (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  plan text not null check (plan in ('family','classroom')),
  max_members int not null default 4,
  invite_code text not null unique default upper(substring(md5(random()::text),1,8)),
  stripe_subscription_id text unique,
  status text not null default 'inactive' check (status in ('active','inactive')),
  created_at timestamptz default now()
);
create table if not exists group_members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);
create table if not exists group_ai_usage (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(id) on delete cascade,
  date date not null default current_date,
  message_count integer not null default 0,
  unique(group_id, date)
);
alter table groups enable row level security;
alter table group_members enable row level security;

-- Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id uuid references modules(id) on delete cascade not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique(user_id, module_id)
);
alter table notes enable row level security;
create policy "Users manage own notes" on notes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- AI usage rate limiting
insert into site_settings (key, value)
  values ('paid_tier_daily_message_limit', '200')
  on conflict (key) do nothing;
```

### Make yourself admin

```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

---

## App Routes

```
/                                  Landing page
/auth/signin                       Sign in
/auth/signup                       Sign up (age group selection)
/auth/forgot-password              Password reset
/join/[code]                       Join a family or classroom group

/dashboard                         Progress overview, streak, XP, next-up module
/learn/[tier]                      Tier module grid
/learn/[tier]/[module]             Module page — lesson steps + AI chat
/learn/[tier]/certificate          Completion certificate (printable, unlocks when tier done)

/account                           Profile settings
/account/billing                   Plans: Monthly / Annual / Family / Classroom
/account/group                     Group dashboard (owner/teacher: member progress, invite code)

/admin                             Overview: users, AI usage today, top modules, conversions
/admin/modules                     Module list — toggle, edit, create
/admin/modules/new                 Visual step-by-step module builder
/admin/modules/[id]/edit           Edit an existing module
/admin/current-events              Create monthly AI news modules with scheduled publish dates
/admin/video-scripts               AI-generated teleprompter scripts per module, export all
/admin/theme                       Brand: name, logo URL, colors, font
/admin/ai                          LLM provider, models per tier, rate limits
/admin/users                       Users: plan management (free/monthly/annual/beta/family/classroom)
/admin/curriculum                  Bulk import via ZIP

/api/chat                          AI streaming (auth-gated, rate-limited, group-aware)
/api/admin/models                  Live model list from provider API
/api/admin/generate-script         AI video script generation
/api/admin/generate-current-events AI current events module generation
/api/groups/info                   Group lookup by invite code
/api/groups/join                   Join a group by invite code
/api/webhooks/stripe               Stripe event handler (subscriptions + group activation)
```

---

## Learning Tiers

| Tier | Ages | Free? | Modules |
|------|------|-------|---------|
| Explorer | 10–11 | ✅ Free | 12 core + monthly current events |
| Builder | 12–13 | Pro | 12 core + monthly current events |
| Thinker | 14–15 | Pro | 12 core + monthly current events |
| Innovator | 16–18 | Pro | 12 core + monthly current events |
| Creator | 18+ | Pro | 6 starter (AI stack, agents, RAG, ship it, business) |

Total core modules: **54** across 5 tiers. Plus monthly current events per tier.

---

## Pricing Plans

| Plan | Price | Learners |
|------|-------|---------|
| Free | $0 | 1 (Explorer only, 10 AI msgs/day) |
| Monthly | $24.99/mo | 1 |
| Annual | $199.99/yr | 1 (save 33%) |
| Family | $59.99/mo | Up to 4 (~$15/learner) |
| Classroom | $149.99/mo | Up to 30 (~$5/student) |
| Beta | Admin-granted | Full access, no Stripe |

**Add to Stripe:** Create products for Family and Classroom plans, copy Price IDs to `STRIPE_FAMILY_PRICE_ID` and `STRIPE_CLASSROOM_PRICE_ID`.

---

## AI Rate Limits

| Plan | Daily limit |
|------|------------|
| Free | 10 msgs/day (configurable in `/admin/ai`) |
| Monthly / Annual / Beta | 200 msgs/day per user |
| Family | 200 msgs/day per member |
| Classroom | 500 msgs/day **shared pool** across all students |

---

## Module Markdown Format

Content is stored as markdown. Steps are separated by `---` on its own line.

```markdown
## About This Lesson

Introduction content here. Use **bold**, *italic*, bullet lists.

> Highlighted quote or key idea — appears with a colored left border.

---

## Key Concepts

- **Term one** — definition
- **Term two** — definition

---

## Activity: Try It

What happened when you tried the prompt?

Type your answer: ___

How good was the result? ___/10

---

## Think About It

What would you change next time?

___

---

## Challenge

Build something harder here.
```

### Step type detection (auto, by heading keyword)

| Heading contains | Card style |
|-----------------|------------|
| "about", "introduction", "background" | Read This — white |
| "key concept", "key idea", "glossary" | Key Ideas — sky blue |
| "fun fact" | Fun Facts — amber |
| "activity", "try it", "build it" | Try It — white + tier color bar |
| "reflect", "debate", "think about" | Think About It — violet |
| "challenge", "level up", "capstone" | Challenge — dark/trophy |

### Interactive elements

| Syntax | Renders as |
|--------|-----------|
| `___` | Fill-in-the-blank input (saved to localStorage) |
| `___/10` | 1–10 rating widget with 😞/🤩 labels |
| `> text` | Blockquote with colored left border |
| ` ```code``` ` | Code block with copy button |

---

## AI Chat — Dual Mode

Each module page has a two-tab AI panel:

| Tab | Name | Behaviour |
|-----|------|-----------|
| Tutor | Spark (Explorer) / Sage (others) | Locked to current lesson, age-appropriate |
| Playground | Try It | Open AI — no topic restriction |

Playground history is **not** saved to DB.

---

## Video Scripts

Each module can have an AI-generated teleprompter script for its intro video:

1. Go to `/admin/video-scripts`
2. Click **Generate Script** on any module
3. Review and edit the script inline
4. Save to DB or **Export All** as a `.txt` file for your production team

Scripts include: Hook, Intro, Main Content, Activity Teaser, Outro, Production Notes, B-roll suggestions.

---

## Current Events Modules

Monthly AI news modules keep subscribers engaged and content fresh:

1. Go to `/admin/current-events`
2. Select tier, month/year, enter the AI topic/headline
3. Paste background context (optional) or let AI research it
4. Click **Generate with AI** or **Use Template**
5. Set a **Publish Date** — module only appears to learners on/after that date
6. Save → module appears in the tier with a 🗞 **New** badge

---

## Group Plans (Family & Classroom)

### Setup flow

1. Owner pays for Family or Classroom plan via Stripe
2. Stripe webhook creates a `groups` row and generates an `invite_code`
3. Owner shares link: `https://graive.com/join/XXXX`
4. Members visit the link, sign in, and join (capacity-checked)
5. All members get paid-tier access automatically

### Group dashboard

Owner/teacher goes to `/account/group` to see:
- Member list with progress, streaks, and AI usage today
- Invite code + shareable link with one-click copy
- Classroom shared AI usage pool (500 msgs/day)

### Admin override

Admins can manually create a group from `/admin/users` or grant `beta` plan to any user without Stripe.

---

## Gamification

- **XP** — 100 XP per completed module, shown on dashboard
- **Streaks** — daily login streak tracked per user, flame 🔥 counter on dashboard
- **Certificates** — printable completion certificate unlocks when all modules in a tier are done
- **Progress bars** — per tier and per module grid
- **"Up Next" card** — dashboard always shows the next incomplete module with a direct link

---

## White-Label

Every visual element is configurable from `/admin/theme`:
- Brand name, logo URL, primary and accent colors, font

The platform is designed for single-tenant white-label deployments — each client gets their own Supabase project + Stripe account + Docker instance. No code changes needed to rebrand.

---

## File Structure

```
web/src/
  app/
    (app)/
      dashboard/page.tsx
      learn/[tier]/page.tsx
      learn/[tier]/[module]/page.tsx
      learn/[tier]/certificate/page.tsx      ← Completion certificate
      account/billing/page.tsx               ← All 4 plan types
      account/group/page.tsx                 ← Group/classroom dashboard
    admin/
      page.tsx                               ← Analytics overview
      modules/page.tsx
      modules/new/page.tsx
      modules/[id]/edit/page.tsx
      modules/_components/ModuleEditor.tsx
      current-events/page.tsx                ← Monthly AI news creator
      video-scripts/page.tsx                 ← AI teleprompter script gen
      theme/page.tsx
      ai/page.tsx
      users/page.tsx
      curriculum/page.tsx
    join/[code]/page.tsx                     ← Group invite join page
    api/
      chat/route.ts                          ← Streaming AI (group-aware rate limiting)
      admin/models/route.ts
      admin/generate-script/route.ts         ← Video script generation
      admin/generate-current-events/route.ts ← Current events generation
      admin/users/plan/route.ts              ← Admin plan override
      groups/info/route.ts
      groups/join/route.ts
      webhooks/stripe/route.ts               ← Group activation on payment
  components/
    chat/ChatPanel.tsx                       ← Dual-mode AI (tutor + playground)
    curriculum/ModulePage.tsx                ← Step-by-step lesson engine
  lib/
    llm/index.ts + providers/               ← Claude / OpenAI / Gemini
    config/site.ts
    supabase/
    stripe/
  types/index.ts

curriculum/
  ages-10-11/   ← 12 modules
  ages-12-13/   ← 12 modules
  ages-14-15/   ← 12 modules
  ages-16-18/   ← 12 modules
  ages-18-plus/ ← 6 modules (Creator tier)
```

---

## Deployment

See [docs/INSTALL.md](../docs/INSTALL.md) for full VPS deployment instructions.

Quick deploy on VPS:
```bash
git pull
docker compose up -d --build
```
