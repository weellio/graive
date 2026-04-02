'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface GroupInfo {
  id: string
  name: string
  plan: 'family' | 'classroom'
  max_members: number
  member_count: number
  status: string
}

export default function JoinGroupPage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [group, setGroup] = useState<GroupInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [alreadyMember, setAlreadyMember] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      setUser(u)

      const res = await fetch(`/api/groups/info?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Invalid invite code')
      } else {
        setGroup(data.group)
        setAlreadyMember(data.alreadyMember ?? false)
      }
      setLoading(false)
    }
    load()
  }, [code])

  async function handleJoin() {
    if (!user) {
      router.push(`/auth/signin?next=/join/${code}`)
      return
    }
    setJoining(true)
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to join group')
      setJoining(false)
    } else {
      toast.success(`Joined ${group?.name}! Welcome aboard 🎉`)
      router.push('/dashboard')
    }
  }

  const planIcon = group?.plan === 'classroom' ? GraduationCap : Users
  const planColor = group?.plan === 'classroom' ? 'text-violet-600' : 'text-teal-600'
  const planBg = group?.plan === 'classroom' ? 'bg-violet-50 border-violet-200' : 'bg-teal-50 border-teal-200'
  const planLabel = group?.plan === 'classroom' ? 'Classroom' : 'Family'
  const spotsLeft = group ? group.max_members - group.member_count : 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-10 text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
              <p className="font-semibold text-foreground">Invalid Invite Code</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : group ? (
          <Card className={`border-2 ${planBg}`}>
            <CardHeader className="text-center pb-3">
              <div className={`inline-flex h-14 w-14 rounded-2xl items-center justify-center mx-auto mb-3 ${planBg}`}>
                {group.plan === 'classroom'
                  ? <GraduationCap className={`h-7 w-7 ${planColor}`} />
                  : <Users className={`h-7 w-7 ${planColor}`} />
                }
              </div>
              <Badge className={`mx-auto text-xs mb-2 ${group.plan === 'classroom' ? 'bg-violet-100 text-violet-700' : 'bg-teal-100 text-teal-700'}`}>
                {planLabel} Plan
              </Badge>
              <CardTitle className="text-xl">{group.name}</CardTitle>
              <CardDescription>
                You've been invited to join this {planLabel.toLowerCase()} group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm bg-card/70 rounded-xl px-4 py-3">
                <span className="text-muted-foreground">Members</span>
                <span className="font-semibold text-foreground">
                  {group.member_count} / {group.max_members}
                  {spotsLeft <= 3 && spotsLeft > 0 && (
                    <span className="ml-2 text-amber-600 text-xs">({spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left)</span>
                  )}
                </span>
              </div>

              {alreadyMember ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  You're already a member of this group.
                </div>
              ) : spotsLeft <= 0 ? (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  This group is full.
                </div>
              ) : group.status !== 'active' ? (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  This group's subscription is not yet active.
                </div>
              ) : null}

              {!alreadyMember && spotsLeft > 0 && group.status === 'active' && (
                <>
                  {!user && (
                    <p className="text-sm text-muted-foreground text-center">
                      You'll need to sign in or create an account first.
                    </p>
                  )}
                  <Button
                    className="w-full"
                    style={{ backgroundColor: group.plan === 'classroom' ? '#7c3aed' : '#0d9488' }}
                    onClick={handleJoin}
                    disabled={joining}
                  >
                    {joining ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {user ? `Join ${group.name}` : 'Sign in to Join'}
                  </Button>
                </>
              )}

              {alreadyMember && (
                <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
