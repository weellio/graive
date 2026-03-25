import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Lock, Star, ChevronRight, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: modules }, { data: progressRows }, { data: subscription }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('modules').select('*').eq('enabled', true).order('order_index'),
      supabase.from('progress').select('module_id').eq('user_id', user.id),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    ])

  const completedIds = new Set((progressRows || []).map(p => p.module_id))
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing'
  const userTier = profile?.age_tier as AgeTier || 'explorer'

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator']
  const modulesByTier = tiers.reduce<Record<AgeTier, Module[]>>((acc, t) => {
    acc[t] = (modules || []).filter(m => m.tier_slug === t) as Module[]
    return acc
  }, {} as Record<AgeTier, Module[]>)

  const userModules = modulesByTier[userTier]
  const completedCount = userModules.filter(m => completedIds.has(m.id)).length
  const progressPct = userModules.length ? Math.round((completedCount / userModules.length) * 100) : 0

  const tierCfg = TIER_CONFIG[userTier]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className={`rounded-2xl p-6 ${tierCfg.bgClass} border ${tierCfg.borderClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p className={`mt-1 font-medium ${tierCfg.textClass}`}>
              {tierCfg.label} Level · {tierCfg.ageRange} · {tierCfg.theme}
            </p>
          </div>
          <Link href={`/learn/${userTier}`}>
            <Button style={{ backgroundColor: tierCfg.color }}>
              Continue Learning <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>{completedCount} of {userModules.length} modules complete</span>
            <span className="flex items-center gap-1 font-semibold" style={{ color: tierCfg.color }}>
              <Zap className="h-3.5 w-3.5" />
              {completedCount * 100} XP earned
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </div>

      {/* All tiers overview */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">All Learning Levels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(tier => {
            const cfg = TIER_CONFIG[tier]
            const tierMods = modulesByTier[tier]
            const done = tierMods.filter(m => completedIds.has(m.id)).length
            const isLocked = !cfg.free && !isSubscribed && tier !== userTier
            const isCurrent = tier === userTier

            return (
              <Card
                key={tier}
                className={`relative overflow-hidden transition-all ${
                  isCurrent ? `border-2 ${cfg.borderClass}` : ''
                } ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cfg.label}</CardTitle>
                      <CardDescription className="text-xs">{cfg.ageRange}</CardDescription>
                    </div>
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-slate-400" />
                    ) : isCurrent ? (
                      <Badge style={{ backgroundColor: cfg.color }} className="text-white text-xs">
                        Current
                      </Badge>
                    ) : cfg.free ? (
                      <Badge variant="outline" className="text-xs">Free</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500 mb-3">{cfg.theme}</p>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{done}/{tierMods.length} modules</span>
                  </div>
                  <Progress value={tierMods.length ? (done / tierMods.length) * 100 : 0} className="h-1.5" />
                  <div className="mt-3">
                    {isLocked ? (
                      <Link href="/account/billing">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Unlock with Pro
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/learn/${tier}`}>
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          {done > 0 ? 'Continue' : 'Start'} <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent modules */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userModules.map(mod => {
            const done = completedIds.has(mod.id)
            return (
              <Link key={mod.id} href={`/learn/${userTier}/${mod.slug}`}>
                <Card className={`h-full cursor-pointer transition-all hover:shadow-md ${done ? 'bg-amber-50 border-amber-200' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-400">Module {mod.order_index}</span>
                          {done && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{mod.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
                      </div>
                      <BookOpen className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>~{mod.estimated_minutes} min</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
