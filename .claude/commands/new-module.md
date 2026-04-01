---
description: Scaffold a new curriculum module — creates lesson files and SQL seed row
argument-hint: <tier> <order_index> <slug> <"Title">
allowed-tools: [Read, Write, Glob, Grep, Bash]
---

# New Curriculum Module

You are scaffolding a new module for the GRAIVE AI literacy curriculum.

## Arguments

The user invoked this command with: $ARGUMENTS

Parse the arguments in this order:
1. `tier` — one of: `explorer` (ages-10-11), `builder` (ages-12-13), `thinker` (ages-14-15), `innovator` (ages-16-18), `creator` (ages-18-plus)
2. `order_index` — the module number (e.g. 13)
3. `slug` — kebab-case identifier (e.g. `ai-and-music`)
4. `title` — the human-readable module title (may be quoted)

If any argument is missing, ask for it before proceeding.

## Tier → folder mapping

| Tier | Folder | Age label |
|------|--------|-----------|
| explorer | ages-10-11 | Explorer Level (Ages 10–11) |
| builder | ages-12-13 | Builder Level (Ages 12–13) |
| thinker | ages-14-15 | Thinker Level (Ages 14–15) |
| innovator | ages-16-18 | Innovator Level (Ages 16–18) |
| creator | ages-18-plus | Creator Level (Ages 18+) |

## Step 1 — Read existing modules for this tier

Read one or two existing lesson-plan.md files from the target tier's folder in `curriculum/` so you understand the depth, tone, and structure expected for that age group. The structure should be:

```
curriculum/<folder>/module-XX-<slug>/lesson-plan.md
curriculum/<folder>/module-XX-<slug>/video-script.md
```

## Step 2 — Create lesson-plan.md

Create `curriculum/<folder>/module-<order_index_padded>-<slug>/lesson-plan.md` with this structure (adapt content fully for the topic and age group):

```markdown
# Lesson Plan: <Title>
### <Age label> | Module <order_index_padded>

---

## Objective
By the end of this lesson, you can [specific, measurable skill].

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- [Any other materials]
- About 30–45 minutes

---

## Watch First
Watch **Module <order_index_padded>: <Title>** before starting the activities.

---

## Try It — [Activity Name]

### Activity 1: [Name] (10 mins)
[Step-by-step instructions with specific prompts to run]

---

### Activity 2: [Name] (10 mins)
[Hands-on challenge building on Activity 1]

---

## Level Up — Harder Version
[A more advanced version for kids who want more challenge]

---

## Reflect
Answer these in your notebook or a document:

1. [Reflection question about what they learned]
2. [Reflection question about what surprised them]
3. [Reflection question connecting it to their own life]

---

## Share (Optional)
[Prompt to share their best output or creation]

---

## Key Takeaway
> **[One sentence the student should be able to say after this lesson.]**
```

## Step 3 — Create video-script.md

Create `curriculum/<folder>/module-<order_index_padded>-<slug>/video-script.md` with this structure:

```markdown
# Video Script: <Title>
### <Age label> | Module <order_index_padded>
### Estimated runtime: 6–8 minutes

---

## HOOK (0:00–0:45)
[Surprising question or bold statement that grabs attention immediately]

---

## INTRO (0:45–1:30)
[Brief intro — what we're covering today and why it matters to this age group]

---

## MAIN CONTENT (1:30–5:00)

### Part 1: [Concept Name]
[Explain the first key idea with an analogy kids relate to]

### Part 2: [Concept Name]
[Second key idea — build on the first]

### Part 3: [Concept Name or demo]
[Show or explain the third element — ideally a live demo or visual]

---

## ACTIVITY TEASER (5:00–5:45)
[Describe what they're about to do in the lesson plan — get them excited]

"In the lesson plan, you're going to..."

---

## OUTRO (5:45–6:30)
[Wrap up with the key takeaway + tease the next module]

---

## PRODUCTION NOTES
- **On-screen text:** [Key terms to show as text overlays]
- **B-roll suggestions:** [Visual ideas: screen recordings, animations, real-world footage]
- **Tone:** [e.g. "Energetic, encouraging, slightly silly" for explorer; "Curious and direct" for builder]
```

## Step 4 — Output the SQL row

After creating the files, output this SQL block for the user to add to `web/supabase-schema.sql` (or run directly in Supabase SQL Editor). Fill in all values correctly:

```sql
INSERT INTO modules (tier_slug, slug, title, description, order_index, estimated_minutes, enabled)
VALUES (
  '<tier>',
  '<slug>',
  '<Title>',
  '<One sentence description of what this module teaches>',
  <order_index>,
  35,
  true
) ON CONFLICT (tier_slug, slug) DO NOTHING;
```

## Step 5 — Summary

Tell the user:
- Which files were created
- The SQL to run in Supabase
- That they can go to `/admin/modules` to verify it appears and toggle it on
