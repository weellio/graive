'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TIER_CONFIG, type AgeTier, type ChatMessage } from '@/types'
import { Send, Bot, User, Loader2, GraduationCap, Zap } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

const PLAYGROUND_COLOR = '#10b981' // emerald-500

interface ChatPanelProps {
  moduleId: string
  moduleTitle: string
  tier: AgeTier
  initialMessages: ChatMessage[]
  historyEnabled: boolean
}

export function ChatPanel({ moduleId, moduleTitle, tier, initialMessages, historyEnabled }: ChatPanelProps) {
  const [mode, setMode] = useState<'tutor' | 'playground'>('tutor')
  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>(initialMessages)
  const [playMessages, setPlayMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tierCfg = TIER_CONFIG[tier]

  const messages = mode === 'tutor' ? tutorMessages : playMessages
  const setMessages = mode === 'tutor' ? setTutorMessages : setPlayMessages

  const accentColor = mode === 'playground' ? PLAYGROUND_COLOR : tierCfg.color
  const assistantName = tier === 'explorer' ? 'Spark' : 'Sage'

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
          saveHistory: mode === 'tutor' && historyEnabled,
          mode,
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
        fullText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }
    } catch (err) {
      setMessages(prev => prev.slice(0, -1))
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setStreaming(false)
    }
  }, [input, messages, setMessages, moduleId, moduleTitle, tier, historyEnabled, streaming, mode])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const emptyState = mode === 'tutor' ? (
    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
      <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: accentColor + '20' }}>
        <GraduationCap className="h-6 w-6" style={{ color: accentColor }} />
      </div>
      <p className="font-semibold" style={{ color: accentColor }}>Hi! I&apos;m {assistantName}</p>
      <p className="text-sm text-muted-foreground mt-1">
        I&apos;m here to help you with <strong>{moduleTitle}</strong>. Ask me anything about the lesson!
      </p>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
      <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: PLAYGROUND_COLOR + '20' }}>
        <Zap className="h-6 w-6" style={{ color: PLAYGROUND_COLOR }} />
      </div>
      <p className="font-semibold" style={{ color: PLAYGROUND_COLOR }}>AI Playground</p>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Try anything here — write a story, ask questions, test your prompts from the lesson.
        <br />
        <span className="text-xs text-muted-foreground mt-1 block">This AI is open and ready to help with anything.</span>
      </p>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">

      {/* Mode toggle */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setMode('tutor')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-all"
          style={mode === 'tutor'
            ? { color: tierCfg.color, borderBottom: `2px solid ${tierCfg.color}`, backgroundColor: tierCfg.color + '08' }
            : { color: '#94a3b8', borderBottom: '2px solid transparent' }}
        >
          <GraduationCap className="h-4 w-4" />
          {assistantName}
        </button>
        <button
          onClick={() => setMode('playground')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-all"
          style={mode === 'playground'
            ? { color: PLAYGROUND_COLOR, borderBottom: `2px solid ${PLAYGROUND_COLOR}`, backgroundColor: PLAYGROUND_COLOR + '08' }
            : { color: '#94a3b8', borderBottom: '2px solid transparent' }}
        >
          <Zap className="h-4 w-4" />
          Try It
        </button>
      </div>

      {/* Mode description pill */}
      <div className="px-3 py-1.5 border-b border-border text-xs text-center"
        style={{ backgroundColor: accentColor + '08', color: accentColor }}>
        {mode === 'tutor'
          ? `📚 Lesson helper — asks about ${moduleTitle}`
          : '🎮 Open AI — write stories, test prompts, ask anything'}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? emptyState : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} accentColor={accentColor} assistantName={assistantName} mode={mode} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-2 items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">{mode === 'tutor' ? assistantName : 'AI'} is thinking…</span>
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
            placeholder={mode === 'tutor'
              ? `Ask ${assistantName} about this lesson…`
              : 'Write a story, ask a question, try a prompt…'}
            rows={2}
            className="resize-none text-sm"
            disabled={streaming}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            size="icon"
            className="h-full aspect-square flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

function ChatBubble({
  message, accentColor, assistantName, mode,
}: {
  message: ChatMessage
  accentColor: string
  assistantName: string
  mode: 'tutor' | 'playground'
}) {
  const isUser = message.role === 'user'
  const Icon = mode === 'playground' ? Zap : Bot

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: isUser ? '#e2e8f0' : accentColor + '20' }}>
        {isUser
          ? <User className="h-3.5 w-3.5 text-muted-foreground" />
          : <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />}
      </div>
      <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed ${
        isUser
          ? 'bg-muted text-foreground rounded-tr-sm'
          : 'bg-card border border-border text-foreground rounded-tl-sm'
      }`}>
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
