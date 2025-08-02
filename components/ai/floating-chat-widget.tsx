'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageCircle, Send, X, User, Bot, Minimize2, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  metadata?: {
    intent?: string
    navigationAction?: {
      type: 'navigate' | 'suggest'
      url: string
      label: string
    }
    smartSuggestions?: Array<{
      label: string
      action: string
      url?: string
    }>
  }
}

interface LeadForm {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Generate session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    
    // Add professional welcome message with smart suggestions
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Hublio! I\'m your AI Assistant specializing in mining industry solutions. I can help you find mining jobs, explore our AI solutions, get the latest mining news, or navigate the site.\n\nHow can I assist you today?',
      timestamp: Date.now(),
      metadata: {
        intent: 'greeting',
        smartSuggestions: [
          { label: 'Find Mining Jobs', action: 'navigate', url: '/vacancies' },
          { label: 'Latest Mining News', action: 'navigate', url: '/blog' },
          { label: 'Our AI Solutions', action: 'navigate', url: '/services' },
          { label: 'Contact Expert', action: 'navigate', url: '/contact' }
        ]
      }
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setHasUnreadMessages(false)
      inputRef.current?.focus()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          context: 'website_chat'
        })
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
          metadata: data.metadata
        }

        setMessages(prev => [...prev, assistantMessage])

        // Handle navigation actions
        if (data.metadata?.navigationAction?.type === 'navigate') {
          // Auto-navigate after a short delay if user doesn't interact
          setTimeout(() => {
            if (confirm(`Would you like me to take you to ${data.metadata.navigationAction.label}?`)) {
              window.location.href = data.metadata.navigationAction.url
            }
          }, 2000)
        }

        // Check if AI suggests lead capture
        if (data.suggestLeadCapture || data.metadata?.intent === 'lead_capture') {
          setTimeout(() => {
            setShowLeadForm(true)
          }, 1000)
        }

        // Show unread indicator if chat is minimized
        if (isMinimized || !isOpen) {
          setHasUnreadMessages(true)
        }
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact us directly.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const submitLeadForm = async () => {
    if (!leadForm.name || !leadForm.email) {
      toast.error('Please fill in your name and email')
      return
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          source: 'ai-chat',
          chatContext: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
        })
      })

      if (response.ok) {
        toast.success('Thank you! We\'ll be in touch soon.')
        setShowLeadForm(false)
        setLeadForm({ name: '', email: '', phone: '', company: '', message: '' })
        
        const thankYouMessage: Message = {
          id: `thanks_${Date.now()}`,
          role: 'assistant',
          content: 'Thank you for providing your contact information! Our team will reach out to you soon. Is there anything else I can help you with today?',
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, thankYouMessage])
      } else {
        throw new Error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Lead submission error:', error)
      toast.error('Failed to submit your information. Please try again.')
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome_new',
      role: 'assistant',
      content: 'Chat cleared! How can I help you today?',
      timestamp: Date.now()
    }])
  }

  return (
    <>
      {/* Professional Chat Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {!isOpen && (
          <div 
            className="relative group cursor-pointer"
            onClick={() => {
              console.log('Container clicked');
              setIsOpen(true);
            }}
          >
            {/* Clean professional button */}
            <div
              className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 border border-primary/20 cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Direct div clicked');
                setIsOpen(true);
              }}
            >
              <MessageCircle className="h-7 w-7 text-white" />
              {hasUnreadMessages && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full">
                  <div className="w-full h-full bg-red-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            
            {/* Professional tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 text-sm bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              AI Assistant - How can I help?
              Ask Hublio AI Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
            
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 animate-ping pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed inset-4 md:bottom-6 md:right-6 md:inset-auto z-[9999] transition-all duration-300 ${
          isMinimized ? 'md:w-80 md:h-16 w-full h-16' : 'md:w-96 md:h-[600px] w-full h-full'
        }`}>
          <Card className="w-full h-full shadow-2xl border-2 border-primary/10 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
            {/* Header */}
            <CardHeader className="pb-3 bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Hublio AI Assistant</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/90">Online & Ready to Help</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] md:max-h-[400px] max-h-[calc(100vh-200px)]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-[85%] md:max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-primary to-secondary text-white ml-auto shadow-lg'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {/* Smart Suggestions for AI messages */}
                        {message.role === 'assistant' && message.metadata?.smartSuggestions && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.metadata.smartSuggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 border-primary/30 text-primary hover:bg-primary/10"
                                onClick={() => {
                                  if (suggestion.action === 'navigate' && suggestion.url) {
                                    window.location.href = suggestion.url
                                  } else if (suggestion.action === 'call' && suggestion.url) {
                                    window.open(suggestion.url)
                                  } else {
                                    // Send as message
                                    setInputValue(suggestion.label)
                                  }
                                }}
                              >
                                {suggestion.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block p-3 rounded-lg bg-muted">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about mining services, safety, careers..."
                      disabled={isLoading}
                      className="flex-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      <span className="hidden md:inline">Powered by Hublio AI • Session: {sessionId.slice(-8)}</span>
                      <span className="md:hidden">Hublio AI</span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-xs hover:bg-primary/10"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
              Let's Connect!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              I'd love to help you optimize your mining operations! Please share your details so our mining experts can reach out with personalized solutions.
            </p>
            
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-primary">Full Name *</label>
                <Input
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-primary">Business Email *</label>
                <Input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@company.com"
                  className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary">Phone Number</label>
                <Input
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+27 XX XXX XXXX"
                  className="mt-1 focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary">Mining Company</label>
                <Input
                  value={leadForm.company}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your mining company name"
                  className="mt-1 focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={submitLeadForm} 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
              >
                Connect with Hublio
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLeadForm(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
