import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/api/auth'

/** GET /api/v1/courses */
export async function GET(req: NextRequest) {
  if (!await validateApiKey(req)) return unauthorizedResponse()

  const supabase = await createServiceClient()
  const { data, error } = await supabase.from('courses').select('*').order('order_index')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ courses: data, count: data?.length ?? 0 })
}

/** POST /api/v1/courses — create a new course */
export async function POST(req: NextRequest) {
  if (!await validateApiKey(req)) return unauthorizedResponse()

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.slug || !body.title) {
    return NextResponse.json({ error: 'Missing required fields: slug, title' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('courses')
    .insert({
      slug: body.slug,
      title: body.title,
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null,
      enabled: body.enabled ?? true,
      order_index: body.order_index ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data }, { status: 201 })
}
