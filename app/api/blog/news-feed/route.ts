import { NextResponse } from "next/server"
import { summarizeNewsArticle } from "@/lib/ai"
import { getRedisClient } from "@/lib/redis"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string | null
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

// Ensure this API route is always dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('📰 Starting news fetch...')
    
    const redis = getRedisClient()
    
    // Check cache first (cache for 30 minutes for faster updates)
    if (redis) {
      try {
        const cached = await redis.get('news-feed:mining')
        if (cached) {
          console.log('✅ Returning cached news')
          return NextResponse.json(JSON.parse(cached as string))
        }
      } catch (cacheError) {
        console.log('⚠️ Cache error:', cacheError)
      }
    }

    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      console.error("❌ NewsAPI key not configured, using mock data")
      return NextResponse.json(getMockNews())
    }

    console.log('🔍 Fetching from NewsAPI...')

    // Fetch mining-related news from NewsAPI with broader search terms
    const newsUrl = `https://newsapi.org/v2/everything?q=mining OR "mineral extraction" OR "gold mining" OR "platinum mining" OR "coal mining" OR "mining company" OR "mining industry"&language=en&sortBy=publishedAt&pageSize=12&from=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&apiKey=${apiKey}`
    
    console.log('📡 Fetching news from NewsAPI...')
    
    const newsResponse = await fetch(newsUrl, {
      headers: {
        'User-Agent': 'HublioWebsite/1.0'
      }
    })

    if (!newsResponse.ok) {
      console.error("❌ NewsAPI error:", newsResponse.status, newsResponse.statusText)
      const errorText = await newsResponse.text()
      console.error("Error response:", errorText)
      return NextResponse.json(getMockNews())
    }

    const newsData = await newsResponse.json()
    console.log(`📊 NewsAPI returned ${newsData.articles?.length || 0} articles`)
    
    if (!newsData.articles || newsData.articles.length === 0) {
      console.log('⚠️ No articles found from NewsAPI, using mock data')
      return NextResponse.json(getMockNews())
    }

    const articles: NewsArticle[] = newsData.articles || []

    // Filter and process articles
    const processedArticles: BlogPost[] = []
    
    for (const article of articles.slice(0, 8)) {
      try {
        if (!article.title || !article.description) {
          console.log('⚠️ Skipping article - missing title or description')
          continue
        }

        console.log(`🔄 Processing: ${article.title.substring(0, 50)}...`)

        // Create content for AI summarization
        const fullContent = `${article.title}\n\n${article.description}`
        
        let summary: string
        try {
          // Try AI summarization
          summary = await summarizeNewsArticle(fullContent)
        } catch (aiError) {
          console.log("⚠️ AI summarization failed, using description:", aiError)
          summary = article.description.substring(0, 250) + (article.description.length > 250 ? "..." : "")
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
          imageUrl: article.urlToImage || undefined,
          source: article.source.name,
          isAIGenerated: true,
        }

        processedArticles.push(blogPost)
        console.log(`✅ Processed article: ${article.title.substring(0, 30)}...`)
      } catch (error) {
        console.error("❌ Error processing article:", error)
        continue
      }
    }

    console.log(`📈 Successfully processed ${processedArticles.length} articles`)

    // If we got no processed articles, return mock data
    if (processedArticles.length === 0) {
      console.log('⚠️ No processable articles, using mock data')
      return NextResponse.json(getMockNews())
    }

    // Cache the results for 30 minutes (faster refresh)
    if (redis) {
      try {
        await redis.setex('news-feed:mining', 1800, JSON.stringify(processedArticles))
        console.log('💾 Cached news feed for 30 minutes')
      } catch (cacheError) {
        console.log('⚠️ Cache save error:', cacheError)
      }
    }

    return NextResponse.json(processedArticles)
  } catch (error) {
    console.error("❌ Error in news feed API:", error)
    return NextResponse.json(getMockNews())
  }
}

// Mock news data for testing and fallback
function getMockNews(): BlogPost[] {
  return [
    {
      title: "Global Mining Operations See Increased AI Integration",
      summary: "Mining companies worldwide are rapidly adopting AI technologies to optimize extraction processes and improve safety standards. Recent implementations show 15-25% efficiency gains across major operations.",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      slug: "ai-integration-mining-2024",
      readTime: "3 min read",
      category: "AI Summarized News",
      source: "Mock Mining News",
      isAIGenerated: true,
    },
    {
      title: "Sustainable Mining Practices Drive Industry Innovation",
      summary: "Environmental consciousness in mining is leading to breakthrough technologies in waste reduction and renewable energy integration. Companies report significant improvements in their carbon footprint metrics.",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      slug: "sustainable-mining-innovation",
      readTime: "2 min read",
      category: "AI Summarized News",
      source: "Mock Environmental Mining",
      isAIGenerated: true,
    },
    {
      title: "Gold Prices Influence Global Mining Investment Strategies",
      summary: "Recent fluctuations in precious metal prices are reshaping investment priorities across the mining sector. Analysts predict continued volatility through Q4 2024.",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      slug: "gold-prices-investment-2024",
      readTime: "2 min read",
      category: "AI Summarized News",
      source: "Mock Market Analysis",
      isAIGenerated: true,
    },
    {
      title: "Advanced Safety Technologies Reduce Mining Accidents",
      summary: "Implementation of IoT sensors and predictive analytics in mining operations has contributed to a 30% reduction in workplace incidents. Industry leaders praise the technology adoption.",
      date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      slug: "mining-safety-technology",
      readTime: "3 min read",
      category: "AI Summarized News",
      source: "Mock Safety Reports",
      isAIGenerated: true,
    },
    {
      title: "Lithium Mining Boom Continues Amid Electric Vehicle Demand",
      summary: "The electric vehicle revolution drives unprecedented demand for lithium mining operations. New extraction sites are being developed across South America and Australia to meet growing needs.",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      slug: "lithium-mining-ev-demand",
      readTime: "2 min read",
      category: "AI Summarized News",
      source: "Mock Industry Reports",
      isAIGenerated: true,
    },
    {
      title: "Automation Transforms Coal Mining Operations",
      summary: "Autonomous vehicles and robotic systems are revolutionizing coal extraction processes. Mining companies report improved productivity and enhanced worker safety through automation implementation.",
      date: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
      slug: "coal-mining-automation",
      readTime: "3 min read",
      category: "AI Summarized News",
      source: "Mock Automation News",
      isAIGenerated: true,
    }
  ]
}
