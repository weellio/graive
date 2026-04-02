import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/config/site'
import { streamLLMResponse } from '@/lib/llm'
import type { AgeTier, ChatMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      messages,
      moduleId,
      moduleTitle,
      tier,
      saveHistory,
      mode = 'tutor',
    }: {
      messages: ChatMessage[]
      moduleId: string
      moduleTitle: string
      tier: AgeTier
      saveHistory: boolean
      mode?: 'tutor' | 'playground'
    } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Cap input message length to prevent token abuse
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.content.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 })
    }

    const settings = await getSiteSettings()

    // Rate limiting — applied to ALL users (free and paid)
    const today = new Date().toISOString().slice(0, 10)

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .single()

    const isSubscribed =
      ['active','trialing','past_due','beta'].includes(subscription?.status ?? '')

    const plan = subscription?.plan ?? 'free'
    const isClassroom = plan === 'classroom'
    const isFamily = plan === 'family'
    const isGroupPlan = isClassroom || isFamily

    const individualLimit = isSubscribed
      ? parseInt(settings.paid_tier_daily_message_limit || '200', 10)
      : parseInt(settings.free_tier_daily_message_limit || '10', 10)

    // ── Classroom: shared group pool of 500 msgs/day ───────────────────────
    if (isClassroom) {
      // Find the group this user belongs to
      const { data: membership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .single()

      if (membership) {
        const { data: groupUsage } = await supabase
          .from('group_ai_usage')
          .select('message_count')
          .eq('group_id', membership.group_id)
          .eq('date', today)
          .single()

        const groupCount = groupUsage?.message_count ?? 0
        const groupLimit = 500

        if (groupCount >= groupLimit) {
          return NextResponse.json(
            { error: `Your classroom has reached its daily AI limit (${groupLimit} messages/day). Try again tomorrow.` },
            { status: 429 }
          )
        }

        // Increment group pool
        await supabase.from('group_ai_usage').upsert(
          { group_id: membership.group_id, date: today, message_count: groupCount + 1 },
          { onConflict: 'group_id,date' }
        )
      }
    }

    // ── Per-user limit (all plans) ─────────────────────────────────────────
    const { data: usage } = await supabase
      .from('ai_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const currentCount = usage?.message_count ?? 0

    if (currentCount >= individualLimit) {
      const planLabel = isSubscribed ? plan : 'free plan'
      return NextResponse.json(
        { error: `Daily message limit reached (${individualLimit}/day on ${planLabel}).${isSubscribed ? ' Try again tomorrow.' : ' Upgrade to continue.'}` },
        { status: 429 }
      )
    }

    // Track per-user usage
    await supabase.from('ai_usage').upsert(
      { user_id: user.id, date: today, message_count: currentCount + 1 },
      { onConflict: 'user_id,date' }
    )

    // Trim conversation history sent to the API — keep last 20 turns max to cap input tokens
    const trimmedMessages = messages.length > 20
      ? messages.slice(-20)
      : messages

    // Get module description for system prompt context
    let moduleDescription: string | undefined
    if (moduleId) {
      const { data: moduleData } = await supabase
        .from('modules')
        .select('description')
        .eq('id', moduleId)
        .single()
      moduleDescription = moduleData?.description ?? undefined
    }

    const stream = await streamLLMResponse(
      trimmedMessages,
      tier,
      settings,
      moduleTitle,
      moduleDescription,
      mode
    )

    // Save history after streaming completes (we need to buffer for this)
    // Instead: save user message now, save assistant message after stream
    const userMessage = messages[messages.length - 1]
    if (saveHistory && settings.conversation_history_enabled === 'true' && moduleId) {
      await supabase.from('conversations').insert({
        user_id: user.id,
        module_id: moduleId,
        role: userMessage.role,
        content: userMessage.content,
      })
    }

    // Wrap the stream to capture assistant response and save to history
    if (saveHistory && settings.conversation_history_enabled === 'true' && moduleId) {
      const [streamForClient, streamForCapture] = stream.tee()

      // Capture in background — don't await so we don't block response
      ;(async () => {
        try {
          const reader = streamForCapture.getReader()
          const decoder = new TextDecoder()
          let fullResponse = ''
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            fullResponse += decoder.decode(value, { stream: true })
          }
          if (fullResponse) {
            await supabase.from('conversations').insert({
              user_id: user.id,
              module_id: moduleId,
              role: 'assistant',
              content: fullResponse,
            })
          }
        } catch {
          // Non-critical — history save failure shouldn't affect the user
        }
      })()

      return new Response(streamForClient, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
