# GRAIVE — Management API Guide

The management API lets you create, update, and bulk-import courses and modules without touching the admin UI. Useful for scripting curriculum imports, syncing content from external tools, or building your own admin tooling.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Response Format](#response-format)
4. [Error Codes](#error-codes)
5. [Modules API](#modules-api)
6. [Courses API](#courses-api)
7. [Bulk Import](#bulk-import)
8. [Example Scripts](#example-scripts)

---

## Authentication

Every request must include a Bearer token in the `Authorization` header.

```
Authorization: Bearer YOUR_API_KEY
```

Generate or rotate your key from `/admin/api-keys` in the admin panel.

If the key is missing or wrong, all endpoints return `401 Unauthorized`:

```json
{ "error": "Unauthorized" }
```

---

## Base URL

```
https://your-domain.com/api/v1
```

For local development:

```
http://localhost:3000/api/v1
```

---

## Response Format

All responses are JSON. Successful responses wrap data in a named key:

```json
{ "module": { ... } }        // single record
{ "modules": [...], "count": 12 }  // list
{ "success": true }          // delete
```

Error responses always have an `error` string:

```json
{ "error": "Missing required field: title" }
```

---

## Error Codes

| Status | Meaning |
| ------ | ------- |
| 200 | OK |
| 201 | Created |
| 207 | Multi-Status (bulk insert with some errors) |
| 400 | Bad request — invalid JSON or missing required field |
| 401 | Unauthorized — missing or invalid API key |
| 404 | Not found |
| 500 | Server error — Supabase query failed |

---

## Modules API

### GET /api/v1/modules

List all modules. Optionally filter by tier or course.

**Query parameters**

| Param | Description |
| ----- | ----------- |
| `tier` | Filter by tier slug (`explorer`, `builder`, `thinker`, `innovator`, `creator`) |
| `course` | Filter by course slug (e.g. `ai-literacy`) |

**Example**

```bash
# All modules
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/modules

# Only Explorer modules
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://your-domain.com/api/v1/modules?tier=explorer"

# Explorer modules in ai-literacy course
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://your-domain.com/api/v1/modules?tier=explorer&course=ai-literacy"
```

**Response**

```json
{
  "modules": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "course_slug": "ai-literacy",
      "tier_slug": "explorer",
      "slug": "what-is-ai",
      "title": "What is AI?",
      "description": "An introduction to artificial intelligence",
      "order_index": 1,
      "enabled": true,
      "content_path": "",
      "content": "# What is AI?\n\n...",
      "video_url": null,
      "video_script": null,
      "estimated_minutes": 20,
      "is_current_events": false,
      "publish_date": null,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### POST /api/v1/modules

Create a single module.

**Required fields:** `tier_slug`, `slug`, `title`

**Body**

```json
{
  "course_slug": "ai-literacy",
  "tier_slug": "explorer",
  "slug": "what-is-ai",
  "title": "What is AI?",
  "description": "An intro to artificial intelligence",
  "order_index": 1,
  "enabled": true,
  "content": "# What is AI?\n\nLesson content here...",
  "estimated_minutes": 20,
  "is_current_events": false,
  "publish_date": null
}
```

**Field reference**

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `tier_slug` | string | **required** | One of: `explorer` `builder` `thinker` `innovator` `creator` |
| `slug` | string | **required** | URL-safe identifier, unique per tier. e.g. `what-is-ai` |
| `title` | string | **required** | Display title |
| `course_slug` | string | `ai-literacy` | Which course this belongs to |
| `course_id` | uuid | null | Course UUID (resolved from `course_slug` if omitted) |
| `description` | string | null | Short summary shown on module cards |
| `order_index` | integer | 0 | Controls display order within a tier. Lower = earlier |
| `enabled` | boolean | true | Whether the module is visible to learners |
| `content` | string | null | Full lesson markdown (stored in DB, takes priority over filesystem) |
| `content_path` | string | `""` | Relative path to a markdown file on disk (fallback if content is null) |
| `video_url` | string | null | Embed URL for the intro video |
| `video_script` | string | null | Teleprompter script for the intro video |
| `estimated_minutes` | integer | 20 | Estimated completion time shown to learners |
| `is_current_events` | boolean | false | Marks as a monthly AI news module (shown with 🗞 badge) |
| `publish_date` | date string | null | ISO date `YYYY-MM-DD`. Module hidden until this date. null = always visible |

**Response** — `201 Created`

```json
{ "module": { ...created module... } }
```

---

### GET /api/v1/modules/:id

Get a single module by UUID.

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/modules/uuid-here
```

**Response** — `200 OK`

```json
{ "module": { ... } }
```

---

### PUT /api/v1/modules/:id

Update a module. Send only the fields you want to change — all others are preserved.

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "enabled": false, "publish_date": "2026-06-01" }' \
  https://your-domain.com/api/v1/modules/uuid-here
```

**Response** — `200 OK`

```json
{ "module": { ...updated module... } }
```

---

### DELETE /api/v1/modules/:id

Permanently delete a module. This also removes any learner progress records linked to this module.

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/modules/uuid-here
```

**Response** — `200 OK`

```json
{ "success": true }
```

---

## Courses API

### GET /api/v1/courses

List all courses ordered by `order_index`.

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/courses
```

**Response**

```json
{
  "courses": [
    {
      "id": "uuid",
      "slug": "ai-literacy",
      "title": "AI Literacy",
      "description": "How AI works and how to use it critically.",
      "icon": "🤖",
      "color": "#6366f1",
      "enabled": true,
      "order_index": 0,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### POST /api/v1/courses

Create a new course.

**Required fields:** `slug`, `title`

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "math-fundamentals",
    "title": "Math Fundamentals",
    "description": "Core maths concepts with AI-assisted learning.",
    "icon": "➕",
    "color": "#0ea5e9",
    "enabled": true,
    "order_index": 1
  }' \
  https://your-domain.com/api/v1/courses
```

**Response** — `201 Created`

```json
{ "course": { ...created course... } }
```

---

### GET /api/v1/courses/:id

Get a course by UUID **or slug**.

```bash
# By UUID
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/courses/uuid-here

# By slug
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/courses/ai-literacy
```

---

### PUT /api/v1/courses/:id

Update a course (partial update).

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "enabled": false }' \
  https://your-domain.com/api/v1/courses/uuid-here
```

---

### DELETE /api/v1/courses/:id

Delete a course. Modules with this `course_id` will have their `course_id` set to null (they are not deleted).

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_KEY" \
  https://your-domain.com/api/v1/courses/uuid-here
```

---

## Bulk Import

`POST /api/v1/modules/bulk` lets you create or update up to **200 modules in a single request**. Ideal for initial curriculum imports and large updates.

### Modes

| Mode | Behaviour |
| ---- | --------- |
| `upsert` (default) | Insert new, update existing. Matches on `(tier_slug, slug)`. |
| `insert` | Insert only. Returns per-row errors if a slug already exists. |

### Request body

```json
{
  "mode": "upsert",
  "modules": [
    {
      "course_slug": "ai-literacy",
      "tier_slug": "explorer",
      "slug": "what-is-ai",
      "title": "What is AI?",
      "order_index": 1,
      "content": "# What is AI?\n\n..."
    },
    {
      "course_slug": "ai-literacy",
      "tier_slug": "explorer",
      "slug": "asking-good-questions",
      "title": "Asking Good Questions",
      "order_index": 2,
      "content": "# Asking Good Questions\n\n..."
    }
  ]
}
```

### Response — upsert mode

`200 OK`

```json
{ "success": true, "count": 2 }
```

### Response — insert mode

`201 Created` (or `207 Multi-Status` if some rows failed)

```json
{
  "inserted": 1,
  "errors": [
    "asking-good-questions: duplicate key value violates unique constraint"
  ]
}
```

---

## Example Scripts

### Import a full tier from a folder of markdown files

```python
#!/usr/bin/env python3
"""
import_tier.py — read all lesson-plan.md files from a folder and bulk-upsert them.

Usage:
  python import_tier.py --tier explorer --course ai-literacy \
    --dir ./curriculum/ages-10-11 --key YOUR_API_KEY \
    --host https://your-domain.com
"""

import os, sys, json, argparse
import urllib.request

def load_modules(dir_path, tier, course):
    modules = []
    order = 1
    for entry in sorted(os.scandir(dir_path), key=lambda e: e.name):
        if not entry.is_dir():
            continue
        lesson_file = os.path.join(entry.path, 'lesson-plan.md')
        if not os.path.exists(lesson_file):
            continue
        with open(lesson_file, encoding='utf-8') as f:
            content = f.read()
        # Extract title from first heading
        title = next(
            (l.lstrip('#').strip() for l in content.splitlines() if l.startswith('#')),
            entry.name
        )
        modules.append({
            'course_slug': course,
            'tier_slug': tier,
            'slug': entry.name,
            'title': title,
            'order_index': order,
            'enabled': True,
            'estimated_minutes': 20,
            'content': content,
        })
        order += 1
    return modules

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--tier', required=True)
    ap.add_argument('--course', default='ai-literacy')
    ap.add_argument('--dir', required=True)
    ap.add_argument('--key', required=True)
    ap.add_argument('--host', required=True)
    args = ap.parse_args()

    modules = load_modules(args.dir, args.tier, args.course)
    print(f'Loaded {len(modules)} modules from {args.dir}')

    payload = json.dumps({'mode': 'upsert', 'modules': modules}).encode()
    req = urllib.request.Request(
        f'{args.host.rstrip("/")}/api/v1/modules/bulk',
        data=payload,
        headers={
            'Authorization': f'Bearer {args.key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    with urllib.request.urlopen(req) as resp:
        result = json.load(resp)
    print('Result:', result)

if __name__ == '__main__':
    main()
```

```bash
python import_tier.py \
  --tier explorer \
  --course ai-literacy \
  --dir ./curriculum/ages-10-11 \
  --key sk_YourKeyHere \
  --host https://graive.com
```

---

### Schedule a current events module

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "course_slug": "ai-literacy",
    "tier_slug": "builder",
    "slug": "current-events-june-2026",
    "title": "June 2026: GPT-5 Released",
    "description": "Monthly AI current events — June 2026.",
    "order_index": 110,
    "is_current_events": true,
    "publish_date": "2026-06-01",
    "estimated_minutes": 25,
    "content": "# June 2026 AI News: GPT-5 Released\n\n..."
  }' \
  https://your-domain.com/api/v1/modules
```

---

### Disable all modules in a tier

```bash
#!/bin/bash
KEY="YOUR_API_KEY"
HOST="https://your-domain.com"

# Get all builder module IDs
IDS=$(curl -s -H "Authorization: Bearer $KEY" \
  "$HOST/api/v1/modules?tier=builder" \
  | python3 -c "import sys,json; [print(m['id']) for m in json.load(sys.stdin)['modules']]")

for ID in $IDS; do
  curl -s -X PUT \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{"enabled": false}' \
    "$HOST/api/v1/modules/$ID"
  echo "Disabled $ID"
done
```

---

### Create a new course and import modules into it

```bash
KEY="YOUR_API_KEY"
HOST="https://your-domain.com"

# 1. Create the course
curl -X POST \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "math-fundamentals",
    "title": "Math Fundamentals",
    "description": "Core maths with AI assistance.",
    "icon": "➕",
    "color": "#0ea5e9",
    "order_index": 1
  }' \
  "$HOST/api/v1/courses"

# 2. Bulk-import modules for the new course
curl -X POST \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "upsert",
    "modules": [
      {
        "course_slug": "math-fundamentals",
        "tier_slug": "explorer",
        "slug": "counting-and-patterns",
        "title": "Counting and Patterns",
        "order_index": 1,
        "estimated_minutes": 15,
        "content": "# Counting and Patterns\n\n..."
      }
    ]
  }' \
  "$HOST/api/v1/modules/bulk"
```

---

*GRAIVE Management API v1 — Last updated: 2026-04-01*
