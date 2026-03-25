'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Upload, Download, FileArchive, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface ImportResult {
  success: boolean
  curriculum?: string
  results?: { imported: number; skipped: number; errors: string[] }
  error?: string
}

export default function AdminCurriculumPage() {
  const [dragging, setDragging] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.name.endsWith('.zip')) {
      toast.error('Please upload a .zip curriculum bundle')
      return
    }

    setImporting(true)
    setImportResult(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/admin/curriculum/import', {
        method: 'POST',
        body: form,
      })
      const data: ImportResult = await res.json()
      setImportResult(data)
      if (data.success) {
        toast.success(`Imported "${data.curriculum}" — ${data.results?.imported} modules`)
      } else {
        toast.error(data.error || 'Import failed')
      }
    } catch {
      toast.error('Network error during import')
    } finally {
      setImporting(false)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  function onExport() {
    window.open('/api/admin/curriculum/export', '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Curriculum</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Import and export curriculum bundles. Swap subjects without touching code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4" /> Import Curriculum
            </CardTitle>
            <CardDescription>
              Upload a <code className="text-xs bg-slate-100 px-1 rounded">.zip</code> bundle containing{' '}
              <code className="text-xs bg-slate-100 px-1 rounded">curriculum.json</code> and markdown content files.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${dragging
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              {importing ? (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Importing…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <FileArchive className="h-8 w-8" />
                  <p className="text-sm font-medium text-slate-600">
                    Drop a .zip here, or click to browse
                  </p>
                  <p className="text-xs">GRAIVE curriculum bundle format</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Result */}
            {importResult && (
              <div className={`rounded-lg p-4 text-sm ${
                importResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {importResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Imported: {importResult.curriculum}
                    </div>
                    <div className="flex gap-3 text-xs text-green-700">
                      <span>{importResult.results?.imported} modules imported</span>
                      {(importResult.results?.skipped ?? 0) > 0 && (
                        <span>{importResult.results?.skipped} skipped</span>
                      )}
                    </div>
                    {(importResult.results?.errors?.length ?? 0) > 0 && (
                      <div className="text-xs text-amber-700">
                        {importResult.results!.errors.map((e, i) => (
                          <div key={i}>⚠ {e}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    {importResult.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Curriculum
            </CardTitle>
            <CardDescription>
              Download the current curriculum as a portable bundle — ready to edit, share, or import into another instance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700 mb-2">The export includes:</p>
              <ul className="space-y-1.5 text-sm text-slate-500">
                {[
                  'curriculum.json — manifest with all module metadata',
                  'content/<tier>/<slug>.md — all lesson markdown files',
                  'HOW_TO_EDIT.md — guide for curriculum authors',
                  'AI tutor prompt overrides (if set)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={onExport} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" /> Download Bundle (.zip)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Format reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bundle Format Reference</CardTitle>
          <CardDescription>
            Share this with anyone creating curriculum for your platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-700 mb-2">ZIP structure</p>
              <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 overflow-x-auto">{`my-curriculum.zip
├── curriculum.json
└── content/
    ├── explorer/
    │   ├── 01-intro.md
    │   └── 02-basics.md
    ├── builder/
    ├── thinker/
    └── innovator/`}</pre>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-2">curriculum.json shape</p>
              <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 overflow-x-auto">{`{
  "format": "graive-curriculum",
  "format_version": "1.0",
  "metadata": {
    "name": "Taco School",
    "author": "Chef Bob",
    "version": "1.0"
  },
  "ai_prompts": {
    "explorer": "You are Chef Spark...",
    "builder": ""
  },
  "tiers": [{
    "slug": "explorer",
    "modules": [{
      "slug": "knife-safety",
      "title": "Knife Safety",
      "order_index": 1,
      "estimated_minutes": 20,
      "content_file": "content/explorer/01-knife-safety.md"
    }]
  }]
}`}</pre>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">Tier slugs are fixed: explorer / builder / thinker / innovator</Badge>
            <Badge variant="outline" className="text-xs">Rename tier labels in Admin → Theme</Badge>
            <Badge variant="outline" className="text-xs">Empty ai_prompts = use platform defaults</Badge>
            <Badge variant="outline" className="text-xs">Import is non-destructive: upserts by tier+slug</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
