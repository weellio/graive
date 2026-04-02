import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, GraduationCap, Copy, Star, Zap, Flame } from 'lucide-react'
import { TIER_CONFIG, type AgeTier } from '@/types'
import { CopyCodeButton } from './_components/CopyCodeButton'

export default async function GroupDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  // Find group owned by this user
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // Or find group this user belongs to as a member
  const { data: membership } = !group
    ? await supabase
        .from('group_members')
        .select('group_id, groups(*)')
        .eq('user_id', user.id)
        .single()
    : { data: null }

  const activeGroup = group ?? (membership?.groups as typeof group ?? null)

  if (!activeGroup) {
    redirect('/account/billing')
  }

  const isOwner = activeGroup.owner_id === user.id
  const today = new Date().toISOString().slice(0, 10)

  // Get all members with their profiles and progress
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, joined_at')
    .eq('group_id', activeGroup.id)

  const memberIds = (members ?? []).map(m => m.user_id)

  // Include owner in member list
  const allIds = isOwner ? [user.id, ...memberIds] : memberIds

  const [
    { data: profiles },
    { data: progressRows },
    { data: usageToday },
    { data: groupUsage },
    { data: modules },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, age_tier, current_streak').in('id', allIds),
    supabase.from('progress').select('user_id, module_id').in('user_id', allIds),
    supabase.from('ai_usage').select('user_id, message_count').in('user_id', allIds).eq('date', today),
    supabase.from('group_ai_usage').select('message_count').eq('group_id', activeGroup.id).eq('date', today).single(),
    supabase.from('modules').select('id').eq('enabled', true),
  ])

  const totalModules = (modules ?? []).length
  const progressByUser = (progressRows ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.user_id] = (acc[r.user_id] ?? 0) + 1
    return acc
  }, {})
  const usageByUser = (usageToday ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.user_id] = r.message_count ?? 0
    return acc
  }, {})

  const memberRows = (profiles ?? []).map(p => ({
    ...p,
    completions: progressByUser[p.id] ?? 0,
    aiToday: usageByUser[p.id] ?? 0,
    isOwner: p.id === activeGroup.owner_id,
  })).sort((a, b) => b.completions - a.completions)

  const isClassroom = activeGroup.plan === 'classroom'
  const groupMsgsToday = groupUsage?.message_count ?? 0
  const groupLimit = isClassroom ? 500 : activeGroup.max_members * 200
  const spotsUsed = memberRows.length
  const spotsLeft = activeGroup.max_members - spotsUsed

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isClassroom
              ? <GraduationCap className="h-5 w-5 text-violet-600" />
              : <Users className="h-5 w-5 text-teal-600" />
            }
            <h1 className="text-2xl font-bold text-foreground">{activeGroup.name}</h1>
            <Badge className={isClassroom
              ? 'bg-violet-100 text-violet-700 border-violet-200'
              : 'bg-teal-100 text-teal-700 border-teal-200'
            }>
              {isClassroom ? 'Classroom' : 'Family'}
            </Badge>
            <Badge className={activeGroup.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-muted text-muted-foreground'
            }>
              {activeGroup.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {spotsUsed} / {activeGroup.max_members} members · {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Invite code:</div>
            <code className="font-mono font-bold text-lg tracking-widest px-3 py-1 bg-muted rounded-lg">
              {activeGroup.invite_code}
            </code>
            <CopyCodeButton code={activeGroup.invite_code} />
          </div>
        )}
      </div>

      {/* Share link banner */}
      {isOwner && (
        <Card className={`border ${isClassroom ? 'border-violet-200 bg-violet-50' : 'border-teal-200 bg-teal-50'}`}>
          <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-0.5">
                Share this link with your {isClassroom ? 'students' : 'family members'}:
              </p>
              <code className="text-xs text-muted-foreground break-all">
                {process.env.NEXT_PUBLIC_APP_URL || 'https://graive.com'}/join/{activeGroup.invite_code}
              </code>
            </div>
            <CopyCodeButton
              code={`${process.env.NEXT_PUBLIC_APP_URL || 'https://graive.com'}/join/${activeGroup.invite_code}`}
              label="Copy Link"
            />
          </CardContent>
        </Card>
      )}

      {/* Group AI usage (classroom only) */}
      {isClassroom && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Group AI Usage Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
              <span>{groupMsgsToday} of {groupLimit} shared messages used</span>
              <span className="font-medium">{Math.round((groupMsgsToday / groupLimit) * 100)}%</span>
            </div>
            <Progress value={(groupMsgsToday / groupLimit) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Shared pool resets at midnight · 500 msgs/day for the whole class</p>
          </CardContent>
        </Card>
      )}

      {/* Member table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isClassroom ? 'Students' : 'Family Members'} ({memberRows.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tier</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Progress</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Streak</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">AI today</th>
                </tr>
              </thead>
              <tbody>
                {memberRows.map(m => {
                  const tierCfg = TIER_CONFIG[m.age_tier as AgeTier]
                  const pct = totalModules ? Math.round((m.completions / totalModules) * 100) : 0
                  return (
                    <tr key={m.id} className="border-b border-slate-50 hover:bg-muted">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{m.full_name || '—'}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                        {m.isOwner && (
                          <Badge variant="outline" className="text-xs mt-0.5">
                            {isClassroom ? 'Teacher' : 'Parent'}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${tierCfg?.textClass} ${tierCfg?.borderClass}`}>
                          {tierCfg?.label ?? m.age_tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 min-w-32">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground shrink-0">{m.completions} <Star className="h-3 w-3 inline fill-amber-400 text-amber-400" /></span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.completions * 100} XP</p>
                      </td>
                      <td className="px-4 py-3">
                        {(m.current_streak ?? 0) > 0 ? (
                          <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm">
                            <Flame className="h-3.5 w-3.5" />{m.current_streak}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Zap className="h-3.5 w-3.5 text-indigo-400" />{m.aiToday}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {memberRows.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No members yet. Share the invite link above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
