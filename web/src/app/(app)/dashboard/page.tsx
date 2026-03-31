import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, type AgeTier, type Module } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Lock, Star, ChevronRight, Zap, Flame, Trophy, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: modules }, { data: progressRows }, { data: subscription }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('modules').select('*').eq('enabled', true).order('tier_slug').order('order_index'),
      supabase.from('progress').select('module_id').eq('user_id', user.id),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    ])

  // ── Streak update ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const lastActive = profile?.last_active_date as string | null
  let currentStreak = (profile?.current_streak as number) ?? 0

  if (lastActive !== today) {
    const newStreak = lastActive === yesterday ? currentStreak + 1 : 1
    const longestStreak = Math.max(newStreak, (profile?.longest_streak as number) ?? 0)
    await supabase.from('profiles').update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_active_date: today,
    }).eq('id', user.id)
    currentStreak = newStreak
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const completedIds = new Set((progressRows || []).map(p => p.module_id))
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing'
  const userTier = (profile?.age_tier as AgeTier) || 'explorer'
  const tierCfg = TIER_CONFIG[userTier]

  const tiers: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator', 'creator']
  const modulesByTier = tiers.reduce<Record<AgeTier, Module[]>>((acc, t) => {
    acc[t] = (modules || []).filter(m => m.tier_slug === t) as Module[]
    return acc
  }, {} as Record<AgeTier, Module[]>)

  const userModules = modulesByTier[userTier]
  const completedCount = userModules.filter(m => completedIds.has(m.id)).length
  const progressPct = userModules.length ? Math.round((completedCount / userModules.length) * 100) : 0
  const tierComplete = userModules.length > 0 && completedCount === userModules.length

  // First incomplete module in user's tier → direct deep-link
  const nextModule = userModules.find(m => !completedIds.has(m.id))
  const totalXP = (progressRows?.length ?? 0) * 100

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Tier complete celebration ─────────────────────────────────────── */}
      {tierComplete && (
        <div className="rounded-2xl p-6 bg-linear-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-5xl">🏆</div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-amber-900">
              You finished {tierCfg.label} level!
            </h2>
            <p className="text-amber-700 text-sm mt-0.5">
              All {userModules.length} modules complete · {completedCount * 100} XP earned
            </p>
          </div>
          <Link href={`/learn/${userTier}/certificate`}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shrink-0">
              <Trophy className="h-4 w-4" /> View Certificate
            </Button>
          </Link>
        </div>
      )}

      {/* ── Hero / progress card ──────────────────────────────────────────── */}
      <div className={`rounded-2xl p-6 ${tierCfg.bgClass} border ${tierCfg.borderClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'} 👋
              </h1>
              {/* Streak badge */}
              {currentStreak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600">{currentStreak}</span>
                  <span className="text-xs text-orange-500">day streak</span>
                </div>
              )}
            </div>
            <p className={`mt-1 font-medium ${tierCfg.textClass}`}>
              {tierCfg.label} Level · {tierCfg.ageRange} · {tierCfg.theme}
            </p>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 bg-white/60 rounded-xl px-4 py-2 border border-white/80 shrink-0">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-lg font-bold text-slate-800">{totalXP}</span>
            <span className="text-sm text-slate-500">XP</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>{completedCount} of {userModules.length} modules complete</span>
            <span className="font-medium">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </div>

      {/* ── Next Up card ──────────────────────────────────────────────────── */}
      {nextModule && !tierComplete && (
        <Link href={`/learn/${userTier}/${nextModule.slug}`}>
          <div
            className="rounded-2xl p-5 border-2 hover-lift cursor-pointer flex items-center gap-4"
            style={{ borderColor: tierCfg.color, backgroundColor: tierCfg.color + '0d' }}
          >
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: tierCfg.color }}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: tierCfg.color }}>
                Up Next — Module {nextModule.order_index}
              </p>
              <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{nextModule.title}</h3>
              {nextModule.description && (
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{nextModule.description}</p>
              )}
            </div>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: tierCfg.color }}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
        </Link>
      )}

      {/* ── All tiers overview ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">All Learning Levels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(tier => {
            const cfg = TIER_CONFIG[tier]
            const tierMods = modulesByTier[tier]
            const done = tierMods.filter(m => completedIds.has(m.id)).length
            const isLocked = !cfg.free && !isSubscribed && tier !== userTier
            const isCurrent = tier === userTier
            const isAllDone = tierMods.length > 0 && done === tierMods.length

            return (
              <Card
                key={tier}
                className={`relative overflow-hidden ${
                  isCurrent ? `border-2 ${cfg.borderClass}` : ''
                } ${isLocked ? 'opacity-60' : 'hover-lift'}`}
              >
                {isAllDone && (
                  <div className="absolute top-2 right-2 text-lg">🏆</div>
                )}
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
                    {done > 0 && <span className="font-medium" style={{ color: cfg.color }}>{done * 100} XP</span>}
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
                          {isAllDone ? 'Review' : done > 0 ? 'Continue' : 'Start'}
                          <ChevronRight className="h-3 w-3 ml-1" />
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

      {/* ── Your modules grid ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userModules.map(mod => {
            const done = completedIds.has(mod.id)
            const isNext = mod.id === nextModule?.id
            return (
              <Link key={mod.id} href={`/learn/${userTier}/${mod.slug}`}>
                <Card className={`h-full hover-lift ${
                  done ? 'bg-amber-50 border-amber-200' :
                  isNext ? `border-2` : ''
                }`}
                style={isNext ? { borderColor: tierCfg.color } : undefined}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-400">Module {mod.order_index}</span>
                          {done && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
                          {isNext && !done && (
                            <Badge className="text-white text-xs" style={{ backgroundColor: tierCfg.color }}>
                              Up Next
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{mod.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
                      </div>
                      <BookOpen className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>~{mod.estimated_minutes} min</span>
                      {done && <span className="text-amber-500 font-medium">+100 XP ⭐</span>}
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
