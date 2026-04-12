'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Video, Download, Sparkles, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ModuleWithScript extends Module {
  scriptDraft?: string
}

export default function VideoScriptsPage() {
  const [modules, setModules] = useState<ModuleWithScript[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tierCollapsed, setTierCollapsed] = useState<Record<string, boolean>>({})
  const [generating, setGenerating] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetch('/api/admin/modules')
      .then(r => r.json())
      .then(({ modules }) => {
        setModules((modules || []) as ModuleWithScript[])
        setLoading(false)
      })
  }, [])

  async function generateScript(mod: ModuleWithScript) {
    setGenerating(mod.id)
    try {
      const res = await fetch('/api/admin/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: mod.id,
          title: mod.title,
          description: mod.description,
          tier: mod.tier_slug,
          estimatedMinutes: mod.estimated_minutes,
          content: mod.content?.slice(0, 2000) ?? '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setModules(prev => prev.map(m =>
        m.id === mod.id ? { ...m, video_script: data.script } : m
      ))
      setExpanded(mod.id)
      toast.success('Script generated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate')
    }
    setGenerating(null)
  }

  async function saveScript(mod: ModuleWithScript) {
    setSaving(mod.id)
    const { error } = await supabase
      .from('modules')
      .update({ video_script: mod.video_script })
      .eq('id', mod.id)
    if (error) {
      toast.error('Failed to save')
    } else {
      toast.success('Script saved')
    }
    setSaving(null)
  }

  async function copyScript(mod: ModuleWithScript) {
    if (!mod.video_script) return
    await navigator.clipboard.writeText(mod.video_script)
    setCopied(mod.id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function exportAll() {
    const withScripts = modules.filter(m => m.video_script)
    if (withScripts.length === 0) { toast.error('No scripts to export'); return }
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const m of withScripts) {
      const filename = `${m.tier_slug}_${m.order_index}.txt`
      zip.file(filename, m.video_script!)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video-scripts.zip'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${withScripts.length} scripts as individual files`)
  }

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator', 'creator']
  const scriptCount = modules.filter(m => m.video_script).length

  if (loading) return <div className="text-sm text-slate-400 py-8 text-center">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Video Scripts</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            AI-generated teleprompter scripts for each module intro video.
            {scriptCount > 0 && ` ${scriptCount} of ${modules.length} scripts ready.`}
          </p>
        </div>
        <Button onClick={exportAll} variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Download className="h-3.5 w-3.5" /> Export All
        </Button>
      </div>

      {tiers.map(tier => {
        const cfg = TIER_CONFIG[tier]
        const tierMods = modules.filter(m => m.tier_slug === tier)
        if (tierMods.length === 0) return null
        const isCollapsed = tierCollapsed[tier] ?? false
        const scriptCount = tierMods.filter(m => m.video_script).length

        const orderCounts = tierMods.reduce<Record<number, number>>((acc, m) => {
          acc[m.order_index] = (acc[m.order_index] ?? 0) + 1
          return acc
        }, {})

        return (
          <div key={tier} className="space-y-2">
            <button
              onClick={() => setTierCollapsed(prev => ({ ...prev, [tier]: !prev[tier] }))}
              className="w-full flex items-center justify-between gap-2 py-1 group"
            >
              <h2 className={`text-sm font-semibold ${cfg.textClass} uppercase tracking-wide`}>
                {cfg.label} · {cfg.ageRange}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{scriptCount}/{tierMods.length} scripts</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </div>
            </button>
            {!isCollapsed && tierMods.map(mod => {
              const isOpen = expanded === mod.id
              const hasScript = !!mod.video_script
              const isDuplicate = (orderCounts[mod.order_index] ?? 0) > 1
              return (
                <Card key={mod.id} className={hasScript ? `border-l-4` : ''} style={hasScript ? { borderLeftColor: cfg.color } : undefined}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-400">#{mod.order_index}</span>
                          <p className="text-sm font-medium text-slate-800 truncate">{mod.title}</p>
                          {hasScript && (
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                              Script ready
                            </Badge>
                          )}
                          {mod.is_current_events && (
                            <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                              Current Events
                            </Badge>
                          )}
                          {isDuplicate && (
                            <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                              Duplicate #
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{mod.estimated_minutes} min · {mod.description?.slice(0, 80)}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasScript && (
                          <>
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => copyScript(mod)}
                              className="h-8 w-8 p-0"
                            >
                              {copied === mod.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => setExpanded(isOpen ? null : mod.id)}
                              className="h-8 w-8 p-0"
                            >
                              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant={hasScript ? 'outline' : 'default'}
                          onClick={() => generateScript(mod)}
                          disabled={generating === mod.id}
                          className="gap-1.5 text-xs"
                        >
                          {generating === mod.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Sparkles className="h-3.5 w-3.5" />
                          }
                          {hasScript ? 'Regenerate' : 'Generate Script'}
                        </Button>
                      </div>
                    </div>

                    {isOpen && mod.video_script && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          value={mod.video_script}
                          onChange={e => setModules(prev => prev.map(m =>
                            m.id === mod.id ? { ...m, video_script: e.target.value } : m
                          ))}
                          rows={20}
                          className="font-mono text-sm leading-relaxed"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline" size="sm"
                            onClick={() => copyScript(mod)}
                            className="gap-1.5"
                          >
                            {copied === mod.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveScript(mod)}
                            disabled={saving === mod.id}
                            className="gap-1.5"
                          >
                            {saving === mod.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Save Script
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
