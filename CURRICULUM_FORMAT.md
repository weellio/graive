# GRAIVE Curriculum Format

Anyone can create a curriculum for this platform. This document explains how.

---

## Quick Start

```bash
# Generate a starter template
node tools/bundle-curriculum.mjs --template

# Edit your content in ./my-curriculum/
# Then bundle it:
node tools/bundle-curriculum.mjs ./my-curriculum my-course-v1.zip

# Upload the .zip at /admin/curriculum
```

---

## What Is a Curriculum Bundle?

A `.zip` file containing:

```
my-curriculum.zip
├── curriculum.json          ← required: the manifest
└── content/
    ├── explorer/
    │   ├── 01-first-module.md
    │   └── 02-second-module.md
    ├── builder/
    ├── thinker/
    └── innovator/
```

---

## curriculum.json

Full example with all fields:

```json
{
  "format": "graive-curriculum",
  "format_version": "1.0",

  "metadata": {
    "name": "Taco School",
    "author": "Chef Bob",
    "version": "2.0"
  },

  "ai_prompts": {
    "explorer": "You are Chef Spark, a warm and encouraging cooking tutor for beginners aged 10-11. You only discuss topics covered in the current lesson. Keep responses under 150 words. Use simple language and food analogies.",
    "builder": "You are Chef Sage, a knowledgeable culinary guide for ages 12-13. Help students understand techniques and the science behind cooking. Stay on topic.",
    "thinker": "You are Chef Sage, a culinary mentor for ages 14-15. Discuss food culture, nutrition science, and the economics of the food industry. Encourage critical thinking.",
    "innovator": "You are Chef Sage, an advanced culinary coach for ages 16-18. Cover professional techniques, food entrepreneurship, menu design, and the future of food tech. Full depth allowed."
  },

  "tiers": [
    {
      "slug": "explorer",
      "label": "Apprentice",
      "age_range": "Ages 10-11",
      "theme": "Kitchen Basics",
      "modules": [
        {
          "slug": "knife-safety",
          "title": "Knife Safety",
          "description": "How to handle a knife safely and confidently",
          "order_index": 1,
          "estimated_minutes": 20,
          "video_url": null,
          "content_file": "content/explorer/01-knife-safety.md"
        },
        {
          "slug": "mise-en-place",
          "title": "Mise en Place",
          "description": "Preparation is everything — the chef's first rule",
          "order_index": 2,
          "estimated_minutes": 25,
          "video_url": "https://www.youtube.com/embed/your-video-id",
          "content_file": "content/explorer/02-mise-en-place.md"
        }
      ]
    },
    {
      "slug": "builder",
      "label": "Cook",
      "age_range": "Ages 12-13",
      "theme": "Techniques & Flavour",
      "modules": []
    },
    {
      "slug": "thinker",
      "label": "Chef",
      "age_range": "Ages 14-15",
      "theme": "Cuisine & Culture",
      "modules": []
    },
    {
      "slug": "innovator",
      "label": "Master Chef",
      "age_range": "Ages 16-18",
      "theme": "Innovation & Business",
      "modules": []
    }
  ]
}
```

---

## Field Reference

### metadata
| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Curriculum name shown in admin |
| `author` | No | Your name or organisation |
| `version` | No | Version string (e.g. `"1.0"`) |

### ai_prompts
Each tier can have a custom AI tutor personality. Leave empty (`""`) to use the platform default.

The prompt is injected as the AI's system prompt. The module title and description are also appended automatically so the tutor always knows what lesson is active.

**Tips for good AI prompts:**
- Give the tutor a name and personality
- Specify the age group
- Define the subject scope
- Set the tone (warm, professional, playful, etc.)
- For younger tiers, add word limits and off-topic restrictions

### tiers
The platform has 4 fixed tier **slugs**: `explorer`, `builder`, `thinker`, `innovator`.

You can rename the **labels** (shown to users) in the manifest and via Admin → Theme.

| Slug | Default label | Default age |
|------|--------------|-------------|
| `explorer` | Explorer | 10-11 |
| `builder` | Builder | 12-13 |
| `thinker` | Thinker | 14-15 |
| `innovator` | Innovator | 16-18 |

### modules
| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | URL-safe identifier, unique within tier (e.g. `knife-safety`) |
| `title` | Yes | Display title |
| `description` | No | Short description shown in module lists |
| `order_index` | Yes | Display order (integer, gaps allowed: 1, 2, 3 or 10, 20, 30) |
| `estimated_minutes` | No | Shown to learners, defaults to 30 |
| `video_url` | No | Embed URL (YouTube: use `/embed/` format) |
| `content_file` | Yes | Path to the markdown file within the ZIP |

---

## Writing Lesson Content

Lesson content is standard Markdown. The platform renders it with full support for:

- Headings (`# H1`, `## H2`, `### H3`)
- **Bold**, *italic*, ~~strikethrough~~
- Lists (ordered and unordered)
- Tables
- Code blocks (` ```language `)
- Blockquotes (`>`)
- Horizontal rules (`---`)
- Images (`![alt](url)`)
- Links (`[text](url)`)

### Recommended lesson structure

```markdown
# Lesson Title
### Tier Level | Module XX

---

## Objective
One sentence: what will the learner be able to do after this?

---

## What You'll Need
- Tool or resource
- About X minutes

---

## Watch First
Short note about the accompanying video (if any).

---

## Try It

### Activity 1: Name (X mins)
Step-by-step activity...

---

### Activity 2: Name (X mins)
Step-by-step activity...

---

### Activity 3: Challenge (X mins)
Harder variant for learners who want more...

---

## Reflect
1. Question prompting recall or opinion
2. Question connecting to real life
3. Question encouraging future thinking

---

## Share (Optional)
Prompt to share work in a community or with a friend.

---

## Coming Up Next
Module XX: [Next title] — [one-line teaser]
```

---

## Import Behaviour

- Import **upserts** by `tier_slug + slug` — safe to re-import after edits
- Existing modules not in the bundle are **left untouched** (not deleted)
- To remove a module, disable it in Admin → Modules
- AI prompt overrides are set immediately on import
- Curriculum metadata (name, author, version) is stored in site settings

---

## Testing Your Bundle Locally

```bash
# Validate your manifest before bundling
node -e "
const m = JSON.parse(require('fs').readFileSync('./my-curriculum/curriculum.json', 'utf-8'));
console.log('Tiers:', m.tiers.length);
m.tiers.forEach(t => console.log(' ', t.slug, '-', t.modules.length, 'modules'));
"

# Bundle
node tools/bundle-curriculum.mjs ./my-curriculum test-bundle.zip
```

---

## Example Curricula

To inspire different use cases:

| Subject | Explorer tier theme | AI tutor example |
|---------|--------------------|--------------------|
| AI Literacy | Talking to Computers | "You are Spark, a friendly AI tutor…" |
| Cooking | Kitchen Basics | "You are Chef Spark, a warm culinary guide…" |
| Personal Finance | Money Basics | "You are Penny, a cheerful money coach for kids…" |
| Entrepreneurship | Ideas & Problems | "You are Max, a startup mentor for young thinkers…" |
| Creative Writing | Storytelling | "You are Quill, an imaginative writing companion…" |
| Environmental Science | Nature & Us | "You are Eco, a nature guide…" |
