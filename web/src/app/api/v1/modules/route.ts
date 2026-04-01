import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/api/auth'

/** GET /api/v1/modules — list all modules (optional ?tier= and ?course= filters) */
export async function GET(req: NextRequest) {
  if (!await validateApiKey(req)) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const tier = searchParams.get('tier')
  const course = searchParams.get('course')

  const supabase = await createServiceClient()
  let query = supabase.from('modules').select('*').order('tier_slug').order('order_index')

  if (tier) query = query.eq('tier_slug', tier)
  if (course) query = query.eq('course_slug', course)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ modules: data, count: data?.length ?? 0 })
}

/** POST /api/v1/modules — create a new module */
export async function POST(req: NextRequest) {
  if (!await validateApiKey(req)) return unauthorizedResponse()

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const required = ['tier_slug', 'slug', 'title']
  for (const field of required) {
    if (!body[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: body.course_id ?? null,
      course_slug: body.course_slug ?? 'ai-literacy',
      tier_slug: body.tier_slug,
      slug: body.slug,
      title: body.title,
      description: body.description ?? null,
      order_index: body.order_index ?? 0,
      enabled: body.enabled ?? true,
      content_path: body.content_path ?? '',
      content: body.content ?? null,
      video_url: body.video_url ?? null,
      estimated_minutes: body.estimated_minutes ?? 20,
      is_current_events: body.is_current_events ?? false,
      publish_date: body.publish_date ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ module: data }, { status: 201 })
}
