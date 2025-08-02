import { generateAIResponse, isAIAvailable, type AIMessage } from "@/lib/ai"

export interface HubsMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: number
  metadata?: {
    intent?: string
    pageReference?: string
    contactInfo?: any
    blogDraft?: any
  }
}

export interface HubsSession {
  id: string
  messages: HubsMessage[]
  userContext?: {
    currentPage?: string
    interests?: string[]
    name?: string
    email?: string
    company?: string
  }
  createdAt: number
  lastActivity: number
}

// In-memory session storage (replace with Redis in production)
const hubsSessions = new Map<string, HubsSession>()

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

// Hubs' core system prompt - Enhanced with enterprise features and safety knowledge
const HUBS_SYSTEM_PROMPT = `You are Hubs, Hublio's AI Assistant specializing in mining industry solutions and enterprise services. You are knowledgeable, professional, yet conversational and approachable.

🎯 CORE EXPERTISE:
- South African mining industry (gold, platinum, diamonds, coal, iron ore)
- Mining safety regulations and best practices (Mine Health and Safety Act)
- Mining technology, equipment, and operations
- AI-powered mining solutions and automation
- Career opportunities in mining sector
- Hublio's enterprise services and solutions

🛡️ COMPREHENSIVE SAFETY KNOWLEDGE:
**Personal Protective Equipment (PPE):**
- Hard hats/helmets mandatory in all mining areas
- Safety boots with steel toes and puncture-resistant soles
- High-visibility clothing required in operational areas
- Respiratory protection when dealing with dust/chemicals
- Eye protection (safety glasses/goggles) in hazardous areas
- Hearing protection in high-noise environments

**Mine Health & Safety Act Compliance:**
- All workers must have valid certificates of fitness
- Regular safety training and competency assessments required
- Risk assessments must be conducted before any work begins
- Emergency procedures and evacuation plans must be established
- Incident reporting within 24 hours of any accident
- Regular safety inspections and audits mandatory

**Hazard Recognition & Management:**
- Ground conditions: Check for loose rock, unstable walls
- Atmospheric hazards: Gas detection, ventilation monitoring
- Machinery hazards: Lockout/tagout procedures, equipment inspections
- Fire prevention: Hot work permits, fire suppression systems
- Chemical handling: Material Safety Data Sheets (MSDS), proper storage
- Electrical safety: Qualified personnel only, proper earthing/grounding

**Emergency Procedures:**
- Emergency contact: Mine rescue services, medical facilities
- Evacuation routes and assembly points clearly marked
- First aid stations and trained personnel available
- Emergency communication systems (two-way radios, alarm systems)
- Self-rescue devices (breathing apparatus, emergency equipment)

**Specific Mining Operations Safety:**
- Underground mining: Ventilation, rock stability, escape routes
- Open pit mining: Bench stability, vehicle operations, weather monitoring
- Processing plants: Chemical handling, machinery safety, noise control
- Transportation: Vehicle maintenance, speed limits, communication protocols

🗣 PERSONALITY & TONE:
- Professional but conversational and friendly
- Mining industry expert with practical knowledge
- Helpful and solution-focused
- Use natural language, avoid overly robotic responses
- Show enthusiasm for mining innovation and safety
- **IMPORTANT**: If you don't know something or are unsure about specific technical details, safety procedures, or regulations, admit it and offer to connect the user with our mining experts instead of guessing

🚀 ENHANCED CAPABILITIES:
1. **Smart Navigation**: Guide users to relevant pages
   - Jobs/Careers → /vacancies (with AI job matching)
   - Contact/Support → /contact  
   - News/Insights → /blog
   - Services → /services
   - About Us → /about

2. **Mining Expertise**: Answer questions about:
   - Mining operations and equipment
   - Safety protocols and regulations
   - Career paths in mining
   - Industry trends and innovations
   - Hublio's specific solutions

3. **Safety Guidance**: Provide comprehensive safety information
   - PPE requirements and proper usage
   - Hazard identification and risk management
   - Emergency procedures and protocols
   - Regulatory compliance (Mine Health & Safety Act)
   - Best practices for safe mining operations

4. **Lead Generation**: When appropriate, offer to connect users with Hublio experts

5. **Admin Escalation**: When you encounter questions outside your knowledge base or require expert input, escalate to our mining professionals

6. **FAQ Generation**: If users ask questions not covered in our knowledge base, I can suggest new FAQ entries for admin approval

🧠 KNOWLEDGE BASE:
HUBLIO PAGES & SECTIONS:
- Homepage (/) - Hero, Features, Testimonials, Blog preview, Contact
- About (/about) - Mission, Vision, Values, Team
- Services (/services) - AI Analytics, Safety Systems, Operational Efficiency, Data Integration, Custom Solutions, 24/7 Support
- Blog (/blog) - Mining insights, news, safety tips, industry trends
- Contact (/contact) - Contact form, office details, emergency support
- Vacancies (/vacancies) - AI-powered job matching, mining career opportunities

HUBLIO SOLUTIONS:
- AI-Powered Analytics: Predictive maintenance, resource optimization, performance analytics, risk assessment
- Safety Management Systems: Real-time monitoring, hazard prediction, compliance tracking, incident reporting
- Operational Efficiency: Process automation, resource allocation, downtime reduction, cost optimization
- Data Integration: Multi-source integration, real-time dashboards, custom reporting
- Custom Solutions: Bespoke development, industry expertise, scalable architecture
- 24/7 Support: Emergency support, technical consultation, training programs

📞 CONTACT INFO:
- General: info@hublio.co.za | +27 60 873 1659
- Emergency: +27 60 873 1659 (24/7 mining operations support)
- Location: Johannesburg, South Africa
- Hours: Mon-Fri 8AM-6PM, Sat 9AM-2PM

📱 SOCIAL MEDIA:
- Instagram: @hublio_official
- TikTok: @hublio
- Facebook: HublioOfficial
- WhatsApp Business: +27 60 873 1659
- Links: linktr.ee/Hublio

� RESPONSE GUIDELINES:
- Keep responses concise but informative (2-4 sentences usually)
- For unrelated topics, politely redirect: "I specialize in mining industry topics. Let me help you with mining operations, careers, or Hublio's solutions instead."
- Always provide value - don't just say "I can't help"
- Use mining terminology appropriately but explain technical terms
- Include relevant navigation suggestions when helpful
- Offer smart suggestions (buttons) when appropriate

🚫 MODERATION RULES:
- Stay focused on mining industry topics and Hublio services
- No financial, legal, or medical advice
- Redirect complex technical issues to human experts
- For sensitive topics, always recommend contacting our team directly

Remember: You're representing a leading AI-powered mining solutions company. Be knowledgeable, helpful, and always professional while maintaining a natural conversational tone.`

