import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Use service client to bypass RLS — admins need to see all modules including disabled ones
  const service = await createServiceClient()
  const { data, error } = await service
    .from('modules')
    .select('*')
    .order('tier_slug')
    .order('order_index')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ modules: data ?? [] })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const ids: string[] | undefined = body?.ids

  const service = await createServiceClient()
  const query = ids?.length
    ? service.from('modules').delete().in('id', ids).select('id')
    : service.from('modules').delete().neq('id', '00000000-0000-0000-0000-000000000000').select('id')

  const { data, error } = await query
  console.log('[DELETE /api/admin/modules] deleted:', data?.length ?? 0, 'error:', error?.message ?? null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, deleted: data?.length ?? 0 })
}
