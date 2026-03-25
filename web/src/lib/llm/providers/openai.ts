import OpenAI from 'openai'
import type { ChatMessage } from '@/types'

export async function streamOpenAI(
  messages: ChatMessage[],
  systemPrompt: string,
  model: string,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY })

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })
}
