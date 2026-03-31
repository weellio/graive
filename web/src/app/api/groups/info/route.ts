import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: group, error } = await supabase
    .from('groups')
    .select('id, name, plan, max_members, status')
    .eq('invite_code', code.toUpperCase())
    .single()

  if (error || !group) {
    return NextResponse.json({ error: 'Invite code not found' }, { status: 404 })
  }

  // Count current members
  const { count: memberCount } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', group.id)

  // Check if current user is already a member
  let alreadyMember = false
  if (user) {
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()
    alreadyMember = !!existing
  }

  return NextResponse.json({
    group: { ...group, member_count: memberCount ?? 0 },
    alreadyMember,
  })
}
