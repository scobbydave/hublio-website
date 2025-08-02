import { type NextRequest, NextResponse } from "next/server"
import { generateBlogsFromNewsArticles, isMiningRelated, type NewsArticle } from "@/lib/ai/blog"

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting automated blog generation...")

    // Check if required environment variables are available
    if (!process.env.NEWS_API_KEY) {
      console.error("NEWS_API_KEY not configured")
      return NextResponse.json(
        {
          error: "News API not configured",
          success: false,
        },
        { status: 500 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured")
      return NextResponse.json(
        {
          error: "OpenAI API not configured",
          success: false,
        },
        { status: 500 },
      )
    }

    if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET) {
      console.error("Sanity not configured")
      return NextResponse.json(
        {
          error: "Sanity CMS not configured",
          success: false,
        },
        { status: 500 },
      )
    }

    // Fetch mining-related news
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=mining OR "mining industry" OR "mining technology" OR "mining safety"&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`,
    )

    if (!newsResponse.ok) {
      throw new Error(`News API error: ${newsResponse.status}`)
    }

    const newsData = await newsResponse.json()
    console.log(`Fetched ${newsData.articles?.length || 0} news articles`)

    if (!newsData.articles || newsData.articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No news articles found",
        generated: 0,
      })
    }

    // Filter for mining-related articles
    const miningArticles: NewsArticle[] = []

    for (const article of newsData.articles.slice(0, 10)) {
      if (article.title && article.description) {
        const newsArticle: NewsArticle = {
          title: article.title,
          description: article.description,
          content: article.content || article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source,
        }

        try {
          const isRelevant = await isMiningRelated(newsArticle)
          if (isRelevant) {
            miningArticles.push(newsArticle)
          }
        } catch (error) {
          console.error("Error checking article relevance:", error)
          // Include article if relevance check fails
          miningArticles.push(newsArticle)
        }
      }
    }

    console.log(`Found ${miningArticles.length} mining-related articles`)

    if (miningArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No mining-related articles found",
        generated: 0,
      })
    }

    // Generate blog posts from the most relevant articles
    const results = await generateBlogsFromNewsArticles(miningArticles, 3)

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`Blog generation complete: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Generated ${successful} blog posts from ${miningArticles.length} articles`,
      generated: successful,
      failed: failed,
      results: results.map((r) => ({
        success: r.success,
        title: r.blogPost?.title,
        error: r.error,
      })),
    })
  } catch (error) {
    console.error("Blog generation cron error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        generated: 0,
      },
      { status: 500 },
    )
  }
}

// Allow GET for testing
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const secret = url.searchParams.get("secret")

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Create a new request with POST method for testing
  const testRequest = new Request(request.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
      "content-type": "application/json",
    },
  })

  return POST(testRequest as NextRequest)
}
