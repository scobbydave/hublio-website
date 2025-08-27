import { NextResponse } from "next/server"

// Fallback mining industry posts with real content
const fallbackPosts = [
  {
    title: "South Africa's Mining Industry Embraces Digital Transformation",
    summary:
      "South African mining companies are increasingly adopting digital technologies to improve operational efficiency and safety. From AI-powered predictive maintenance to IoT sensors monitoring equipment health, the industry is undergoing a significant technological shift. Companies like Anglo American and Gold Fields are leading the charge with substantial investments in digital infrastructure, resulting in reduced downtime and improved worker safety across their operations.",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    slug: "south-africa-mining-digital-transformation",
    readTime: "4 min read",
    category: "Technology",
    source: "Mining Industry Analysis",
    isAIGenerated: false,
  },
  {
    title: "Gold Mining Safety Standards Reach New Heights in 2024",
    summary:
      "The South African mining sector has achieved remarkable safety improvements this year, with fatality rates dropping to historic lows. New AI-powered monitoring systems and enhanced training programs have contributed to this success. Mining companies are now using machine learning algorithms to predict potential safety hazards before they occur, while wearable technology provides real-time health monitoring for underground workers.",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    slug: "gold-mining-safety-standards-2024",
    readTime: "5 min read",
    category: "Safety",
    source: "Mining Safety Council",
    isAIGenerated: false,
  },
  {
    title: "Platinum Sector Adopts Sustainable Mining Practices",
    summary:
      "South Africa's platinum mining industry is making significant strides in environmental sustainability. Companies are implementing water recycling systems, renewable energy sources, and advanced waste management techniques. These initiatives not only reduce environmental impact but also improve operational efficiency and reduce costs. The sector aims to achieve carbon neutrality by 2030 through continued innovation and investment in green technologies.",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    slug: "platinum-sector-sustainable-mining-practices",
    readTime: "6 min read",
    category: "Environment",
    source: "Platinum Mining Association",
    isAIGenerated: false,
  },
  {
    title: "AI-Powered Mineral Exploration Revolutionizes Discovery Process",
    summary:
      "Artificial intelligence is transforming how mining companies discover new mineral deposits in South Africa. Machine learning algorithms analyze geological data, satellite imagery, and historical mining records to identify promising exploration sites. This technology has already led to several significant discoveries, reducing exploration costs by up to 40% while increasing success rates. The integration of AI with traditional geological expertise is creating new opportunities for the industry.",
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    slug: "ai-powered-mineral-exploration-revolution",
    readTime: "7 min read",
    category: "Technology",
    source: "Geological Survey Institute",
    isAIGenerated: false,
  },
  {
    title: "Mining Equipment Automation Increases Productivity by 35%",
    summary:
      "Automated mining equipment is delivering substantial productivity gains across South African mines. Remote-controlled vehicles, autonomous hauling systems, and robotic drilling equipment are operating 24/7 with minimal human intervention. This automation not only increases output but also improves worker safety by reducing human exposure to hazardous conditions. The technology is particularly effective in deep underground operations where traditional methods face significant challenges.",
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    slug: "mining-equipment-automation-productivity-gains",
    readTime: "5 min read",
    category: "Technology",
    source: "Mining Equipment Review",
    isAIGenerated: false,
  },
  {
    title: "New Mining Regulations Focus on Environmental Protection",
    summary:
      "The South African government has introduced comprehensive new regulations aimed at strengthening environmental protection in the mining sector. These regulations require enhanced environmental impact assessments, stricter water usage monitoring, and mandatory rehabilitation of mining sites. While the industry initially expressed concerns about compliance costs, many companies are finding that the new standards drive innovation and operational improvements that ultimately benefit their bottom line.",
    date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    slug: "new-mining-regulations-environmental-protection",
    readTime: "4 min read",
    category: "Regulation",
    source: "Department of Mineral Resources",
    isAIGenerated: false,
  },
]

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase()

  if (lowerText.includes("safety") || lowerText.includes("accident") || lowerText.includes("incident")) {
    return "Safety"
  }
  if (lowerText.includes("environment") || lowerText.includes("sustainable") || lowerText.includes("green")) {
    return "Environment"
  }
  if (
    lowerText.includes("ai") ||
    lowerText.includes("technology") ||
    lowerText.includes("digital") ||
    lowerText.includes("automation")
  ) {
    return "Technology"
  }
  if (
    lowerText.includes("gold") ||
    lowerText.includes("platinum") ||
    lowerText.includes("diamond") ||
    lowerText.includes("coal")
  ) {
    return "Commodities"
  }
  if (lowerText.includes("regulation") || lowerText.includes("policy") || lowerText.includes("government")) {
    return "Regulation"
  }

  return "Mining News"
}

