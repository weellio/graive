import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/api/auth'

/**
 * POST /api/v1/modules/bulk
 * Body: { modules: [...], mode: 'upsert' | 'insert' }
 * Upserts on (tier_slug, slug) or inserts new rows.
 * Returns { inserted, updated, errors }.
 */
export async function POST(req: NextRequest) {
  if (!await validateApiKey(req)) return unauthorizedResponse()

  let body: { modules?: unknown[]; mode?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const modules = body.modules
  if (!Array.isArray(modules) || modules.length === 0) {
    return NextResponse.json({ error: 'modules array required' }, { status: 400 })
  }

  if (modules.length > 200) {
    return NextResponse.json({ error: 'Max 200 modules per bulk request' }, { status: 400 })
  }

  const mode = body.mode ?? 'upsert'
  const supabase = await createServiceClient()

  const rows = modules.map((m: any) => ({
    course_id: m.course_id ?? null,
    course_slug: m.course_slug ?? 'ai-literacy',
    tier_slug: m.tier_slug,
    slug: m.slug,
    title: m.title,
    description: m.description ?? null,
    order_index: m.order_index ?? 0,
    enabled: m.enabled ?? true,
    content_path: m.content_path ?? '',
    content: m.content ?? null,
    video_url: m.video_url ?? null,
    estimated_minutes: m.estimated_minutes ?? 20,
    is_current_events: m.is_current_events ?? false,
    publish_date: m.publish_date ?? null,
  }))

  if (mode === 'upsert') {
    const { data, error } = await supabase
      .from('modules')
      .upsert(rows, { onConflict: 'tier_slug,slug' })
      .select('id')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, count: data?.length ?? 0 })
  }

  // insert mode — collect errors per row
  const results = { inserted: 0, errors: [] as string[] }
  for (const row of rows) {
    const { error } = await supabase.from('modules').insert(row)
    if (error) results.errors.push(`${row.slug}: ${error.message}`)
    else results.inserted++
  }

  return NextResponse.json(results, { status: results.errors.length > 0 ? 207 : 201 })
}
