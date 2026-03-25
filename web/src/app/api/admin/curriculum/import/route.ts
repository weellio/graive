import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import JSZip from 'jszip'

interface CurriculumManifest {
  format: string
  format_version: string
  metadata: {
    name: string
    author: string
    version: string
  }
  ai_prompts?: {
    explorer?: string
    builder?: string
    thinker?: string
    innovator?: string
  }
  tiers: Array<{
    slug: string
    label?: string
    age_range?: string
    theme?: string
    modules: Array<{
      slug: string
      title: string
      description?: string
      order_index: number
      estimated_minutes?: number
      video_url?: string | null
      content_file: string
    }>
  }>
}

export async function POST(req: NextRequest) {
  // Admin check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Parse multipart form
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  if (!file.name.endsWith('.zip')) {
    return NextResponse.json({ error: 'File must be a .zip' }, { status: 400 })
  }

  // Parse ZIP
  const buffer = Buffer.from(await file.arrayBuffer())
  const zip = new JSZip()
  let loaded: JSZip

  try {
    loaded = await zip.loadAsync(buffer)
  } catch {
    return NextResponse.json({ error: 'Could not read ZIP file' }, { status: 400 })
  }

  // Read manifest
  const manifestFile = loaded.file('curriculum.json')
  if (!manifestFile) {
    return NextResponse.json(
      { error: 'Missing curriculum.json in ZIP root' },
      { status: 400 }
    )
  }

  let manifest: CurriculumManifest
  try {
    const raw = await manifestFile.async('string')
    manifest = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'curriculum.json is not valid JSON' }, { status: 400 })
  }

  if (manifest.format !== 'graive-curriculum') {
    return NextResponse.json(
      { error: 'Not a GRAIVE curriculum bundle (format must be "graive-curriculum")' },
      { status: 400 }
    )
  }

  const service = await createServiceClient()
  const results = { imported: 0, skipped: 0, errors: [] as string[] }

  // Import each module
  for (const tier of manifest.tiers) {
    const validTiers = ['explorer', 'builder', 'thinker', 'innovator']
    if (!validTiers.includes(tier.slug)) {
      results.errors.push(`Unknown tier slug: ${tier.slug}`)
      continue
    }

    for (const mod of tier.modules) {
      // Read content from ZIP
      let content: string | null = null
      const contentFile = loaded.file(mod.content_file)
      if (contentFile) {
        content = await contentFile.async('string')
      }

      // Upsert module into DB
      const { error } = await service.from('modules').upsert(
        {
          tier_slug: tier.slug,
          slug: mod.slug,
          title: mod.title,
          description: mod.description || null,
          order_index: mod.order_index,
          estimated_minutes: mod.estimated_minutes || 30,
          video_url: mod.video_url || null,
          content_path: mod.content_file,
          content: content,
          enabled: true,
        },
        { onConflict: 'tier_slug,slug' }
      )

      if (error) {
        results.errors.push(`${tier.slug}/${mod.slug}: ${error.message}`)
        results.skipped++
      } else {
        results.imported++
      }
    }
  }

  // Update site settings: curriculum metadata + AI prompts
  const settingsToUpsert: Array<{ key: string; value: string }> = [
    { key: 'curriculum_name', value: manifest.metadata?.name || '' },
    { key: 'curriculum_author', value: manifest.metadata?.author || '' },
    { key: 'curriculum_version', value: manifest.metadata?.version || '' },
  ]

  if (manifest.ai_prompts) {
    for (const [tier, prompt] of Object.entries(manifest.ai_prompts)) {
      if (prompt !== undefined) {
        settingsToUpsert.push({ key: `system_prompt_${tier}`, value: prompt })
      }
    }
  }

  await service.from('site_settings').upsert(settingsToUpsert, { onConflict: 'key' })

  return NextResponse.json({
    success: true,
    curriculum: manifest.metadata?.name,
    results,
  })
}
