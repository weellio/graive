# GRAIVE — Web Platform

AI literacy curriculum platform for kids aged 10–18. Built on Next.js + Supabase + Stripe with a white-label admin panel, age-gated AI chat, and a step-by-step interactive lesson engine.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database / Auth | Supabase (Postgres + RLS) |
| Payments | Stripe (subscriptions + Customer Portal) |
| AI | Anthropic Claude / OpenAI / Google Gemini (switchable) |
| Hosting | Vercel |

---

## Local Development

```bash
cd web
npm install
cp .env.local.example .env.local   # fill in values below
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

# AI providers — only the one you select in admin is needed
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

All AI provider keys can also be set per-deployment from the admin panel (`/admin/ai`) — the DB value takes precedence over the environment variable.

---

## Database Setup (Supabase)

Run these in the Supabase SQL editor in order.

### Core tables

```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  age_tier text not null default 'explorer',
  role text not null default 'student',
  stripe_customer_id text,
  parent_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null default 'inactive',
  plan text not null default 'free',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table subscriptions enable row level security;
create policy "Users read own subscription" on subscriptions for select using (auth.uid() = user_id);

-- Modules
create table modules (
  id uuid primary key default gen_random_uuid(),
  tier_slug text not null,
  slug text not null unique,
  title text not null,
  description text,
  order_index int not null default 1,
  enabled boolean not null default true,
  content_path text,
  content text,
  video_url text,
  estimated_minutes int not null default 30,
  created_at timestamptz default now()
);
alter table modules enable row level security;
create policy "Anyone reads enabled modules" on modules for select using (enabled = true);
create policy "Admins manage modules" on modules for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Progress
create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id uuid references modules(id) on delete cascade not null,
  completed_at timestamptz default now(),
  unique(user_id, module_id)
);
alter table progress enable row level security;
create policy "Users manage own progress" on progress for all using (auth.uid() = user_id);

-- AI usage (rate limiting)
create table ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  message_count int not null default 0,
  unique(user_id, date)
);
alter table ai_usage enable row level security;
create policy "Users manage own usage" on ai_usage for all using (auth.uid() = user_id);

-- Conversations (chat history)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id uuid references modules(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);
alter table conversations enable row level security;
create policy "Users manage own conversations" on conversations for all using (auth.uid() = user_id);

