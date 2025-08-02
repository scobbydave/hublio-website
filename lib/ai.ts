import OpenAI from "openai"

// Initialize OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  if (!openaiClient) {
    throw new Error("OpenAI API key not configured")
  }

  return openaiClient
}

export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: number
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

export interface AIOptions {
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  model?: string
}

// Generate AI response
export async function generateAIResponse(messages: AIMessage[], options: AIOptions = {}): Promise<AIResponse> {
  try {
    const client = getOpenAIClient()

    const { systemPrompt, maxTokens = 1000, temperature = 0.7, model = "gpt-4o-mini" } = options

    // Prepare messages for OpenAI
    const openaiMessages: any[] = []

    if (systemPrompt) {
      openaiMessages.push({
        role: "system",
        content: systemPrompt,
      })
    }

    openaiMessages.push(
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    )

    const response = await client.chat.completions.create({
      model,
      messages: openaiMessages,
      max_tokens: maxTokens,
      temperature,
    })

    const choice = response.choices[0]
    if (!choice?.message?.content) {
      throw new Error("No response from OpenAI")
    }

    return {
      content: choice.message.content,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
      finishReason: choice.finish_reason || undefined,
    }
  } catch (error) {
    console.error("AI response error:", error)
    throw error
  }
}

// Generate text with simple prompt
export async function generateText(prompt: string, options: AIOptions = {}): Promise<string> {
  const response = await generateAIResponse([{ role: "user", content: prompt }], options)

  return response.content
}

// Check if AI is available
export function isAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

// Mining industry specific AI functions
export async function generateMiningContent(
  topic: string,
  contentType: "blog" | "faq" | "safety-tip" | "news-summary" = "blog",
): Promise<string> {
  const systemPrompts = {
    blog: `You are a professional mining industry content writer. Create engaging, informative blog posts that provide value to mining professionals in South Africa. Focus on safety, technology, and operational efficiency.`,
    faq: `You are a mining industry expert creating helpful FAQ content. Provide clear, accurate answers to common mining industry questions, focusing on South African mining context.`,
    "safety-tip": `You are a mining safety expert. Create practical, actionable safety tips for mining operations. Focus on preventing accidents and maintaining compliance with South African mining regulations.`,
    "news-summary": `You are a mining industry analyst. Summarize mining news and developments with focus on their impact on South African mining operations.`,
  }

  return await generateText(`Create ${contentType} content about: ${topic}`, {
    systemPrompt: systemPrompts[contentType],
    maxTokens: 1500,
    temperature: 0.7,
  })
}
