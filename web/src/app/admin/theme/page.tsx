'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ThemeSettings {
  brand_name: string
  brand_logo_url: string
  brand_primary_color: string
  brand_accent_color: string
  brand_font: string
}

const DEFAULTS: ThemeSettings = {
  brand_name: 'LearnAI',
  brand_logo_url: '',
  brand_primary_color: '#6366f1',
  brand_accent_color: '#f59e0b',
  brand_font: 'Inter',
}

export default function AdminThemePage() {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const keys = Object.keys(DEFAULTS) as (keyof ThemeSettings)[]
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', keys)
      .then(({ data }) => {
        if (data) {
          const merged = { ...DEFAULTS }
          data.forEach(row => {
            if (row.key in merged) {
              (merged as Record<string, string>)[row.key] = row.value
            }
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
    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Theme settings saved')
    }
  }

  function set(key: keyof ThemeSettings, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Theme</h1>
        <p className="text-sm text-slate-500 mt-0.5">Customize your brand identity. Changes apply on next page load.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input
              id="brand_name"
              value={settings.brand_name}
              onChange={e => set('brand_name', e.target.value)}
              placeholder="LearnAI"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="brand_logo_url">Logo URL</Label>
            <Input
              id="brand_logo_url"
              value={settings.brand_logo_url}
              onChange={e => set('brand_logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-slate-400">Leave empty to show brand name as text.</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="brand_font">Font Family</Label>
            <Input
              id="brand_font"
              value={settings.brand_font}
              onChange={e => set('brand_font', e.target.value)}
              placeholder="Inter"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="brand_primary_color">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="brand_primary_color"
                value={settings.brand_primary_color}
                onChange={e => set('brand_primary_color', e.target.value)}
                className="h-9 w-16 rounded border cursor-pointer"
              />
              <Input
                value={settings.brand_primary_color}
                onChange={e => set('brand_primary_color', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="brand_accent_color">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="brand_accent_color"
                value={settings.brand_accent_color}
                onChange={e => set('brand_accent_color', e.target.value)}
                className="h-9 w-16 rounded border cursor-pointer"
              />
              <Input
                value={settings.brand_accent_color}
                onChange={e => set('brand_accent_color', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          {/* Preview swatch */}
          <div className="flex gap-2 mt-2">
            <div
              className="h-8 w-24 rounded text-white text-xs flex items-center justify-center font-medium"
              style={{ backgroundColor: settings.brand_primary_color }}
            >
              Primary
            </div>
            <div
              className="h-8 w-24 rounded text-white text-xs flex items-center justify-center font-medium"
              style={{ backgroundColor: settings.brand_accent_color }}
            >
              Accent
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Theme'}
      </Button>
    </div>
  )
}
