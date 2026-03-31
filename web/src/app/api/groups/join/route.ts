import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code }: { code: string } = await req.json()
  if (!code) return NextResponse.json({ error: 'Missing invite code' }, { status: 400 })

  // Look up group
  const { data: group, error } = await supabase
    .from('groups')
    .select('id, name, plan, max_members, status, owner_id')
    .eq('invite_code', code.toUpperCase())
    .single()

  if (error || !group) {
    return NextResponse.json({ error: 'Invite code not found' }, { status: 404 })
  }
  if (group.status !== 'active') {
    return NextResponse.json({ error: 'This group\'s subscription is not active' }, { status: 403 })
  }
  if (group.owner_id === user.id) {
    return NextResponse.json({ error: 'You are the owner of this group' }, { status: 400 })
  }

  // Check capacity
  const { count: memberCount } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', group.id)

  if ((memberCount ?? 0) >= group.max_members) {
    return NextResponse.json({ error: 'This group is full' }, { status: 400 })
  }

  // Already a member?
  const { data: existing } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', group.id)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ ok: true, alreadyMember: true })
  }

  // Add member
  const { error: insertError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Upsert a subscription row for this user so rate limiter grants paid access
  const { error: subError } = await supabase.from('subscriptions').upsert(
    {
      user_id: user.id,
      status: 'active',
      plan: group.plan,
      stripe_subscription_id: null,
      current_period_end: null,
    },
    { onConflict: 'user_id' }
  )

  if (subError) {
    console.error('[groups/join] subscription upsert failed:', subError.message)
  }

  return NextResponse.json({ ok: true })
}