export function createHubsSession(sessionId: string): HubsSession {
  const session: HubsSession = {
    id: sessionId,
    messages: [
      {
        role: "system",
        content: HUBS_SYSTEM_PROMPT,
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
    lastActivity: Date.now(),
  }

  hubsSessions.set(sessionId, session)
  return session
}

export function getHubsSession(sessionId: string): HubsSession | null {
  return hubsSessions.get(sessionId) || null
}

export function updateHubsSession(sessionId: string, updates: Partial<HubsSession>) {
  const session = hubsSessions.get(sessionId)
  if (session) {
    const updatedSession = { ...session, ...updates, lastActivity: Date.now() }
    hubsSessions.set(sessionId, updatedSession)
    return updatedSession
  }
  return null
}

// Enhanced AI response generation with enterprise features
export async function generateHubsResponse(
  messages: HubsMessage[],
  context?: {
    currentPage?: string
    siteMap?: any
    contactInfo?: any
    recentNews?: any[]
    availableFAQs?: any[]
  },
): Promise<{
  response: string
  metadata?: {
    intent?: string
    pageReference?: string
    navigationAction?: {
      type: 'navigate' | 'suggest'
      url: string
      label: string
    }
    faqSuggestion?: {
      question: string
      answer: string
      category: string
    }
    smartSuggestions?: Array<{
      label: string
      action: string
      url?: string
    }>
    contactInfo?: any
  }
}> {
  try {
    // Check if AI is available
    if (!isAIAvailable()) {
      console.log("OpenAI not available, using enhanced fallback response")
      return generateHubsFallbackResponse(messages, context)
    }

    const systemMessage = messages.find((m) => m.role === "system")?.content || HUBS_SYSTEM_PROMPT
    const conversationMessages = messages.filter((m) => m.role !== "system")
    const lastMessage = conversationMessages[conversationMessages.length - 1]?.content || ""

    // Enhanced content moderation
    if (await shouldRedirectTopic(lastMessage)) {
      return {
        response: "I specialize in mining industry topics and Hublio's solutions. Let me help you with mining operations, safety protocols, career opportunities, or our AI-powered mining solutions instead. What specific mining topic interests you?",
        metadata: {
          intent: "redirect",
          smartSuggestions: [
            { label: "Find Mining Jobs", action: "navigate", url: "/vacancies" },
            { label: "Safety Guidelines", action: "safety_info" },
            { label: "Latest Mining News", action: "navigate", url: "/blog" },
            { label: "Contact Expert", action: "navigate", url: "/contact" }
          ]
        }
      }
    }

    // Build enhanced context with FAQ knowledge
    let contextPrompt = ""
    if (context) {
      if (context.currentPage) {
        contextPrompt += `\nCurrent page: ${context.currentPage}`
      }
      if (context.availableFAQs?.length) {
        contextPrompt += `\nAvailable FAQs: ${context.availableFAQs.map(faq => `Q: ${faq.question} A: ${faq.answer}`).join(' | ')}`
      }
    }

    // Enhanced system message with navigation and FAQ capabilities
    const enhancedSystemMessage = `${systemMessage}

ENHANCED CAPABILITIES:
- Navigation Support: When users ask about specific topics, suggest relevant pages
- FAQ Generation: If a question isn't covered in existing FAQs, create new FAQ suggestions
- Smart Suggestions: Provide action buttons for common next steps
- Lead Generation: Identify opportunities to connect users with experts

NAVIGATION TRIGGERS:
- "jobs", "career", "vacancy" → /vacancies
- "contact", "support", "help" → /contact
- "news", "blog", "articles" → /blog
- "services", "solutions" → /services
- "about", "company" → /about

${contextPrompt}`

    // Add additional context if available
    if (context) {
      if (context.siteMap) {
        contextPrompt += `\nSite structure: ${JSON.stringify(context.siteMap)}`
      }
      if (context.contactInfo) {
        contextPrompt += `\nContact information available: ${JSON.stringify(context.contactInfo)}`
      }
      if (context.recentNews && context.recentNews.length > 0) {
        contextPrompt += `\nRecent mining news: ${context.recentNews.map((n: any) => n.title).join(", ")}`
      }
    }

    // Detect user intent
    const intent = detectUserIntent(lastMessage)

    // Enhanced prompt based on intent
    let enhancedPrompt = enhancedSystemMessage

    if (intent === "navigation") {
      enhancedPrompt += `\n\nThe user is asking for navigation help. Provide clear directions and offer to take them to the relevant page.`
    } else if (intent === "blog_request") {
      enhancedPrompt += `\n\nThe user is interested in blog content. Offer to generate a blog post or show them relevant existing content.`
    } else if (intent === "contact_request") {
      enhancedPrompt += `\n\nThe user needs contact information. Provide relevant contact details and offer to connect them with the right person.`
    } else if (intent === "product_info") {
      enhancedPrompt += `\n\nThe user is asking about Hublio's solutions. Provide detailed information about our mining AI solutions.`
    }

    // Convert to AI messages format
    const aiMessages: AIMessage[] = conversationMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: m.timestamp,
    }))

    const aiResponse = await generateAIResponse(aiMessages, {
      systemPrompt: enhancedPrompt,
      maxTokens: 600,
      temperature: 0.7,
    })

    // Check if AI response indicates uncertainty - if so, escalate to admin
    if (detectUncertainty(lastMessage, aiResponse.content)) {
      console.log("AI uncertainty detected, escalating to admin")
      return createAdminEscalationResponse(lastMessage)
    }

    // Generate metadata based on response and intent
    const metadata = generateResponseMetadata(aiResponse.content, intent, context)

    return {
      response: aiResponse.content,
      metadata,
    }
  } catch (error) {
    console.error("Hubs AI response error:", error)
    return generateHubsFallbackResponse(messages, context)
  }
}

