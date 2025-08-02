import { type NextRequest, NextResponse } from "next/server"
import { generateMiningBlogPost } from "@/lib/ai/hubs"
import { rateLimit, getClientIdentifier, rateLimits } from "@/lib/rate-limit"

const blogRateLimit = rateLimit(rateLimits.api)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = blogRateLimit(identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await request.json()
    const { topic, newsData, category } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    console.log("Generating blog post for topic:", topic)

    // Generate blog post using Hubs
    const blogPost = await generateMiningBlogPost(topic, newsData)

    // TODO: Save to Sanity CMS as draft
    // const savedPost = await saveBlogDraftToSanity(blogPost)

    return NextResponse.json({
      success: true,
      blogPost,
      message: "Blog post generated successfully",
    })
  } catch (error) {
    console.error("Blog generation error:", error)
    return NextResponse.json({ error: "Failed to generate blog post" }, { status: 500 })
  }
}
