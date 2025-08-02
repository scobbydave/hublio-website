import { generateAIResponse } from "@/lib/ai"

export interface FAQItem {
  question: string
  answer: string
  category: string
  tags: string[]
}

export interface FAQGenerationOptions {
  category?: string
  count?: number
  difficulty?: "basic" | "intermediate" | "advanced"
  focus?: "safety" | "technology" | "operations" | "general"
}

// Generate FAQ items for mining industry
export async function generateMiningFAQs(options: FAQGenerationOptions = {}): Promise<FAQItem[]> {
  const { category = "Mining Operations", count = 5, difficulty = "intermediate", focus = "general" } = options

  try {
    const prompt = `Generate ${count} frequently asked questions and answers for a mining industry website.

Requirements:
- Category: ${category}
- Difficulty level: ${difficulty}
- Focus area: ${focus}
- Professional tone suitable for mining industry professionals
- Accurate, helpful information
- South African mining context when relevant
- Include safety considerations where appropriate

Format as JSON array with objects containing:
- question: The FAQ question
- answer: Comprehensive answer (2-3 paragraphs)
- category: Category name
- tags: Array of relevant tags

Focus areas:
- safety: Mining health and safety protocols
- technology: AI, automation, and mining technology
- operations: Day-to-day mining operations and processes
- general: General mining industry information`

    const response = await generateAIResponse(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        systemPrompt: `You are a mining industry expert with extensive knowledge of South African mining operations, safety protocols, and modern mining technology. Provide accurate, professional information that helps mining professionals understand complex topics.`,
        maxTokens: 1500,
        temperature: 0.7,
      },
    )

    try {
      const faqs = JSON.parse(response.content)
      return Array.isArray(faqs) ? faqs : []
    } catch (parseError) {
      console.error("Error parsing FAQ JSON:", parseError)
      return generateFallbackFAQs(options)
    }
  } catch (error) {
    console.error("Error generating FAQs:", error)
    return generateFallbackFAQs(options)
  }
}

// Generate FAQs based on specific topics
export async function generateTopicFAQs(topic: string, count = 3): Promise<FAQItem[]> {
  try {
    const prompt = `Generate ${count} frequently asked questions and answers specifically about: ${topic}

Requirements:
- Focus specifically on ${topic}
- Professional mining industry context
- Practical, actionable information
- Include safety considerations if relevant
- South African mining industry perspective

Format as JSON array with objects containing:
- question: Specific question about ${topic}
- answer: Detailed answer (2-3 paragraphs)
- category: Relevant category
- tags: Array of relevant tags including "${topic.toLowerCase()}"`

    const response = await generateAIResponse(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        systemPrompt: `You are a mining industry expert specializing in ${topic}. Provide detailed, accurate information that helps mining professionals understand and implement best practices.`,
        maxTokens: 1000,
        temperature: 0.6,
      },
    )

    try {
      const faqs = JSON.parse(response.content)
      return Array.isArray(faqs) ? faqs : []
    } catch (parseError) {
      return generateFallbackTopicFAQs(topic, count)
    }
  } catch (error) {
    console.error("Error generating topic FAQs:", error)
    return generateFallbackTopicFAQs(topic, count)
  }
}

// Generate safety-focused FAQs
export async function generateSafetyFAQs(count = 5): Promise<FAQItem[]> {
  return generateMiningFAQs({
    category: "Mining Safety",
    count,
    focus: "safety",
    difficulty: "intermediate",
  })
}

// Generate technology FAQs
export async function generateTechnologyFAQs(count = 5): Promise<FAQItem[]> {
  return generateMiningFAQs({
    category: "Mining Technology",
    count,
    focus: "technology",
    difficulty: "intermediate",
  })
}

// Fallback FAQ generation
function generateFallbackFAQs(options: FAQGenerationOptions): FAQItem[] {
  const { category = "Mining Operations", focus = "general" } = options

  const baseFAQs: FAQItem[] = [
    {
      question: "What are the key safety protocols in South African mining operations?",
      answer:
        "South African mining operations follow strict safety protocols including mandatory safety training, regular equipment inspections, and compliance with the Mine Health and Safety Act. Key protocols include proper ventilation systems, emergency evacuation procedures, and continuous monitoring of hazardous conditions. All personnel must wear appropriate personal protective equipment (PPE) and follow established safety procedures at all times.",
      category: "Mining Safety",
      tags: ["safety", "protocols", "south-africa", "compliance"],
    },
    {
      question: "How is AI technology transforming mining operations?",
      answer:
        "AI technology is revolutionizing mining through predictive maintenance, automated equipment monitoring, and data-driven decision making. Machine learning algorithms analyze equipment performance to predict failures before they occur, reducing downtime and maintenance costs. AI-powered systems also optimize resource allocation, improve safety monitoring, and enhance operational efficiency across all aspects of mining operations.",
      category: "Mining Technology",
      tags: ["ai", "technology", "automation", "predictive-maintenance"],
    },
    {
      question: "What are the environmental considerations in modern mining?",
      answer:
        "Modern mining operations prioritize environmental sustainability through responsible resource extraction, waste management, and land rehabilitation. Companies implement water recycling systems, dust control measures, and biodiversity conservation programs. Environmental impact assessments are conducted before operations begin, and ongoing monitoring ensures compliance with environmental regulations and minimizes ecological disruption.",
      category: "Environmental Impact",
      tags: ["environment", "sustainability", "compliance", "rehabilitation"],
    },
  ]

  // Filter based on focus area
  if (focus === "safety") {
    return baseFAQs.filter((faq) => faq.tags.includes("safety"))
  } else if (focus === "technology") {
    return baseFAQs.filter((faq) => faq.tags.includes("technology") || faq.tags.includes("ai"))
  }

  return baseFAQs
}

function generateFallbackTopicFAQs(topic: string, count: number): FAQItem[] {
  return [
    {
      question: `What are the key aspects of ${topic} in mining operations?`,
      answer: `${topic} plays a crucial role in modern mining operations by improving efficiency, safety, and productivity. Understanding the fundamentals of ${topic} helps mining professionals make informed decisions and implement best practices. Regular training and staying updated with industry developments in ${topic} are essential for successful mining operations.`,
      category: "Mining Operations",
      tags: [topic.toLowerCase(), "mining", "operations", "best-practices"],
    },
  ].slice(0, count)
}

// Get common mining FAQ categories
export function getFAQCategories(): string[] {
  return [
    "Mining Safety",
    "Mining Technology",
    "Environmental Impact",
    "Mining Operations",
    "Equipment and Maintenance",
    "Regulatory Compliance",
    "Workforce Development",
    "Data Analytics",
    "Automation and AI",
    "Sustainability",
  ]
}

// Get mining-specific topics for FAQ generation
export function getMiningFAQTopics(): string[] {
  return [
    "Predictive Maintenance",
    "Safety Protocols",
    "Environmental Compliance",
    "Equipment Optimization",
    "Data Analytics",
    "Automation Systems",
    "Workforce Training",
    "Emergency Procedures",
    "Quality Control",
    "Regulatory Requirements",
  ]
}

// Determine if FAQ should be generated based on user interaction
export function shouldGenerateFAQ(userMessage: string): boolean {
  const faqTriggers = [
    'what is',
    'how to',
    'how do',
    'what are',
    'tell me about',
    'explain',
    'help with',
    'guide me',
    'best practices',
    'safety',
    'compliance',
    'procedure',
    'regulation'
  ]
  
  const messageLower = userMessage.toLowerCase()
  return faqTriggers.some(trigger => messageLower.includes(trigger))
}