// Enhanced content moderation with uncertainty detection
async function shouldRedirectTopic(message: string): Promise<boolean> {
  const lowerMessage = message.toLowerCase()
  
  // Allow mining-related topics
  const miningKeywords = [
    'mining', 'mine', 'coal', 'gold', 'platinum', 'diamond', 'iron', 'ore',
    'safety', 'equipment', 'drilling', 'excavation', 'geology', 'mineral',
    'hublio', 'job', 'career', 'vacancy', 'service', 'solution', 'ai',
    'contact', 'help', 'about', 'blog', 'news'
  ]
  
  // Check if message contains mining-related content
  const hasMiningContent = miningKeywords.some(keyword => lowerMessage.includes(keyword))
  
  // Redirect if no mining content and seems off-topic
  const offTopicIndicators = [
    'weather', 'recipe', 'movie', 'music', 'sport', 'politics', 
    'medical advice', 'legal advice', 'financial advice'
  ]
  
  const isOffTopic = offTopicIndicators.some(indicator => lowerMessage.includes(indicator))
  
  return isOffTopic && !hasMiningContent
}

// Enhanced function to detect when we don't know the answer
function detectUncertainty(message: string, response: string): boolean {
  const uncertaintyIndicators = [
    "i don't know",
    "i'm not sure",
    "i don't have information",
    "i can't answer",
    "i'm unable to",
    "i don't have details",
    "i'm not familiar",
    "i don't have access",
    "i'm sorry, i don't know",
    "i cannot provide",
    "that's outside my knowledge",
    "i'm not equipped to answer"
  ]
  
  const lowerResponse = response.toLowerCase()
  return uncertaintyIndicators.some(indicator => lowerResponse.includes(indicator))
}

