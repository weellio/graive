'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { TIER_CONFIG, type AgeTier, type Profile, type SubscriptionPlan } from '@/types'
import { Loader2 } from 'lucide-react'

interface UserRow extends Profile {
  plan: SubscriptionPlan
  sub_status: string | null
  today_messages: number
}

const PLAN_OPTIONS: { value: SubscriptionPlan; label: string; badge: string }[] = [
  { value: 'free',    label: 'Free',    badge: 'bg-muted text-muted-foreground border-border' },
  { value: 'monthly', label: 'Monthly', badge: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'annual',  label: 'Annual',  badge: 'bg-blue-100 text-blue-700 border-blue-200'   },
  { value: 'beta',    label: 'Beta',    badge: 'bg-violet-100 text-violet-700 border-violet-200' },
]

function planBadgeClass(plan: SubscriptionPlan) {
  return PLAN_OPTIONS.find(p => p.value === plan)?.badge ?? 'bg-muted text-muted-foreground'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('subscriptions').select('user_id, status, plan'),
      supabase.from('ai_usage').select('user_id, message_count').eq('date', today),
    ]).then(([{ data: profiles }, { data: subs }, { data: usageRows }]) => {
      const subMap = new Map((subs ?? []).map(s => [s.user_id, s]))
      const usageMap = new Map((usageRows ?? []).map(u => [u.user_id, u.message_count]))
      const rows: UserRow[] = (profiles ?? []).map(p => {
        const sub = subMap.get(p.id)
        const isActive = sub?.status === 'active' || sub?.status === 'trialing'
        return {
          ...p,
          plan: (isActive ? (sub?.plan ?? 'monthly') : 'free') as SubscriptionPlan,
          sub_status: sub?.status ?? null,
          today_messages: usageMap.get(p.id) ?? 0,
        }
      })
      setUsers(rows)
      setLoading(false)
    })
  }, [])

  async function changePlan(userId: string, plan: SubscriptionPlan) {
    setUpdating(userId)
    try {
      const res = await fetch('/api/admin/users/plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan } : u))
      toast.success(`Plan updated to ${plan}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update plan')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground py-8 text-center">Loading users…</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {users.length} user{users.length !== 1 ? 's' : ''}. Use the Plan column to manually grant or revoke access.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name / Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tier</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">AI today</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const tierCfg = TIER_CONFIG[user.age_tier as AgeTier]
                  const busy = updating === user.id

                  return (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-muted">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{user.full_name || '—'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${tierCfg?.textClass} ${tierCfg?.borderClass}`}
                        >
                          {tierCfg?.label ?? user.age_tier}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Select
                              value={user.plan}
                              onValueChange={v => changePlan(user.id, v as SubscriptionPlan)}
                            >
                              <SelectTrigger className="h-7 w-28 text-xs border-0 p-0 shadow-none focus:ring-0">
                                <Badge className={`text-xs cursor-pointer ${planBadgeClass(user.plan)}`}>
                                  {user.plan}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {PLAN_OPTIONS.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    <Badge className={`text-xs mr-1 ${opt.badge}`}>{opt.label}</Badge>
                                    {opt.value === 'beta' && (
                                      <span className="text-muted-foreground text-xs">— full access, no Stripe</span>
                                    )}
                                    {opt.value === 'free' && (
                                      <span className="text-muted-foreground text-xs">— Explorer only, rate-limited</span>
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {user.role === 'admin' ? (
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">admin</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">student</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${user.today_messages > 0 ? 'text-foreground' : 'text-slate-300'}`}>
                          {user.today_messages}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No users yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
