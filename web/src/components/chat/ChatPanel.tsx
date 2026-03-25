'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TIER_CONFIG, type AgeTier, type ChatMessage } from '@/types'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

interface ChatPanelProps {
  moduleId: string
  moduleTitle: string
  tier: AgeTier
  initialMessages: ChatMessage[]
  historyEnabled: boolean
}

export function ChatPanel({ moduleId, moduleTitle, tier, initialMessages, historyEnabled }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tierCfg = TIER_CONFIG[tier]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    // Placeholder for streaming response
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          moduleId,
          moduleTitle,
          tier,
          saveHistory: historyEnabled,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to get response')
      }

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }
    } catch (err) {
      setMessages(prev => prev.slice(0, -1)) // remove empty assistant msg
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setStreaming(false)
    }
  }, [input, messages, moduleId, moduleTitle, tier, historyEnabled, streaming])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const assistantName = tier === 'explorer' ? 'Spark' : 'Sage'

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b ${tierCfg.bgClass} ${tierCfg.borderClass}`}>
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: tierCfg.color }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${tierCfg.textClass}`}>{assistantName}</p>
            <p className="text-xs text-slate-500">AI Study Assistant · {tierCfg.label} Level</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: tierCfg.color + '20' }}
            >
              <Bot className="h-6 w-6" style={{ color: tierCfg.color }} />
            </div>
            <p className={`font-semibold ${tierCfg.textClass}`}>Hi! I&apos;m {assistantName}</p>
            <p className="text-sm text-slate-500 mt-1">
              I&apos;m here to help you with <strong>{moduleTitle}</strong>. Ask me anything about the lesson!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} tierColor={tierCfg.color} assistantName={assistantName} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-2 items-center text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">{assistantName} is thinking…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${assistantName} about this lesson…`}
            rows={2}
            className="resize-none text-sm"
            disabled={streaming}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            size="icon"
            className="h-full aspect-square flex-shrink-0"
            style={{ backgroundColor: tierCfg.color }}
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

function ChatBubble({
  message,
  tierColor,
  assistantName,
}: {
  message: ChatMessage
  tierColor: string
  assistantName: string
}) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: isUser ? '#e2e8f0' : tierColor + '20',
        }}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-slate-500" />
        ) : (
          <Bot className="h-3.5 w-3.5" style={{ color: tierColor }} />
        )}
      </div>
      <div
        className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed ${
          isUser
            ? 'bg-slate-100 text-slate-800 rounded-tr-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:my-2">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
