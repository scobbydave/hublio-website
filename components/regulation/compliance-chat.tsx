'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Loader2,
  MessageCircle,
  Shield
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ComplianceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI Compliance Advisor specializing in mining regulations and compliance. I can help you with:

• **Safety regulations** and protocols
• **Environmental compliance** requirements
• **Labor laws** specific to mining
• **Licensing** and permit guidance
• **Equipment safety** standards
• **Health and safety** protocols
• **Water and air quality** standards

I only provide information related to mining compliance. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/regulation/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble processing your request right now. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Compliance Advisor
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Bot className="h-3 w-3 mr-1" />
                  Powered by Gemini
                </Badge>
              </CardTitle>
              <CardDescription>
                Get instant answers to your mining compliance questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                    <div className={`flex-1 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-lg max-w-[90%] break-words ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-white dark:bg-slate-700 border mr-auto'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} 
                              components={{
                                p: ({children}) => <p className="break-words mb-2 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="break-words ml-4 mb-2">{children}</ul>,
                                li: ({children}) => <li className="break-words mb-1">{children}</li>,
                                strong: ({children}) => <strong className="font-semibold">{children}</strong>
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm break-words">{message.content}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {mounted ? message.timestamp.toLocaleTimeString() : '...'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Bot className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="p-3 bg-white dark:bg-slate-700 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Analyzing compliance regulations...
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs">
                This AI provides informational guidance only. Consult legal professionals for compliance decisions.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about mining regulations, safety standards, environmental compliance..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                className="px-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {[
                'What are the main safety requirements for underground mining?',
                'How do I obtain a mining license in South Africa?',
                'What environmental permits do I need for a new mine?',
                'What are the latest changes to mining labor laws?'
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInput(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
