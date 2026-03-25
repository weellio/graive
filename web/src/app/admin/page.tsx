import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, MessageSquare, TrendingUp } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: moduleCount },
    { count: completionCount },
    { count: messageCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }).eq('enabled', true),
    supabase.from('progress').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Users', value: userCount ?? 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Modules', value: moduleCount ?? 0, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Completions', value: completionCount ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'AI Messages', value: messageCount ?? 0, icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-50' },
  ]

  // Recent activity
  const { data: recentCompletions } = await supabase
    .from('progress')
    .select('completed_at, user_id, module_id')
    .order('completed_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform statistics at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`inline-flex h-10 w-10 rounded-lg ${stat.bg} items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent completions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Module Completions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCompletions && recentCompletions.length > 0 ? (
            <div className="space-y-2">
              {recentCompletions.map((c, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-600 font-mono text-xs">{c.user_id.slice(0, 8)}…</span>
                  <span className="text-slate-400 text-xs">
                    {new Date(c.completed_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No completions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
