import { NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis"
import { summarizeNewsArticle } from "@/lib/ai"
import { GeminiService } from "@/lib/gemini"

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
  content?: string
}

interface BlogPost {
  title: string
  summary: string
  date: string
  slug: string
  readTime: string
  category: string
  sourceUrl?: string
  imageUrl?: string
  source?: string
  isAIGenerated: boolean
}

const geminiService = new GeminiService()

export async function GET() {
  try {
    const redis = getRedisClient()
    
    // Check cache first (cache for 1 hour)
    if (redis) {
      const cached = await redis.get('news-feed:mining')
      if (cached) {
        return NextResponse.json(JSON.parse(cached as string))
      }
    }

    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      console.log("NewsAPI key not configured, returning empty array")
      return NextResponse.json([])
    }

    // Fetch mining-related news from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=mining+OR+minerals+OR+"gold+mining"+OR+"platinum+mining"+OR+"coal+mining"&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    )

    if (!newsResponse.ok) {
      console.error("NewsAPI error:", newsResponse.status, newsResponse.statusText)
      return NextResponse.json([])
    }

    const newsData = await newsResponse.json()
    const articles: NewsArticle[] = newsData.articles || []

    // Filter and summarize articles
    const processedArticles: BlogPost[] = []
    
    for (const article of articles.slice(0, 6)) {
      try {
        if (!article.title || !article.description) continue

        // Create content for AI summarization
        const fullContent = `${article.title}\n\n${article.description}\n\n${article.content || ''}`
        
        let summary: string
        try {
          // Try Gemini first, fallback to OpenAI
          summary = await geminiService.summarizeNews(fullContent)
        } catch (geminiError) {
          console.log("Gemini failed, trying OpenAI:", geminiError)
          try {
            summary = await summarizeNewsArticle(fullContent)
          } catch (openaiError) {
            console.log("OpenAI also failed, using description:", openaiError)
            summary = article.description.substring(0, 200) + "..."
          }
        }

        // Create blog post format
        const blogPost: BlogPost = {
          title: article.title,
          summary: summary,
          date: article.publishedAt,
          slug: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          readTime: "2 min read",
          category: "AI Summarized News",
          sourceUrl: article.url,
          source: article.source.name,
          isAIGenerated: true,
        }

        processedArticles.push(blogPost)
      } catch (error) {
        console.error("Error processing article:", error)
        continue
      }
    }

    // Cache the results for 1 hour
    if (redis && processedArticles.length > 0) {
      await redis.setex('news-feed:mining', 3600, JSON.stringify(processedArticles))
    }

    return NextResponse.json(processedArticles)
  } catch (error) {
    console.error("Error in news feed API:", error)
    return NextResponse.json([])
  }
}
