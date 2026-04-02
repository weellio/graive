'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { Course } from '@/types'
import { Plus, BookOpen, Pencil, X, Check } from 'lucide-react'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ slug: '', title: '', description: '', icon: '📚', color: '#6366f1' })
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .order('order_index')
      .then(({ data }) => {
        setCourses((data || []) as Course[])
        setLoading(false)
      })
  }, [])

  async function handleCreate() {
    if (!form.slug || !form.title) { toast.error('Slug and title required'); return }
    const { data, error } = await supabase
      .from('courses')
      .insert({
        slug: form.slug,
        title: form.title,
        description: form.description || null,
        icon: form.icon || null,
        color: form.color || null,
        enabled: true,
        order_index: courses.length,
      })
      .select()
      .single()

    if (error) { toast.error(error.message); return }
    setCourses(prev => [...prev, data as Course])
    setShowNew(false)
    setForm({ slug: '', title: '', description: '', icon: '📚', color: '#6366f1' })
    toast.success('Course created')
  }

  async function handleUpdate(course: Course) {
    const { error } = await supabase
      .from('courses')
      .update({
        title: course.title,
        description: course.description,
        icon: course.icon,
        color: course.color,
      })
      .eq('id', course.id)

    if (error) { toast.error(error.message); return }
    setEditingId(null)
    toast.success('Course updated')
  }

  async function toggleEnabled(course: Course) {
    const { error } = await supabase
      .from('courses')
      .update({ enabled: !course.enabled })
      .eq('id', course.id)

    if (error) { toast.error(error.message); return }
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, enabled: !c.enabled } : c))
    toast.success(`Course ${course.enabled ? 'disabled' : 'enabled'}`)
  }

  function updateField(id: string, field: keyof Course, value: unknown) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  if (loading) return <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Top-level subject areas. Each course contains modules across all tier levels.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setShowNew(true)}>
          <Plus className="h-3.5 w-3.5" /> New Course
        </Button>
      </div>

      {showNew && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader><CardTitle className="text-base">New Course</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Slug <span className="text-muted-foreground text-xs">(URL-safe, e.g. ai-literacy)</span></Label>
                <Input
                  placeholder="ai-literacy"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  placeholder="AI Literacy"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                rows={2}
                placeholder="What learners will explore in this course"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Icon (emoji)</Label>
                <Input
                  placeholder="📚"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Color (hex)</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    className="h-9 w-9 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create Course</Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {courses.length === 0 && (
          <div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed border-border rounded-xl">
            No courses yet. Create one above.
          </div>
        )}
        {courses.map(course => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: (course.color || '#6366f1') + '20' }}
                >
                  {course.icon || '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === course.id ? (
                    <div className="space-y-2">
                      <Input
                        value={course.title}
                        onChange={e => updateField(course.id, 'title', e.target.value)}
                      />
                      <Textarea
                        rows={2}
                        value={course.description || ''}
                        onChange={e => updateField(course.id, 'description', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(course)}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{course.title}</p>
                        <Badge variant="outline" className="text-xs font-mono">{course.slug}</Badge>
                        {!course.enabled && <Badge variant="outline" className="text-xs text-muted-foreground">Disabled</Badge>}
                      </div>
                      {course.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{course.description}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(editingId === course.id ? null : course.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-muted-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <Switch
                    checked={course.enabled}
                    onCheckedChange={() => toggleEnabled(course)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-muted-foreground bg-muted rounded-xl p-4">
        <p className="font-medium text-muted-foreground mb-1">
          <BookOpen className="h-4 w-4 inline mr-1" /> How courses work
        </p>
        <ul className="space-y-1 list-disc pl-4">
          <li>Each course groups modules across all 5 tier levels (Explorer → Creator).</li>
          <li>Modules are assigned a <code className="font-mono text-xs bg-card px-1 rounded">course_slug</code> to link them to a course.</li>
          <li>The default course is <code className="font-mono text-xs bg-card px-1 rounded">ai-literacy</code> — all existing modules belong here.</li>
          <li>New courses appear at <code className="font-mono text-xs bg-card px-1 rounded">/learn/[course-slug]/[tier]</code>.</li>
        </ul>
      </div>
    </div>
  )
}
