import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { BookOpen, Star, Clock, ChevronRight, Lock, Zap } from 'lucide-react'

interface PageProps {
  params: Promise<{ tier: string }>
}

export default async function TierPage({ params }: PageProps) {
  const { tier } = await params
  const tierConfig = TIER_CONFIG[tier as AgeTier]
  if (!tierConfig) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const [{ data: modules }, { data: progressRows }, { data: subscription }] =
    await Promise.all([
      supabase
        .from('modules')
        .select('*')
        .eq('tier_slug', tier)
        .eq('enabled', true)
        .order('order_index'),
      supabase.from('progress').select('module_id').eq('user_id', user.id),
      supabase.from('subscriptions').select('status').eq('user_id', user.id).single(),
    ])

  const isSubscribed =
    subscription?.status === 'active' || subscription?.status === 'trialing'

  if (!tierConfig.free && !isSubscribed) {
    redirect('/account/billing?reason=tier-locked')
  }

  const completedIds = new Set((progressRows || []).map(p => p.module_id))
  const allModules = (modules || []) as Module[]
  const completedCount = allModules.filter(m => completedIds.has(m.id)).length
  const progressPct = allModules.length
    ? Math.round((completedCount / allModules.length) * 100)
    : 0

  // Find the first incomplete module for "Continue" button
  const nextIncomplete = allModules.find(m => !completedIds.has(m.id))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tier header */}
      <div className={`rounded-2xl p-6 mb-8 ${tierConfig.bgClass} border ${tierConfig.borderClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-medium ${tierConfig.textClass} mb-1`}>
              {tierConfig.ageRange}
            </p>
            <h1 className="text-2xl font-bold text-slate-800">{tierConfig.label} Level</h1>
            <p className="text-slate-600 mt-1">{tierConfig.theme}</p>
          </div>
          {nextIncomplete && (
            <Link href={`/learn/${tier}/${nextIncomplete.slug}`}>
              <Button style={{ backgroundColor: tierConfig.color }}>
                {completedCount > 0 ? 'Continue' : 'Start Learning'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-sm text-slate-600 mb-1.5">
            <span>{completedCount} of {allModules.length} modules complete</span>
            <span className="flex items-center gap-1 font-semibold" style={{ color: tierConfig.color }}>
              <Zap className="h-3.5 w-3.5" /> {completedCount * 100} XP
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </div>

      {/* Module grid */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allModules.map((mod, idx) => {
          const done = completedIds.has(mod.id)
          const isCurrent = !done && allModules
            .slice(0, idx)
            .every(m => completedIds.has(m.id))

          return (
            <Link key={mod.id} href={`/learn/${tier}/${mod.slug}`}>
              <Card
                className={`h-full cursor-pointer transition-all hover:shadow-md ${
                  done
                    ? 'bg-amber-50 border-amber-200'
                    : isCurrent
                    ? `border-2 ${tierConfig.borderClass}`
                    : ''
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {/* Module number / status indicator */}
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5"
                      style={{
                        backgroundColor: done
                          ? '#fef3c7'
                          : isCurrent
                          ? tierConfig.color + '20'
                          : '#f1f5f9',
                        color: done ? '#d97706' : isCurrent ? tierConfig.color : '#94a3b8',
                      }}
                    >
                      {done ? <Star className="h-5 w-5 fill-amber-400 text-amber-400" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-slate-400">Module {mod.order_index}</span>
                        {done && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> +100 XP
                          </Badge>
                        )}
                        {isCurrent && !done && (
                          <Badge
                            className="text-white text-xs"
                            style={{ backgroundColor: tierConfig.color }}
                          >
                            Up Next
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-800 leading-tight">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> ~{mod.estimated_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Lesson + AI Chat
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Back to dashboard */}
      <div className="mt-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-500">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