-- Notes (per user per module)
create table notes (
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

-- Site settings (key/value store for admin config)
create table site_settings (
  key text primary key,
  value text not null
);
alter table site_settings enable row level security;
create policy "Admins manage settings" on site_settings for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Anyone reads settings" on site_settings for select using (true);
```

### Seed default site settings

```sql
insert into site_settings (key, value) values
  ('brand_name', 'GRAIVE'),
  ('brand_logo_url', ''),
  ('brand_primary_color', '#6366f1'),
  ('brand_accent_color', '#f59e0b'),
  ('brand_font', 'Inter'),
  ('llm_provider', 'claude'),
  ('llm_model_explorer', 'claude-haiku-4-5-20251001'),
  ('llm_model_builder', 'claude-haiku-4-5-20251001'),
  ('llm_model_thinker', 'claude-sonnet-4-6'),
  ('llm_model_innovator', 'claude-sonnet-4-6'),
  ('llm_api_key_override', ''),
  ('conversation_history_enabled', 'true'),
  ('free_tier_daily_message_limit', '10'),
  ('paid_tier_daily_message_limit', '200')
on conflict (key) do nothing;
```

### Make yourself admin

```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

---

## App Routes

```
/                              Marketing / landing page
/auth/signin                   Sign in
/auth/signup                   Sign up (age group selection)

/dashboard                     Progress overview
/learn/[tier]                  Tier module grid
/learn/[tier]/[module]         Module page — lesson steps + AI chat

/account                       Profile settings
/account/billing               Stripe Customer Portal

/admin                         Admin overview
/admin/modules                 Module list — toggle, edit, create new
/admin/modules/new             Visual module builder (no ZIP needed)
/admin/modules/[id]/edit       Edit an existing module
/admin/theme                   Brand: logo, name, colors, font
/admin/ai                      LLM provider, models per tier, API key, rate limits
/admin/users                   User list + tier/role management
/admin/curriculum              Bulk import via ZIP

/api/chat                      AI streaming endpoint (auth-gated, rate-limited)
/api/admin/models              Live model list from provider API (admin-only)
/api/webhooks/stripe           Stripe event handler
/api/progress                  Mark module complete
```

---

## Loading Curriculum Content

### Option A — Admin Module Builder (recommended for new/single modules)

1. Go to `/admin/modules` → **New Module**
2. Fill in metadata (title, tier, slug, estimated time)
3. Add steps using the visual builder — each step is one card learners navigate
4. Use toolbar buttons to insert: Bold, Italic, Bullets, Code blocks, Blockquotes, Fill-in blanks (`___`), Ratings (`___/10`)
5. Toggle **Published** → **Create Module**

### Option B — ZIP Bulk Import (for importing the full curriculum)

Prepare a ZIP with this structure:
```
curriculum.json          ← module registry
content/
  explorer/
    what-is-ai.md
    asking-good-questions.md
    ...
  builder/
    ...
```

`curriculum.json` format:
```json
[
  {
    "tier_slug": "explorer",
    "slug": "what-is-ai",
    "title": "What is AI?",
    "description": "...",
    "order_index": 1,
    "estimated_minutes": 30,
    "enabled": true,
    "content_path": "explorer/what-is-ai.md"
  }
]
```

Upload at `/admin/curriculum` → **Import ZIP**.

---

## Module Markdown Format

Module content is stored as markdown in the `modules.content` column. Steps are separated by `---` on its own line.

```markdown
## About This Lesson

Introduction content here. Use **bold**, *italic*, bullet lists.

> Highlighted quote or key idea appears with a colored border.

---

## Key Concepts

- **Term one** — definition
- **Term two** — definition

---

## Activity: Try It

What happened when you tried the vague prompt?

Type your answer: ___

How good was the result? ___/10

---

## Reflect

What would you change next time?

___

---

## Challenge

Build something harder here.
```

### Step type detection (auto, by heading keywords)

| Heading contains | Step type | Card style |
|-----------------|-----------|------------|
| "about this", "introduction", "background" | Read This | White |
| "key concept", "key term", "glossary", "key idea" | Key Ideas | Sky blue |
| "fun fact" | Fun Facts | Amber |
| "activity", "try it", "build it" | Try It | White + tier color bar |
| "reflect", "debate", "journal", "think about" | Think About It | Violet |
| "challenge", "level up", "capstone" | Challenge | Dark / trophy |
| anything else | General | White |

### Interactive elements

| Syntax | Renders as |
|--------|-----------|
| `___` | Fill-in-the-blank input (localStorage) |
| `___/10` | 1–10 rating widget with 😞/🤩 anchors (localStorage) |
| `` > text `` | Highlighted blockquote with colored left border |
| ` ```code``` ` | Code block with copy button |

---

## AI Chat — Dual Mode

Each module page has a two-tab AI panel:

| Tab | Name | Behaviour |
|-----|------|-----------|
| Tutor | Spark (Explorer) / Sage (others) | Locked to current lesson topic, age-appropriate system prompt |
| Try It | AI Playground | Open AI — write stories, test prompts, ask anything |

Playground messages are NOT saved to the DB even when history is enabled.

### System prompt tiers

| Tier | Model (default) | Behaviour |
|------|----------------|-----------|
| Explorer (10–11) | claude-haiku-4-5 | Simple language, warm, lesson-locked, max ~150 words |
| Builder (12–13) | claude-haiku-4-5 | Digital literacy topics, age-appropriate |
| Thinker (14–15) | claude-sonnet-4-6 | Ethics, society, balanced critical thinking |
| Innovator (16–18) | claude-sonnet-4-6 | Nearly open, technical/philosophical/business |

All model assignments are overrideable from `/admin/ai`. Models are fetched live from the provider API — no hardcoded lists.

---

## LLM Provider Switching

Supported providers: **Anthropic Claude**, **OpenAI**, **Google Gemini**

Switch provider at `/admin/ai`. Each provider has sensible model defaults that auto-populate when you switch. The API key can be set as an environment variable or overridden per-deployment in the admin panel (DB value wins).

---

## Access Gating

| Feature | Free (Explorer) | Paid subscription |
|---------|----------------|-------------------|
| Explorer tier modules | All | All |
| AI chat (Explorer) | 10 msg/day (configurable) | Unlimited |
| Builder / Thinker / Innovator tiers | Locked | All |
| AI chat (paid tiers) | Locked | Unlimited |
| Progress tracking | Yes | Yes |

Daily message limit is configurable at `/admin/ai` → "Free Tier Daily Message Limit".

---

## White-Label

Every visual and brand element is configurable from `/admin/theme`:
- Brand name, logo URL
- Primary and accent colors (CSS variables, applied globally)
- Font family

Tier names are configurable in the DB. Each deployment is its own Supabase project + Stripe account + Vercel instance — no code changes needed to rebrand.

---

## File Structure

```
web/src/
  app/
    (marketing)/page.tsx          Landing page
    (app)/
      dashboard/page.tsx
      learn/[tier]/page.tsx
      learn/[tier]/[module]/page.tsx
      account/billing/page.tsx
    admin/
      page.tsx                    Overview
      modules/
        page.tsx                  Module list
        new/page.tsx              Create module
        [id]/edit/page.tsx        Edit module
        _components/
          ModuleEditor.tsx        Shared visual editor
      theme/page.tsx
      ai/page.tsx
      users/page.tsx
      curriculum/page.tsx         ZIP import
    api/
      chat/route.ts               AI streaming endpoint
      admin/models/route.ts       Live model list
      webhooks/stripe/route.ts
      progress/route.ts
  components/
    chat/ChatPanel.tsx            Dual-mode AI chat (tutor + playground)
    curriculum/ModulePage.tsx     Step-by-step lesson engine
    curriculum/ModuleCard.tsx
  lib/
    llm/
      index.ts                    Provider factory + mode routing
      providers/claude.ts
      providers/openai.ts
      providers/gemini.ts
      system-prompts.ts           Age-appropriate prompts
    config/site.ts                Load brand/settings from DB
    supabase/client.ts
    supabase/server.ts
    stripe/client.ts
  types/index.ts
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel, set `Root Directory` to `web`
3. Add all environment variables in Vercel project settings
4. Set Stripe webhook endpoint to `https://your-domain.com/api/webhooks/stripe`
5. Events to enable: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Pending / Not Yet Built

- Stripe checkout + webhooks (DB sync via n8n or direct)
- n8n automations (welcome email, weekly digest, dunning)
- Progress dashboard with XP display
- Mobile responsive chat panel collapse
- Logo upload (currently set via URL in admin theme)
