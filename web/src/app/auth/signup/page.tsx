'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TIER_CONFIG, type AgeTier } from '@/types'
import { toast } from 'sonner'

const TIERS: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator']

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [ageTier, setAgeTier] = useState<AgeTier>('explorer')
  const [parentEmail, setParentEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const needsParentEmail = ageTier === 'explorer' || ageTier === 'builder'

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          age_tier: ageTier,
          parent_email: needsParentEmail ? parentEmail : null,
        },
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Account created! Check your email to confirm.')
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Start learning</CardTitle>
          <CardDescription>Create your free account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                type="text"
                placeholder="First name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Your age group</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIERS.map(tier => {
                  const cfg = TIER_CONFIG[tier]
                  const active = ageTier === tier
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setAgeTier(tier)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        active
                          ? `${cfg.borderClass} ${cfg.bgClass}`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`font-semibold text-sm ${active ? cfg.textClass : 'text-slate-700'}`}>
                        {cfg.label} {cfg.free && <span className="text-xs font-normal">(Free)</span>}
                      </div>
                      <div className="text-xs text-slate-500">{cfg.ageRange}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {needsParentEmail && (
              <div className="space-y-2">
                <Label htmlFor="parent-email">Parent or guardian email</Label>
                <Input
                  id="parent-email"
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Recommended for under-13 learners so a parent can stay informed.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account'}
            </Button>

            {ageTier !== 'explorer' && (
              <p className="text-xs text-center text-slate-500">
                The {TIER_CONFIG[ageTier].label} tier requires a subscription after sign-up.
              </p>
            )}
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
