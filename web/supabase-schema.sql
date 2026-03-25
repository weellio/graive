-- ============================================================
-- LearnAI Platform - Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- SITE SETTINGS (white-label config)
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Default white-label settings
insert into site_settings (key, value) values
  ('brand_name', 'LearnAI'),
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
  ('maintenance_mode', 'false'),
  -- Per-tier system prompt overrides (empty = use built-in defaults)
  ('system_prompt_explorer', ''),
  ('system_prompt_builder', ''),
  ('system_prompt_thinker', ''),
  ('system_prompt_innovator', ''),
  -- Curriculum metadata (set by import)
  ('curriculum_name', ''),
  ('curriculum_author', ''),
  ('curriculum_version', '')
on conflict (key) do nothing;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  age_tier text not null default 'explorer'
    check (age_tier in ('explorer', 'builder', 'thinker', 'innovator')),
  role text not null default 'student'
    check (role in ('student', 'admin')),
  stripe_customer_id text unique,
  parent_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, age_tier)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'age_tier', 'explorer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'inactive'
    check (status in ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
  plan text default 'free'
    check (plan in ('free', 'monthly', 'annual')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- MODULES (data-driven registry)
-- ============================================================
create table if not exists modules (
  id uuid primary key default uuid_generate_v4(),
  tier_slug text not null
    check (tier_slug in ('explorer', 'builder', 'thinker', 'innovator')),
  slug text not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  enabled boolean not null default true,
  content_path text not null default '',  -- relative path to markdown file (filesystem)
  content text,                           -- inline markdown (imported curriculum, takes priority)
  video_url text,
  estimated_minutes integer default 30,
  created_at timestamptz default now(),
  unique(tier_slug, slug)
);

-- Seed modules from built curriculum
insert into modules (tier_slug, slug, title, description, order_index, content_path, estimated_minutes) values
  -- Explorer (10-11)
  ('explorer', 'what-is-ai', 'What Is AI?', 'Understand how AI learns from patterns — not magic, just math.', 1, 'ages-10-11/module-01-what-is-ai/lesson-plan.md', 30),
  ('explorer', 'good-questions', 'Asking Good Questions', 'The secret to great AI output: be specific.', 2, 'ages-10-11/module-02-good-questions/lesson-plan.md', 30),
  ('explorer', 'prompt-recipe', 'Prompts Are Like Recipes', 'Context + Instruction + Format = the prompt recipe.', 3, 'ages-10-11/module-03-prompt-recipe/lesson-plan.md', 35),
  ('explorer', 'when-ai-is-wrong', 'When AI Gets It Wrong', 'Hallucinations, fact-checking, and how to fix mistakes.', 4, 'ages-10-11/module-04-when-ai-is-wrong/lesson-plan.md', 30),
  ('explorer', 'staying-safe', 'Staying Safe Online', 'Five rules for smart, safe internet use.', 5, 'ages-10-11/module-05-staying-safe/lesson-plan.md', 25),
  ('explorer', 'create-with-ai', 'Create with AI', 'Use everything you''ve learned to make something amazing.', 6, 'ages-10-11/module-06-create-with-ai/lesson-plan.md', 45),
  -- Builder (12-13)
  ('builder', 'how-ai-learns', 'How AI Actually Learns', 'Training data, pattern recognition, and why AI can be biased.', 1, 'ages-12-13/module-01-how-ai-learns/lesson-plan.md', 40),
  ('builder', 'structured-prompts', 'Your First Structured Prompt', 'The RCTFC framework: Role, Context, Task, Format, Constraints.', 2, 'ages-12-13/module-02-structured-prompts/lesson-plan.md', 45),
  ('builder', 'algorithms', 'Algorithms Around You', 'How recommendation algorithms shape what you see.', 3, 'ages-12-13/module-03-algorithms/lesson-plan.md', 40),
  ('builder', 'misinformation', 'Misinformation in the AI Age', 'The STOP framework for verifying what''s real.', 4, 'ages-12-13/module-04-misinformation/lesson-plan.md', 45),
  ('builder', 'chatbot-persona', 'Building a Chatbot Persona', 'Design your own AI assistant with a system prompt.', 5, 'ages-12-13/module-05-chatbot-persona/lesson-plan.md', 50),
  ('builder', 'data-privacy', 'Data, Privacy & Your Digital Life', 'What apps collect, why, and what you can do about it.', 6, 'ages-12-13/module-06-data-privacy/lesson-plan.md', 40),
  -- Thinker (14-15)
  ('thinker', 'chain-of-thought', 'Chain of Thought Prompting', 'Make AI show its work and think step by step.', 1, 'ages-14-15/module-01-chain-of-thought/lesson-plan.md', 50),
  ('thinker', 'ai-ethics', 'AI Ethics: Bias & Fairness', 'Where bias comes from and who is responsible.', 2, 'ages-14-15/module-02-ai-ethics/lesson-plan.md', 60),
  ('thinker', 'digital-economy', 'The Digital Economy', 'Follow the money — how platforms make billions from your attention.', 3, 'ages-14-15/module-03-digital-economy/lesson-plan.md', 55),
  ('thinker', 'jobs-automation', 'Jobs & Automation', 'Which jobs are changing and what skills actually matter.', 4, 'ages-14-15/module-04-jobs-automation/lesson-plan.md', 55),
  ('thinker', 'ai-for-learning', 'AI for Learning (Without Cheating Yourself)', 'Socratic AI: use it to think harder, not less.', 5, 'ages-14-15/module-05-ai-for-learning/lesson-plan.md', 55),
  ('thinker', 'digital-identity', 'Personal Brand & Digital Identity', 'Shape your digital footprint with intention.', 6, 'ages-14-15/module-06-digital-identity/lesson-plan.md', 50),
  -- Innovator (16-18)
  ('innovator', 'advanced-prompting', 'Advanced Prompting Systems', 'Chains, meta-prompts, reusable templates, and role separation.', 1, 'ages-16-18/module-01-advanced-prompting/lesson-plan.md', 75),
  ('innovator', 'building-no-code', 'Building with AI (No-Code)', 'Automations, n8n, Make — AI that works while you sleep.', 2, 'ages-16-18/module-02-building-no-code/lesson-plan.md', 90),
  ('innovator', 'entrepreneurship', 'Entrepreneurship in the AI Age', 'Unique insight + AI leverage = unfair advantage.', 3, 'ages-16-18/module-03-entrepreneurship/lesson-plan.md', 70),
  ('innovator', 'philosophy', 'Philosophy of Mind & AI', 'Consciousness, creativity, and what makes us human.', 4, 'ages-16-18/module-04-philosophy/lesson-plan.md', 60),
  ('innovator', 'ai-policy', 'AI Policy & Civic Engagement', 'Five debates shaping the AI-governed world.', 5, 'ages-16-18/module-05-ai-policy/lesson-plan.md', 65),
  ('innovator', 'human-edge', 'The Human Edge', 'What AI cannot do — and how to build it.', 6, 'ages-16-18/module-06-human-edge/lesson-plan.md', 60)
on conflict (tier_slug, slug) do nothing;

-- ============================================================
-- PROGRESS
-- ============================================================
create table if not exists progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, module_id)
);

