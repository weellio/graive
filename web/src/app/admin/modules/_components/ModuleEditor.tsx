'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff,
  Bold, Italic, List, Code, Quote, Save, GripVertical,
} from 'lucide-react'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ─── Step types ──────────────────────────────────────────────────────────────

type StepType = 'intro' | 'activity' | 'concepts' | 'facts' | 'reflect' | 'challenge' | 'general'

const STEP_TYPE_OPTIONS: { value: StepType; label: string; emoji: string; heading: string }[] = [
  { value: 'intro',     label: 'Read This',      emoji: '📖', heading: '## About This Lesson' },
  { value: 'concepts',  label: 'Key Ideas',       emoji: '💡', heading: '## Key Concepts' },
  { value: 'facts',     label: 'Fun Facts',       emoji: '✨', heading: '## Fun Fact' },
  { value: 'activity',  label: 'Try It',          emoji: '🧪', heading: '## Activity: Try It' },
  { value: 'reflect',   label: 'Think About It',  emoji: '🧠', heading: '## Reflect' },
  { value: 'challenge', label: 'Challenge',       emoji: '🏆', heading: '## Challenge' },
  { value: 'general',   label: 'General',         emoji: '📝', heading: '## Introduction' },
]

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarButton {
  label: string
  title: string
  before: string
  after?: string
  block?: boolean
}

const TOOLBAR: ToolbarButton[] = [
  { label: 'B',   title: 'Bold',           before: '**', after: '**' },
  { label: 'I',   title: 'Italic',         before: '*',  after: '*'  },
  { label: '—',   title: 'Bullet list',    before: '\n- ', block: true },
  { label: '</>',  title: 'Code block',    before: '\n```\n', after: '\n```', block: true },
  { label: '"',   title: 'Blockquote',     before: '\n> ', block: true },
  { label: '___', title: 'Fill-in blank',  before: '___' },
  { label: '?/10',title: 'Rating (1–10)',  before: '___/10' },
]

