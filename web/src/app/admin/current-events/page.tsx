'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Sparkles, Loader2, CalendarDays, Newspaper } from 'lucide-react'
import { TIER_CONFIG, type AgeTier } from '@/types'
import { toast } from 'sonner'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const CURRENT_EVENTS_TEMPLATE = (
  tier: AgeTier,
  topic: string,
  month: string,
  year: number,
  context: string,
) => `# ${month} ${year} AI News: ${topic}

> This is your monthly AI Current Events module — what's happening RIGHT NOW in the world of artificial intelligence.

---

## What Happened This Month

${context || `In ${month} ${year}, the AI world saw major developments around "${topic}". Here's what you need to know...`}

Add 2-3 paragraphs here explaining the news event in age-appropriate language for ${TIER_CONFIG[tier].label} level (${TIER_CONFIG[tier].ageRange}).

---

## Why This Matters

Explain why this development is significant. What does it mean for students, for jobs, for society?

- Point 1: ___
- Point 2: ___
- Point 3: ___

---

## Key Concepts

**Term 1:** Definition here.

**Term 2:** Definition here.

**Term 3:** Definition here.

---

## Activity: Try It

Use Spark AI to explore this topic further.

Ask Spark: *"Explain ${topic} like I'm in ${TIER_CONFIG[tier].ageRange}. What are the pros and cons?"*

Rate how well Spark explained it: ___/10

What surprised you most about the response?

___

---

## Think About It

1. How might this affect people your age in the next 5 years?

2. Who benefits from this development? Who might be harmed?

3. If you could ask the people building this AI one question, what would it be?

---

## Challenge

Write a 3-sentence summary of this news story as if you were explaining it to a younger sibling or friend who has never heard of AI.

Your summary:

___

___

___

---

## What's Coming Next Month

Stay tuned — AI is moving fast. Come back next month for more current events!`

export default function CurrentEventsPage() {
  const router = useRouter()
  const supabase = createClient()

  const now = new Date()
  const [tier, setTier] = useState<AgeTier>('builder')
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [month, setMonth] = useState(MONTH_NAMES[now.getMonth()])
  const [year, setYear] = useState(now.getFullYear())
  const [publishDate, setPublishDate] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  )
  const [preview, setPreview] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator', 'creator']

  function buildTemplate() {
    return CURRENT_EVENTS_TEMPLATE(tier, topic, month, year, context)
  }

  async function handleGenerateWithAI() {
    if (!topic) { toast.error('Enter a topic first'); return }
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/generate-current-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, topic, context, month, year }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setPreview(data.content)
      toast.success('Content generated — review and save')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    }
    setGenerating(false)
  }

  function handleUseTemplate() {
    if (!topic) { toast.error('Enter a topic first'); return }
    setPreview(buildTemplate())
  }

  async function handleSave() {
    if (!topic || !preview) { toast.error('Topic and content required'); return }
    setSaving(true)

    const slug = `current-events-${month.toLowerCase()}-${year}`
    const orderIndex = 100 + now.getMonth() // high index so it appears after core modules

    const { data, error } = await supabase.from('modules').upsert(
      {
        tier_slug: tier,
        slug,
        title: `${month} ${year}: ${topic}`,
        description: `Monthly AI current events — ${month} ${year}. Topic: ${topic}`,
        order_index: orderIndex,
        enabled: true,
        content_path: '',
        content: preview,
        estimated_minutes: 25,
        is_current_events: true,
        publish_date: publishDate || null,
      },
      { onConflict: 'tier_slug,slug' }
    ).select('id').single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Current events module saved!')
      router.push(`/admin/modules/${data.id}/edit`)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Newspaper className="h-5 w-5 text-amber-600" />
          <h1 className="text-xl font-bold text-slate-800">New Current Events Module</h1>
        </div>
        <p className="text-sm text-slate-500">
          Create a monthly AI news module. Use the template for a quick start, or let AI write the full content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: config */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Module Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Month</Label>
                  <Select value={month} onValueChange={v => v && setMonth(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value) || now.getFullYear())}
                    min={2024}
                    max={2030}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tier</Label>
                <Select value={tier} onValueChange={v => setTier(v as AgeTier)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiers.map(t => (
                      <SelectItem key={t} value={t}>
                        {TIER_CONFIG[t].label} · {TIER_CONFIG[t].ageRange}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>AI Topic / News Headline</Label>
                <Input
                  placeholder="e.g. GPT-5 Released, AI in Healthcare, EU AI Act Passes"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Context / Background (optional)</Label>
                <Textarea
                  placeholder="Paste a summary or key facts about the news story. AI will use this to write accurate content."
                  rows={5}
                  value={context}
                  onChange={e => setContext(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Publish Date
                </Label>
                <Input
                  type="date"
                  value={publishDate}
                  onChange={e => setPublishDate(e.target.value)}
                />
                <p className="text-xs text-slate-400">Module will only show to learners on or after this date.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleUseTemplate}
              disabled={!topic}
              className="flex-1"
            >
              Use Template
            </Button>
            <Button
              onClick={handleGenerateWithAI}
              disabled={generating || !topic}
              className="flex-1 gap-2"
            >
              {generating
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Sparkles className="h-4 w-4" />
              }
              Generate with AI
            </Button>
          </div>
        </div>

        {/* Right: preview + save */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Content Preview / Editor</Label>
            {preview && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                <Newspaper className="h-3 w-3 mr-1" /> Current Events
              </Badge>
            )}
          </div>
          <Textarea
            rows={32}
            className="font-mono text-sm leading-relaxed"
            placeholder="Click 'Use Template' or 'Generate with AI' to populate content here. You can edit freely before saving."
            value={preview}
            onChange={e => setPreview(e.target.value)}
          />
          <Button
            className="w-full gap-2"
            onClick={handleSave}
            disabled={saving || !preview || !topic}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Module & Open Editor
          </Button>
        </div>
      </div>
    </div>
  )
}
