# GRAIVE

**Generative Robotic AI in Virtual Environments**

An AI literacy platform for ages 10–18. Teaches prompt engineering, digital critical thinking, and the skills to build in an AI-first world — with a built-in AI tutor on every lesson.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is this?

GRAIVE is a full-stack, white-label learning management system built on Next.js and Supabase. It ships with a complete curriculum across 5 age tiers, an embedded AI tutor (Claude, OpenAI, or Gemini), Stripe subscriptions, a drag-and-drop curriculum import/export system, and a management REST API.

The platform is designed to be **subject-agnostic** — swap the curriculum bundle and it teaches anything.

---

## Features

- **5 age-tiered learning tracks** — Explorer (10–11), Builder (12–13), Thinker (14–15), Innovator (16–18), Creator (18+)
- **Multi-course architecture** — modules grouped under named courses (e.g. `ai-literacy`), extensible to any subject
- **Embedded AI tutor** on every lesson — age-appropriate guardrails, streaming token-by-token responses
- **Multi-provider LLM** — Claude, OpenAI, or Gemini; switchable from the admin panel without code changes
- **Modular curriculum** — import/export ZIP bundles, bulk-upsert via REST API
- **White-label ready** — brand name, logo, colours all set from the admin panel, applied via CSS variables
- **Stripe subscriptions** — first module of each tier free, Pro subscription unlocks everything
- **Progress tracking** — per-user, per-module completion with streak tracking
- **Conversation history** — per-module chat history saved to Supabase (admin toggle)
- **Management REST API** — full CRUD for courses and modules, bulk import up to 200 modules per request
- **Admin panel** — theme, courses, modules, AI config, curriculum import, API keys, user management
- **Docker + Traefik** — production-ready deployment configuration

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database + Auth | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude (default), OpenAI, or Google Gemini |
| Payments | Stripe |
| Deployment | Docker + Traefik |

---

## Project Structure

```
graive/
├── curriculum/               ← Lesson content (markdown)
│   ├── curriculum.json       ← Bundle manifest
│   ├── ages-10-11/           ← Explorer modules
│   ├── ages-12-13/           ← Builder modules
│   ├── ages-14-15/           ← Thinker modules
│   └── ages-16-18/           ← Innovator modules
├── web/                      ← Next.js application
│   ├── src/
│   │   ├── app/              ← Pages and API routes
│   │   │   ├── (app)/learn/[course]/[tier]/[module]/
│   │   │   ├── admin/        ← Admin panel pages
│   │   │   └── api/          ← API routes (chat, progress, webhooks, v1/*)
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
    ├── INSTALL.md            ← Full installation guide
    └── API_GUIDE.md          ← Management REST API reference
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

The platform ships with fully written modules across all tiers:

| Tier | Ages | Theme |
| ---- | ---- | ----- |
| Explorer | 10–11 | Talking to Computers |
| Builder | 12–13 | Understanding the Machine |
| Thinker | 14–15 | Critical AI Citizenship |
| Innovator | 16–18 | Build with AI, Think Beyond AI |
| Creator | 18+ | Ship Real Things with AI |

Each module includes hands-on activities, reflection questions, and a "coming up next" teaser. Modules are organised under **courses** — the default course is `ai-literacy`. Multiple courses can coexist on one platform.

### URL structure

```text
/learn/ai-literacy/explorer/what-is-ai
         ↑ course   ↑ tier   ↑ module slug
```

### Import a curriculum

```bash
# 1. Go to /admin/curriculum in the app
# 2. Drag and drop a .zip bundle
# 3. Done — modules are live immediately
```

Or use the REST API to bulk-import programmatically:

```bash
curl -X POST -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mode":"upsert","modules":[...]}' \
  https://your-domain.com/api/v1/modules/bulk
```

See **[docs/API_GUIDE.md](docs/API_GUIDE.md)** for the full API reference and example scripts.

### Create your own curriculum

```bash
# Scaffold a new curriculum
node tools/bundle-curriculum.mjs --template

# Edit content in ./my-curriculum/
# Bundle it
node tools/bundle-curriculum.mjs ./my-curriculum my-course.zip
```

See **[CURRICULUM_FORMAT.md](CURRICULUM_FORMAT.md)** for the full authoring spec. The platform is subject-agnostic — the same codebase can teach anything.

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
| `/admin/courses` | Create and manage courses |
| `/admin/modules` | Toggle modules on/off, reorder, edit metadata |
| `/admin/curriculum` | Import/export curriculum bundles |
| `/admin/theme` | Brand name, logo, colours |
| `/admin/ai` | LLM provider, model, history toggle, rate limits |
| `/admin/api-keys` | Generate and rotate management API keys |
| `/admin/users` | User list with tier, plan, and join date |

---

## Management REST API

GRAIVE includes a full management API for scripted imports and integrations.

```text
Base URL: https://your-domain.com/api/v1
Auth:     Authorization: Bearer YOUR_API_KEY
```

Key endpoints:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/v1/modules` | List modules (filter by `?tier=` or `?course=`) |
| POST | `/api/v1/modules` | Create a module |
| PUT | `/api/v1/modules/:id` | Update a module |
| DELETE | `/api/v1/modules/:id` | Delete a module |
| POST | `/api/v1/modules/bulk` | Bulk upsert/insert up to 200 modules |
| GET | `/api/v1/courses` | List courses |
| POST | `/api/v1/courses` | Create a course |
| PUT | `/api/v1/courses/:id` | Update a course |
| DELETE | `/api/v1/courses/:id` | Delete a course |

Generate your API key at `/admin/api-keys`. See **[docs/API_GUIDE.md](docs/API_GUIDE.md)** for the full reference.

---

## White-Labelling

Every customer-facing string is configurable from the admin panel — no code changes needed.

| Setting | Where |
|---------|-------|
| Brand name | Admin → Theme |
| Logo | Admin → Theme (URL or `/logo.png` in `web/public/`) |
| Primary + accent colours | Admin → Theme |
| AI tutor name + personality | Admin → AI Config or curriculum manifest |
| LLM provider + model | Admin → AI Config |
| Curriculum content | Admin → Curriculum (import a ZIP) or REST API |

---

## Documentation

- **[docs/USER_GUIDE.md](docs/USER_GUIDE.md)** — for learners and parents
- **[docs/INSTALL.md](docs/INSTALL.md)** — full installation and deployment guide
- **[docs/API_GUIDE.md](docs/API_GUIDE.md)** — management REST API reference
- **[CURRICULUM_FORMAT.md](CURRICULUM_FORMAT.md)** — for curriculum authors

---

## Community

Daily AI news: **[r/graive](https://reddit.com/r/graive)** — 100 sources compiled every day.

---

## License

MIT