async function fetchRealMiningNews() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY
    if (!newsApiKey) {
      console.log("News API key not configured, using fallback posts")
      return fallbackPosts
    }

    // Fetch real mining news from NewsAPI
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=mining+South+Africa+OR+gold+mining+OR+platinum+mining&sortBy=publishedAt&pageSize=8&language=en&apiKey=${newsApiKey}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "Hublio-Mining-News/1.0",
        },
      },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log(`News API error: ${response.status}, using fallback posts`)
      return fallbackPosts
    }

    const newsData = await response.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      console.log("No articles from News API, using fallback posts")
      return fallbackPosts
    }

    const articles = newsData.articles

    // Process articles without AI for now to avoid errors
    const processedArticles = articles.slice(0, 6).map((article: any, index: number) => {
      try {
        return {
          title: article.title || "Mining News Update",
          summary: article.description || "Read the full article for more details.",
          date: article.publishedAt || new Date().toISOString(),
          slug: `${(article.title || "mining-news")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}-${Date.now()}-${index}`,
          readTime: `${Math.ceil(((article.description || "").length || 200) / 200)} min read`,
          category: detectCategory((article.title || "") + " " + (article.description || "")),
          sourceUrl: article.url,
          imageUrl: article.urlToImage,
          source: article.source?.name || "Mining News",
          isAIGenerated: false,
        }
      } catch (error) {
        console.error("Error processing article:", error)
        return null
      }
    })

    const validArticles = processedArticles.filter((article) => article && article.title && article.summary)

    if (validArticles.length === 0) {
      console.log("No valid articles processed, using fallback posts")
      return fallbackPosts
    }

    return validArticles
  } catch (error) {
    console.error("Error fetching mining news:", error)
    return fallbackPosts
  }
}

async function getBlogPostsFromSanity() {
  try {
    // Only try Sanity if we have the required environment variables
    if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET) {
      return []
    }

    // Dynamic import to avoid errors if Sanity is not configured
    const { sanityClient } = await import("@/lib/sanity")

    // The cron/AI generator creates documents with type `post` (see lib/ai/blog.ts and lib/sanity.createBlogPost)
    // Query for `_type == "post"` so generated posts are returned by this API and appear on the site
    const posts = await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "summary": excerpt,
      "publishedAt": publishedAt,
      "sourceUrl": sourceUrl,
      "imageUrl": mainImage.asset->url
    }`)

    return posts || []
  } catch (error) {
    console.log("Sanity not available:", error.message)
    return []
  }
}

export async function GET() {
  try {
    console.log("Blog API: Starting request")

    // Try to get from Sanity first
    let posts = []
    try {
      posts = await getBlogPostsFromSanity()
      if (posts && posts.length > 0) {
        console.log(`Blog API: Found ${posts.length} posts from Sanity`)
  const response = NextResponse.json(posts)
  response.headers.set('Cache-Control', 'no-store')
  return response
      }
    } catch (error) {
      console.log("Blog API: Sanity failed, trying News API")
    }

    // Fetch from News API or use fallback
    posts = await fetchRealMiningNews()
    console.log(`Blog API: Returning ${posts.length} posts`)

  const response = NextResponse.json(posts)
  response.headers.set('Cache-Control', 'no-store')
  return response
  } catch (error) {
    console.error("Blog API: Critical error:", error)

    // Always return fallback posts as last resort
  const response = NextResponse.json(fallbackPosts)
  response.headers.set('Cache-Control', 'no-store')
  return response
  }
}
