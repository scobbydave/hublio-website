// Only create OpenAI client if API key is available - using dynamic import
let openai: any = null

async function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import("openai")).default
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    } catch (error) {
      console.log("OpenAI not available:", error.message)
    }
  }
  return openai
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: number
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  userInfo?: {
    name?: string
    email?: string
  }
  createdAt: number
  lastActivity: number
}

// In-memory session storage (replace with Redis/database in production)
const chatSessions = new Map<string, ChatSession>()

export function createChatSession(sessionId: string): ChatSession {
  const session: ChatSession = {
    id: sessionId,
    messages: [
      {
        role: "system",
        content: `You are Hublio's AI assistant, specializing in mining solutions in South Africa. 
        You help visitors learn about our services, answer questions, and capture leads.
        
        Key guidelines:
        - Be professional, helpful, and knowledgeable about mining
        - If someone shows interest, politely ask for their name and email
        - Keep responses concise but informative
        - If you don't know something, be honest and offer to connect them with our team
        - Focus on South African mining industry context`,
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
    lastActivity: Date.now(),
  }

  chatSessions.set(sessionId, session)
  return session
}

export function getChatSession(sessionId: string): ChatSession | null {
  return chatSessions.get(sessionId) || null
}

export function updateChatSession(sessionId: string, updates: Partial<ChatSession>) {
  const session = chatSessions.get(sessionId)
  if (session) {
    const updatedSession = { ...session, ...updates, lastActivity: Date.now() }
    chatSessions.set(sessionId, updatedSession)
    return updatedSession
  }
  return null
}

export async function generateAIResponse(messages: ChatMessage[], context?: string): Promise<string> {
  // Get OpenAI client dynamically
  const client = await getOpenAIClient()

  // If no OpenAI API key or client, return a helpful fallback
  if (!client) {
    const lastMessage = messages[messages.length - 1]?.content || ""
    return createFallbackResponse(lastMessage)
  }

  try {
    const systemMessage = messages.find((m) => m.role === "system")?.content || ""
    const conversationMessages = messages.filter((m) => m.role !== "system")

    const contextPrompt = context ? `\n\nAdditional context from our knowledge base:\n${context}` : ""

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemMessage + contextPrompt,
        },
        ...conversationMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return (
      response.choices[0]?.message?.content ||
      createFallbackResponse(conversationMessages[conversationMessages.length - 1]?.content || "")
    )
  } catch (error) {
    console.error("AI response error:", error)
    const lastMessage = messages[messages.length - 1]?.content || ""
    return createFallbackResponse(lastMessage)
  }
}

function createFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Mining-specific responses
  if (lowerMessage.includes("mining") || lowerMessage.includes("mine")) {
    return "Hublio specializes in AI-powered mining solutions for South African enterprises. We help optimize operations, enhance safety, and increase efficiency through advanced technology. Would you like to know more about our specific services?"
  }

  if (lowerMessage.includes("safety")) {
    return "Safety is our top priority at Hublio. Our AI systems provide real-time monitoring, predictive hazard detection, and compliance tracking to ensure the highest safety standards in mining operations. We've helped reduce incident rates by up to 40% across our client sites."
  }

  if (lowerMessage.includes("ai") || lowerMessage.includes("artificial intelligence")) {
    return "Our AI solutions include predictive maintenance, resource optimization, safety monitoring, and operational analytics. We use machine learning to analyze mining data and provide actionable insights that drive better decision-making and improved outcomes."
  }

  if (lowerMessage.includes("cost") || lowerMessage.includes("price") || lowerMessage.includes("pricing")) {
    return "Our pricing depends on your specific needs and the scale of your operations. We offer flexible packages ranging from basic monitoring to comprehensive AI solutions. I'd be happy to connect you with our sales team for a customized quote. What's the best way to reach you?"
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("demo") || lowerMessage.includes("meeting")) {
    return "I'd be happy to help you get in touch with our team! You can reach us at:\n\n📧 info@hublio.co.za\n📞 +27 60 873 1659\n📍 65 Fairways Pinnacle Point Golf Estate, Mossel Bay, Western Cape, 6500\n\nWould you like me to have someone contact you directly? If so, please share your name and email address."
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! Welcome to Hublio. I am Hubs and I'm here to help you learn about our AI-powered mining solutions. We specialize in helping South African mining companies optimize their operations, enhance safety, and reduce costs. What would you like to know?"
  }

  if (lowerMessage.includes("help")) {
    return "I'm here to help! I can tell you about:\n\n🔧 Our AI mining solutions\n🛡️ Safety systems and monitoring\n📊 Operational efficiency tools\n💰 Pricing and packages\n📞 How to get in touch with our team\n\nWhat interests you most?"
  }

  // Default response
  return "Thank you for your question! Hublio provides AI-powered solutions for the mining industry, focusing on safety, efficiency, and optimization. We work with mining companies across South Africa to implement cutting-edge technology solutions. How can I help you learn more about our services?"
}

// Cleanup old sessions (run periodically)
export function cleanupOldSessions() {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours

  for (const [sessionId, session] of chatSessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      chatSessions.delete(sessionId)
    }
  }
}