function insertIntoTextarea(
  ta: HTMLTextAreaElement,
  before: string,
  after = '',
) {
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = ta.value.slice(start, end)
  const replacement = before + (selected || '') + after
  const newVal = ta.value.slice(0, start) + replacement + ta.value.slice(end)
  // Use execCommand to trigger React's synthetic event
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
    ?.set?.call(ta, newVal)
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  // Restore cursor
  const cursor = start + before.length + (selected ? selected.length : 0) + (after ? 0 : 0)
  ta.setSelectionRange(cursor, cursor)
  ta.focus()
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface StepDraft {
  id: string  // local only
  type: StepType
  content: string  // full markdown for this step (including heading)
}

interface ModuleDraft {
  tier_slug: AgeTier
  title: string
  slug: string
  description: string
  order_index: number
  estimated_minutes: number
  video_url: string
  enabled: boolean
  steps: StepDraft[]
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function detectStepType(content: string): StepType {
  const h = (content.match(/^#{1,4}\s+(.+)$/m)?.[1] ?? '').toLowerCase()
  if (h.includes('key concept') || h.includes('key term') || h.includes('glossary') || h.includes('key idea')) return 'concepts'
  if (h.includes('fun fact')) return 'facts'
  if (h.includes('reflect') || h.includes('debate') || h.includes('journal') || h.includes('think about')) return 'reflect'
  if (h.includes('level up') || h.includes('challenge') || h.includes('capstone')) return 'challenge'
  if (h.includes('activity') || h.includes('try it') || h.includes('build it')) return 'activity'
  if (h.includes('about this') || h.includes('background') || h.includes('introduction') || h.includes('how it works')) return 'intro'
  return 'general'
}

function parseStepsFromContent(content: string): StepDraft[] {
  return content
    .split(/\n---\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => ({ id: makeId(), type: detectStepType(s), content: s }))
}

function assembleContent(steps: StepDraft[]): string {
  return steps.map(s => s.content.trim()).join('\n\n---\n\n')
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function StepEditor({
  step,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  step: StepDraft
  index: number
  total: number
  onChange: (id: string, patch: Partial<StepDraft>) => void
  onDelete: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const [preview, setPreview] = useState(false)
  const typeOption = STEP_TYPE_OPTIONS.find(o => o.value === step.type) ?? STEP_TYPE_OPTIONS[0]

  function handleTypeChange(newType: StepType) {
    const opt = STEP_TYPE_OPTIONS.find(o => o.value === newType)!
    // Replace/prepend heading — if content already starts with #, replace that line
    const body = step.content.replace(/^#{1,4}.+\n?/, '').trimStart()
    onChange(step.id, { type: newType, content: opt.heading + '\n\n' + body })
  }

  function handleToolbar(btn: ToolbarButton) {
    if (!taRef.current) return
    insertIntoTextarea(taRef.current, btn.before, btn.after ?? '')
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="py-2 px-3 bg-slate-50 rounded-t-xl border-b border-slate-200">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-slate-300 flex-shrink-0" />
          <span className="text-xs font-mono text-slate-400 w-5">{index + 1}</span>

          {/* Type selector */}
          <Select value={step.type} onValueChange={v => handleTypeChange(v as StepType)}>
            <SelectTrigger className="h-7 text-xs w-40 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STEP_TYPE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.emoji} {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="text-xs py-0 h-5">{typeOption.emoji} {typeOption.label}</Badge>

          <div className="flex-1" />

          {/* Toolbar */}
          <div className="flex items-center gap-0.5">
            {TOOLBAR.map(btn => (
              <button
                key={btn.title}
                title={btn.title}
                onClick={() => handleToolbar(btn)}
                className="px-1.5 py-0.5 text-xs font-mono rounded hover:bg-slate-200 text-slate-600 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-1">
            <button
              title="Preview"
              onClick={() => setPreview(p => !p)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
            >
              {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
            <button
              title="Move up"
              disabled={index === 0}
              onClick={() => onMove(step.id, -1)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              title="Move down"
              disabled={index === total - 1}
              onClick={() => onMove(step.id, 1)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              title="Delete step"
              onClick={() => onDelete(step.id)}
              className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {preview ? (
          <div className="p-4 prose prose-sm prose-slate max-w-none min-h-[120px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={taRef}
            value={step.content}
            onChange={e => onChange(step.id, { content: e.target.value })}
            className="w-full p-3 font-mono text-xs text-slate-700 resize-none focus:outline-none min-h-[140px] bg-white rounded-b-xl"
            spellCheck={false}
            placeholder={`${typeOption.heading}\n\nWrite your step content here…\n\nTip: use ___ for fill-in blanks, ___/10 for ratings`}
          />
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main editor ─────────────────────────────────────────────────────────────

export function ModuleEditor({ existing }: { existing?: Module }) {
  const router = useRouter()
  const supabase = createClient()

  const [draft, setDraft] = useState<ModuleDraft>(() => {
    if (existing) {
      return {
        tier_slug: existing.tier_slug,
        title: existing.title,
        slug: existing.slug,
        description: existing.description ?? '',
        order_index: existing.order_index,
        estimated_minutes: existing.estimated_minutes,
        video_url: existing.video_url ?? '',
        enabled: existing.enabled,
        steps: existing.content ? parseStepsFromContent(existing.content) : [],
      }
    }
    return {
      tier_slug: 'explorer',
      title: '',
      slug: '',
      description: '',
      order_index: 1,
      estimated_minutes: 30,
      video_url: '',
      enabled: false,
      steps: [],
    }
  })

  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(!!existing)

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && draft.title) {
      setDraft(prev => ({ ...prev, slug: slugify(prev.title) }))
    }
  }, [draft.title, slugManual])

  function set<K extends keyof ModuleDraft>(key: K, value: ModuleDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  function addStep() {
    const opt = STEP_TYPE_OPTIONS[0]
    setDraft(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { id: makeId(), type: 'intro', content: opt.heading + '\n\n' },
      ],
    }))
  }

  function changeStep(id: string, patch: Partial<StepDraft>) {
    setDraft(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, ...patch } : s),
    }))
  }

  function deleteStep(id: string) {
    setDraft(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }))
  }

  function moveStep(id: string, dir: -1 | 1) {
    setDraft(prev => {
      const steps = [...prev.steps]
      const idx = steps.findIndex(s => s.id === id)
      const target = idx + dir
      if (target < 0 || target >= steps.length) return prev
      ;[steps[idx], steps[target]] = [steps[target], steps[idx]]
      return { ...prev, steps }
    })
  }

  async function save() {
    if (!draft.title.trim()) { toast.error('Title is required'); return }
    if (!draft.slug.trim())  { toast.error('Slug is required');  return }
    if (draft.steps.length === 0) { toast.error('Add at least one step'); return }

    setSaving(true)

    const content = assembleContent(draft.steps)
    const payload = {
      tier_slug: draft.tier_slug,
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim() || null,
      order_index: draft.order_index,
      estimated_minutes: draft.estimated_minutes,
      video_url: draft.video_url.trim() || null,
      enabled: draft.enabled,
      content,
      content_path: draft.slug.trim(),  // use slug as path reference
    }

    let error
    if (existing) {
      ;({ error } = await supabase.from('modules').update(payload).eq('id', existing.id))
    } else {
      ;({ error } = await supabase.from('modules').insert(payload))
    }

    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(existing ? 'Module updated' : 'Module created')
    router.push('/admin/modules')
    router.refresh()
  }

  const tierCfg = TIER_CONFIG[draft.tier_slug]

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Metadata */}
      <Card>
        <CardHeader><CardTitle className="text-base">Module Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid gap-1.5">
              <Label>Title</Label>
              <Input
                value={draft.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Asking Good Questions"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Tier</Label>
              <Select value={draft.tier_slug} onValueChange={v => set('tier_slug', v as AgeTier)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['explorer', 'builder', 'thinker', 'innovator'] as AgeTier[]).map(t => (
                    <SelectItem key={t} value={t}>{TIER_CONFIG[t].label} · {TIER_CONFIG[t].ageRange}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Slug <span className="text-slate-400 font-normal">(URL-safe ID)</span></Label>
              <Input
                value={draft.slug}
                onChange={e => { setSlugManual(true); set('slug', e.target.value) }}
                placeholder="asking-good-questions"
                className="font-mono text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Order index</Label>
              <Input
                type="number" min={1}
                value={draft.order_index}
                onChange={e => set('order_index', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Estimated minutes</Label>
              <Input
                type="number" min={5} step={5}
                value={draft.estimated_minutes}
                onChange={e => set('estimated_minutes', parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="col-span-2 grid gap-1.5">
              <Label>Description <span className="text-slate-400 font-normal">(shown on module card)</span></Label>
              <Input
                value={draft.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Brief one-liner about what this module covers"
              />
            </div>

            <div className="col-span-2 grid gap-1.5">
              <Label>Video URL <span className="text-slate-400 font-normal">(optional, YouTube embed)</span></Label>
              <Input
                value={draft.video_url}
                onChange={e => set('video_url', e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>

            <div className="col-span-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-700">Published</p>
                <p className="text-xs text-slate-400">Visible to learners when enabled</p>
              </div>
              <Switch checked={draft.enabled} onCheckedChange={v => set('enabled', v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Steps</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each step is one card learners navigate through. Use the toolbar to insert formatting and interactive elements.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addStep} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Step
          </Button>
        </div>

        {draft.steps.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
            <p className="text-sm">No steps yet.</p>
            <p className="text-xs mt-1">Click <strong>Add Step</strong> to start building your module.</p>
          </div>
        )}

        {/* Toolbar legend */}
        {draft.steps.length > 0 && (
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1">
            <span><code className="font-mono">___</code> → fill-in blank</span>
            <span><code className="font-mono">___/10</code> → rating widget</span>
            <span><code className="font-mono">&gt; text</code> → highlighted quote</span>
            <span><code className="font-mono">```code```</code> → code block with copy button</span>
            <span><code className="font-mono">---</code> at start of line → NOT used inside steps (it splits steps)</span>
          </div>
        )}

        <div className="space-y-3">
          {draft.steps.map((step, idx) => (
            <StepEditor
              key={step.id}
              step={step}
              index={idx}
              total={draft.steps.length}
              onChange={changeStep}
              onDelete={deleteStep}
              onMove={moveStep}
            />
          ))}
        </div>

        {draft.steps.length > 0 && (
          <Button variant="outline" size="sm" onClick={addStep} className="gap-1.5 w-full">
            <Plus className="h-3.5 w-3.5" />
            Add Another Step
          </Button>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
        <Button onClick={save} disabled={saving} className="gap-1.5">
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : existing ? 'Save Changes' : 'Create Module'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/admin/modules')}>
          Cancel
        </Button>
        <span className="text-xs text-slate-400 ml-auto">
          {draft.steps.length} step{draft.steps.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