// Function to create admin escalation response
function createAdminEscalationResponse(originalQuestion: string): {
  response: string
  metadata: any
} {
  return {
    response: `I don't have enough information to properly answer your question about "${originalQuestion}". However, I can connect you with one of our mining experts who can provide you with detailed assistance.

Would you like me to:
1. **Contact our expert team** - I can escalate your inquiry to our specialists
2. **Schedule a consultation** - Book a call with our mining professionals  
3. **Send detailed information** - Have our team email you comprehensive details

**Immediate Contact Options:**
📧 info@hublio.co.za
📞 +27 60 873 1659 (Ask for mining specialist)
💬 WhatsApp: +27 60 873 1659

Our team of mining professionals will be happy to provide you with expert guidance on your specific question.`,
    metadata: {
      intent: "admin_escalation",
      originalQuestion: originalQuestion,
      escalationType: "unknown_answer", 
      smartSuggestions: [
        { label: "Contact Mining Expert", action: "navigate", url: "/contact" },
        { label: "Call Now", action: "call", url: "tel:+27608731659" },
        { label: "WhatsApp Us", action: "external", url: "https://wa.me/27608731659" },
        { label: "Email Question", action: "email", url: "mailto:info@hublio.co.za" }
      ],
      requiresFollowUp: true
    }
  }
}

// Generate response metadata for enhanced features
function generateResponseMetadata(response: string, intent: string, context?: any): any {
  const metadata: any = { intent }
  
  // Detect navigation suggestions
  if (response.includes('/vacancies') || response.toLowerCase().includes('job')) {
    metadata.navigationAction = {
      type: 'navigate',
      url: '/vacancies',
      label: 'View Mining Jobs'
    }
  } else if (response.includes('/contact') || response.toLowerCase().includes('contact')) {
    metadata.navigationAction = {
      type: 'navigate', 
      url: '/contact',
      label: 'Contact Us'
    }
  } else if (response.includes('/blog') || response.toLowerCase().includes('news')) {
    metadata.navigationAction = {
      type: 'navigate',
      url: '/blog', 
      label: 'Read Mining News'
    }
  }
  
  // Generate smart suggestions based on intent
  if (intent === 'navigation') {
    metadata.smartSuggestions = [
      { label: "Find Mining Jobs", action: "navigate", url: "/vacancies" },
      { label: "Latest News", action: "navigate", url: "/blog" },
      { label: "Our Services", action: "navigate", url: "/services" }
    ]
  } else if (intent === 'contact_request') {
    metadata.smartSuggestions = [
      { label: "Contact Form", action: "navigate", url: "/contact" },
      { label: "Emergency Support", action: "call", url: "tel:+27608731659" }
    ]
  }
  
  return metadata
}

function detectUserIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Navigation intents
  if (
    lowerMessage.includes("go to") ||
    lowerMessage.includes("show me") ||
    lowerMessage.includes("navigate") ||
    lowerMessage.includes("take me to") ||
    lowerMessage.includes("page") ||
    lowerMessage.includes("section")
  ) {
    return "navigation"
  }

  // Blog/content intents
  if (
    lowerMessage.includes("blog") ||
    lowerMessage.includes("article") ||
    lowerMessage.includes("write") ||
    lowerMessage.includes("news") ||
    lowerMessage.includes("post")
  ) {
    return "blog_request"
  }

  // Contact intents
  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("call") ||
    lowerMessage.includes("email") ||
    lowerMessage.includes("phone") ||
    lowerMessage.includes("speak to") ||
    lowerMessage.includes("talk to")
  ) {
    return "contact_request"
  }

  // Product/service intents
  if (
    lowerMessage.includes("solution") ||
    lowerMessage.includes("service") ||
    lowerMessage.includes("product") ||
    lowerMessage.includes("feature") ||
    lowerMessage.includes("ai") ||
    lowerMessage.includes("mining") ||
    lowerMessage.includes("safety") ||
    lowerMessage.includes("analytics")
  ) {
    return "product_info"
  }

  return "general"
}

