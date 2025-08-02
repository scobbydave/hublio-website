import { type NextRequest, NextResponse } from "next/server"
import {
  generateAIResponse,
  getChatSession,
  createChatSession,
  updateChatSession,
  type ChatMessage,
} from "@/lib/ai/chat"
import { getFAQs } from "@/lib/sanity"
import { rateLimit, getClientIdentifier, rateLimits } from "@/lib/rate-limit"
import { sendLeadNotification } from "@/lib/email"
import { shouldGenerateFAQ } from "@/lib/ai/faq"

const chatRateLimit = rateLimit(rateLimits.chat)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = chatRateLimit(identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        },
      )
    }

    const body = await request.json()
    const { message, sessionId, messages } = body

    if (!message || !sessionId) {
      return NextResponse.json({ error: "Message and session ID are required" }, { status: 400 })
    }

    // Get or create chat session
    let session = getChatSession(sessionId)
    if (!session) {
      session = createChatSession(sessionId)
    }

    // Add user message to session
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }

    session.messages.push(userMessage)

    // Check for lead capture intent
    const leadIntent = detectLeadIntent(message)
    if (leadIntent && !session.userInfo?.email) {
      const leadInfo = extractLeadInfo(message)
      if (leadInfo.email) {
        session.userInfo = leadInfo

        // Send lead notification
        await sendLeadNotification({
          name: leadInfo.name || "Unknown",
          email: leadInfo.email,
          message: message,
          source: "chat",
          sessionId,
        })
      }
    }

    // Get relevant context from FAQs
    const faqs = await getFAQs()
    const context = buildContext(message, faqs)

    // Generate AI response
    const aiResponse = await generateAIResponse(session.messages, context)

    // Add AI response to session
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    }

    session.messages.push(assistantMessage)

    // Check if we should generate a new FAQ
    if (shouldGenerateFAQ(message, faqs)) {
      // Generate FAQ in the background (don't wait for it)
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai/faq/auto-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      }).catch((error) => console.error("Background FAQ generation failed:", error))
    }

    // Update session
    updateChatSession(sessionId, session)

    return NextResponse.json(
      { response: aiResponse },
      {
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      },
    )
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function detectLeadIntent(message: string): boolean {
  const leadKeywords = [
    "contact",
    "quote",
    "price",
    "cost",
    "interested",
    "demo",
    "consultation",
    "meeting",
    "call",
    "email",
    "phone",
  ]

  return leadKeywords.some((keyword) => message.toLowerCase().includes(keyword))
}

function extractLeadInfo(message: string): { name?: string; email?: string } {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const email = message.match(emailRegex)?.[0]

  // Simple name extraction (this could be improved with NLP)
  const namePatterns = [/my name is ([a-zA-Z\s]+)/i, /i'm ([a-zA-Z\s]+)/i, /i am ([a-zA-Z\s]+)/i]

  let name: string | undefined
  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match) {
      name = match[1].trim()
      break
    }
  }

  return { name, email }
}

function buildContext(message: string, faqs: any[]): string {
  // Simple keyword matching for relevant FAQs
  const relevantFAQs = faqs
    .filter((faq) => {
      const messageWords = message.toLowerCase().split(" ")
      const faqWords = (faq.question + " " + faq.answer).toLowerCase()

      return messageWords.some((word) => word.length > 3 && faqWords.includes(word))
    })
    .slice(0, 3) // Limit to top 3 relevant FAQs

  if (relevantFAQs.length === 0) return ""

  return relevantFAQs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")
}
