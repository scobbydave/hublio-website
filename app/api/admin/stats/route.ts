import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"
import { getAnalytics } from "@/lib/redis"

export async function GET(request: Request) {
  try {
    // Simple authentication check
    const url = new URL(request.url)
    const key = url.searchParams.get("key")

    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch stats from Sanity (with fallback)
    let faqs = 0, aiGeneratedFaqs = 0
    let blogPosts = 0, aiGeneratedBlogs = 0
    let testimonials = 0
    let leads = 0
    let vacancies = 0, activeVacancies = 0
    let recentLeads = []
    let recentFaqs = []
    let recentBlogs = []
    let recentVacancies = []
    let leadsBySource = []
    let vacanciesByCategory = []

    try {
      const client = sanityClient
      if (client) {
        const results = await Promise.all([
          // FAQs
          client.fetch(`count(*[_type == "faq"])`).catch(() => 0),
          client.fetch(`count(*[_type == "faq" && aiGenerated == true])`).catch(() => 0),
          client.fetch(`*[_type == "faq"] | order(_createdAt desc)[0...10] {
            _id, question, answer, category, aiGenerated, _createdAt
          }`).catch(() => []),
          
          // Blog posts
          client.fetch(`count(*[_type == "post"])`).catch(() => 0),
          client.fetch(`count(*[_type == "post" && aiGenerated == true])`).catch(() => 0),
          client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...10] {
            _id, title, publishedAt, aiGenerated, author
          }`).catch(() => []),
          
          // Testimonials
          client.fetch(`count(*[_type == "testimonial"])`).catch(() => 0),
          
          // Leads
          client.fetch(`count(*[_type == "lead"])`).catch(() => 0),
          client.fetch(`*[_type == "lead"] | order(_createdAt desc)[0...10] {
            _id, name, email, source, status, _createdAt
          }`).catch(() => []),
          client.fetch(`*[_type == "lead"] | {
            "source": source,
            "count": count(*[_type == "lead" && source == ^.source])
          } | order(count desc)[0...10]`).catch(() => []),
          
          // Vacancies
          client.fetch(`count(*[_type == "vacancy"])`).catch(() => 0),
          client.fetch(`count(*[_type == "vacancy" && isActive == true])`).catch(() => 0),
          client.fetch(`*[_type == "vacancy"] | order(_createdAt desc)[0...10] {
            _id, title, company, location, postedDate, _createdAt
          }`).catch(() => []),
          client.fetch(`*[_type == "vacancy"] | {
            "category": category,
            "count": count(*[_type == "vacancy" && category == ^.category])
          } | order(count desc)[0...10]`).catch(() => [])
        ])
        
        faqs = results[0] || 0
        aiGeneratedFaqs = results[1] || 0
        recentFaqs = results[2] || []
        blogPosts = results[3] || 0
        aiGeneratedBlogs = results[4] || 0
        recentBlogs = results[5] || []
        testimonials = results[6] || 0
        leads = results[7] || 0
        recentLeads = results[8] || []
        leadsBySource = results[9] || []
        vacancies = results[10] || 0
        activeVacancies = results[11] || 0
        recentVacancies = results[12] || []
        vacanciesByCategory = results[13] || []
      }
    } catch (error) {
      console.log("Sanity stats fetch failed, using defaults:", (error as Error).message)
    }

    // Fetch analytics from Redis
    let chatEvents = [], matchEvents = [], blogViewEvents = []
    try {
      [chatEvents, matchEvents, blogViewEvents] = await Promise.all([
        getAnalytics('chat_session', 100),
        getAnalytics('ai_match', 100),
        getAnalytics('blog_view', 100)
      ])
    } catch (error) {
      console.log("Redis analytics fetch failed:", (error as Error).message)
    }

    // Enhanced recent activity
    const recentActivity = [
      ...recentLeads.slice(0, 3).map((lead: any) => ({
        type: 'lead',
        message: `New lead: ${lead.name} from ${lead.source || 'unknown source'}`,
        timestamp: new Date(lead._createdAt).getTime()
      })),
      ...recentFaqs.slice(0, 3).map((faq: any) => ({
        type: 'faq',
        message: `${faq.aiGenerated ? 'AI generated' : 'Added'} FAQ: ${faq.question.substring(0, 50)}...`,
        timestamp: new Date(faq._createdAt).getTime()
      })),
      ...recentBlogs.slice(0, 3).map((post: any) => ({
        type: 'blog',
        message: `${post.aiGenerated ? 'AI generated' : 'Published'} blog: ${post.title}`,
        timestamp: new Date(post.publishedAt || post._createdAt).getTime()
      })),
      ...recentVacancies.slice(0, 3).map((job: any) => ({
        type: 'vacancy',
        message: `New vacancy: ${job.title} at ${job.company}`,
        timestamp: new Date(job._createdAt).getTime()
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

    // Legacy stats for existing dashboard component
    const stats = {
      totalLeads: leads,
      totalFAQs: faqs,
      totalBlogPosts: blogPosts,
      chatSessions: chatEvents.length,
    }

    // Enhanced stats for new features
    const detailedStats = {
      leads: {
        total: leads,
        bySource: leadsBySource,
        recent: recentLeads
      },
      faqs: {
        total: faqs,
        aiGenerated: aiGeneratedFaqs,
        recent: recentFaqs
      },
      blog: {
        total: blogPosts,
        aiGenerated: aiGeneratedBlogs,
        recent: recentBlogs
      },
      vacancies: {
        total: vacancies,
        active: activeVacancies,
        byCategory: vacanciesByCategory,
        recent: recentVacancies
      },
      analytics: {
        chatSessions: chatEvents.length,
        aiMatches: matchEvents.length,
        blogViews: blogViewEvents.length
      }
    }

    return NextResponse.json({ 
      stats, 
      recentActivity,
      detailedStats 
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
