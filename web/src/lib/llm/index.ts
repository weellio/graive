import type { AgeTier, ChatMessage, LLMProvider } from '@/types'
import type { SiteSettings } from '@/types'
import { getSystemPrompt, getPlaygroundPrompt } from './system-prompts'
import { streamClaude } from './providers/claude'
import { streamOpenAI } from './providers/openai'
import { streamGemini } from './providers/gemini'

export async function streamLLMResponse(
  messages: ChatMessage[],
  tier: AgeTier,
  settings: SiteSettings,
  moduleTitle?: string,
  moduleDescription?: string,
  mode: 'tutor' | 'playground' = 'tutor'
): Promise<ReadableStream<Uint8Array>> {
  const provider = settings.llm_provider as LLMProvider
  const apiKey = settings.llm_api_key_override || undefined

  const modelKey = `llm_model_${tier}` as keyof SiteSettings
  const model = settings[modelKey] as string

  // Playground mode always uses the open prompt — ignores DB overrides
  let systemPrompt: string
  if (mode === 'playground') {
    systemPrompt = getPlaygroundPrompt(tier)
  } else {
    const overrideKey = `system_prompt_${tier}` as keyof SiteSettings
    const override = settings[overrideKey] as string | undefined
    systemPrompt = override?.trim()
      ? override.trim()
      : getSystemPrompt({ tier, moduleTitle, moduleDescription })
  }

  switch (provider) {
    case 'gemini':
      return streamGemini(messages, systemPrompt, model || 'gemini-2.0-flash', apiKey)
    case 'openai':
      return streamOpenAI(messages, systemPrompt, model || 'gpt-4o-mini', apiKey)
    case 'claude':
    default:
      return streamClaude(messages, systemPrompt, model || 'claude-haiku-4-5-20251001', apiKey)
  }
}
