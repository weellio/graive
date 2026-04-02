export type AgeTier = 'explorer' | 'builder' | 'thinker' | 'innovator' | 'creator'
export type UserRole = 'student' | 'admin'
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled'
export type SubscriptionPlan = 'free' | 'monthly' | 'annual' | 'beta' | 'family' | 'classroom'
export type LLMProvider = 'claude' | 'openai' | 'gemini'
export type MessageRole = 'user' | 'assistant'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  age_tier: AgeTier
  role: UserRole
  stripe_customer_id: string | null
  parent_email: string | null
  current_streak: number
  longest_streak: number
  last_active_date: string | null
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  owner_id: string
  name: string
  plan: 'family' | 'classroom'
  max_members: number
  invite_code: string
  stripe_subscription_id: string | null
  status: 'active' | 'inactive'
  created_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  joined_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  plan: SubscriptionPlan
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  enabled: boolean
  order_index: number
  created_at: string
}

export interface Module {
  id: string
  course_id: string | null
  course_slug: string | null    // denormalized for convenient querying
  tier_slug: AgeTier
  slug: string
  title: string
  description: string | null
  order_index: number
  enabled: boolean
  content_path: string
  content: string | null        // DB-stored markdown (imported curriculum)
  video_url: string | null
  video_script: string | null   // Teleprompter/production script for the intro video
  estimated_minutes: number
  is_current_events: boolean    // Monthly AI news module
  publish_date: string | null   // Scheduled publish date (null = always visible)
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  module_id: string
  completed_at: string
}

export interface Conversation {
  id: string
  user_id: string
  module_id: string | null
  role: MessageRole
  content: string
  created_at: string
}

export interface SiteSettings {
  brand_name: string
  brand_logo_url: string
  brand_primary_color: string
  brand_accent_color: string
  brand_font: string
  llm_provider: LLMProvider
  llm_model: string
  llm_model_explorer: string
  llm_model_builder: string
  llm_model_thinker: string
  llm_model_innovator: string
  llm_api_key_override: string
  conversation_history_enabled: string
  free_tier_daily_message_limit: string
  paid_tier_daily_message_limit: string
  maintenance_mode: string
  // Per-tier system prompt overrides (set by curriculum import)
  system_prompt_explorer: string
  system_prompt_builder: string
  system_prompt_thinker: string
  system_prompt_innovator: string
  // Curriculum metadata
  curriculum_name: string
  curriculum_author: string
  curriculum_version: string
  // Management API
  api_key: string
  // Access control — comma-separated list of tier slugs that are free without subscription
  free_tiers: string
}

export interface ChatMessage {
  role: MessageRole
  content: string
}

export const TIER_CONFIG: Record<AgeTier, {
  label: string
  ageRange: string
  theme: string
  color: string
  bgClass: string
  textClass: string
  borderClass: string
  free: boolean
}> = {
  explorer: {
    label: 'Explorer',
    ageRange: 'Ages 10–11',
    theme: 'Talking to Computers',
    color: '#6366f1',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    free: true,
  },
  builder: {
    label: 'Builder',
    ageRange: 'Ages 12–13',
    theme: 'Understanding the Machine',
    color: '#0d9488',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200',
    free: false,
  },
  thinker: {
    label: 'Thinker',
    ageRange: 'Ages 14–15',
    theme: 'Critical AI Citizenship',
    color: '#7c3aed',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
    free: false,
  },
  innovator: {
    label: 'Innovator',
    ageRange: 'Ages 16–18',
    theme: 'Build with AI, Think Beyond AI',
    color: '#059669',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    free: false,
  },
  creator: {
    label: 'Creator',
    ageRange: 'Ages 18+',
    theme: 'Ship Real Things with AI',
    color: '#ea580c',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200',
    free: false,
  },
}
