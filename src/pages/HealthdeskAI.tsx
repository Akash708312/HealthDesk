
// src/HealthdeskAI.tsx
import React, { useState, useRef, useEffect } from 'react'
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Bot, Send, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ScrollArea } from '@/components/ui/scroll-area'

type Message = {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

// read from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string

const HealthdeskAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hello! I'm your HealthDesk AI assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!API_KEY) {
      toast.error('Missing VITE_GEMINI_API_KEY in .env')
      console.error('Set VITE_GEMINI_API_KEY in your .env file')
    }
  }, [])

  const callGemini = async (history: Message[]): Promise<string> => {
    try {
      if (!API_KEY) return 'AI not configured.'
  
      const genAI = new GoogleGenerativeAI(API_KEY)
  
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      })
  
      const formattedHistory = history.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
  
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are a helpful health assistant. Provide general health information only. Never provide diagnosis or treatment.' }],
          },
          ...formattedHistory
        ]
      })
  
      const result = await chat.sendMessage(input)
      return result.response.text()
  
    } catch (err: any) {
      console.error("Gemini SDK Error:", err)
      toast.error('AI request failed')
      return "I'm having trouble responding right now. Please try again later."
    }
  }
  
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(m => [...m, userMsg])
    setInput('')
    setIsTyping(true)

    const reply = await callGemini([...messages, userMsg])
    setMessages(m => [...m, {
      id: (Date.now() + 1).toString(),
      content: reply,
      sender: 'bot',
      timestamp: new Date()
    }])
    setIsTyping(false)
  }

  return (
    <MainLayout showSidebar={true}>
      <div className="flex flex-col h-[calc(100vh-4rem)] py-4">
        <Card className="flex-1 flex flex-col border overflow-hidden">
          <CardHeader className="border-b flex items-center p-4 shrink-0">
            <Avatar className="mr-2"><Bot /></Avatar>
            <div>
              <CardTitle>HealthDesk Assistant</CardTitle>
              <CardDescription>Not medical advice.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={cn('flex', m.sender === 'bot' ? 'justify-start' : 'justify-end')}>
                    <Avatar className={cn('mr-2 flex-shrink-0', m.sender === 'bot' ? '' : 'invisible')}>
                      <Bot />
                    </Avatar>
                    <div className={cn('px-4 py-2 rounded-lg shadow-sm max-w-[80%]', m.sender === 'bot' ? 'bg-gray-100' : 'bg-blue-600 text-white')}>
                      {m.content}
                    </div>
                    <Avatar className={cn('ml-2 flex-shrink-0', m.sender === 'user' ? '' : 'invisible')}>
                      <User />
                    </Avatar>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="mr-2"><Bot /></Avatar>
                    <Loader2 className="animate-spin" />
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            <form onSubmit={send} className="flex gap-2 border-t p-4 shrink-0">
              <Input
                value={input}
                onChange={e => setInput(e.currentTarget.value)}
                placeholder="Ask a health question…"
                disabled={isTyping || !API_KEY}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isTyping || !API_KEY}>
                {isTyping ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

export default HealthdeskAI
