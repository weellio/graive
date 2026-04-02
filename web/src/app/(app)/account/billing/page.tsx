import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, createCustomerPortalSession } from '@/lib/stripe/client'
import { getSiteSettings } from '@/lib/config/site'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock, Zap, Users, GraduationCap } from 'lucide-react'
import type { Profile, Subscription } from '@/types'
import { headers } from 'next/headers'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; error?: string }>
}) {
  const { reason, error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const [{ data: profile }, { data: subscription }, settings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    getSiteSettings(),
  ])

  const isSubscribed =
    subscription?.status === 'active' || subscription?.status === 'trialing'

  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  async function goToPortal() {
    'use server'
    const supabase2 = await createClient()
    const { data: { user: u } } = await supabase2.auth.getUser()
    if (!u) redirect('/auth/signin')
    const { data: p } = await supabase2.from('profiles').select('stripe_customer_id').eq('id', u.id).single()
    if (!p?.stripe_customer_id) redirect('/account/billing')
    const session = await createCustomerPortalSession(
      p.stripe_customer_id,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/billing`
    )
    redirect(session.url)
  }

  async function goToCheckout(formData: FormData) {
    'use server'
    const priceId = formData.get('priceId') as string
    if (!priceId) redirect('/account/billing?error=no_price')
    const supabase2 = await createClient()
    const { data: { user: u } } = await supabase2.auth.getUser()
    if (!u) redirect('/auth/signin')
    const { data: p } = await supabase2.from('profiles').select('stripe_customer_id').eq('id', u.id).single()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    try {
      const session = await createCheckoutSession(
        p?.stripe_customer_id ?? null,
        priceId,
        u.id,
        `${appUrl}/dashboard?upgraded=1`,
        `${appUrl}/account/billing`
      )
      if (!session.url) redirect('/account/billing?error=no_url')
      redirect(session.url)
    } catch (err) {
      const msg = err instanceof Error ? encodeURIComponent(err.message) : 'stripe_error'
      redirect(`/account/billing?error=${msg}`)
    }
  }

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID || ''
  const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID || ''
  const familyPriceId = process.env.STRIPE_FAMILY_PRICE_ID || ''
  const classroomPriceId = process.env.STRIPE_CLASSROOM_PRICE_ID || ''

  const proFeatures = [
    'All 4 learning tiers (Explorer → Innovator)',
    'Up to 200 AI messages per day',
    'Full conversation history',
    'Progress tracking & XP',
    'Completion certificates',
    'New modules added regularly',
  ]

  const groupFeatures = [
    'Everything in Pro for every member',
    'One billing account for the group',
    'Join with a shared invite code',
    'Admin sees group member progress',
    'Priority support',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and payment details.</p>
      </div>

      {reason === 'tier-locked' && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Lock className="h-4 w-4 shrink-0" />
          This tier requires a Pro subscription. Upgrade below to unlock all content.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Checkout failed</p>
          <p className="mt-0.5 text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>
            {isSubscribed
              ? `Your ${(subscription as Subscription).plan} subscription is active.`
              : 'You are on the free plan — Explorer tier only.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {isSubscribed ? (subscription as Subscription).plan : 'Free'}
              </span>
              <Badge
                className={
                  isSubscribed
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-muted text-muted-foreground border-border'
                }
              >
                {isSubscribed ? (subscription as Subscription).status : 'free'}
              </Badge>
            </div>
            {isSubscribed && (
              <form action={goToPortal}>
                <Button variant="outline" size="sm">Manage Subscription</Button>
              </form>
            )}
          </div>
          {isSubscribed && (subscription as Subscription).current_period_end && (
            <p className="text-sm text-muted-foreground">
              Renews on{' '}
              {new Date((subscription as Subscription).current_period_end!).toLocaleDateString(
                'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {!isSubscribed && (
        <>
          {/* ── Individual plans ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Individual Plans</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly */}
              <Card className="border-2 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Monthly</CardTitle>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">$24.99</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">1 learner · cancel anytime</p>
                </CardHeader>
                <CardContent>
                  <form action={goToCheckout}>
                    <input type="hidden" name="priceId" value={monthlyPriceId} />
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={!monthlyPriceId}>
                      <Zap className="h-4 w-4 mr-2" /> Get Started
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Annual */}
              <Card className="border-2 border-indigo-500 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-indigo-600 text-white text-xs">Best Value</Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Annual</CardTitle>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">$199.99</span>
                    <span className="text-muted-foreground text-sm">/year</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium">Save 33% · 1 learner</p>
                </CardHeader>
                <CardContent>
                  <form action={goToCheckout}>
                    <input type="hidden" name="priceId" value={annualPriceId} />
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={!annualPriceId}>
                      <Zap className="h-4 w-4 mr-2" /> Get Annual
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Pro features */}
            <Card className="bg-muted border-border">
              <CardContent className="pt-5">
                <p className="text-sm font-medium text-foreground mb-3">Everything in Pro:</p>
                <ul className="space-y-2">
                  {proFeatures.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* ── Group plans ───────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Group Plans</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                One subscription covers multiple learners — perfect for families and classrooms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Family */}
              <Card className="border-2 border-teal-400 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-teal-500 text-white text-xs">Family</Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-teal-600" />
                    <CardTitle className="text-base">Family Plan</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">$59.99</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-xs text-teal-600 font-medium">Up to 4 learners · ~$15/learner</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />Parent dashboard to track kids' progress</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />Each child gets their own account</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />All Pro features for every member</li>
                  </ul>
                  <form action={goToCheckout}>
                    <input type="hidden" name="priceId" value={familyPriceId} />
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled={!familyPriceId}>
                      <Users className="h-4 w-4 mr-2" /> Get Family Plan
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Classroom */}
              <Card className="border-2 border-violet-400 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-violet-600 text-white text-xs">Classroom</Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-5 w-5 text-violet-600" />
                    <CardTitle className="text-base">Classroom Plan</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">$149.99</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-xs text-violet-600 font-medium">Up to 30 students · ~$5/student</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0" />Teacher dashboard with class roster</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0" />Simple join code for students</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0" />All Pro features for every student</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0" />Priority support</li>
                  </ul>
                  <form action={goToCheckout}>
                    <input type="hidden" name="priceId" value={classroomPriceId} />
                    <Button className="w-full bg-violet-600 hover:bg-violet-700" disabled={!classroomPriceId}>
                      <GraduationCap className="h-4 w-4 mr-2" /> Get Classroom Plan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Group features */}
            <Card className="bg-muted border-border">
              <CardContent className="pt-5">
                <p className="text-sm font-medium text-foreground mb-3">Everything in Group plans:</p>
                <ul className="space-y-2">
                  {groupFeatures.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
