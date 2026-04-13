/**
 * callAI — single non-streaming AI call across all providers.
 * Usage: const text = await callAI(prompt, settings, 1500)
 */
import type { SiteSettings } from '@/types'

export const PROVIDER_DEFAULTS: Record<string, string> = {
  claude:   'claude-sonnet-4-6',
  openai:   'gpt-4o',
  gemini:   'gemini-2.0-flash',
  deepseek: 'deepseek-chat',
}

export const MODEL_PREFIXES: Record<string, string> = {
  claude:   'claude',
  openai:   'gpt',
  gemini:   'gemini',
  deepseek: 'deepseek',
}

/** Resolve the correct model for the active provider, ignoring stale stored models from other providers. */
export function resolveModel(provider: string, storedModel: string): string {
  const prefix = MODEL_PREFIXES[provider]
  return (prefix && storedModel.startsWith(prefix))
    ? storedModel
    : PROVIDER_DEFAULTS[provider] ?? PROVIDER_DEFAULTS.claude
}

export async function callAI(
  prompt: string,
  settings: SiteSettings,
  maxTokens = 1500,
): Promise<string> {
  const provider = settings.llm_provider
  const apiKey = settings.llm_api_key_override || undefined
  const model = resolveModel(provider, settings.llm_model || '')

  switch (provider) {
    case 'openai': {
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY })
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      })
      return res.choices[0]?.message?.content ?? ''
    }

    case 'gemini': {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY || '')
      const genModel = genAI.getGenerativeModel({ model })
      const res = await genModel.generateContent(prompt)
      return res.response.text()
    }

    case 'deepseek': {
      // DeepSeek is OpenAI-compatible — use the OpenAI SDK with a custom base URL
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({
        apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      })
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      })
      return res.choices[0]?.message?.content ?? ''
    }

    default: {
      // claude
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY })
      const res = await client.messages.create({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      })
      return res.content[0].type === 'text' ? res.content[0].text : ''
    }
  }
}
