import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

export async function GET(request: Request) {
  try {
    // Simple authentication check
    const url = new URL(request.url)
    const key = url.searchParams.get("key")

    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch stats from Sanity
    const [faqs, blogPosts, testimonials] = await Promise.all([
      sanityClient.fetch(`count(*[_type == "faq"])`),
      sanityClient.fetch(`count(*[_type == "blogPost"])`),
      sanityClient.fetch(`count(*[_type == "testimonial"])`),
    ])

    // Get recent activity (mock data for now - replace with actual logging)
    const recentActivity = [
      { type: "lead", message: "New lead captured via chat", timestamp: Date.now() - 3600000 },
      { type: "faq", message: "AI generated FAQ about mining safety", timestamp: Date.now() - 7200000 },
      { type: "blog", message: "Auto-generated blog post from news", timestamp: Date.now() - 86400000 },
    ]

    const stats = {
      totalLeads: 12, // This would come from your lead tracking system
      totalFAQs: faqs || 0,
      totalBlogPosts: blogPosts || 0,
      chatSessions: 45, // This would come from session tracking
    }

    return NextResponse.json({ stats, recentActivity })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
