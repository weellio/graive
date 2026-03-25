'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TIER_CONFIG, type AgeTier, type Module, type Conversation, type Profile, type ChatMessage } from '@/types'
import {
  CheckCircle2, ChevronLeft, ChevronRight, BookOpen, MessageSquare, Clock,
  Star, Zap, Trophy, Lightbulb, FlaskConical, Brain, Rocket, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const MODULE_XP = 100

// ─── Step parsing ────────────────────────────────────────────────────────────

function parseSteps(content: string): string[] {
  return content
    .split(/\n---\n/)
    .map(s => s.trim())
    .filter(s => {
      // Remove steps that are only headings (no body text)
      const body = s.replace(/^#{1,4}\s+.*/mg, '').trim()
      return body.length > 20
    })
}

type StepType = 'intro' | 'activity' | 'concepts' | 'facts' | 'reflect' | 'challenge' | 'general'

function getStepType(content: string): StepType {
  const h = (content.match(/^#{1,4}\s+(.+)$/m)?.[1] ?? '').toLowerCase()
  if (h.includes('key concept') || h.includes('key term') || h.includes('glossary')) return 'concepts'
  if (h.includes('fun fact')) return 'facts'
  if (h.includes('reflect') || h.includes('debate') || h.includes('journal')) return 'reflect'
  if (h.includes('level up') || h.includes('challenge') || h.includes('capstone') || h.includes('innovator') || h.includes('thinker challenge') || h.includes('builder challenge') || h.includes('explorer challenge')) return 'challenge'
  if (h.includes('activity') || h.includes('try it') || h.includes('build it') || h.includes('deep dive') || h.includes('draw it') || h.includes('case stud')) return 'activity'
  if (h.includes('about this') || h.includes('background') || h.includes('the landscape') || h.includes('introduction') || h.includes('how it works') || h.includes('technical')) return 'intro'
  return 'general'
}

interface StepMeta {
  icon: React.ElementType
  label: string
  bg: string
  border: string
  topBar: string        // CSS color for the accent bar
  pillBg: string
  pillText: string
  headingColor: string
  dark: boolean
}

const STEP_META: Record<StepType, StepMeta> = {
  intro:     { icon: BookOpen,     label: 'Read',         bg: 'bg-white',       border: 'border-slate-200',  topBar: '', pillBg: 'bg-slate-100',    pillText: 'text-slate-600',   headingColor: 'text-slate-900',   dark: false },
  activity:  { icon: FlaskConical, label: 'Activity',     bg: 'bg-white',       border: 'border-slate-200',  topBar: '', pillBg: '',                 pillText: '',                  headingColor: 'text-slate-900',   dark: false },
  concepts:  { icon: Lightbulb,    label: 'Key Concepts', bg: 'bg-sky-50',      border: 'border-sky-200',    topBar: '#0ea5e9', pillBg: 'bg-sky-100',    pillText: 'text-sky-700',    headingColor: 'text-sky-900',     dark: false },
  facts:     { icon: Sparkles,     label: 'Fun Facts',    bg: 'bg-amber-50',    border: 'border-amber-200',  topBar: '#f59e0b', pillBg: 'bg-amber-100',  pillText: 'text-amber-800',  headingColor: 'text-amber-900',   dark: false },
  reflect:   { icon: Brain,        label: 'Reflect',      bg: 'bg-violet-50',   border: 'border-violet-200', topBar: '#8b5cf6', pillBg: 'bg-violet-100', pillText: 'text-violet-700', headingColor: 'text-violet-900',  dark: false },
  challenge: { icon: Trophy,       label: 'Challenge',    bg: 'bg-slate-900',   border: 'border-slate-700',  topBar: '#f59e0b', pillBg: 'bg-yellow-400', pillText: 'text-slate-900',  headingColor: 'text-white',       dark: true  },
  general:   { icon: BookOpen,     label: 'Read',         bg: 'bg-white',       border: 'border-slate-200',  topBar: '#cbd5e1', pillBg: 'bg-slate-100',  pillText: 'text-slate-600',  headingColor: 'text-slate-900',   dark: false },
}

// ─── Step card ────────────────────────────────────────────────────────────────

/** Pull the first heading out of markdown so we can render it at large size */
function extractHeading(content: string): { heading: string; rest: string } {
  const lines = content.split('\n')
  const idx = lines.findIndex(l => /^#{1,4}\s+/.test(l))
  if (idx === -1) return { heading: '', rest: content }
  const heading = lines[idx].replace(/^#{1,4}\s+/, '').replace(/ — /g, ' - ')
  const rest = [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').trim()
  return { heading, rest }
}

function StepCard({
  content,
  tier,
  videoUrl,
}: {
  content: string
  tier: AgeTier
  videoUrl?: string | null
}) {
  const tierCfg = TIER_CONFIG[tier]
  const type = getStepType(content)
  const meta = STEP_META[type]
  const Icon = meta.icon

  const topBarColor = type === 'intro' || type === 'activity' ? tierCfg.color : meta.topBar
  const pillBg = type === 'activity' ? tierCfg.color + '22' : meta.pillBg
  const pillText = type === 'activity' ? tierCfg.color : undefined

  const { heading, rest } = extractHeading(content)
  const cleaned = rest.replace(/ — /g, ' - ').replace(/—/g, '-')

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-sm ${meta.bg} ${meta.border}`}>

      {/* Coloured accent bar at the top */}
      <div className="h-1.5 w-full" style={{ backgroundColor: topBarColor }} />

      <div className="p-6 sm:p-10">

        {/* Type pill */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${meta.pillBg} ${meta.pillText}`}
            style={type === 'activity' ? { backgroundColor: pillBg, color: pillText } : {}}
          >
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
        </div>

        {/* Large heading — rendered outside prose so we fully control size */}
        {heading && (
          <h2 className={`text-2xl sm:text-3xl font-black leading-tight mb-6 ${meta.headingColor}`}>
            {heading}
          </h2>
        )}

        {videoUrl && (
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 mb-8">
            <iframe src={videoUrl} className="w-full h-full" allowFullScreen title="Module video" />
          </div>
        )}

        {/* Body — prose-lg gives 18px base, relaxed leading */}
        <div
          className={`prose prose-lg max-w-none
            prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2
            prose-h4:text-base prose-h4:font-semibold prose-h4:mt-4 prose-h4:mb-1
            prose-p:leading-relaxed prose-p:mb-5
            prose-ul:space-y-3 prose-ul:my-4
            prose-ol:space-y-3 prose-ol:my-4
            prose-li:leading-relaxed
            prose-strong:font-bold
            prose-code:bg-white/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:py-0.5 prose-blockquote:rounded-r-lg
            prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-table:text-base prose-thead:border-b-2
            ${meta.dark
              ? 'prose-invert prose-blockquote:border-white/30 prose-code:bg-white/10'
              : 'prose-slate prose-a:text-indigo-600 prose-blockquote:border-slate-300 prose-blockquote:bg-white/60'
            }
          `}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ModulePageProps {
  module: Module
  profile: Profile
  content: string
  history: Conversation[]
  isCompleted: boolean
  tier: AgeTier
  prevModule: { slug: string; title: string } | null
  nextModule: { slug: string; title: string } | null
  historyEnabled: boolean
}

export function ModulePage({
  module,
  profile,
  content,
  history,
  isCompleted,
  tier,
  prevModule,
  nextModule,
  historyEnabled,
}: ModulePageProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(isCompleted)
  const [marking, setMarking] = useState(false)
  const [step, setStep] = useState(0)
  const tierCfg = TIER_CONFIG[tier]

  const steps = parseSteps(content)
  const totalSteps = steps.length || 1
  const isLastStep = step === totalSteps - 1
  const stepProgress = Math.round(((step + 1) / totalSteps) * 100)

  const initialMessages: ChatMessage[] = history.map(h => ({
    role: h.role,
    content: h.content,
  }))

  async function markComplete() {
    if (completed) return
    setMarking(true)
    const supabase = createClient()
    const { error } = await supabase.from('progress').upsert({
      user_id: profile.id,
      module_id: module.id,
    })
    if (error) {
      toast.error('Could not save progress')
    } else {
      setCompleted(true)
      toast.success(`⭐ Module complete! +${MODULE_XP} XP earned`, {
        description: nextModule
          ? `Up next: ${nextModule.title}`
          : 'Amazing — you finished the level! 🏆',
        duration: 4000,
      })
      if (nextModule) {
        setTimeout(() => router.push(`/learn/${tier}/${nextModule.slug}`), 2000)
      }
    }
    setMarking(false)
  }

  const stepView = (
    <div className="space-y-4">
      {/* Step progress bar */}
      <div className="bg-slate-800 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-white">
            Step <span className="text-xl font-black">{step + 1}</span>{' '}
            <span className="text-slate-400 text-sm font-normal">of {totalSteps}</span>
          </span>
          <span className="font-bold text-sm text-white">
            {stepProgress}%
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stepProgress}%`, backgroundColor: tierCfg.color }}
          />
        </div>
        {/* Step dots */}
        {totalSteps <= 15 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="h-2 rounded-full transition-all duration-200 hover:opacity-80 focus:outline-none"
                style={{
                  width: i === step ? '24px' : '8px',
                  backgroundColor: i < step ? tierCfg.color + 'aa' : i === step ? tierCfg.color : '#475569',
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Step content card */}
      <StepCard
        content={steps[step] ?? ''}
        tier={tier}
        videoUrl={step === 0 ? module.video_url : null}
      />

      {/* Step navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          disabled={step === 0}
          className="gap-2 rounded-xl border-2 font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={markComplete}
            disabled={completed || marking}
            size="lg"
            className={`gap-2 px-8 rounded-xl font-semibold text-white ${
              completed ? 'bg-green-500 hover:bg-green-500' : ''
            }`}
            style={!completed ? { backgroundColor: tierCfg.color } : {}}
          >
            {completed ? (
              <><CheckCircle2 className="h-5 w-5" /> Done!</>
            ) : marking ? (
              'Saving...'
            ) : (
              <><Star className="h-5 w-5" /> Complete and earn {MODULE_XP} XP</>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            size="lg"
            className="gap-2 px-8 rounded-xl font-semibold text-white"
            style={{ backgroundColor: tierCfg.color }}
          >
            Next Step <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard" className="hover:text-slate-700 transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/learn/${tier}`} className={`font-medium transition-colors ${tierCfg.textClass}`}>
          {tierCfg.label}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700 truncate">{module.title}</span>
      </div>

      {/* Module header */}
      <div className={`rounded-2xl p-5 mb-6 ${tierCfg.bgClass} border-2 ${tierCfg.borderClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${tierCfg.textClass} ${tierCfg.borderClass}`}
              >
                Module {module.order_index}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1 text-slate-500">
                <Zap className="h-3 w-3" /> {MODULE_XP} XP
              </Badge>
              <Badge variant="outline" className="text-xs gap-1 text-slate-500">
                <BookOpen className="h-3 w-3" /> {totalSteps} steps
              </Badge>
              {completed && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1 font-semibold">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Complete
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
            {module.description && (
              <p className="text-sm text-slate-600 mt-1">
                {module.description.replace(/ — /g, ' - ')}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~{module.estimated_minutes} min
              </span>
            </div>
          </div>
          {completed && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-700 text-sm font-semibold shrink-0">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {MODULE_XP} XP earned
            </div>
          )}
        </div>
      </div>

      {/* Desktop split layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_400px] gap-6">
        <div>{stepView}</div>
        <div className="sticky top-20 h-[calc(100vh-6rem)]">
          <ChatPanel
            moduleId={module.id}
            moduleTitle={module.title}
            tier={tier}
            initialMessages={initialMessages}
            historyEnabled={historyEnabled}
          />
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="lesson">
          <TabsList className="w-full mb-4 rounded-xl">
            <TabsTrigger value="lesson" className="flex-1 gap-2 rounded-lg">
              <BookOpen className="h-4 w-4" /> Lesson
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 gap-2 rounded-lg">
              <MessageSquare className="h-4 w-4" /> AI Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="lesson">{stepView}</TabsContent>
          <TabsContent value="chat" className="h-[70vh]">
            <ChatPanel
              moduleId={module.id}
              moduleTitle={module.title}
              tier={tier}
              initialMessages={initialMessages}
              historyEnabled={historyEnabled}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Module prev/next navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
        {prevModule ? (
          <Link href={`/learn/${tier}/${prevModule.slug}`}>
            <Button variant="ghost" className="text-slate-500 gap-2 rounded-xl">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{prevModule.title}</span>
              <span className="sm:hidden text-sm">Previous</span>
            </Button>
          </Link>
        ) : <div />}
        {nextModule && (
          <Link href={`/learn/${tier}/${nextModule.slug}`}>
            <Button variant="ghost" className="text-slate-500 gap-2 rounded-xl">
              <span className="hidden sm:inline text-sm">{nextModule.title}</span>
              <span className="sm:hidden text-sm">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
