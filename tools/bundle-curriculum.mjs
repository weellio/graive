#!/usr/bin/env node
/**
 * GRAIVE Curriculum Bundler
 *
 * Converts a curriculum folder into an importable .zip bundle.
 *
 * Usage:
 *   node tools/bundle-curriculum.mjs <curriculum-folder> [output.zip]
 *
 * Example:
 *   node tools/bundle-curriculum.mjs ./my-taco-curriculum taco-school-v1.zip
 *
 * The curriculum folder must contain a curriculum.json manifest.
 * See CURRICULUM_FORMAT.md for the full spec.
 */

import { createWriteStream, readFileSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Try to use jszip from the web app's node_modules
let JSZip
try {
  JSZip = require('../web/node_modules/jszip')
} catch {
  console.error('Error: jszip not found. Run: cd web && npm install')
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.log(`
Usage: node tools/bundle-curriculum.mjs <curriculum-folder> [output.zip]

Example:
  node tools/bundle-curriculum.mjs ./curriculum taco-school.zip
  node tools/bundle-curriculum.mjs ./my-curriculum output/my-course-v1.zip

The curriculum folder must contain a curriculum.json manifest.
Run: node tools/bundle-curriculum.mjs --template  to generate a starter template.
  `)
  process.exit(0)
}

if (args[0] === '--template') {
  generateTemplate()
  process.exit(0)
}

const inputDir = resolve(args[0])
const outputFile = args[1] ? resolve(args[1]) : resolve(`curriculum-bundle-${Date.now()}.zip`)

if (!existsSync(inputDir)) {
  console.error(`Error: directory not found: ${inputDir}`)
  process.exit(1)
}

const manifestPath = join(inputDir, 'curriculum.json')
if (!existsSync(manifestPath)) {
  console.error(`Error: curriculum.json not found in ${inputDir}`)
  console.error('Run --template to generate a starter template.')
  process.exit(1)
}

let manifest
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
} catch (e) {
  console.error('Error: curriculum.json is not valid JSON:', e.message)
  process.exit(1)
}

if (manifest.format !== 'graive-curriculum') {
  console.error('Error: curriculum.json must have "format": "graive-curriculum"')
  process.exit(1)
}

console.log(`\nBundling: ${manifest.metadata?.name || 'unnamed curriculum'}`)
console.log(`Author:   ${manifest.metadata?.author || 'unknown'}`)
console.log(`Version:  ${manifest.metadata?.version || '1.0'}`)
console.log()

const zip = new JSZip()
zip.file('curriculum.json', JSON.stringify(manifest, null, 2))

let filesAdded = 0
let filesMissing = 0

for (const tier of manifest.tiers || []) {
  for (const mod of tier.modules || []) {
    const contentPath = join(inputDir, mod.content_file)
    if (existsSync(contentPath)) {
      const content = readFileSync(contentPath, 'utf-8')
      zip.file(mod.content_file, content)
      console.log(`  ✓  ${mod.content_file}`)
      filesAdded++
    } else {
      console.warn(`  ✗  MISSING: ${mod.content_file}`)
      filesMissing++
    }
  }
}

// Add HOW_TO_EDIT.md
const howtoPath = join(inputDir, 'HOW_TO_EDIT.md')
if (existsSync(howtoPath)) {
  zip.file('HOW_TO_EDIT.md', readFileSync(howtoPath, 'utf-8'))
}

console.log()
console.log(`Files added:   ${filesAdded}`)
if (filesMissing > 0) {
  console.warn(`Files missing: ${filesMissing} (modules with missing content will use a placeholder)`)
}

const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
createWriteStream(outputFile).end(buffer)

