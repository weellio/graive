---
description: Audit curriculum — find mismatches between filesystem modules and DB schema seed rows
allowed-tools: [Read, Glob, Grep, Bash]
---

# Module Audit

Check that curriculum files, the supabase-schema.sql seed data, and the curriculum.json manifest are all in sync.

## Arguments

$ARGUMENTS — optional: a specific tier to check (e.g. `explorer`). If blank, check all tiers.

## Tier → folder mapping

| Tier | Curriculum folder |
|------|-------------------|
| explorer | ages-10-11 |
| builder | ages-12-13 |
| thinker | ages-14-15 |
| innovator | ages-16-18 |
| creator | ages-18-plus |

## Step 1 — List all curriculum folders

For each tier in scope, list all subdirectories in `curriculum/<folder>/`.
Each subdirectory is a module. Extract the slug from the folder name (the part after `module-XX-`).

## Step 2 — Read schema seed rows

Read `web/supabase-schema.sql`. Find all INSERT INTO modules rows. For each, extract:
- `tier_slug`
- `slug`
- `order_index`
- `title`

## Step 3 — Read curriculum.json (if it exists)

Check if `curriculum/curriculum.json` exists. If so, read it and extract the module slugs listed per tier.

## Step 4 — Cross-reference and report

Check all three sources and report any of these problems:

### Problems to look for

**A. Folder exists but no SQL seed row**
The module is in the filesystem but will not appear in the app unless seeded.
→ Provide the INSERT SQL needed.

**B. SQL seed row exists but no folder**
The module is in the DB but has no lesson content files.
→ Suggest running `/new-module` to create the content.

**C. Duplicate order_index within a tier**
Two modules have the same order_index, which breaks the sort order.
→ List the conflicting slugs and their current order_index values.

**D. Missing lesson-plan.md in a module folder**
The folder exists but has no `lesson-plan.md`.
→ List the affected modules.

**E. curriculum.json out of sync**
Module listed in JSON but not in filesystem or SQL (or vice versa).
→ Only report if curriculum.json exists.

## Step 5 — Summary

Print a clean summary table:

```
TIER       | FOLDERS | SQL ROWS | ISSUES
-----------|---------|----------|-------
explorer   |      12 |       12 | none
builder    |      12 |       12 | none
thinker    |      12 |       11 | ⚠ missing SQL row for module-12-future-skills
innovator  |      12 |       12 | none
creator    |       6 |        6 | none
```

Followed by detailed issue descriptions with SQL fixes where applicable.

If everything is in sync, say so clearly and end.
