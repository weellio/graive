'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import type { AgeTier } from '@/types'

interface AISettings {
  llm_provider: string
  llm_model_explorer: string
  llm_model_builder: string
  llm_model_thinker: string
  llm_model_innovator: string
  llm_api_key_override: string
  conversation_history_enabled: string
  free_tier_daily_message_limit: string
  paid_tier_daily_message_limit: string
}

const DEFAULTS: AISettings = {
  llm_provider: 'claude',
  llm_model_explorer: 'claude-haiku-4-5-20251001',
  llm_model_builder: 'claude-haiku-4-5-20251001',
  llm_model_thinker: 'claude-sonnet-4-6',
  llm_model_innovator: 'claude-sonnet-4-6',
  llm_api_key_override: '',
  conversation_history_enabled: 'true',
  free_tier_daily_message_limit: '10',
  paid_tier_daily_message_limit: '200',
}

const PROVIDER_DOCS: Record<string, string> = {
  claude:  'https://docs.anthropic.com/en/docs/about-claude/models',
  openai:  'https://platform.openai.com/docs/models',
  gemini:  'https://ai.google.dev/gemini-api/docs/models/gemini',
}

const PROVIDER_MODEL_DEFAULTS: Record<string, Pick<AISettings, 'llm_model_explorer' | 'llm_model_builder' | 'llm_model_thinker' | 'llm_model_innovator'>> = {
  claude: {
    llm_model_explorer:  'claude-haiku-4-5-20251001',
    llm_model_builder:   'claude-haiku-4-5-20251001',
    llm_model_thinker:   'claude-sonnet-4-6',
    llm_model_innovator: 'claude-sonnet-4-6',
  },
  openai: {
    llm_model_explorer:  'gpt-4o-mini',
    llm_model_builder:   'gpt-4o-mini',
    llm_model_thinker:   'gpt-4o',
    llm_model_innovator: 'gpt-4o',
  },
  gemini: {
    llm_model_explorer:  'gemini-2.0-flash',
    llm_model_builder:   'gemini-2.0-flash',
    llm_model_thinker:   'gemini-1.5-pro',
    llm_model_innovator: 'gemini-1.5-pro',
  },
}

const tiers: { key: keyof AISettings; label: string; tier: AgeTier }[] = [
  { key: 'llm_model_explorer',  label: 'Explorer (10–11)',  tier: 'explorer' },
  { key: 'llm_model_builder',   label: 'Builder (12–13)',   tier: 'builder' },
  { key: 'llm_model_thinker',   label: 'Thinker (14–15)',   tier: 'thinker' },
  { key: 'llm_model_innovator', label: 'Innovator (16–18)', tier: 'innovator' },
]

export default function AdminAIPage() {
  const [settings, setSettings] = useState<AISettings>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const keys = Object.keys(DEFAULTS)
    supabase
      .from('site_settings').select('key, value').in('key', keys)
      .then(({ data }) => {
        if (data) {
          const merged = { ...DEFAULTS }
          data.forEach(row => {
            if (row.key in merged) (merged as Record<string, string>)[row.key] = row.value
          })
          setSettings(merged)
        }
      })
  }, [])

  const fetchModels = useCallback(async (provider: string) => {
    setModelsLoading(true)
    setModelsError(null)
    try {
      const res = await fetch(`/api/admin/models?provider=${provider}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch models')
      setModels(data.models ?? [])
    } catch (err) {
      setModelsError(err instanceof Error ? err.message : 'Could not fetch models')
      setModels([])
    } finally {
      setModelsLoading(false)
    }
  }, [])

  // Fetch models whenever provider changes (and on first load)
  useEffect(() => {
    fetchModels(settings.llm_provider)
  }, [settings.llm_provider, fetchModels])

  async function save() {
    setSaving(true)
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) toast.error('Failed to save settings')
    else toast.success('AI settings saved')
  }

  function set(key: keyof AISettings, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">AI Config</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure the LLM provider, models, and conversation settings.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Provider</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>LLM Provider</Label>
            <Select
              value={settings.llm_provider}
              onValueChange={v => {
                if (!v) return
                const modelDefaults = PROVIDER_MODEL_DEFAULTS[v] ?? PROVIDER_MODEL_DEFAULTS.claude
                setSettings(prev => ({ ...prev, llm_provider: v, ...modelDefaults }))
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="api_key_override">API Key Override</Label>
            <Input
              id="api_key_override"
              type="password"
              value={settings.llm_api_key_override}
              onChange={e => set('llm_api_key_override', e.target.value)}
              placeholder="Leave empty to use server environment variable"
            />
            <p className="text-xs text-slate-400">
              {{
                claude: 'Uses ANTHROPIC_API_KEY env var if empty',
                openai: 'Uses OPENAI_API_KEY env var if empty',
                gemini: 'Uses GEMINI_API_KEY env var if empty',
              }[settings.llm_provider] ?? ''}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">Model per Tier</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Models fetched live from the {settings.llm_provider} API.{' '}
                <a
                  href={PROVIDER_DOCS[settings.llm_provider]}
                  target="_blank" rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  Full model list →
                </a>
              </CardDescription>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={() => fetchModels(settings.llm_provider)}
              disabled={modelsLoading}
              className="shrink-0 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${modelsLoading ? 'animate-spin' : ''}`} />
              {modelsLoading ? 'Fetching…' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {modelsError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠ {modelsError} — check your API key is configured.
            </p>
          )}
          {tiers.map(t => (
            <div key={t.key} className="grid gap-1.5">
              <Label>{t.label}</Label>
              {models.length > 0 ? (
                <Select value={settings[t.key]} onValueChange={v => set(t.key, v ?? '')}>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select a model…" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(m => (
                      <SelectItem key={m} value={m} className="font-mono text-sm">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={settings[t.key]}
                  onChange={e => set(t.key, e.target.value)}
                  placeholder={modelsLoading ? 'Loading models…' : 'Enter model name manually'}
                  className="font-mono text-sm"
                  disabled={modelsLoading}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">History &amp; Rate Limiting</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Conversation History</p>
              <p className="text-xs text-slate-400">When off, messages are not saved to the database.</p>
            </div>
            <Switch
              checked={settings.conversation_history_enabled === 'true'}
              onCheckedChange={v => set('conversation_history_enabled', v ? 'true' : 'false')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="free_daily_limit">Free Tier — Daily Message Limit</Label>
              <Input
                id="free_daily_limit"
                type="number" min="1" max="100"
                value={settings.free_tier_daily_message_limit}
                onChange={e => set('free_tier_daily_message_limit', e.target.value)}
              />
              <p className="text-xs text-slate-400">Explorer users on the free plan.</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="paid_daily_limit">Paid Tier — Daily Message Limit</Label>
              <Input
                id="paid_daily_limit"
                type="number" min="1" max="10000"
                value={settings.paid_tier_daily_message_limit}
                onChange={e => set('paid_tier_daily_message_limit', e.target.value)}
              />
              <p className="text-xs text-slate-400">Subscribers (all tiers). Prevents API cost abuse.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save AI Config'}
      </Button>
    </div>
  )
}
