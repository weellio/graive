// DeepSeek is OpenAI-compatible — reuse the OpenAI SDK with a custom base URL
import OpenAI from 'openai'
import type { ChatMessage } from '@/types'

export async function streamDeepSeek(
  messages: ChatMessage[],
  systemPrompt: string,
  model: string,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const client = new OpenAI({
    apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  })

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })
}
