import type { AgeTier, ChatMessage, LLMProvider } from '@/types'
import type { SiteSettings } from '@/types'
import { getSystemPrompt } from './system-prompts'
import { streamClaude } from './providers/claude'
import { streamOpenAI } from './providers/openai'

export async function streamLLMResponse(
  messages: ChatMessage[],
  tier: AgeTier,
  settings: SiteSettings,
  moduleTitle?: string,
  moduleDescription?: string
): Promise<ReadableStream<Uint8Array>> {
  const provider = settings.llm_provider as LLMProvider
  const apiKey = settings.llm_api_key_override || undefined

  const modelKey = `llm_model_${tier}` as keyof SiteSettings
  const model = settings[modelKey] as string

  // DB override takes priority — allows imported curricula to set their own tutor personality
  const overrideKey = `system_prompt_${tier}` as keyof SiteSettings
  const override = settings[overrideKey] as string | undefined
  const systemPrompt = override?.trim()
    ? override.trim()
    : getSystemPrompt({ tier, moduleTitle, moduleDescription })

  switch (provider) {
    case 'openai':
      return streamOpenAI(messages, systemPrompt, model || 'gpt-4o-mini', apiKey)
    case 'claude':
    default:
      return streamClaude(messages, systemPrompt, model || 'claude-haiku-4-5-20251001', apiKey)
  }
}
