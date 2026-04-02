import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import path from 'path'
import fs from 'fs/promises'

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

/**
 * Load an optional slug map from curriculum/curriculum.json.
 * Shape: { "folder-name": "tier-slug", ... }
 * If the file doesn't exist or doesn't have a slug_map, returns {}.
 */
async function loadSlugMap(curriculumRoot: string): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(path.join(curriculumRoot, 'curriculum.json'), 'utf-8')
    const json = JSON.parse(raw)
    return json.slug_map ?? {}
  } catch {
    return {}
  }
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = await createServiceClient()

  // Resolve curriculum root — try repo-root sibling first (local dev + Vercel monorepo),
  // then same-directory fallback (if curriculum was moved inside web/)
  const candidates = [
    path.join(process.cwd(), 'curriculum'),
    path.join(process.cwd(), '..', 'curriculum'),
  ]
  let curriculumRoot = candidates[0]
  for (const c of candidates) {
    try { await fs.access(c); curriculumRoot = c; break } catch { /* try next */ }
  }

  const results = { imported: 0, skipped: 0, errors: [] as string[] }

  // Optional mapping of folder name → tier slug
  const slugMap = await loadSlugMap(curriculumRoot)

  // Scan all entries in the curriculum root
  let rootEntries: string[]
  try {
    rootEntries = await fs.readdir(curriculumRoot)
  } catch {
    return NextResponse.json({ error: 'Could not read curriculum directory' }, { status: 500 })
  }

  for (const entry of rootEntries.sort()) {
    const tierDir = path.join(curriculumRoot, entry)

    // Skip files and hidden entries
    const stat = await fs.stat(tierDir).catch(() => null)
    if (!stat?.isDirectory()) continue

    // Resolve tier slug: explicit map → folder name as-is
    const tierSlug = slugMap[entry] ?? entry

    // Find module subdirectories (any subdir starting with 'module-')
    let subEntries: string[]
    try {
      subEntries = await fs.readdir(tierDir)
    } catch {
      continue
    }

    const moduleDirs = subEntries.filter(e => e.startsWith('module-')).sort()
    if (moduleDirs.length === 0) continue  // not a tier folder

    for (const moduleDir of moduleDirs) {
      const orderMatch = moduleDir.match(/^module-(\d+)-/)
      const order_index = orderMatch ? parseInt(orderMatch[1], 10) : 99
      const slug = moduleDir.replace(/^module-\d+-/, '')

      const moduleDir_ = path.join(tierDir, moduleDir)

      // Pick the best content file: expanded > base > first .md found
      const candidates = ['lesson-plan-expanded.md', 'lesson-plan.md']
      let content: string | null = null
      let contentFile: string | null = null

      for (const candidate of candidates) {
        try {
          content = await fs.readFile(path.join(moduleDir_, candidate), 'utf-8')
          contentFile = `${entry}/${moduleDir}/${candidate}`
          break
        } catch { /* try next */ }
      }

      if (!content) {
        // Fall back to first .md in the directory
        const mdFiles = subEntries.filter(f => f.endsWith('.md'))
        if (mdFiles.length > 0) {
          try {
            content = await fs.readFile(path.join(moduleDir_, mdFiles[0]), 'utf-8')
            contentFile = `${entry}/${moduleDir}/${mdFiles[0]}`
          } catch { /* give up */ }
        }
      }

      if (!content) {
        results.errors.push(`No markdown found: ${entry}/${moduleDir}`)
        results.skipped++
        continue
      }

      const title = extractTitle(content)
      if (!title) {
        results.errors.push(`Could not extract title: ${entry}/${moduleDir}`)
        results.skipped++
        continue
      }

      const { error } = await service.from('modules').upsert(
        {
          tier_slug: tierSlug,
          slug,
          title,
          description: extractDescription(content) || null,
          order_index,
          estimated_minutes: 35,
          content_path: contentFile,
          content,
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
