import { type NextRequest, NextResponse } from "next/server"
import { rateLimit, getClientIdentifier, rateLimits } from "@/lib/rate-limit"
import {
  generateHubsResponse,
  createHubsSession,
  getHubsSession,
  updateHubsSession,
  type HubsMessage,
} from "@/lib/ai/hubs"

const chatRateLimit = rateLimit(rateLimits.chat)

// Site map for navigation assistance
const SITE_MAP = {
  "/": "Homepage - Hero, Features, Testimonials, Blog preview, Contact",
  "/about": "About Us - Mission, Vision, Values, Team",
  "/services":
    "Services - AI Analytics, Safety Systems, Operational Efficiency, Data Integration, Custom Solutions, 24/7 Support",
  "/blog": "Blog - Mining insights, news, safety tips, industry trends",
  "/contact": "Contact - Contact form, office details, emergency support",
}

// Updated contact information
const CONTACT_INFO = {
  general: {
    email: "info@hublio.co.za",
    phone: "+27 60 873 1659",
    location: "Johannesburg, South Africa",
  },
  emergency: {
    phone: "+27 60 873 1659",
    description: "24/7 emergency support for critical mining operations",
  },
  office_hours: {
    weekdays: "Monday-Friday: 8:00 AM - 6:00 PM",
    saturday: "Saturday: 9:00 AM - 2:00 PM",
    sunday: "Sunday: Closed",
  },
}

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
    const { message, sessionId, currentPage } = body

    if (!message || !sessionId) {
      return NextResponse.json({ error: "Message and session ID are required" }, { status: 400 })
    }

    console.log(`Hubs Chat API: Received message from session ${sessionId}:`, message)

    // Get or create Hubs session
    let session = getHubsSession(sessionId)
    if (!session) {
      session = createHubsSession(sessionId)
    }

    // Add user message to session
    const userMessage: HubsMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }

    session.messages.push(userMessage)

    // Update user context if available
    if (currentPage) {
      session.userContext = {
        ...session.userContext,
        currentPage,
      }
    }

    // Prepare context for Hubs
    const context = {
      currentPage: currentPage || "/",
      siteMap: SITE_MAP,
      contactInfo: CONTACT_INFO,
      recentNews: [], // TODO: Integrate with News API
    }

    let hubsResponse: any

    try {
      // Generate Hubs response
      hubsResponse = await generateHubsResponse(session.messages, context)
    } catch (aiError: any) {
      console.log("Hubs AI error, using fallback:", aiError?.message || aiError)
      hubsResponse = {
        response: createBasicHubsResponse(message),
        metadata: { intent: "general" },
      }
    }

    // Add Hubs response to session
    const assistantMessage: HubsMessage = {
      role: "assistant",
      content: hubsResponse.response,
      timestamp: Date.now(),
      metadata: hubsResponse.metadata,
    }

    session.messages.push(assistantMessage)

    // Update session
    updateHubsSession(sessionId, session)

    console.log("Hubs Chat API: Sending response:", hubsResponse.response)

    // Log escalation if this is an admin escalation
    if (hubsResponse.metadata?.intent === "admin_escalation") {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/escalation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            originalQuestion: hubsResponse.metadata.originalQuestion,
            userMessage: message,
            escalationType: hubsResponse.metadata.escalationType,
          }),
        })
      } catch (escalationError) {
        console.error("Failed to log escalation:", escalationError)
      }
    }

    // Return response with metadata for frontend actions
    return NextResponse.json(
      {
        response: hubsResponse.response,
        metadata: hubsResponse.metadata,
      },
      {
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      },
    )
  } catch (error) {
    console.error("Hubs Chat API error:", error)
    return NextResponse.json(
      {
        response:
          "I'm Hubs, your mining industry assistant. I'm experiencing technical difficulties right now, but I'm here to help with your mining solutions needs. Please try contacting our support team directly at info@hublio.co.za or +27 60 873 1659.",
        metadata: { intent: "error", contactInfo: CONTACT_INFO },
      },
      { status: 200 }, // Return 200 to avoid frontend errors
    )
  }
}

function createBasicHubsResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Navigation responses
  if (lowerMessage.includes("feature") || lowerMessage.includes("service")) {
    return "I can show you Hublio's key features! We offer AI-Powered Analytics, Safety Management Systems, Operational Efficiency tools, Data Integration, Custom Solutions, and 24/7 Support. Would you like me to take you to our Services page to explore these in detail?"
  }

  if (lowerMessage.includes("about") || lowerMessage.includes("company")) {
    return "Hublio is a South African company specializing in AI-powered mining solutions. Our mission is to transform mining operations through cutting-edge technology, focusing on safety, efficiency, and optimization. Would you like to visit our About page to learn more about our team and values?"
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
    return "Here's how to reach our team:\n\n📧 info@hublio.co.za\n📞 +27 60 873 1659\n📍 Johannesburg, South Africa\n🚨 Emergency: +27 60 873 1659\n\nOffice Hours: Monday-Friday 8AM-6PM, Saturday 9AM-2PM\n\nWould you like me to take you to our contact page?"
  }

  if (lowerMessage.includes("blog") || lowerMessage.includes("news") || lowerMessage.includes("article")) {
    return "Our blog features the latest mining industry insights, safety tips, and AI technology updates. We cover South African mining news and provide practical guidance for mining professionals. Would you like to explore our blog section?"
  }

  if (lowerMessage.includes("safety") || lowerMessage.includes("health")) {
    return "Safety is our top priority at Hublio! Our Safety Management Systems provide real-time monitoring, hazard prediction, and compliance tracking. We've helped mining companies reduce incident rates by up to 40%. Our systems monitor conditions 24/7 and alert teams to potential risks before they become incidents."
  }

  if (lowerMessage.includes("ai") || lowerMessage.includes("analytics")) {
    return "Our AI-Powered Analytics solution uses machine learning to analyze mining data and provide actionable insights. It includes predictive maintenance, resource optimization, and performance analytics. This helps mining companies reduce downtime by up to 35% and maximize productivity. Would you like to learn more about our AI solutions?"
  }

  if (lowerMessage.includes("mining") || lowerMessage.includes("solution")) {
    return "Hublio provides comprehensive AI-powered solutions for the South African mining industry. We help optimize operations, enhance safety, and reduce costs through intelligent automation and data analytics. Our solutions include AI Analytics, Safety Systems, Operational Efficiency tools, and more. What specific aspect interests you most?"
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm Hubs, your AI assistant for Hublio. I specialize in helping with mining industry solutions, website navigation, and answering questions about our AI-powered mining tools. How can I assist you today?"
  }

  if (lowerMessage.includes("help")) {
    return "I'm here to help! I can assist you with:\n\n🧭 **Navigation** - Find any page or section\n🔧 **Solutions** - Learn about our AI mining tools\n📝 **Content** - Mining industry insights and news\n📞 **Contact** - Connect with our team\n🛡️ **Safety** - Mining health and safety guidance\n\nWhat would you like to explore?"
  }

  // Default response
  return "I'm Hubs, Hublio's AI assistant specializing in mining industry solutions. I can help you navigate our website, learn about our AI-powered mining tools, or discuss industry topics. Our solutions help South African mining companies optimize operations, enhance safety, and reduce costs. What brings you to Hublio today?"
}
