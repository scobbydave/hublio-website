import { type NextRequest, NextResponse } from "next/server"
import { generateSocialMediaPost } from "@/lib/ai"
import { sendSocialMediaApproval } from "@/lib/email"
import { getBlogPosts } from "@/lib/sanity"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent blog posts for social media content
    const recentPosts = await getBlogPosts()
    const latestPost = recentPosts[0]

    if (!latestPost) {
      return NextResponse.json({ message: "No blog posts available for social media generation" })
    }

    // Generate social media posts
    const socialPosts = await generateSocialMediaPost({
      title: latestPost.title,
      summary: latestPost.summary,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${latestPost.slug.current}`,
    })

    // Send for approval
    await sendSocialMediaApproval({
      blogPost: latestPost,
      socialPosts,
    })

    return NextResponse.json({
      success: true,
      message: "Social media posts generated and sent for approval",
      postsGenerated: socialPosts.length,
    })
  } catch (error) {
    console.error("Social media generation error:", error)
    return NextResponse.json({ error: "Failed to generate social media posts" }, { status: 500 })
  }
}