-- ============================================================
-- CONVERSATIONS (AI chat history)
-- ============================================================
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  module_id uuid references modules(id) on delete set null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- AI USAGE (rate limiting)
-- ============================================================
create table if not exists ai_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  date date not null default current_date,
  message_count integer not null default 0,
  unique(user_id, date)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table progress enable row level security;
alter table conversations enable row level security;
alter table ai_usage enable row level security;
alter table modules enable row level security;
alter table site_settings enable row level security;

-- Profiles: users see only their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Subscriptions: users see only their own
create policy "Users can view own subscription" on subscriptions for select using (auth.uid() = user_id);

-- Progress: users manage only their own
create policy "Users can view own progress" on progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on progress for insert with check (auth.uid() = user_id);
create policy "Users can delete own progress" on progress for delete using (auth.uid() = user_id);

-- Conversations: users see only their own
create policy "Users can view own conversations" on conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on conversations for insert with check (auth.uid() = user_id);

-- AI usage: users see only their own
create policy "Users can view own ai_usage" on ai_usage for select using (auth.uid() = user_id);

-- Modules: everyone can read enabled modules
create policy "Anyone can read enabled modules" on modules for select using (enabled = true);

-- Site settings: everyone can read
create policy "Anyone can read site_settings" on site_settings for select using (true);

-- Admin policies (service role bypasses RLS anyway, but for completeness)
create policy "Admins can manage modules" on modules for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage site_settings" on site_settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
