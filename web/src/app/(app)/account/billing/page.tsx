import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, createCustomerPortalSession } from '@/lib/stripe/client'
import { getSiteSettings } from '@/lib/config/site'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Lock, Zap } from 'lucide-react'
import type { Profile, Subscription } from '@/types'
import { headers } from 'next/headers'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams
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
    const supabase2 = await createClient()
    const { data: { user: u } } = await supabase2.auth.getUser()
    if (!u) redirect('/auth/signin')
    const { data: p } = await supabase2.from('profiles').select('stripe_customer_id').eq('id', u.id).single()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      p?.stripe_customer_id ?? null,
      priceId,
      u.id,
      `${appUrl}/dashboard?upgraded=1`,
      `${appUrl}/account/billing`
    )
    redirect(session.url!)
  }

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID || ''
  const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID || ''

  const features = [
    'All 4 learning tiers (Explorer → Innovator)',
    'Unlimited AI chat with age-appropriate assistant',
    'Full conversation history',
    'Progress tracking & completion badges',
    'New modules added regularly',
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing & Subscription</h1>
        <p className="text-slate-500 mt-1">Manage your plan and payment details.</p>
      </div>

      {reason === 'tier-locked' && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Lock className="h-4 w-4 flex-shrink-0" />
          This tier requires a Pro subscription. Upgrade below to unlock all content.
        </div>
      )}

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>
            {isSubscribed
              ? `Your ${(subscription as Subscription).plan} subscription is active.`
              : 'You are on the free plan.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">
                {isSubscribed ? 'Pro' : 'Free'}
              </span>
              <Badge
                className={
                  isSubscribed
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {isSubscribed ? (subscription as Subscription).status : 'Free'}
              </Badge>
            </div>
            {isSubscribed && (
              <form action={goToPortal}>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </form>
            )}
          </div>

          {isSubscribed && (subscription as Subscription).current_period_end && (
            <p className="text-sm text-slate-500">
              Renews on{' '}
              {new Date((subscription as Subscription).current_period_end!).toLocaleDateString(
                'en-GB',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {!isSubscribed && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Upgrade to Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly */}
            <Card className="border-2 border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Monthly</CardTitle>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-slate-800">£9.99</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <form action={goToCheckout}>
                  <input type="hidden" name="priceId" value={monthlyPriceId} />
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
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
                  <span className="text-3xl font-bold text-slate-800">£79.99</span>
                  <span className="text-slate-500 text-sm">/year</span>
                </div>
                <p className="text-xs text-indigo-600 font-medium">2 months free</p>
              </CardHeader>
              <CardContent>
                <form action={goToCheckout}>
                  <input type="hidden" name="priceId" value={annualPriceId} />
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Zap className="h-4 w-4 mr-2" /> Get Annual
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Features list */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-5">
              <p className="text-sm font-medium text-slate-700 mb-3">Everything in Pro:</p>
              <ul className="space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
