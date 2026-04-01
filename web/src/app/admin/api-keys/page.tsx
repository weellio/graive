'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { RefreshCw, Eye, EyeOff, Copy, Key, Terminal } from 'lucide-react'

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(40)
  crypto.getRandomValues(array)
  return 'sk_' + Array.from(array).map(b => chars[b % chars.length]).join('')
}

export default function AdminApiKeysPage() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'api_key')
      .single()
      .then(({ data }) => {
        setApiKey(data?.value || '')
        setLoading(false)
      })
  }, [])

  async function saveKey(key: string) {
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'api_key', value: key }, { onConflict: 'key' })

    if (error) {
      toast.error(error.message)
    } else {
      setApiKey(key)
      toast.success('API key saved')
    }
    setSaving(false)
  }

  async function handleGenerate() {
    const newKey = generateApiKey()
    await saveKey(newKey)
    setVisible(true)
  }

  async function handleRevoke() {
    await saveKey('')
    setVisible(false)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(apiKey).then(() => toast.success('Copied to clipboard'))
  }

  if (loading) return <div className="text-sm text-slate-400 py-8 text-center">Loading…</div>

  const maskedKey = apiKey ? apiKey.slice(0, 7) + '•'.repeat(apiKey.length - 10) + apiKey.slice(-3) : ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">API Keys</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage the Bearer token used to authenticate calls to the management API.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" /> Management API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKey ? (
            <>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    value={visible ? apiKey : maskedKey}
                    className="font-mono text-sm pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => setVisible(v => !v)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400"
                      title={visible ? 'Hide' : 'Show'}
                    >
                      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400"
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleGenerate}
                  disabled={saving}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Rotate Key
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRevoke}
                  disabled={saving}
                >
                  Revoke
                </Button>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Rotating the key immediately invalidates the old one. Update any scripts that use it.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <Key className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-4">No API key set. Generate one to enable the management API.</p>
              <Button onClick={handleGenerate} disabled={saving} className="gap-2">
                <Key className="h-4 w-4" /> Generate API Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4" /> API Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>Use the key as a Bearer token in the <code className="font-mono bg-slate-100 px-1 rounded">Authorization</code> header:</p>
          <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed">{`# List all modules
curl -H "Authorization: Bearer YOUR_KEY" \\
  https://your-domain.com/api/v1/modules

# Create a module
curl -X POST -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"tier_slug":"explorer","slug":"my-module","title":"My Module","course_slug":"ai-literacy"}' \\
  https://your-domain.com/api/v1/modules

# Bulk upsert modules (max 200 per request)
curl -X POST -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"mode":"upsert","modules":[...]}' \\
  https://your-domain.com/api/v1/modules/bulk

# List courses
curl -H "Authorization: Bearer YOUR_KEY" \\
  https://your-domain.com/api/v1/courses`}</pre>

          <div className="space-y-2">
            <p className="font-medium text-slate-700">Endpoints</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1.5 pr-4 font-medium text-slate-700">Method</th>
                    <th className="text-left py-1.5 pr-4 font-medium text-slate-700">Path</th>
                    <th className="text-left py-1.5 font-medium text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['GET', '/api/v1/modules', 'List modules (?tier=, ?course= optional)'],
                    ['POST', '/api/v1/modules', 'Create a module'],
                    ['GET', '/api/v1/modules/:id', 'Get a module by ID'],
                    ['PUT', '/api/v1/modules/:id', 'Update a module'],
                    ['DELETE', '/api/v1/modules/:id', 'Delete a module'],
                    ['POST', '/api/v1/modules/bulk', 'Bulk upsert/insert (max 200)'],
                    ['GET', '/api/v1/courses', 'List all courses'],
                    ['POST', '/api/v1/courses', 'Create a course'],
                    ['GET', '/api/v1/courses/:id', 'Get course by ID or slug'],
                    ['PUT', '/api/v1/courses/:id', 'Update a course'],
                    ['DELETE', '/api/v1/courses/:id', 'Delete a course'],
                  ].map(([method, path, desc]) => (
                    <tr key={path + method}>
                      <td className="py-1.5 pr-4">
                        <Badge variant="outline" className="text-xs font-mono">{method}</Badge>
                      </td>
                      <td className="py-1.5 pr-4 font-mono text-slate-600">{path}</td>
                      <td className="py-1.5 text-slate-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
