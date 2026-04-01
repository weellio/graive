import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/api/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  const supabase = await createServiceClient()
  // Allow lookup by slug or UUID
  const isUuid = /^[0-9a-f-]{36}$/.test(id)
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ course: data })
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  delete body.id

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('courses')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data })
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  const supabase = await createServiceClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
