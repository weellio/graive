import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { moduleId } = await req.json()
  if (!moduleId) {
    return NextResponse.json({ error: 'moduleId required' }, { status: 400 })
  }

  const { error } = await supabase.from('progress').upsert({
    user_id: user.id,
    module_id: moduleId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tier = searchParams.get('tier')

  let query = supabase.from('progress').select('module_id').eq('user_id', user.id)

  if (tier) {
    // Join with modules to filter by tier
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('tier_slug', tier)

    const moduleIds = (modules || []).map(m => m.id)
    query = query.in('module_id', moduleIds)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ completedModuleIds: (data || []).map(p => p.module_id) })
}
