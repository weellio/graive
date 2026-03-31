import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/config/site'
import type { AgeTier } from '@/types'

const TIER_VOICE: Record<AgeTier, string> = {
  explorer:  'friendly, enthusiastic, simple vocabulary, like a cool older sibling. Ages 10–11.',
  builder:   'confident, curious, slightly technical but still fun. Ages 12–13.',
  thinker:   'thoughtful, challenging, treats them like young adults. Ages 14–15.',
  innovator: 'direct, ambitious, peer-to-peer tone. Ages 16–18.',
  creator:   'professional but energetic, assumes prior AI knowledge. Ages 18+.',
}

const SCRIPT_TEMPLATE = (
  title: string,
  tier: AgeTier,
  description: string,
  keyPoints: string,
  durationMinutes: number,
) => `You are a professional video scriptwriter for an AI literacy education platform.

Write a complete, production-ready video script for a ${Math.max(2, Math.round(durationMinutes * 0.12))}-minute intro video for the following module.

VOICE/TONE: ${TIER_VOICE[tier]}

MODULE TITLE: ${title}
MODULE DESCRIPTION: ${description}
KEY CONTENT POINTS: ${keyPoints}

FORMAT YOUR SCRIPT EXACTLY LIKE THIS:

---
TITLE: ${title}
TIER: ${tier}
APPROX DURATION: ${Math.max(2, Math.round(durationMinutes * 0.12))} minutes
---

[HOOK - 15 seconds]
(Write the opening line that grabs attention immediately. No "Welcome to..." — start with a question, surprising fact, or bold statement.)

[INTRO - 20 seconds]
(Briefly introduce what this module covers and why it matters to this age group specifically.)

[MAIN CONTENT - ${Math.max(60, durationMinutes * 5)} seconds]
(Cover the 3-4 key concepts from the module. Use short paragraphs. Mark any visual cues in parentheses like: (show animation of...) or (cut to screen recording of...))

[ACTIVITY TEASER - 15 seconds]
(Mention the hands-on activity they'll do in the module — build excitement.)

[OUTRO - 10 seconds]
(Call to action: dive into the lesson. Short, punchy, encouraging.)

---
PRODUCTION NOTES:
- Recommended B-roll: (list 3-4 specific visual suggestions)
- On-screen text overlays: (list key terms to flash on screen)
- Suggested background music mood: (one word)
---

Write the full script now. Make it feel real, natural, and age-appropriate. Avoid jargon the audience won't know. Every sentence should earn its place.`

export async function POST(req: NextRequest) {
  // Verify admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { moduleId, title, description, tier, estimatedMinutes, content } = await req.json()
  if (!title || !tier) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const settings = await getSiteSettings()

  // Extract key points from content (first 2000 chars, strip markdown)
  const keyPoints = content
    .replace(/#{1,4}\s+/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\n{2,}/g, '\n')
    .slice(0, 800)
    .trim() || description || 'See module description.'

  const prompt = SCRIPT_TEMPLATE(title, tier as AgeTier, description ?? '', keyPoints, estimatedMinutes ?? 30)

  // Use the configured LLM
  const provider = settings.llm_provider
  const apiKeyOverride = settings.llm_api_key_override || undefined

  try {
    let script = ''

    if (provider === 'openai') {
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({ apiKey: apiKeyOverride || process.env.OPENAI_API_KEY })
      const res = await client.chat.completions.create({
        model: settings.llm_model_innovator || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      })
      script = res.choices[0]?.message?.content ?? ''
    } else if (provider === 'gemini') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(apiKeyOverride || process.env.GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: settings.llm_model_innovator || 'gemini-1.5-pro' })
      const res = await model.generateContent(prompt)
      script = res.response.text()
    } else {
      // Default: Claude
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: apiKeyOverride || process.env.ANTHROPIC_API_KEY })
      const res = await client.messages.create({
        model: settings.llm_model_innovator || 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      })
      script = res.content[0].type === 'text' ? res.content[0].text : ''
    }

    if (!script) return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })

    // Auto-save to DB
    const service = await createServiceClient()
    await service.from('modules').update({ video_script: script }).eq('id', moduleId)

    return NextResponse.json({ script })
  } catch (err) {
    console.error('[generate-script]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate script' },
      { status: 500 }
    )
  }
}
