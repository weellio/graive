import { createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, MessageSquare, TrendingUp, Zap, Flame } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createServiceClient()

  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()

  const [
    { count: userCount },
    { count: moduleCount },
    { count: completionCount },
    { data: usageToday },
    { count: completionsThisWeek },
    { data: subs },
    { data: newUsers },
    { data: topModulesRaw },
    { data: recentCompletions },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }).eq('enabled', true),
    supabase.from('progress').select('*', { count: 'exact', head: true }),
    supabase.from('ai_usage').select('user_id, message_count').eq('date', today),
    supabase.from('progress').select('*', { count: 'exact', head: true }).gte('completed_at', weekAgo),
    supabase.from('subscriptions').select('status, plan'),
    supabase.from('profiles').select('id, created_at').gte('created_at', weekAgo),
    // Top modules by completion count — fetch all progress rows and group client-side
    supabase.from('progress').select('module_id'),
    supabase.from('progress')
      .select('completed_at, user_id, module_id, modules(title)')
      .order('completed_at', { ascending: false })
      .limit(10),
  ])

  const activeToday = (usageToday ?? []).length
  const msgsToday = (usageToday ?? []).reduce((s, r) => s + (r.message_count ?? 0), 0)
  const paidCount = (subs ?? []).filter(s => s.status === 'active' || s.status === 'trialing').length
  const newUsersCount = (newUsers ?? []).length

  // Top 5 modules by completion count
  const modCounts: Record<string, number> = {}
  for (const r of topModulesRaw ?? []) {
    modCounts[r.module_id] = (modCounts[r.module_id] ?? 0) + 1
  }
  const topModuleIds = Object.entries(modCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }))

  // Resolve module titles for top modules
  const { data: topModuleData } = topModuleIds.length
    ? await supabase
        .from('modules')
        .select('id, title, tier_slug')
        .in('id', topModuleIds.map(m => m.id))
    : { data: [] }

  const topModules = topModuleIds.map(({ id, count }) => ({
    count,
    ...((topModuleData ?? []).find(m => m.id === id) ?? { id, title: id.slice(0, 8), tier_slug: '' }),
  }))

  const stats = [
    { label: 'Total Users',     value: userCount ?? 0,       icon: Users,         color: 'text-indigo-600', bg: 'bg-indigo-50',  sub: `+${newUsersCount} this week` },
    { label: 'Paid',            value: paidCount,             icon: Zap,           color: 'text-green-600',  bg: 'bg-green-50',   sub: `${userCount ? Math.round((paidCount / userCount) * 100) : 0}% conversion` },
    { label: 'Active Today',    value: activeToday,           icon: Flame,         color: 'text-orange-500', bg: 'bg-orange-50',  sub: `${msgsToday} AI msgs` },
    { label: 'Active Modules',  value: moduleCount ?? 0,      icon: BookOpen,      color: 'text-teal-600',   bg: 'bg-teal-50',    sub: '' },
    { label: 'Completions',     value: completionCount ?? 0,  icon: TrendingUp,    color: 'text-violet-600', bg: 'bg-violet-50',  sub: `+${completionsThisWeek ?? 0} this week` },
    { label: 'AI Messages',     value: msgsToday,             icon: MessageSquare, color: 'text-sky-600',    bg: 'bg-sky-50',     sub: 'today' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform statistics at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`inline-flex h-10 w-10 rounded-lg ${stat.bg} items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              {stat.sub && <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top modules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Modules by Completions</CardTitle>
          </CardHeader>
          <CardContent>
            {topModules.length > 0 ? (
              <div className="space-y-3">
                {topModules.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-400"
                          style={{ width: `${Math.round((m.count / (topModules[0]?.count ?? 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{m.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No completions yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent completions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Completions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCompletions && recentCompletions.length > 0 ? (
              <div className="space-y-1">
                {recentCompletions.map((c, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                    <span className="text-muted-foreground font-mono text-xs truncate max-w-30">
                      {c.user_id.slice(0, 8)}…
                    </span>
                    <span className="text-muted-foreground text-xs truncate flex-1 px-2">
                      {(c as { modules?: { title?: string } }).modules?.title ?? '—'}
                    </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      {new Date(c.completed_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No completions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
