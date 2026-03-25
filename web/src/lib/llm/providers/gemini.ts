import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ChatMessage } from '@/types'

export async function streamGemini(
  messages: ChatMessage[],
  systemPrompt: string,
  model: string,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY || '')

  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
  })

  // Gemini uses 'model' for assistant role
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const chat = genModel.startChat({ history })
  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessageStream(lastMessage.content)

  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })
}
