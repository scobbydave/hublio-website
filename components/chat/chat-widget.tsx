"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Loader2, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: number
  metadata?: {
    intent?: string
    pageReference?: string
    navigationSuggestion?: string
    contactInfo?: any
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add Hubs welcome message
      setMessages([
        {
          id: "1",
          content:
            "Hello! I'm Hubs, your AI assistant for Hublio. I specialize in mining industry solutions and can help you navigate our website, learn about our AI-powered tools, or discuss mining topics. How can I assist you today?",
          role: "assistant",
          timestamp: Date.now(),
          metadata: {
            intent: "welcome",
          },
        },
      ])
    }
  }, [isOpen, messages.length])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsOpen(false) // Close chat after navigation
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("Sending message to Hubs...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          currentPage: window.location.pathname,
          messages: [...messages, userMessage],
        }),
      })

      console.log("Hubs response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Hubs API error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Hubs response data:", data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm here to help with your mining solutions needs.",
        role: "assistant",
        timestamp: Date.now(),
        metadata: data.metadata,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Hubs chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm experiencing technical difficulties right now. Please try contacting our support team directly at info@hublio.co.za or +27 11 123 4567 for immediate assistance.",
        role: "assistant",
        timestamp: Date.now(),
        metadata: {
          intent: "error",
          contactInfo: {
            email: "info@hublio.co.za",
            phone: "+27 11 123 4567",
          },
        },
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "hublio-gradient border-0 text-white hover:opacity-90",
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-40 flex flex-col chat-widget-enter">
          {/* Header */}
          <div className="p-4 border-b hublio-gradient text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Hubs AI Assistant</h3>
                <p className="text-sm opacity-90">Mining Industry Specialist</p>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Online
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        message.role === "user" ? "hublio-gradient text-white" : "bg-muted border border-border",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>

                  {/* Action buttons based on metadata */}
                  {message.metadata && message.role === "assistant" && (
                    <div className="mt-2 flex flex-wrap gap-2 justify-start">
                      {message.metadata.pageReference && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigation(message.metadata.pageReference)}
                          className="text-xs"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          {message.metadata.pageReference === "/contact"
                            ? "Contact Us"
                            : message.metadata.pageReference === "/services"
                              ? "View Services"
                              : message.metadata.pageReference === "/about"
                                ? "About Us"
                                : message.metadata.pageReference === "/blog"
                                  ? "Read Blog"
                                  : "Visit Page"}
                        </Button>
                      )}

                      {message.metadata.contactInfo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigation("/contact")}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Get in Touch
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2 border border-border">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Hubs is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t bg-muted/30">
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("Show me your features")}
                className="text-xs h-6 px-2"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("Tell me about safety solutions")}
                className="text-xs h-6 px-2"
              >
                Safety
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("How can I contact you?")}
                className="text-xs h-6 px-2"
              >
                Contact
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("Show me mining news")}
                className="text-xs h-6 px-2"
              >
                News
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Hubs about mining solutions..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