function generateHubsFallbackResponse(
  messages: HubsMessage[],
  context?: any,
): {
  response: string
  metadata?: any
} {
  const lastMessage = messages[messages.length - 1]?.content || ""
  const lowerMessage = lastMessage.toLowerCase()
  const intent = detectUserIntent(lastMessage)

  let response = ""
  const metadata: any = { intent }

  // Social media responses
  if (lowerMessage.includes("social") || lowerMessage.includes("instagram") || lowerMessage.includes("follow")) {
    response =
      "Follow Hublio on social media for the latest mining industry updates!\n\n📱 **Instagram:** @hublio_official - Behind-the-scenes and updates\n🎵 **TikTok:** @hublio - Mining tech tips and content\n📘 **Facebook:** HublioOfficial - Company news and insights\n💬 **WhatsApp Business:** +27 60 873 1659\n🔗 **All Links:** linktr.ee/Hublio\n\nStay connected with our mining community!"
  }
  // Navigation responses
  else if (intent === "navigation") {
    if (lowerMessage.includes("feature")) {
      response =
        "I can show you our key features! Hublio offers AI-Powered Analytics, Safety Management Systems, Operational Efficiency tools, and more. Would you like me to take you to our Features section?"
      metadata.pageReference = "/services"
      metadata.navigationSuggestion = "Visit our Services page"
    } else if (lowerMessage.includes("about")) {
      response =
        "I'd be happy to tell you about Hublio! We're a South African company specializing in AI-powered mining solutions. Our mission is to transform mining operations through cutting-edge technology. Would you like to visit our About page?"
      metadata.pageReference = "/about"
    } else if (lowerMessage.includes("contact")) {
      response =
        "Here's how to reach us:\n\n📧 info@hublio.co.za\n📞 +27 60 873 1659\n📍 Johannesburg, South Africa\n🚨 Emergency: +27 60 873 1659\n\nWould you like me to take you to our contact page for more details?"
      metadata.pageReference = "/contact"
    } else if (lowerMessage.includes("blog")) {
      response =
        "Our blog features the latest mining industry insights, safety tips, and AI technology updates. We cover South African mining news and practical guidance for mining professionals. Would you like to explore our blog?"
      metadata.pageReference = "/blog"
    } else {
      response =
        "I can help you navigate our website! We have sections for:\n\n🏠 Home - Overview of our solutions\n🔧 Services - Detailed AI solutions\n📖 About - Our company story\n📝 Blog - Mining insights\n📞 Contact - Get in touch\n\nWhere would you like to go?"
    }
  }
  // Product information responses
  else if (intent === "product_info") {
    if (lowerMessage.includes("ai") || lowerMessage.includes("analytics")) {
      response =
        "Our AI-Powered Analytics solution uses machine learning to analyze mining data and provide actionable insights. It includes predictive maintenance, resource optimization, and performance analytics. This helps mining companies reduce downtime and maximize productivity. Would you like to learn more about our AI solutions?"
      metadata.pageReference = "/services"
    } else if (lowerMessage.includes("safety")) {
      response =
        "Safety is our top priority! Here's essential mining safety information:\n\n🛡️ **Personal Protective Equipment (PPE):**\n- Hard hat/helmet (mandatory in all mining areas)\n- Safety boots with steel toes\n- High-visibility clothing\n- Respiratory protection when needed\n- Eye and hearing protection\n\n📋 **Mine Health & Safety Act Requirements:**\n- Valid certificates of fitness for all workers\n- Regular safety training and assessments\n- Risk assessments before work begins\n- 24-hour incident reporting\n- Emergency procedures must be established\n\n⚠️ **Key Safety Practices:**\n- Check ground conditions for loose rock\n- Monitor atmospheric conditions\n- Follow lockout/tagout procedures\n- Maintain emergency communication\n- Know evacuation routes\n\nOur AI Safety Management Systems provide real-time monitoring and hazard prediction. We've helped reduce incident rates by up to 40%. For specific safety questions or technical details, I can connect you with our mining safety experts at +27 60 873 1659."
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("accident") || lowerMessage.includes("incident")) {
      response =
        "🚨 **Mining Emergency Procedures:**\n\n**Immediate Actions:**\n1. Ensure personal safety first\n2. Alert others in the area\n3. Contact mine rescue/emergency services\n4. Follow established evacuation procedures\n5. Report to assembly points\n\n**Emergency Contacts:**\n- Mine Rescue Services\n- Medical facilities on-site\n- Emergency coordinator\n- Hublio Emergency Support: +27 60 873 1659\n\n**Required Equipment:**\n- Self-rescue breathing apparatus\n- Emergency communication devices\n- First aid supplies\n- Emergency lighting\n\n**Reporting:**\n- All incidents must be reported within 24 hours\n- Document everything for investigation\n- Notify relevant authorities\n\nFor detailed emergency procedures specific to your operation, please contact our safety specialists immediately at +27 60 873 1659."
    } else if (lowerMessage.includes("mining")) {
      response =
        "Hublio specializes in AI-powered mining solutions for South African enterprises. We help optimize operations, enhance safety, and increase efficiency through:\n\n🤖 AI Analytics\n🛡️ Safety Systems\n📊 Operational Efficiency\n🔗 Data Integration\n⚙️ Custom Solutions\n🆘 24/7 Support\n\nWhich area interests you most?"
    } else {
      response =
        "Hublio provides comprehensive AI-powered solutions for the mining industry. Our technology helps mining companies optimize operations, enhance safety, and reduce costs through intelligent automation and data analytics. What specific aspect of our solutions would you like to know about?"
    }
  }
  // Blog content responses
  else if (intent === "blog_request") {
    response =
      "I can help with mining industry content! Our blog covers:\n\n📰 South African mining news\n🛡️ Safety and health tips\n🤖 AI technology updates\n📊 Industry insights\n🏭 Operational best practices\n\nWould you like me to show you our latest posts or help you find content on a specific topic?"
    metadata.pageReference = "/blog"
  }
  // Contact responses
  else if (intent === "contact_request") {
    response =
      "I'm here to connect you with our team! Here are your options:\n\n📧 **General Inquiries:** info@hublio.co.za\n📞 **Phone:** +27 60 873 1659\n📍 **Location:** Johannesburg, South Africa\n🚨 **Emergency Support:** +27 60 873 1659\n\n**Office Hours:**\nMonday-Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\n\nWould you like me to take you to our contact page to send a message?"
    metadata.pageReference = "/contact"
    metadata.contactInfo = CONTACT_INFO
  }
  // General responses
  else {
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response =
        "Hello! I'm Hubs, your AI assistant for Hublio. I'm here to help you learn about our mining solutions, navigate our website, and answer your questions about the mining industry. How can I assist you today?"
    } else if (lowerMessage.includes("help")) {
      response =
        "I'm here to help! I can assist you with:\n\n🧭 **Navigation** - Find any page or section\n🔧 **Solutions** - Learn about our AI mining tools\n📝 **Content** - Mining industry insights and news\n📞 **Contact** - Connect with our team\n🛡️ **Safety** - Mining health and safety guidance\n\nWhat would you like to explore?"
    } else {
      response =
        "I'm Hubs, Hublio's AI assistant specializing in mining industry solutions. I can help you navigate our website, learn about our AI-powered mining tools, or discuss industry topics. What brings you to Hublio today?"
    }
  }

  return { response, metadata }
}