console.log(`\nBundle saved: ${outputFile}`)
console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`)
console.log('\nUpload at: /admin/curriculum → Import Curriculum\n')

// ─── Template generator ───────────────────────────────────────────────────────

function generateTemplate() {
  const { mkdirSync, writeFileSync } = require('fs')
  const outDir = resolve('./my-curriculum')

  const manifest = {
    format: 'graive-curriculum',
    format_version: '1.0',
    metadata: {
      name: 'My Curriculum',
      author: 'Your Name',
      version: '1.0',
    },
    ai_prompts: {
      explorer: '',
      builder: '',
      thinker: '',
      innovator: '',
    },
    tiers: [
      {
        slug: 'explorer',
        label: 'Explorer',
        age_range: 'Ages 10-11',
        theme: 'Getting Started',
        modules: [
          {
            slug: 'introduction',
            title: 'Introduction',
            description: 'Welcome to the course',
            order_index: 1,
            estimated_minutes: 20,
            video_url: null,
            content_file: 'content/explorer/01-introduction.md',
          },
          {
            slug: 'the-basics',
            title: 'The Basics',
            description: 'Core concepts',
            order_index: 2,
            estimated_minutes: 25,
            video_url: null,
            content_file: 'content/explorer/02-the-basics.md',
          },
        ],
      },
      {
        slug: 'builder',
        label: 'Builder',
        age_range: 'Ages 12-13',
        theme: 'Going Deeper',
        modules: [
          {
            slug: 'intermediate-concepts',
            title: 'Intermediate Concepts',
            description: 'Building on the basics',
            order_index: 1,
            estimated_minutes: 30,
            video_url: null,
            content_file: 'content/builder/01-intermediate-concepts.md',
          },
        ],
      },
      {
        slug: 'thinker',
        label: 'Thinker',
        age_range: 'Ages 14-15',
        theme: 'Critical Thinking',
        modules: [],
      },
      {
        slug: 'innovator',
        label: 'Innovator',
        age_range: 'Ages 16-18',
        theme: 'Creating',
        modules: [],
      },
    ],
  }

  mkdirSync(join(outDir, 'content/explorer'), { recursive: true })
  mkdirSync(join(outDir, 'content/builder'), { recursive: true })
  mkdirSync(join(outDir, 'content/thinker'), { recursive: true })
  mkdirSync(join(outDir, 'content/innovator'), { recursive: true })

  writeFileSync(join(outDir, 'curriculum.json'), JSON.stringify(manifest, null, 2))

  const moduleTemplate = (title, tier, order) => `# ${title}
### ${tier} Level | Module ${String(order).padStart(2, '0')}

---

## Objective
By the end of this lesson, you will be able to...

---

## What You'll Need
- A device with internet access
- About 20 minutes

---

## Watch First
Watch **Module ${String(order).padStart(2, '0')}: ${title}** before trying the activities.

---

## Try It

### Activity 1 (10 mins)

Describe the activity here...

---

### Activity 2 (10 mins)

Describe the activity here...

---

## Reflect
1. What was the most interesting thing you learned?
2. What was the hardest part?
3. How would you use this in real life?

---

## Coming Up Next
Module ${String(order + 1).padStart(2, '0')} — [Next module title]
`

  writeFileSync(
    join(outDir, 'content/explorer/01-introduction.md'),
    moduleTemplate('Introduction', 'Explorer', 1)
  )
  writeFileSync(
    join(outDir, 'content/explorer/02-the-basics.md'),
    moduleTemplate('The Basics', 'Explorer', 2)
  )
  writeFileSync(
    join(outDir, 'content/builder/01-intermediate-concepts.md'),
    moduleTemplate('Intermediate Concepts', 'Builder', 1)
  )

  console.log(`\nTemplate created at: ${outDir}`)
  console.log('\nNext steps:')
  console.log('  1. Edit curriculum.json — update name, author, module titles')
  console.log('  2. Write your lesson content in content/<tier>/*.md')
  console.log('  3. Bundle: node tools/bundle-curriculum.mjs ./my-curriculum')
  console.log('  4. Import at /admin/curriculum\n')
}
