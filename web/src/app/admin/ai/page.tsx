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

const TIERS = [
  { slug: 'explorer',  label: 'Explorer',  ages: 'Ages 10–11' },
  { slug: 'builder',   label: 'Builder',   ages: 'Ages 12–13' },
  { slug: 'thinker',   label: 'Thinker',   ages: 'Ages 14–15' },
  { slug: 'innovator', label: 'Innovator', ages: 'Ages 16–18' },
  { slug: 'creator',   label: 'Creator',   ages: 'Ages 18+' },
]

interface AISettings {
  llm_provider: string
  llm_model: string
  llm_api_key_override: string
  conversation_history_enabled: string
  free_tier_daily_message_limit: string
  paid_tier_daily_message_limit: string
  free_tiers: string
}

const DEFAULTS: AISettings = {
  llm_provider: 'claude',
  llm_model: 'claude-sonnet-4-6',
  llm_api_key_override: '',
  conversation_history_enabled: 'true',
  free_tier_daily_message_limit: '10',
  paid_tier_daily_message_limit: '200',
  free_tiers: 'explorer',
}

const PROVIDER_DOCS: Record<string, string> = {
  claude:  'https://docs.anthropic.com/en/docs/about-claude/models',
  openai:  'https://platform.openai.com/docs/models',
  gemini:  'https://ai.google.dev/gemini-api/docs/models/gemini',
}

const PROVIDER_MODEL_DEFAULTS: Record<string, string> = {
  claude:  'claude-sonnet-4-6',
  openai:  'gpt-4o',
  gemini:  'gemini-2.0-flash',
}

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

  function toggleFreeTier(slug: string, enabled: boolean) {
    setSettings(prev => {
      const current = prev.free_tiers.split(',').map(s => s.trim()).filter(Boolean)
      const next = enabled ? [...new Set([...current, slug])] : current.filter(s => s !== slug)
      return { ...prev, free_tiers: next.join(',') }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">AI Config</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure the LLM provider, model, and conversation settings.</p>
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
                setSettings(prev => ({
                  ...prev,
                  llm_provider: v,
                  llm_model: PROVIDER_MODEL_DEFAULTS[v] ?? PROVIDER_MODEL_DEFAULTS.claude,
                }))
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
              <CardTitle className="text-base">Model</CardTitle>
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
          <div className="grid gap-1.5">
            <Label>Active Model</Label>
            {models.length > 0 ? (
              <Select value={settings.llm_model} onValueChange={v => set('llm_model', v ?? '')}>
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
                value={settings.llm_model}
                onChange={e => set('llm_model', e.target.value)}
                placeholder={modelsLoading ? 'Loading models…' : 'Enter model name manually'}
                className="font-mono text-sm"
                disabled={modelsLoading}
              />
            )}
            <p className="text-xs text-slate-400">Used for all AI chat and content generation.</p>
          </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Free Access</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Tiers enabled here are accessible without a subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {TIERS.map(t => {
            const isFree = settings.free_tiers.split(',').map(s => s.trim()).includes(t.slug)
            return (
              <div key={t.slug} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.ages}</p>
                </div>
                <Switch
                  checked={isFree}
                  onCheckedChange={v => toggleFreeTier(t.slug, v)}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save AI Config'}
      </Button>
    </div>
  )
}
