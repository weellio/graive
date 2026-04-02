#!/usr/bin/env node
/**
 * Build a GRAIVE curriculum zip bundle from the /curriculum folder.
 * Usage: node scripts/build-curriculum-zip.js [--tier creator] [--out my.zip]
 *
 * Defaults: all tiers, output = curriculum-bundle.zip
 */

const fs = require('fs')
const path = require('path')
const JSZip = require('../web/node_modules/jszip')

const TIER_MAP = {
  'ages-10-11':   'explorer',
  'ages-12-13':   'builder',
  'ages-14-15':   'thinker',
  'ages-16-18':   'innovator',
  'ages-18-plus': 'creator',
}

const TIER_META = {
  explorer:  { label: 'Explorer',  age_range: 'Ages 10–11', theme: 'Talking to Computers' },
  builder:   { label: 'Builder',   age_range: 'Ages 12–13', theme: 'Understanding the Machine' },
  thinker:   { label: 'Thinker',   age_range: 'Ages 14–15', theme: 'Critical AI Citizenship' },
  innovator: { label: 'Innovator', age_range: 'Ages 16–18', theme: 'Build with AI, Think Beyond AI' },
  creator:   { label: 'Creator',   age_range: 'Ages 18+',   theme: 'Professional AI Mastery' },
}

const ESTIMATED_MINUTES = {
  explorer: 35, builder: 40, thinker: 45, innovator: 55, creator: 60,
}

// Parse args
const args = process.argv.slice(2)
const tierIdx = args.indexOf('--tier')
const outIdx  = args.indexOf('--out')
const tierArg = tierIdx !== -1 ? args[tierIdx + 1] : null
const outArg  = outIdx  !== -1 ? args[outIdx  + 1] : null
const outFile = outArg || (tierArg ? `curriculum-${tierArg}.zip` : 'curriculum-bundle.zip')

const curriculumRoot = path.join(__dirname, '..', 'web', 'curriculum')

function extractTitle(markdown) {
  const m = markdown.match(/^#\s+(?:Lesson Plan:\s*)?(.+)/m)
  return m ? m[1].trim() : ''
}

function extractDescription(markdown) {
  const m = markdown.match(/##\s+Objective\s*\n+([\s\S]+?)(?:\n---|\n##)/m)
  if (!m) return ''
  return m[1].replace(/\n+/g, ' ').replace(/\s+/g, ' ').slice(0, 200).trim()
}

async function build() {
  const zip = new JSZip()
  const manifest = {
    format: 'graive-curriculum',
    format_version: '1.0',
    metadata: {
      name: 'GRAIVE AI Literacy',
      author: 'GRAIVE',
      version: '1.0',
    },
    tiers: [],
  }

  const foldersToProcess = tierArg
    ? Object.entries(TIER_MAP).filter(([, slug]) => slug === tierArg)
    : Object.entries(TIER_MAP)

  for (const [folder, tierSlug] of foldersToProcess) {
    const tierDir = path.join(curriculumRoot, folder)
    if (!fs.existsSync(tierDir)) {
      console.warn(`  ⚠  Skipping ${folder} — folder not found`)
      continue
    }

    const entries = fs.readdirSync(tierDir).filter(e => e.startsWith('module-')).sort()
    const tierEntry = {
      ...TIER_META[tierSlug],
      slug: tierSlug,
      modules: [],
    }

    for (const moduleDir of entries) {
      const orderMatch = moduleDir.match(/^module-(\d+)-/)
      const order_index = orderMatch ? parseInt(orderMatch[1], 10) : 99
      const slug = moduleDir.replace(/^module-\d+-/, '')

      // Prefer expanded lesson plan if available
      const expandedPath = path.join(tierDir, moduleDir, 'lesson-plan-expanded.md')
      const basePath     = path.join(tierDir, moduleDir, 'lesson-plan.md')
      const contentPath  = fs.existsSync(expandedPath) ? expandedPath : basePath

      if (!fs.existsSync(contentPath)) {
        console.warn(`  ⚠  Missing lesson-plan.md: ${folder}/${moduleDir}`)
        continue
      }

      const content = fs.readFileSync(contentPath, 'utf-8')
      const title = extractTitle(content)
      if (!title) {
        console.warn(`  ⚠  Could not extract title: ${folder}/${moduleDir}`)
        continue
      }

      const contentFile = `content/${tierSlug}/${slug}.md`
      zip.file(contentFile, content)

      tierEntry.modules.push({
        slug,
        title,
        description: extractDescription(content),
        order_index,
        estimated_minutes: ESTIMATED_MINUTES[tierSlug] || 35,
        content_file: contentFile,
      })

      console.log(`  ✓  ${tierSlug}/${slug} — ${title}`)
    }

    if (tierEntry.modules.length > 0) {
      manifest.tiers.push(tierEntry)
    }
  }

  zip.file('curriculum.json', JSON.stringify(manifest, null, 2))

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  fs.writeFileSync(outFile, buffer)

  const totalModules = manifest.tiers.reduce((n, t) => n + t.modules.length, 0)
  console.log(`\n✅  ${outFile} — ${totalModules} modules across ${manifest.tiers.length} tier(s)`)
}

build().catch(err => { console.error(err); process.exit(1) })
