'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Clock, GripVertical, Plus, Pencil, ChevronDown, Trash2 } from 'lucide-react'

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function toggleCollapsed(tier: string) {
    setCollapsed(prev => ({ ...prev, [tier]: !prev[tier] }))
  }

  useEffect(() => {
    fetch('/api/admin/modules')
      .then(r => r.json())
      .then(({ modules }) => {
        setModules((modules || []) as Module[])
        setLoading(false)
      })
  }, [])

  // Keep select-all checkbox indeterminate state in sync
  useEffect(() => {
    if (!selectAllRef.current) return
    const allIds = modules.map(m => m.id)
    const noneSelected = selected.size === 0
    const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))
    selectAllRef.current.indeterminate = !noneSelected && !allSelected
  }, [selected, modules])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    const allIds = modules.map(m => m.id)
    const allSelected = allIds.every(id => selected.has(id))
    setSelected(allSelected ? new Set() : new Set(allIds))
  }

  async function toggleEnabled(mod: Module) {
    const { error } = await supabase
      .from('modules')
      .update({ enabled: !mod.enabled })
      .eq('id', mod.id)

    if (error) { toast.error('Failed to update module'); return }
    setModules(prev => prev.map(m => m.id === mod.id ? { ...m, enabled: !m.enabled } : m))
    toast.success(`Module ${mod.enabled ? 'disabled' : 'enabled'}`)
  }

  async function deleteModule(mod: Module) {
    if (!confirm(`Delete "${mod.title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/modules/${mod.id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete module'); return }
    setModules(prev => prev.filter(m => m.id !== mod.id))
    setSelected(prev => { const next = new Set(prev); next.delete(mod.id); return next })
    toast.success('Module deleted')
  }

  async function deleteSelected() {
    const ids = [...selected]
    const isAll = ids.length === modules.length
    const msg = isAll
      ? `Delete ALL ${ids.length} modules? This cannot be undone.`
      : `Delete ${ids.length} selected module${ids.length > 1 ? 's' : ''}? This cannot be undone.`
    if (!confirm(msg)) return
    setDeleting(true)
    const res = await fetch('/api/admin/modules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error ?? 'Failed to delete modules'); setDeleting(false); return }
    setModules(prev => prev.filter(m => !selected.has(m.id)))
    setSelected(new Set())
    setDeleting(false)
    const n = data.deleted ?? ids.length
    toast.success(`${n} module${n !== 1 ? 's' : ''} deleted from database`)
  }

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator', 'creator']
  const allSelected = modules.length > 0 && modules.every(m => selected.has(m.id))

  if (loading) {
    return <div className="text-sm text-muted-foreground py-8 text-center">Loading modules…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Modules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Toggle modules on/off or create new ones.</p>
        </div>
        <div className="flex items-center gap-2">
          {modules.length > 0 && (
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-border accent-red-600"
              />
              Select all
            </label>
          )}
          {selected.size > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={deleteSelected}
              disabled={deleting}
              className="gap-1.5 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {selected.size === modules.length ? 'All' : `${selected.size} Selected`}
            </Button>
          )}
          <Link href="/admin/modules/new">
            <Button size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-3.5 w-3.5" />
              New Module
            </Button>
          </Link>
        </div>
      </div>

      {tiers.map(tier => {
        const cfg = TIER_CONFIG[tier]
        const tierModules = modules.filter(m => m.tier_slug === tier)
        if (tierModules.length === 0) return null
        const isCollapsed = collapsed[tier] ?? false
        const enabledCount = tierModules.filter(m => m.enabled).length
        const tierAllSelected = tierModules.every(m => selected.has(m.id))

        return (
          <Card key={tier}>
            <CardHeader
              className={`pb-3 rounded-t-xl ${cfg.bgClass} border-b ${cfg.borderClass} cursor-pointer select-none ${isCollapsed ? 'rounded-b-xl border-b-0' : ''}`}
              onClick={() => toggleCollapsed(tier)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={tierAllSelected}
                    onChange={() => {
                      const ids = tierModules.map(m => m.id)
                      setSelected(prev => {
                        const next = new Set(prev)
                        tierAllSelected ? ids.forEach(id => next.delete(id)) : ids.forEach(id => next.add(id))
                        return next
                      })
                    }}
                    className="h-4 w-4 rounded border-border accent-red-600"
                  />
                  <CardTitle className={`text-sm font-semibold ${cfg.textClass}`}>
                    {cfg.label} · {cfg.ageRange}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{enabledCount}/{tierModules.length} enabled</span>
                  <ChevronDown className={`h-4 w-4 ${cfg.textClass} transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                </div>
              </div>
            </CardHeader>
            {!isCollapsed && <CardContent className="p-0">
              {tierModules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className={`flex items-center gap-3 px-4 py-3 ${selected.has(mod.id) ? 'bg-red-50 dark:bg-red-950/20' : ''} ${
                    idx < tierModules.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(mod.id)}
                    onChange={() => toggleSelect(mod.id)}
                    className="h-4 w-4 rounded border-border accent-red-600 shrink-0"
                  />
                  <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-mono shrink-0">
                    {mod.order_index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
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
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      title="Delete module"
                      onClick={() => deleteModule(mod)}
                      className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <Switch
                      checked={mod.enabled}
                      onCheckedChange={() => toggleEnabled(mod)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>}
          </Card>
        )
      })}
    </div>
  )
}
