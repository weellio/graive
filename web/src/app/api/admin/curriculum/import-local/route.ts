import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import path from 'path'
import fs from 'fs/promises'

const TIER_MAP: Record<string, string> = {
  'ages-10-11':   'explorer',
  'ages-12-13':   'builder',
  'ages-14-15':   'thinker',
  'ages-16-18':   'innovator',
  'ages-18-plus': 'creator',
}

/** Extract the title from the first H1 line of a markdown file */
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(?:Lesson Plan:\s*)?(.+)/m)
  return match ? match[1].trim() : ''
}

/** Extract a one-line description from the Objective section */
function extractDescription(markdown: string): string {
  const match = markdown.match(/##\s+Objective\s*\n+([\s\S]+?)(?:\n---|\n##)/m)
  if (!match) return ''
  return match[1].replace(/\n+/g, ' ').replace(/\s+/g, ' ').slice(0, 200).trim()
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = await createServiceClient()
  const curriculumRoot = path.join(process.cwd(), '..', 'curriculum')
  const results = { imported: 0, skipped: 0, errors: [] as string[] }

  for (const [folder, tierSlug] of Object.entries(TIER_MAP)) {
    const tierDir = path.join(curriculumRoot, folder)

    let entries: string[]
    try {
      entries = await fs.readdir(tierDir)
    } catch {
      results.errors.push(`Could not read ${folder}/`)
      continue
    }

    const moduleDirs = entries
      .filter(e => e.startsWith('module-'))
      .sort()

    for (const moduleDir of moduleDirs) {
      const slug = moduleDir.replace(/^module-\d+-/, '')
      const orderMatch = moduleDir.match(/^module-(\d+)-/)
      const order_index = orderMatch ? parseInt(orderMatch[1], 10) : 99

      const lessonPath = path.join(tierDir, moduleDir, 'lesson-plan.md')
      let content: string
      try {
        content = await fs.readFile(lessonPath, 'utf-8')
      } catch {
        results.errors.push(`Missing lesson-plan.md: ${folder}/${moduleDir}`)
        results.skipped++
        continue
      }

      // Try expanded version first for richer content
      let fullContent = content
      try {
        const expanded = await fs.readFile(
          path.join(tierDir, moduleDir, 'lesson-plan-expanded.md'), 'utf-8'
        )
        if (expanded) fullContent = expanded
      } catch { /* no expanded version — use base */ }

      const title = extractTitle(content)
      if (!title) {
        results.errors.push(`Could not extract title: ${folder}/${moduleDir}`)
        results.skipped++
        continue
      }

      const description = extractDescription(content)

      const { error } = await service.from('modules').upsert(
        {
          tier_slug: tierSlug,
          slug,
          title,
          description: description || null,
          order_index,
          estimated_minutes: 35,
          content_path: `${folder}/${moduleDir}/lesson-plan.md`,
          content: fullContent,
          enabled: true,
        },
        { onConflict: 'tier_slug,slug' }
      )

      if (error) {
        results.errors.push(`${tierSlug}/${slug}: ${error.message}`)
        results.skipped++
      } else {
        results.imported++
      }
    }
  }

  return NextResponse.json({ success: true, results })
}
