import { createServiceClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/types'

let cachedSettings: SiteSettings | null = null
let cacheTime = 0
const CACHE_TTL = 60_000 // 1 minute

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()
  if (cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings
  }

  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error || !data) {
      return getDefaultSettings()
    }

    const settings = data.reduce((acc, row) => {
      acc[row.key as keyof SiteSettings] = row.value
      return acc
    }, {} as SiteSettings)

    cachedSettings = { ...getDefaultSettings(), ...settings }
    cacheTime = now
    return cachedSettings
  } catch {
    return getDefaultSettings()
  }
}

export function invalidateSettingsCache() {
  cachedSettings = null
  cacheTime = 0
}

export function getDefaultSettings(): SiteSettings {
  return {
    brand_name: 'LearnAI',
    brand_logo_url: '',
    brand_primary_color: '#6366f1',
    brand_accent_color: '#f59e0b',
    brand_font: 'Inter',
    llm_provider: 'claude',
    llm_model_explorer: 'claude-haiku-4-5-20251001',
    llm_model_builder: 'claude-haiku-4-5-20251001',
    llm_model_thinker: 'claude-sonnet-4-6',
    llm_model_innovator: 'claude-sonnet-4-6',
    llm_api_key_override: '',
    conversation_history_enabled: 'true',
    free_tier_daily_message_limit: '10',
    maintenance_mode: 'false',
  }
}

/** Generate inline CSS for brand variables — injected in root layout */
export function buildCssVars(settings: SiteSettings): string {
  return `
    :root {
      --brand-primary: ${settings.brand_primary_color};
      --brand-accent: ${settings.brand_accent_color};
    }
  `.trim()
}
