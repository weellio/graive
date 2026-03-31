import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.warn('[stripe webhook] no profile found for customer', customerId)
          break
        }

        const priceId = sub.items.data[0]?.price?.id
        const plan = resolvePlan(priceId)

        await supabase.from('subscriptions').upsert(
          {
            user_id: profile.id,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId ?? null,
            status: sub.status,
            plan,
            current_period_end: sub.items.data[0]?.current_period_end
              ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('subscriptions')
            .update({ status: 'canceled', updated_at: new Date().toISOString() })
            .eq('user_id', profile.id)

          // Deactivate group if this was a group plan
          await supabase
            .from('groups')
            .update({ status: 'inactive' })
            .eq('owner_id', profile.id)
            .eq('stripe_subscription_id', sub.id)
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.customer && session.client_reference_id) {
          const userId = session.client_reference_id
          const customerId = session.customer as string

          // Link stripe customer id to user profile
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
            .eq('id', userId)

          // If this is a group plan, create the group and activate it
          const priceId = session.metadata?.price_id ?? (session as unknown as { line_items?: { data?: { price?: { id?: string } }[] } }).line_items?.data?.[0]?.price?.id
          const plan = resolvePlan(priceId)

          if (plan === 'family' || plan === 'classroom') {
            const maxMembers = plan === 'family' ? 4 : 30
            const groupName = session.metadata?.group_name ?? (plan === 'family' ? 'My Family' : 'My Classroom')

            // Check if user already has a group
            const { data: existingGroup } = await supabase
              .from('groups')
              .select('id')
              .eq('owner_id', userId)
              .single()

            if (existingGroup) {
              // Reactivate
              await supabase
                .from('groups')
                .update({ status: 'active', stripe_subscription_id: session.subscription as string })
                .eq('id', existingGroup.id)
            } else {
              await supabase.from('groups').insert({
                owner_id: userId,
                name: groupName,
                plan,
                max_members: maxMembers,
                stripe_subscription_id: session.subscription as string,
                status: 'active',
              })
            }
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('user_id', profile.id)
        }
        break
      }

      default:
        // Unhandled event type — that's fine
        break
    }
  } catch (err) {
    console.error('[stripe webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

function resolvePlan(priceId?: string): 'monthly' | 'annual' | 'family' | 'classroom' | 'free' {
  if (!priceId) return 'free'
  if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) return 'annual'
  if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) return 'monthly'
  if (priceId === process.env.STRIPE_FAMILY_PRICE_ID) return 'family'
  if (priceId === process.env.STRIPE_CLASSROOM_PRICE_ID) return 'classroom'
  return 'monthly'
}
