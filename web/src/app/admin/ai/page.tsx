'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
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
}

// Suggested defaults per provider — shown as hints, not enforced
const PROVIDER_HINTS: Record<string, { placeholder: string; docsUrl: string; envVar: string; suggestions: string[] }> = {
  claude: {
    placeholder: 'e.g. claude-haiku-4-5-20251001',
    docsUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
    envVar: 'ANTHROPIC_API_KEY',
    suggestions: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-opus-4-6'],
  },
  openai: {
    placeholder: 'e.g. gpt-4o-mini',
    docsUrl: 'https://platform.openai.com/docs/models',
    envVar: 'OPENAI_API_KEY',
    suggestions: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
  },
  gemini: {
    placeholder: 'e.g. gemini-2.0-flash',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini',
    envVar: 'GEMINI_API_KEY',
    suggestions: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
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
  const supabase = createClient()

  useEffect(() => {
    const keys = Object.keys(DEFAULTS)
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', keys)
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

  const hint = PROVIDER_HINTS[settings.llm_provider] ?? PROVIDER_HINTS.claude

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">AI Config</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure the LLM provider, models, and conversation settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>LLM Provider</Label>
            <Select value={settings.llm_provider} onValueChange={v => set('llm_provider', v ?? '')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
              Overrides <code>{hint.envVar}</code> env var on the server.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Model per Tier</CardTitle>
          <CardDescription className="text-xs">
            Type any model name supported by <strong>{settings.llm_provider}</strong>.{' '}
            <a href={hint.docsUrl} target="_blank" rel="noopener noreferrer"
               className="text-indigo-500 hover:underline">
              See latest models →
            </a>
            <span className="block mt-1 text-slate-400">
              Suggestions: {hint.suggestions.join(' · ')}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiers.map(t => (
            <div key={t.key} className="grid gap-1.5">
              <Label>{t.label}</Label>
              <Input
                value={settings[t.key]}
                onChange={e => set(t.key, e.target.value)}
                placeholder={hint.placeholder}
                className="font-mono text-sm"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History &amp; Rate Limiting</CardTitle>
        </CardHeader>
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
          <div className="grid gap-1.5">
            <Label htmlFor="daily_limit">Free Tier Daily Message Limit</Label>
            <Input
              id="daily_limit"
              type="number"
              min="1"
              max="100"
              value={settings.free_tier_daily_message_limit}
              onChange={e => set('free_tier_daily_message_limit', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save AI Config'}
      </Button>
    </div>
  )
}
