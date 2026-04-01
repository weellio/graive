import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/api/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/** GET /api/v1/modules/[id] */
export async function GET(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  const supabase = await createServiceClient()
  const { data, error } = await supabase.from('modules').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ module: data })
}

/** PUT /api/v1/modules/[id] — full or partial update */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Remove id from body if present — don't allow changing PK
  delete body.id

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('modules')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ module: data })
}

/** DELETE /api/v1/modules/[id] */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!await validateApiKey(req)) return unauthorizedResponse()
  const { id } = await params

  const supabase = await createServiceClient()
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
