---
description: Scaffold a monthly current events module with publish date and SQL row
argument-hint: <tier> <YYYY-MM> <"Topic headline">
allowed-tools: [Read, Write, Glob, Grep]
---

# New Current Events Module

You are creating a monthly AI/tech news module for the GRAIVE platform. These are marked `is_current_events = true` and appear with a 🗞 badge in the tier grid.

## Arguments

The user invoked this command with: $ARGUMENTS

Parse:
1. `tier` — one of: `explorer`, `builder`, `thinker`, `innovator`, `creator`
2. `month` — format `YYYY-MM` (e.g. `2026-04`)
3. `topic` — the headline or AI topic (e.g. "AI learns to play chess better than any human")

If any argument is missing, ask before proceeding.

## Tier context

| Tier | Age label | Tone |
|------|-----------|------|
| explorer | Ages 10–11 | Playful, simple words, lots of examples |
| builder | Ages 12–13 | Curious, cause-and-effect explanations |
| thinker | Ages 14–15 | Critical, ask "who benefits and who doesn't?" |
| innovator | Ages 16–18 | Technical detail allowed, policy/ethics angle |
| creator | Ages 18+ | Practical: "what can I build with this?" |

## Derived values

- `slug` = `current-events-<YYYY-MM>` (e.g. `current-events-2026-04`)
- `title` = `AI in the News — <Month Name> <Year>: <Topic>` (e.g. `AI in the News — April 2026: Chess AI Breaks All Records`)
- `publish_date` = first day of the month: `<YYYY-MM>-01`
- Folder: `curriculum/<tier-folder>/<slug>/`

## Step 1 — Create lesson-plan.md

Create `curriculum/<tier-folder>/<slug>/lesson-plan.md`:

```markdown
# AI in the News: <Topic>
### <Age label> | Current Events — <Month Year>

---

## What Happened

[2–3 paragraphs explaining the news story in plain language at the right reading level.
Use an analogy the age group will recognise. Be factual — do not invent details.]

---

## Why It Matters

[1–2 paragraphs on the significance. What does this mean for the future? For people?
Frame for the age group — a 10 year old cares about different things than a 17 year old.]

---

## Key Concepts

- **[Term]** — [definition]
- **[Term]** — [definition]
- **[Term]** — [definition]

---

## Try It — Explore This Yourself

[A specific activity using a free AI tool. Give them exact prompts to run that
relate directly to the news story. Make it hands-on, not just "ask ChatGPT about it".]

---

## Think About It

Answer these in your notebook:

1. [Question connecting this story to their life or something they care about]
2. [Question asking them to take a position or make a prediction]
3. [Question about ethics or unintended consequences — adapted for age]

---

## Challenge

[A harder, open-ended challenge for students who want to go deeper.
Could be: write a response, build something, research further, debate a question.]

---

## Sources & Further Reading

- [Suggest where to learn more — age-appropriate: news sites, YouTube channels, etc.]
```

## Step 2 — Output the SQL

Output this SQL for the user to run in Supabase SQL Editor:

```sql
INSERT INTO modules (
  tier_slug, slug, title, description,
  order_index, estimated_minutes, enabled,
  is_current_events, publish_date
)
SELECT
  '<tier>',
  '<slug>',
  '<title>',
  'Monthly AI news: <brief description>',
  COALESCE((SELECT MAX(order_index) FROM modules WHERE tier_slug = '<tier>'), 0) + 1,
  25,
  true,
  true,
  '<YYYY-MM>-01'
WHERE NOT EXISTS (
  SELECT 1 FROM modules WHERE tier_slug = '<tier>' AND slug = '<slug>'
);
```

(Uses a subquery to auto-assign the next order_index so it appears at the end of the tier grid.)

## Step 3 — Summary

Tell the user:
- File created
- Publish date (module becomes visible to learners on this date)
- SQL to run
- That the module will show with a 🗞 badge in `/learn/<tier>`
