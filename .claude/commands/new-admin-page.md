---
description: Scaffold a new admin page following the GRAIVE codebase patterns
argument-hint: <route-name> ["Page Title"]
allowed-tools: [Read, Write, Glob, Grep]
---

# New Admin Page

Scaffold a new admin page for the GRAIVE platform following the exact patterns already used in the codebase.

## Arguments

The user invoked this command with: $ARGUMENTS

Parse:
1. `route-name` — the URL slug (e.g. `reports` → creates `/admin/reports`)
2. `title` — optional human-readable title (e.g. `"Usage Reports"`)

## Step 1 — Read existing admin pages for reference

Read at least two existing admin pages to understand the exact patterns:
- `web/src/app/admin/page.tsx` (overview — uses createServiceClient, complex queries)
- `web/src/app/admin/users/page.tsx` (simpler list page)

## Step 2 — Understand the required patterns

Every admin page in this codebase MUST follow these patterns:

1. **Server component** (no `'use client'` at top level unless strictly necessary)
2. **Use `createServiceClient`** from `@/lib/supabase/server` — not `createClient` — because admin pages bypass RLS
3. **No auth check needed** — the admin layout (`web/src/app/admin/layout.tsx`) already gates all `/admin/**` routes to `role = 'admin'` users
4. **Standard imports**: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`, Button, Badge etc. from shadcn/ui
5. **Page wrapper**: `<div className="space-y-6">` as the root element
6. **Page header pattern**:
   ```tsx
   <div>
     <h1 className="text-2xl font-bold text-slate-800">[Title]</h1>
     <p className="text-slate-500 mt-1">[Subtitle]</p>
   </div>
   ```

## Step 3 — Create the page file

Create `web/src/app/admin/<route-name>/page.tsx` with a sensible, working scaffold that:
- Fetches relevant data from Supabase using createServiceClient
- Renders it in a Card layout consistent with other admin pages
- Has at least one data section (even if placeholder)
- Is TypeScript with no `any` types where avoidable

## Step 4 — Add to admin nav

Read `web/src/app/admin/layout.tsx`. Add the new route to the `navItems` array:

```tsx
{ href: '/admin/<route-name>', label: '<Title>', icon: <AppropriateIcon> },
```

Pick the most appropriate icon from the already-imported set in that file (LayoutDashboard, BookOpen, Palette, Bot, Users, Package, Video, Newspaper) or add a new lucide-react import if needed.

## Step 5 — Summary

Tell the user:
- File created at `web/src/app/admin/<route-name>/page.tsx`
- What nav change was made to `layout.tsx`
- What data it currently queries (and what they might want to add)
- Whether they need any new Supabase tables or columns
