'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TIER_CONFIG, type AgeTier, type Module, type Conversation, type Profile, type ChatMessage } from '@/types'
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, MessageSquare, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  const tierCfg = TIER_CONFIG[tier]

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
      toast.success('Module complete! Great work 🎉')
      if (nextModule) {
        setTimeout(() => router.push(`/learn/${tier}/${nextModule.slug}`), 1200)
      }
    }
    setMarking(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/learn/${tier}`} className={`hover:${tierCfg.textClass} ${tierCfg.textClass} font-medium`}>
          {tierCfg.label}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-700 truncate">{module.title}</span>
      </div>

      {/* Module header */}
      <div className={`rounded-xl p-5 mb-6 ${tierCfg.bgClass} border ${tierCfg.borderClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`text-xs ${tierCfg.textClass} ${tierCfg.borderClass}`}>
                Module {module.order_index}
              </Badge>
              {completed && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
            {module.description && (
              <p className="text-sm text-slate-600 mt-1">{module.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{module.estimated_minutes} min</span>
            </div>
          </div>
          <Button
            onClick={markComplete}
            disabled={completed || marking}
            className={completed ? 'bg-green-600 hover:bg-green-600' : ''}
            style={!completed ? { backgroundColor: tierCfg.color } : {}}
          >
            {completed ? (
              <><CheckCircle2 className="h-4 w-4 mr-2" /> Done</>
            ) : marking ? 'Saving…' : 'Mark Complete'}
          </Button>
        </div>
      </div>

      {/* Desktop: split layout. Mobile: tabs */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_400px] gap-6">
        <div>
          <LessonContent content={content} videoUrl={module.video_url} />
          <ModuleNav tier={tier} prev={prevModule} next={nextModule} />
        </div>
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

      <div className="lg:hidden">
        <Tabs defaultValue="lesson">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="lesson" className="flex-1 gap-2">
              <BookOpen className="h-4 w-4" /> Lesson
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 gap-2">
              <MessageSquare className="h-4 w-4" /> AI Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="lesson">
            <LessonContent content={content} videoUrl={module.video_url} />
            <ModuleNav tier={tier} prev={prevModule} next={nextModule} />
          </TabsContent>
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
    </div>
  )
}

function LessonContent({ content, videoUrl }: { content: string; videoUrl?: string | null }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
      {videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 mb-6">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allowFullScreen
            title="Module video"
          />
        </div>
      )}
      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

function ModuleNav({
  tier,
  prev,
  next,
}: {
  tier: AgeTier
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}) {
  return (
    <div className="flex justify-between mt-4">
      {prev ? (
        <Link href={`/learn/${tier}/${prev.slug}`}>
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </Button>
        </Link>
      ) : <div />}
      {next && (
        <Link href={`/learn/${tier}/${next.slug}`}>
          <Button variant="outline" className="gap-2">
            <span className="hidden sm:inline">{next.title}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}
