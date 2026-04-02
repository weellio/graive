import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/config/site'
import type { AgeTier } from '@/types'

const TIER_CONTEXT: Record<AgeTier, string> = {
  explorer:  'ages 10-11, simple vocabulary, fun and encouraging tone, short sentences, relatable examples from everyday life',
  builder:   'ages 12-13, curious and engaging, slightly technical but still accessible, pop culture references OK',
  thinker:   'ages 14-15, thoughtful and critical, encourages debate and analysis, treats them as young adults',
  innovator: 'ages 16-18, ambitious and direct, assumes some prior AI knowledge, career and entrepreneurship relevant',
  creator:   'ages 18+, professional and peer-level, assumes solid AI literacy, focuses on building and shipping real products',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { tier, topic, context, month, year }: {
    tier: AgeTier; topic: string; context?: string; month: string; year: number
  } = await req.json()

  if (!tier || !topic || !month || !year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const settings = await getSiteSettings()

  const prompt = `You are an expert AI literacy educator writing a monthly "Current Events in AI" module for ${TIER_CONTEXT[tier]}.

Topic: ${topic}
Month/Year: ${month} ${year}
${context ? `Background context:\n${context}` : ''}

Write a complete, engaging lesson module in markdown format using this EXACT structure with --- separators between sections:

# ${month} ${year} AI News: ${topic}

> This is your monthly AI Current Events module — what's happening RIGHT NOW in the world of AI.

---

## What Happened

(2-3 engaging paragraphs explaining the news story accurately and in age-appropriate language. Be specific — use real names, companies, dates where possible. Don't talk down to them.)

---

## Key Concepts

(Define 3 key terms from this story as **Term:** Definition pairs. Keep definitions to 1-2 sentences.)

---

## Why It Matters to You

(2 paragraphs connecting this AI news to the learner's life, future career, and world. Be concrete — give specific examples.)

---

## Activity: Try It

(Create a hands-on activity using the built-in Spark AI. Include:
- A specific prompt for them to try with Spark
- A fill-in-blank question: ___
- A rating question: ___/10 with context
- One open reflection question with ___ for answer)

---

## Think About It

(3 thought-provoking discussion questions as a numbered list. These should push critical thinking — no easy yes/no answers.)

---

## Challenge

(One creative challenge that synthesises this topic. Could be writing, designing, or debating. Include blank lines for their response using ___ markers.)

---

## Coming Next Month

(One teaser sentence about AI news to watch — keep them curious.)

Write the full module now. It should take about 20-25 minutes to complete. Make it feel like the most engaging thing they've read all week.`

  try {
    let content = ''
    const provider = settings.llm_provider
    const apiKeyOverride = settings.llm_api_key_override || undefined

    const PROVIDER_DEFAULTS: Record<string, string> = { claude: 'claude-sonnet-4-6', openai: 'gpt-4o', gemini: 'gemini-2.0-flash' }
    const MODEL_PREFIXES: Record<string, string> = { claude: 'claude', openai: 'gpt', gemini: 'gemini' }
    const storedModel = settings.llm_model || ''
    const prefix = MODEL_PREFIXES[provider]
    const resolvedModel = (prefix && storedModel.startsWith(prefix)) ? storedModel : PROVIDER_DEFAULTS[provider] ?? PROVIDER_DEFAULTS.claude

    if (provider === 'openai') {
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({ apiKey: apiKeyOverride || process.env.OPENAI_API_KEY })
      const res = await client.chat.completions.create({
        model: resolvedModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
      })
      content = res.choices[0]?.message?.content ?? ''
    } else if (provider === 'gemini') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(apiKeyOverride || process.env.GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: resolvedModel })
      const res = await model.generateContent(prompt)
      content = res.response.text()
    } else {
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: apiKeyOverride || process.env.ANTHROPIC_API_KEY })
      const res = await client.messages.create({
        model: resolvedModel,
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
      })
      content = res.content[0].type === 'text' ? res.content[0].text : ''
    }

    if (!content) return NextResponse.json({ error: 'Empty AI response' }, { status: 500 })
    return NextResponse.json({ content })
  } catch (err) {
    console.error('[generate-current-events]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
