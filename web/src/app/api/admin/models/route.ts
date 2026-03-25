import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  // Admin-only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const provider = req.nextUrl.searchParams.get('provider') ?? 'claude'

  // Read API key override from DB (server-side — never exposed to client)
  const { data: keyRow } = await supabase
    .from('site_settings').select('value').eq('key', 'llm_api_key_override').single()
  const override = keyRow?.value?.trim() ?? ''

  try {
    switch (provider) {
      case 'claude': {
        const key = override || process.env.ANTHROPIC_API_KEY
        if (!key) return NextResponse.json({ error: 'No API key configured' }, { status: 400 })
        const res = await fetch('https://api.anthropic.com/v1/models?limit=100', {
          headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        })
        if (!res.ok) throw new Error(`Anthropic ${res.status}`)
        const { data } = await res.json()
        const models: string[] = (data ?? [])
          .map((m: { id: string }) => m.id)
          .sort((a: string, b: string) => b.localeCompare(a))
        return NextResponse.json({ models })
      }

      case 'openai': {
        const key = override || process.env.OPENAI_API_KEY
        if (!key) return NextResponse.json({ error: 'No API key configured' }, { status: 400 })
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
        })
        if (!res.ok) throw new Error(`OpenAI ${res.status}`)
        const { data } = await res.json()
        const models: string[] = (data ?? [])
          .map((m: { id: string }) => m.id)
          .filter((id: string) =>
            id.startsWith('gpt-') || id.startsWith('o1') || id.startsWith('o3') || id.startsWith('o4')
          )
          .sort((a: string, b: string) => b.localeCompare(a))
        return NextResponse.json({ models })
      }

      case 'gemini': {
        const key = override || process.env.GEMINI_API_KEY
        if (!key) return NextResponse.json({ error: 'No API key configured' }, { status: 400 })
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=100`
        )
        if (!res.ok) throw new Error(`Gemini ${res.status}`)
        const { models: raw } = await res.json()
        const models: string[] = (raw ?? [])
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map((m: { name: string }) => m.name.replace('models/', ''))
          .sort((a: string, b: string) => b.localeCompare(a))
        return NextResponse.json({ models })
      }

      default:
        return NextResponse.json({ models: [] })
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
