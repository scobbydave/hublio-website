import { type NextRequest, NextResponse } from "next/server"
import { generateFAQAnswer } from "@/lib/ai"
import { createFAQ } from "@/lib/sanity"
import { sendFAQNotification } from "@/lib/email"
import { rateLimit, getClientIdentifier, rateLimits } from "@/lib/rate-limit"

const faqRateLimit = rateLimit(rateLimits.api)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = faqRateLimit(identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // Generate AI answer
    const answer = await generateFAQAnswer(question)

    // Save to Sanity CMS
    const faq = await createFAQ(question, answer)

    // Send notification to admin
    await sendFAQNotification({ question, answer })

    return NextResponse.json({
      success: true,
      faq,
      message: "FAQ generated and saved successfully",
    })
  } catch (error) {
    console.error("FAQ auto-generation error:", error)
    return NextResponse.json({ error: "Failed to generate FAQ" }, { status: 500 })
  }
}
