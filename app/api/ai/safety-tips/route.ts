import { NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis"
import { generateMiningContent } from "@/lib/ai"
import { GeminiService } from "@/lib/gemini"

interface SafetyTip {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  isAIGenerated: boolean
}

const geminiService = new GeminiService()

export async function GET() {
  try {
    const redis = getRedisClient()
    
    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 })
    }

    // Get existing tips
    const existingTips = await redis.get('safety-tips:list')
    const tips: SafetyTip[] = existingTips ? JSON.parse(existingTips as string) : []

    return NextResponse.json(tips)
  } catch (error) {
    console.error("Error fetching safety tips:", error)
    return NextResponse.json({ error: "Failed to fetch safety tips" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const redis = getRedisClient()
    
    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 })
    }

    // Check if we already generated tips today
    const today = new Date().toDateString()
    const lastGenerated = await redis.get('safety-tips:last-generated')
    
    if (lastGenerated === today) {
      return NextResponse.json({ message: "Tips already generated today" })
    }

    // Generate 1-2 safety tips using AI
    const topics = [
      "Underground mining safety protocols",
      "Personal protective equipment (PPE) best practices",
      "Mine ventilation safety",
      "Chemical handling in mining operations",
      "Heavy machinery safety",
      "Fire prevention in mining facilities",
      "First aid procedures for mining incidents",
      "Environmental hazard awareness",
      "Electrical safety in mines",
      "Fall protection systems"
    ]

    const randomTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 2)
    
    const newTips: SafetyTip[] = []

    for (const topic of randomTopics) {
      try {
        let tipContent: string

        // Try Gemini first, fallback to OpenAI
        try {
          const prompt = `Generate a practical and actionable safety tip for mining operations related to: ${topic}. 
          The tip should be:
          - Specific and actionable
          - 50-100 words
          - Focused on preventing accidents
          - Written in clear, simple language
          - Relevant to South African mining operations
          
          Format: Just return the safety tip content, no extra formatting.`
          
          tipContent = await geminiService.generateContent("safety-tip", prompt)
        } catch (geminiError) {
          console.log("Gemini failed, trying OpenAI:", geminiError)
          tipContent = await generateMiningContent(topic, "safety-tip")
        }

        const tip: SafetyTip = {
          id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Safety Tip: ${topic}`,
          content: tipContent,
          category: "Safety",
          createdAt: new Date().toISOString(),
          isAIGenerated: true
        }

        newTips.push(tip)
      } catch (error) {
        console.error(`Error generating tip for ${topic}:`, error)
      }
    }

    if (newTips.length > 0) {
      // Get existing tips and add new ones
      const existingTips = await redis.get('safety-tips:list')
      const allTips: SafetyTip[] = existingTips ? JSON.parse(existingTips as string) : []
      
      // Add new tips to the beginning and keep only last 50 tips
      const updatedTips = [...newTips, ...allTips].slice(0, 50)
      
      // Save to Redis
      await redis.setex('safety-tips:list', 86400 * 7, JSON.stringify(updatedTips)) // Keep for 7 days
      await redis.set('safety-tips:last-generated', today)
    }

    return NextResponse.json({ 
      message: `Generated ${newTips.length} new safety tips`,
      tips: newTips 
    })
  } catch (error) {
    console.error("Error generating safety tips:", error)
    return NextResponse.json({ error: "Failed to generate safety tips" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const redis = getRedisClient()
    
    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const tipId = searchParams.get('id')

    if (!tipId) {
      return NextResponse.json({ error: "Tip ID required" }, { status: 400 })
    }

    // Get existing tips
    const existingTips = await redis.get('safety-tips:list')
    const tips: SafetyTip[] = existingTips ? JSON.parse(existingTips as string) : []

    // Remove the tip with the specified ID
    const updatedTips = tips.filter(tip => tip.id !== tipId)

    // Save back to Redis
    await redis.setex('safety-tips:list', 86400 * 7, JSON.stringify(updatedTips))

    return NextResponse.json({ message: "Safety tip deleted successfully" })
  } catch (error) {
    console.error("Error deleting safety tip:", error)
    return NextResponse.json({ error: "Failed to delete safety tip" }, { status: 500 })
  }
}
