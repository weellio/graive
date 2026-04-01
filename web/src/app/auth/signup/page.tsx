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

const TIERS: AgeTier[] = ['explorer', 'builder', 'thinker', 'innovator', 'creator']

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [ageTier, setAgeTier] = useState<AgeTier>('explorer')
  const [parentEmail, setParentEmail] = useState('')
  const [parentConsent, setParentConsent] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Explorer = ages 10–11, Builder = 12–13: require parent email + consent
  const needsParent = ageTier === 'explorer' || ageTier === 'builder'

  function canSubmit() {
    if (!fullName || !email || !password) return false
    if (needsParent && (!parentEmail || !parentConsent)) return false
    if (!termsAccepted) return false
    return true
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          age_tier: ageTier,
          parent_email: needsParent ? parentEmail : null,
        },
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      // Fire-and-forget parent notification — don't block signup on email delivery
      if (needsParent && parentEmail) {
        fetch('/api/auth/notify-parent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childName: fullName, childEmail: email, parentEmail, tier: ageTier }),
        }).catch(() => {/* silent — email is informational only */})
      }
      toast.success('Account created! Check your email to confirm.')
      router.push('/auth/confirm')
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
                      onClick={() => {
                        setAgeTier(tier)
                        setParentConsent(false)
                        setParentEmail('')
                      }}
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

            {needsParent && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                <p className="text-sm font-medium text-amber-800">
                  Parent or guardian required for ages 10–13
                </p>
                <div className="space-y-1">
                  <Label htmlFor="parent-email" className="text-sm">Parent / guardian email</Label>
                  <Input
                    id="parent-email"
                    type="email"
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={e => setParentEmail(e.target.value)}
                    required={needsParent}
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 shrink-0"
                    checked={parentConsent}
                    onChange={e => setParentConsent(e.target.checked)}
                    required
                  />
                  <span className="text-xs text-amber-700">
                    I am the parent or guardian of this learner, or a parent/guardian has given permission for this account to be created. I understand my child will interact with an AI assistant as part of this course.
                  </span>
                </label>
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 shrink-0"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                required
              />
              <span className="text-xs text-slate-500">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-slate-700" target="_blank">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-slate-700" target="_blank">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={loading || !canSubmit()}>
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