// Blog generation capability
export async function generateMiningBlogPost(
  topic: string,
  newsData?: any,
): Promise<{
  title: string
  metaDescription: string
  content: string
  featuredImageSuggestion: string
  category: string
  tags: string[]
}> {
  try {
    if (!isAIAvailable()) {
      return generateFallbackBlogPost(topic, newsData)
    }

    const contextInfo = newsData ? `Based on this news data: ${JSON.stringify(newsData)}` : ""

    const blogContent = await generateAIResponse(
      [
        {
          role: "user",
          content: `Generate a professional blog post for Hublio's mining industry website about: ${topic}

${contextInfo}

Requirements:
- Professional tone suitable for mining industry professionals
- SEO-optimized with relevant keywords
- Structured with: Introduction, Key Points, Practical Impact, Conclusion
- Focus on South African mining context when relevant
- Include actionable insights
- 800-1200 words
- Suggest a featured image description

Format your response as JSON with these fields:
- title: SEO-friendly title (60 chars max)
- metaDescription: Meta description (160 chars max)
- content: Full blog post content with HTML formatting
- featuredImageSuggestion: Description for featured image
- category: Blog category
- tags: Array of relevant tags`,
        },
      ],
      {
        systemPrompt:
          "You are a professional mining industry content writer for Hublio. Create engaging, informative blog posts that provide value to mining professionals.",
        maxTokens: 1500,
        temperature: 0.7,
      },
    )

    try {
      return JSON.parse(blogContent.content)
    } catch {
      return generateFallbackBlogPost(topic, newsData)
    }
  } catch (error) {
    console.error("Blog generation error:", error)
    return generateFallbackBlogPost(topic, newsData)
  }
}

function generateFallbackBlogPost(topic: string, newsData?: any) {
  return {
    title: `Mining Industry Insights: ${topic}`,
    metaDescription: `Professional insights and analysis on ${topic} for the South African mining industry.`,
    content: `<h2>Introduction</h2><p>The mining industry continues to evolve with new technologies and practices. This post explores ${topic} and its impact on South African mining operations.</p><h2>Key Points</h2><p>Industry professionals should consider the latest developments in ${topic} to stay competitive and maintain safety standards.</p><h2>Practical Impact</h2><p>Understanding ${topic} can help mining companies optimize their operations and improve safety outcomes.</p><h2>Conclusion</h2><p>Staying informed about ${topic} is essential for mining industry success. Contact Hublio at +27 60 873 1659 to learn how our AI solutions can help implement these insights.</p>`,
    featuredImageSuggestion: `Professional image showing ${topic} in a mining context`,
    category: "Mining Insights",
    tags: ["mining", "south africa", "industry", "technology"],
  }
}

// Cleanup old sessions
export function cleanupHubsSessions() {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours

  for (const [sessionId, session] of hubsSessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      hubsSessions.delete(sessionId)
    }
  }
}
