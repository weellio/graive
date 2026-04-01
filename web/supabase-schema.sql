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
  ('paid_tier_daily_message_limit', '200'),
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
    check (age_tier in ('explorer', 'builder', 'thinker', 'innovator', 'creator')),
  role text not null default 'student'
    check (role in ('student', 'admin')),
  stripe_customer_id text unique,
  parent_email text,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
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
    check (plan in ('free', 'monthly', 'annual', 'beta', 'family', 'classroom')),
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
    check (tier_slug in ('explorer', 'builder', 'thinker', 'innovator', 'creator')),
  slug text not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  enabled boolean not null default true,
  content_path text not null default '',  -- relative path to markdown file (filesystem)
  content text,                           -- inline markdown (imported curriculum, takes priority)
  video_url text,
  video_script text,
  estimated_minutes integer default 30,
  is_current_events boolean not null default false,
  publish_date date,
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
  ('innovator', 'human-edge', 'The Human Edge', 'What AI cannot do — and how to build it.', 6, 'ages-16-18/module-06-human-edge/lesson-plan.md', 60),
  -- Explorer modules 7-12
  ('explorer', 'ai-art', 'AI and Art: Who''s the Artist?', 'How AI generates images and the great creativity debate.', 7, 'ages-10-11/module-07-ai-art/lesson-plan.md', 35),
  ('explorer', 'robots', 'Robots vs AI: What''s the Difference?', 'Physical robots, software AI, and how they work together.', 8, 'ages-10-11/module-08-robots/lesson-plan.md', 30),
  ('explorer', 'ai-in-school', 'AI in Your School Life', 'Using AI ethically for learning — when it helps vs when it''s cheating.', 9, 'ages-10-11/module-09-ai-in-school/lesson-plan.md', 30),
  ('explorer', 'talking-to-ai', 'Having a Real Conversation with AI', 'Multi-turn conversations, follow-ups, and correcting AI mistakes.', 10, 'ages-10-11/module-10-talking-to-ai/lesson-plan.md', 35),
  ('explorer', 'ai-helpers', 'AI Helpers All Around You', 'Siri, Alexa, autocomplete, and recommendation engines in daily life.', 11, 'ages-10-11/module-11-ai-helpers/lesson-plan.md', 30),
  ('explorer', 'future-of-ai', 'What Could AI Do in Your Future?', 'Jobs AI might help with and things humans will always do.', 12, 'ages-10-11/module-12-future-of-ai/lesson-plan.md', 35),
  -- Builder modules 7-12
  ('builder', 'training-data', 'Where Does AI Get Its Knowledge?', 'Training datasets, web scraping, copyright, and what AI doesn''t know.', 7, 'ages-12-13/module-07-training-data/lesson-plan.md', 40),
  ('builder', 'ai-writing', 'AI Writing: Collaborator or Cheat?', 'Using AI for drafting, editing, and brainstorming — ethical use in school.', 8, 'ages-12-13/module-08-ai-writing/lesson-plan.md', 45),
  ('builder', 'deepfakes', 'Deepfakes and Digital Deception', 'How deepfakes work, spotting them, and their social impact.', 9, 'ages-12-13/module-09-deepfakes/lesson-plan.md', 45),
  ('builder', 'prompt-chaining', 'Chaining Prompts Together', 'Multi-step prompting and building on previous AI outputs.', 10, 'ages-12-13/module-10-prompt-chaining/lesson-plan.md', 45),
  ('builder', 'ai-bias', 'Why Is AI Sometimes Unfair?', 'Bias in training data, facial recognition errors, and who gets harmed.', 11, 'ages-12-13/module-11-ai-bias/lesson-plan.md', 50),
  ('builder', 'build-a-tool', 'Design Your Own AI Tool', 'Problem definition, choosing the right AI approach, simple prototyping.', 12, 'ages-12-13/module-12-build-a-tool/lesson-plan.md', 55),
  -- Thinker modules 7-12
  ('thinker', 'ai-creativity', 'Can AI Really Be Creative?', 'Generative art, music, and writing — the originality debate.', 7, 'ages-14-15/module-07-ai-creativity/lesson-plan.md', 55),
  ('thinker', 'surveillance', 'AI Surveillance: Safety or Control?', 'Facial recognition, social scoring, privacy rights, and the balance.', 8, 'ages-14-15/module-08-surveillance/lesson-plan.md', 60),
  ('thinker', 'climate-ai', 'AI and the Climate Crisis', 'AI''s energy footprint, climate solutions, and the carbon tradeoff.', 9, 'ages-14-15/module-09-climate-ai/lesson-plan.md', 55),
  ('thinker', 'mental-health-ai', 'AI, Social Media, and Mental Health', 'Algorithmic feeds, dopamine loops, AI therapy tools, and regulation.', 10, 'ages-14-15/module-10-mental-health-ai/lesson-plan.md', 60),
  ('thinker', 'future-work', 'Designing the Future of Work', 'Reskilling, UBI debate, and human-AI collaboration models.', 11, 'ages-14-15/module-11-future-work/lesson-plan.md', 55),
  ('thinker', 'ai-manifesto', 'Write Your AI Manifesto', 'Synthesise your ethical beliefs into a personal AI stance.', 12, 'ages-14-15/module-12-your-ai-manifesto/lesson-plan.md', 60),
  -- Innovator modules 7-12
  ('innovator', 'fine-tuning', 'Fine-Tuning and Customising AI Models', 'What fine-tuning is, when to use it vs prompting, practical examples.', 7, 'ages-16-18/module-07-fine-tuning/lesson-plan.md', 70),
  ('innovator', 'ai-product', 'Building an AI-Powered Product', 'MVP definition, API integration, user testing, monetisation basics.', 8, 'ages-16-18/module-08-ai-product/lesson-plan.md', 80),
  ('innovator', 'legal-ai', 'AI Law: What You Need to Know', 'Copyright, liability, GDPR, EU AI Act, platform terms of service.', 9, 'ages-16-18/module-09-legal-ai/lesson-plan.md', 65),
  ('innovator', 'multimodal', 'Multimodal AI: Beyond Text', 'Vision, audio, video AI — use cases and combining modalities.', 10, 'ages-16-18/module-10-multimodal/lesson-plan.md', 70),
  ('innovator', 'ai-leadership', 'Leading in the Age of AI', 'Communication, decision-making with AI tools, responsible deployment.', 11, 'ages-16-18/module-11-ai-leadership/lesson-plan.md', 65),
  ('innovator', 'capstone-build', 'Capstone: Build Something Real', 'Design, build, and pitch an AI solution to a real problem.', 12, 'ages-16-18/module-12-capstone-build/lesson-plan.md', 90),
  -- Creator (18+)
  ('creator', 'ai-stack', 'The Modern AI Stack', 'LLMs, APIs, vector databases, orchestration layers — the full picture.', 1, 'ages-18-plus/module-01-ai-stack/lesson-plan.md', 60),
  ('creator', 'prompt-engineering-pro', 'Professional Prompt Engineering', 'System prompts, few-shot examples, temperature/top-p, structured output.', 2, 'ages-18-plus/module-02-prompt-engineering-pro/lesson-plan.md', 75),
  ('creator', 'agents', 'Building AI Agents', 'What agents are, tool use, memory, planning loops, Claude Agent SDK.', 3, 'ages-18-plus/module-03-agents/lesson-plan.md', 90),
  ('creator', 'rag', 'RAG: Teaching AI Your Own Data', 'Retrieval-augmented generation, embeddings, vector search, chunking.', 4, 'ages-18-plus/module-04-rag/lesson-plan.md', 90),
  ('creator', 'ship-it', 'Ship an AI Product in a Weekend', 'No-code tools, n8n automations, Vercel deploy, pricing strategy.', 5, 'ages-18-plus/module-05-ship-it/lesson-plan.md', 120),
  ('creator', 'ai-business', 'Running a Lean AI Business', 'Cost management, API pricing, customer acquisition, SaaS vs usage billing.', 6, 'ages-18-plus/module-06-ai-business/lesson-plan.md', 75)
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
-- GROUPS (family / classroom plans)
-- ============================================================
create table if not exists groups (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  plan text not null check (plan in ('family', 'classroom')),
  max_members int not null default 4,
  invite_code text not null unique default upper(substring(md5(random()::text), 1, 8)),
  stripe_subscription_id text unique,
  status text not null default 'inactive' check (status in ('active', 'inactive')),
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

-- Groups: owners manage their group, members can read
create policy "Group owners manage their group" on groups for all using (auth.uid() = owner_id);
create policy "Group members can read their group" on groups for select using (
  exists (select 1 from group_members where group_id = groups.id and user_id = auth.uid())
);
create policy "Users manage own group membership" on group_members for all using (auth.uid() = user_id);
create policy "Group owners see all members" on group_members for select using (
  exists (select 1 from groups where id = group_id and owner_id = auth.uid())
);

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

-- ============================================================
-- MIGRATION: Courses + course columns on modules
-- Run this block if upgrading an existing installation
-- ============================================================

-- 1. Courses table
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text,
  icon text,
  color text,
  enabled boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- Seed the default AI Literacy course
insert into courses (slug, title, description, icon, color, enabled, order_index)
values ('ai-literacy', 'AI Literacy', 'How artificial intelligence works, how to use it, and how to think critically about it.', '🤖', '#6366f1', true, 0)
on conflict (slug) do nothing;

-- 2. Add course columns to modules
alter table modules
  add column if not exists course_id uuid references courses(id) on delete set null,
  add column if not exists course_slug text not null default 'ai-literacy';

-- Back-fill existing modules to the ai-literacy course
update modules m
set course_id = c.id, course_slug = 'ai-literacy'
from courses c
where c.slug = 'ai-literacy'
  and m.course_id is null;

-- 3. Add api_key to site_settings
insert into site_settings (key, value)
values ('api_key', '')
on conflict (key) do nothing;

-- 4. RLS for courses table
alter table courses enable row level security;
create policy "Anyone can read enabled courses" on courses for select using (enabled = true);
create policy "Admins can manage courses" on courses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

