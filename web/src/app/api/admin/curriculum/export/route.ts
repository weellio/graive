import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import JSZip from 'jszip'

export async function GET() {
  // Admin check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = await createServiceClient()

  // Load all modules
  const { data: modules } = await service
    .from('modules')
    .select('*')
    .order('tier_slug')
    .order('order_index')

  // Load curriculum metadata from settings
  const { data: settings } = await service
    .from('site_settings')
    .select('key, value')
    .in('key', ['curriculum_name', 'curriculum_author', 'curriculum_version',
                 'system_prompt_explorer', 'system_prompt_builder',
                 'system_prompt_thinker', 'system_prompt_innovator'])

  const settingsMap = Object.fromEntries((settings || []).map(s => [s.key, s.value]))

  // Group modules by tier
  const tiers = ['explorer', 'builder', 'thinker', 'innovator'] as const
  const tierMeta: Record<string, { label: string; age_range: string; theme: string }> = {
    explorer: { label: 'Explorer', age_range: 'Ages 10-11', theme: 'Talking to Computers' },
    builder: { label: 'Builder', age_range: 'Ages 12-13', theme: 'Understanding the Machine' },
    thinker: { label: 'Thinker', age_range: 'Ages 14-15', theme: 'Critical AI Citizenship' },
    innovator: { label: 'Innovator', age_range: 'Ages 16-18', theme: 'Build with AI, Think Beyond AI' },
  }

  const zip = new JSZip()

  const manifest: Record<string, unknown> = {
    format: 'graive-curriculum',
    format_version: '1.0',
    metadata: {
      name: settingsMap['curriculum_name'] || 'AI Literacy for Kids',
      author: settingsMap['curriculum_author'] || 'GRAIVE',
      version: settingsMap['curriculum_version'] || '1.0',
      exported_at: new Date().toISOString(),
    },
    ai_prompts: {
      explorer: settingsMap['system_prompt_explorer'] || '',
      builder: settingsMap['system_prompt_builder'] || '',
      thinker: settingsMap['system_prompt_thinker'] || '',
      innovator: settingsMap['system_prompt_innovator'] || '',
    },
    tiers: tiers.map(tierSlug => {
      const tierModules = (modules || []).filter(m => m.tier_slug === tierSlug)
      return {
        slug: tierSlug,
        ...tierMeta[tierSlug],
        modules: tierModules.map(m => ({
          slug: m.slug,
          title: m.title,
          description: m.description,
          order_index: m.order_index,
          estimated_minutes: m.estimated_minutes,
          video_url: m.video_url || null,
          content_file: `content/${tierSlug}/${String(m.order_index).padStart(2, '0')}-${m.slug}.md`,
        })),
      }
    }),
  }

  zip.file('curriculum.json', JSON.stringify(manifest, null, 2))

  // Add content files
  for (const mod of modules || []) {
    const content = mod.content || `# ${mod.title}\n\n${mod.description || ''}\n\n*Content not yet added.*`
    const filename = `content/${mod.tier_slug}/${String(mod.order_index).padStart(2, '0')}-${mod.slug}.md`
    zip.file(filename, content)
  }

  // Add a HOWTO for curriculum creators
  zip.file('HOW_TO_EDIT.md', HOWTO_CONTENT)

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

  const curriculumName = (settingsMap['curriculum_name'] || 'curriculum').replace(/\s+/g, '-').toLowerCase()
  const filename = `${curriculumName}-${new Date().toISOString().slice(0, 10)}.zip`

  return new Response(zipBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

const HOWTO_CONTENT = `# How to Edit This Curriculum

## Structure

This bundle contains:
- \`curriculum.json\` — the manifest: tier structure, module metadata, AI tutor prompts
- \`content/<tier>/<order>-<slug>.md\` — the markdown lesson content for each module

## Editing Content

Open any \`.md\` file in \`content/\` and edit it. These are standard Markdown files.
The app renders them with full Markdown support (headings, lists, code blocks, tables, etc.)

## Adding a New Module

1. Add a new entry to the correct tier's \`modules\` array in \`curriculum.json\`:
\`\`\`json
{
  "slug": "my-new-module",
  "title": "My New Module",
  "description": "A short description shown in the module list",
  "order_index": 13,
  "estimated_minutes": 30,
  "video_url": null,
  "content_file": "content/explorer/13-my-new-module.md"
}
\`\`\`
2. Create the corresponding markdown file at that \`content_file\` path.

## Customising the AI Tutor

In \`curriculum.json\`, edit the \`ai_prompts\` section:
\`\`\`json
"ai_prompts": {
  "explorer": "You are Chef Spark, a friendly cooking tutor for young beginners aged 10-11...",
  "builder": "You are Chef Sage, a knowledgeable culinary guide for ages 12-13...",
  "thinker": "...",
  "innovator": "..."
}
\`\`\`

Leave a prompt empty (\`""\`) to use the platform default.

## Importing

Go to **/admin/curriculum** and upload your ZIP. The import will:
- Replace or add modules in the database
- Store content directly (no filesystem access needed)
- Apply AI prompt overrides
- Update curriculum metadata

## Tips

- Keep slugs lowercase, hyphen-separated, unique within a tier
- \`order_index\` determines display order — use integers, gaps are fine (1, 2, 3 or 10, 20, 30)
- Estimated minutes is shown to learners — be realistic
- The AI tutor sees the module title and description — write clear descriptions
`
