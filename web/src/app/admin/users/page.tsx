import { createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TIER_CONFIG, type AgeTier, type Profile } from '@/types'

export default async function AdminUsersPage() {
  const supabase = await createServiceClient()

  const [{ data: profiles }, { data: subscriptions }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('subscriptions').select('user_id, status, plan'),
  ])

  const subMap = new Map(
    (subscriptions || []).map(s => [s.user_id, s])
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Showing {profiles?.length ?? 0} most recent users.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Name / Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Tier</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(profiles || []).map((profile: Profile) => {
                  const sub = subMap.get(profile.id)
                  const tierCfg = TIER_CONFIG[profile.age_tier as AgeTier]
                  const isSubscribed = sub?.status === 'active' || sub?.status === 'trialing'

                  return (
                    <tr key={profile.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">
                          {profile.full_name || '—'}
                        </p>
                        <p className="text-xs text-slate-400">{profile.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${tierCfg?.textClass} ${tierCfg?.borderClass}`}
                        >
                          {tierCfg?.label ?? profile.age_tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {isSubscribed ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            {sub?.plan ?? 'pro'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-500">
                            free
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {profile.role === 'admin' ? (
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                            admin
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">student</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(profile.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(!profiles || profiles.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-8">No users yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
