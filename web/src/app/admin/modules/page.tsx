'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Clock, GripVertical, Plus, Pencil } from 'lucide-react'

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('modules')
      .select('*')
      .order('tier_slug')
      .order('order_index')
      .then(({ data }) => {
        setModules((data || []) as Module[])
        setLoading(false)
      })
  }, [])

  async function toggleEnabled(mod: Module) {
    const { error } = await supabase
      .from('modules')
      .update({ enabled: !mod.enabled })
      .eq('id', mod.id)

    if (error) {
      toast.error('Failed to update module')
      return
    }

    setModules(prev => prev.map(m => m.id === mod.id ? { ...m, enabled: !m.enabled } : m))
    toast.success(`Module ${mod.enabled ? 'disabled' : 'enabled'}`)
  }

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator']

  if (loading) {
    return <div className="text-sm text-slate-400 py-8 text-center">Loading modules…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Modules</h1>
          <p className="text-sm text-slate-500 mt-0.5">Toggle modules on/off or create new ones.</p>
        </div>
        <Link href="/admin/modules/new">
          <Button size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />
            New Module
          </Button>
        </Link>
      </div>

      {tiers.map(tier => {
        const cfg = TIER_CONFIG[tier]
        const tierModules = modules.filter(m => m.tier_slug === tier)
        if (tierModules.length === 0) return null

        return (
          <Card key={tier}>
            <CardHeader className={`pb-3 rounded-t-xl ${cfg.bgClass} border-b ${cfg.borderClass}`}>
              <CardTitle className={`text-sm font-semibold ${cfg.textClass}`}>
                {cfg.label} · {cfg.ageRange}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {tierModules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx < tierModules.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <GripVertical className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-mono flex-shrink-0">
                    {mod.order_index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{mod.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{mod.estimated_minutes} min
                      </span>
                      <span className="font-mono">{mod.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/modules/${mod.id}/edit`}>
                      <button
                        title="Edit module"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <Switch
                      checked={mod.enabled}
                      onCheckedChange={() => toggleEnabled(mod)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
