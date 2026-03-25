import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { SubscriptionPlan } from '@/types'

export async function PATCH(req: NextRequest) {
  // Verify caller is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, plan }: { userId: string; plan: SubscriptionPlan } = await req.json()
  if (!userId || !plan) return NextResponse.json({ error: 'userId and plan required' }, { status: 400 })

  // Use service client to bypass RLS when writing other users' subscriptions
  const service = await createServiceClient()

  const newStatus = plan === 'free' ? 'inactive' : 'active'
  const periodEnd = (plan !== 'free' && plan !== 'beta')
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null

  // Check if a subscription row already exists for this user
  const { data: existing } = await service
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { error } = await service
      .from('subscriptions')
      .update({
        status: newStatus,
        plan,
        stripe_subscription_id: null,
        stripe_price_id: null,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await service
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: newStatus,
        plan,
        stripe_subscription_id: null,
        stripe_price_id: null,
        current_period_end: periodEnd,
      })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
