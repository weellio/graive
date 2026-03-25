# GRAIVE

**Generative Robotic AI in Virtual Environments**

An AI literacy platform for ages 10–18. Teaches prompt engineering, digital critical thinking, and the skills to build in an AI-first world — with a built-in AI tutor on every lesson.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is this?

GRAIVE is a full-stack, white-label learning management system built on Next.js and Supabase. It ships with a complete 48-module curriculum across 4 age tiers, an embedded Claude/OpenAI AI tutor, Stripe subscriptions, and a drag-and-drop curriculum import/export system.

The platform is designed to be **subject-agnostic** — swap the curriculum bundle and it teaches anything.

---

## Features

- **4 age-tiered learning tracks** — Explorer (10–11), Builder (12–13), Thinker (14–15), Innovator (16–18)
- **48 modules** of AI literacy curriculum, fully written and ready to use
- **Embedded AI tutor** on every lesson — age-appropriate guardrails per tier
- **Streaming chat** — token-by-token responses via Claude or OpenAI
- **Modular curriculum** — import/export ZIP bundles, swap subjects without touching code
- **White-label ready** — brand name, logo, colours all set from the admin panel
- **Stripe subscriptions** — free Explorer tier, paid Pro for all other tiers
- **Progress tracking** — per-user, per-module completion
- **Admin panel** — theme, modules, AI config, curriculum import, user management
- **Docker + Traefik** — production-ready deployment configuration

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database + Auth | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude (default) or OpenAI |
| Payments | Stripe |
| Deployment | Docker + Traefik |

---

## Project Structure

```
graive/
├── curriculum/               ← Lesson content (markdown)
│   ├── curriculum.json       ← Bundle manifest (48 modules)
│   ├── ages-10-11/           ← Explorer modules 1–12
│   ├── ages-12-13/           ← Builder modules 1–12
│   ├── ages-14-15/           ← Thinker modules 1–12
│   └── ages-16-18/           ← Innovator modules 1–12
├── web/                      ← Next.js application
│   ├── src/
│   │   ├── app/              ← Pages and API routes
│   │   ├── components/       ← React components
│   │   ├── lib/              ← Supabase, Stripe, LLM clients
│   │   └── types/            ← TypeScript types
│   ├── supabase-schema.sql   ← Run once in Supabase to set up DB
│   ├── Dockerfile
│   └── .env.local.example    ← Copy to .env.local
├── tools/
│   └── bundle-curriculum.mjs ← CLI: package a curriculum folder into a ZIP
├── docker-compose.yml        ← Production deployment
├── CURRICULUM_FORMAT.md      ← Spec for curriculum authors
└── docs/
    ├── USER_GUIDE.md         ← End-user documentation
    └── INSTALL.md            ← Full installation guide
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- A [Stripe](https://stripe.com) account

### 1. Install

```bash
git clone https://github.com/YOUR_USERNAME/graive.git
cd graive/web
npm install
```

### 2. Configure

```bash
cp .env.local.example .env.local
# Edit .env.local — add Supabase, Anthropic, and Stripe keys
```

### 3. Set up the database

In your Supabase project → SQL Editor → paste and run `web/supabase-schema.sql`.

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

For the full setup guide including Stripe webhooks, admin promotion, and production deployment — see **[docs/INSTALL.md](docs/INSTALL.md)**.

---

## Curriculum

The platform ships with 48 fully written modules:

| Tier | Ages | Modules | Theme |
|------|------|---------|-------|
| Explorer | 10–11 | 12 | Talking to Computers |
| Builder | 12–13 | 12 | Understanding the Machine |
| Thinker | 14–15 | 12 | Critical AI Citizenship |
| Innovator | 16–18 | 12 | Build with AI, Think Beyond AI |

Each module includes 3 hands-on activities, reflection questions, and a "coming up next" teaser.

### Import a curriculum

```bash
# 1. Go to /admin/curriculum in the app
# 2. Drag and drop a .zip bundle
# 3. Done — modules are live immediately
```

### Create your own curriculum

```bash
# Scaffold a new curriculum
node tools/bundle-curriculum.mjs --template

# Edit content in ./my-curriculum/
# Bundle it
node tools/bundle-curriculum.mjs ./my-curriculum my-course.zip
```

See **[CURRICULUM_FORMAT.md](CURRICULUM_FORMAT.md)** for the full authoring spec. The platform is subject-agnostic — the same codebase can teach tacos, finance, coding, or anything else.

---

## Deployment

The app includes a production-ready `docker-compose.yml` for VPS deployment behind Traefik.

```bash
# On your VPS
git clone https://github.com/YOUR_USERNAME/graive.git /srv/graive
cd /srv/graive
cp web/.env.local.example web/.env.local
# Fill in .env.local
docker compose up -d --build
```

See **[docs/INSTALL.md](docs/INSTALL.md)** for the full deployment guide, including:
- Traefik streaming fix (required for AI chat)
- Stripe webhook configuration
- First admin setup
- Updating after code changes

---

## Admin Panel

After setup, promote your account to admin in Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
```

Then visit `/admin` to access:

| Page | What it does |
|------|-------------|
| `/admin` | Overview — users, completions, AI messages |
| `/admin/modules` | Toggle modules on/off per tier |
| `/admin/curriculum` | Import/export curriculum bundles |
| `/admin/theme` | Brand name, logo, colours |
| `/admin/ai` | LLM provider, model per tier, history toggle |
| `/admin/users` | User list with tier, plan, and join date |

---

## White-Labelling

Every customer-facing string is configurable from the admin panel — no code changes needed.

| Setting | Where |
|---------|-------|
| Brand name | Admin → Theme |
| Logo | Admin → Theme (URL or `/logo.png` in `web/public/`) |
| Primary + accent colours | Admin → Theme |
| Tier labels | Curriculum manifest (`curriculum.json`) |
| AI tutor name + personality | Admin → AI Config or curriculum manifest |
| LLM provider | Admin → AI Config |
| Curriculum content | Admin → Curriculum (import a ZIP) |

---

## Documentation

- **[docs/USER_GUIDE.md](docs/USER_GUIDE.md)** — for learners and parents
- **[docs/INSTALL.md](docs/INSTALL.md)** — full installation and deployment guide
- **[CURRICULUM_FORMAT.md](CURRICULUM_FORMAT.md)** — for curriculum authors

---

## Community

Daily AI news: **[r/graive](https://reddit.com/r/graive)** — 100 sources compiled every day.

---

## License

MIT
