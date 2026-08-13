import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { ChatAPI } from '../../lib/api'
import type { ChatMessage } from '../../types'
import { FadeIn } from '../../components/motion/FadeIn'

export function ParentChat() {
  const { myChildren, children: allChildren } = useData()
  const { activeChild } = useActiveChild()
  const child = activeChild || myChildren[0] || allChildren[0]
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!child) return
    void ChatAPI.list(child.id)
      .then((r) => setMessages(r.messages))
      .catch(() => {
        setMessages([
          {
            id: 'cm0',
            role: 'assistant',
            content: `Namaste! I’m BalVikas AI. Ask about ${child.name}'s milestones, diet, or vaccines.`,
            timestamp: new Date().toISOString(),
          },
        ])
      })
  }, [child])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  if (!child) return <p className="text-slate text-sm">No child data yet.</p>

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    setTyping(true)
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, optimistic])
    try {
      const { messages: pair } = await ChatAPI.send(child.id, text)
      setMessages((m) => {
        const without = m.filter((x) => x.id !== optimistic.id)
        return [...without, ...pair]
      })
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Could not reach the assistant. Check that the API server is running.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="max-w-3xl h-[calc(100vh-8rem)] flex flex-col">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">AI care assistant</h1>
        <p className="text-sm text-slate mb-4">Live chat stored on the server for {child.name}</p>
      </FadeIn>

      <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-forest text-mint flex items-center justify-center shrink-0">
                    <Bot size={15} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user' ? 'chat-user' : 'chat-bot text-ink'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-sky text-white flex items-center justify-center shrink-0">
                    <User size={15} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-forest text-mint flex items-center justify-center">
                <Bot size={15} />
              </div>
              <div className="chat-bot px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-mist">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${child.name}…`}
              className="flex-1 px-4 py-3 rounded-2xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="specular-btn px-4 rounded-2xl disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
