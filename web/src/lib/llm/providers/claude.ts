import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from '@/types'

export async function streamClaude(
  messages: ChatMessage[],
  systemPrompt: string,
  model: string,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY })

  const stream = await client.messages.stream({
    model,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })
}
