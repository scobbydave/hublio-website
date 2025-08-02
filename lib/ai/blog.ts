import OpenAI from "openai"
import { summarizeNewsArticle } from "@/lib/ai"
import { generateBlogContent, summarizeNews } from "@/lib/ai"
import { createBlogPost } from "@/lib/sanity"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface BlogGenerationRequest {
  topic: string
  newsData?: {
    title: string
    description: string
    content: string
    url?: string
  }
  category?: string
  targetAudience?: string
}

export interface NewsArticle {
  title: string
  description: string
  content: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
}

export interface BlogGenerationResult {
  success: boolean
  blogPost?: any
  error?: string
}

export async function generateBlogPost(request: BlogGenerationRequest): Promise<any> {
  try {
    const { topic, newsData, category = "Mining Industry", targetAudience = "mining professionals" } = request

    const prompt = `Create a comprehensive blog post for Hublio's mining industry website.

Topic: ${topic}
Category: ${category}
Target Audience: ${targetAudience}
${newsData ? `News Source: ${JSON.stringify(newsData)}` : ""}

Requirements:
- Professional tone for South African mining industry
- SEO-optimized with relevant keywords
- Structure: Introduction, Key Points (2-3 sections), Practical Applications, Conclusion
- Include actionable insights and practical advice
- Focus on safety, efficiency, and technology where relevant
- 800-1200 words
- Include relevant statistics or data points when possible

Please format as JSON with these exact fields:
{
  "title": "SEO-friendly title (max 60 characters)",
  "summary": "Compelling 2-3 sentence summary",
  "content": "Full HTML-formatted blog content with proper headings and paragraphs",
  "metaDescription": "Meta description for SEO (max 160 characters)",
  "category": "Blog category",
  "tags": ["array", "of", "relevant", "tags"],
  "featuredImageSuggestion": "Description for featured image",
  "readTime": "estimated read time"
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert mining industry content writer for Hublio, a leading South African AI-powered mining solutions company. 
          
          Your expertise includes:
          - South African mining industry trends and regulations
          - AI applications in mining operations
          - Mining safety protocols and best practices
          - Operational efficiency and cost optimization
          - Environmental sustainability in mining
          - Equipment maintenance and predictive analytics
          
          Write engaging, informative content that provides real value to mining professionals, engineers, and decision-makers.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const blogContent = response.choices[0]?.message?.content || ""

    try {
      const parsedContent = JSON.parse(blogContent)

      // Validate required fields
      if (!parsedContent.title || !parsedContent.content || !parsedContent.summary) {
        throw new Error("Missing required fields in generated content")
      }

      // Calculate read time if not provided
      if (!parsedContent.readTime) {
        const wordCount = parsedContent.content.replace(/<[^>]*>/g, "").split(/\s+/).length
        const readTime = Math.ceil(wordCount / 200) // Average reading speed
        parsedContent.readTime = `${readTime} min read`
      }

      return {
        title: parsedContent.title.substring(0, 60),
        summary: parsedContent.summary,
        content: parsedContent.content,
        metaDescription: parsedContent.metaDescription?.substring(0, 160) || parsedContent.summary.substring(0, 160),
        category: parsedContent.category || category,
        tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : ["mining", "industry", "south-africa"],
        featuredImageSuggestion:
          parsedContent.featuredImageSuggestion || `Professional mining industry image related to ${topic}`,
        readTime: parsedContent.readTime,
      }
    } catch (parseError) {
      console.error("Error parsing generated blog content:", parseError)
      return generateFallbackBlogPost(topic, newsData)
    }
  } catch (error) {
    console.error("Error generating blog post:", error)
    return generateFallbackBlogPost(request.topic, request.newsData)
  }
}

function generateFallbackBlogPost(topic: string, newsData?: any): any {
  const wordCount = 600
  const readTime = Math.ceil(wordCount / 200)

  return {
    title: `${topic}: Mining Industry Insights`,
    summary: `Explore the latest developments in ${topic} and their impact on South African mining operations. Learn how these changes affect safety, efficiency, and profitability.`,
    content: `
      <h2>Introduction</h2>
      <p>The South African mining industry continues to evolve with new technologies and practices. Understanding ${topic} is crucial for mining professionals who want to stay competitive and maintain the highest safety standards.</p>
      
      <h2>Key Developments</h2>
      <p>Recent developments in ${topic} have shown significant potential for improving mining operations. Industry leaders are increasingly focusing on implementing these advances to enhance both safety and operational efficiency.</p>
      
      <h2>Practical Applications</h2>
      <p>Mining companies can leverage insights about ${topic} to optimize their operations, reduce costs, and improve worker safety. The integration of modern approaches with traditional mining practices creates opportunities for substantial improvements.</p>
      
      <h2>Impact on South African Mining</h2>
      <p>For South African mining operations, understanding ${topic} is particularly important given the unique challenges and opportunities in our local market. Companies that adapt quickly to these changes often see improved performance and competitive advantages.</p>
      
      <h2>Conclusion</h2>
      <p>Staying informed about ${topic} is essential for mining industry success. As technology continues to advance, mining professionals must remain adaptable and informed. Contact Hublio to learn how our AI-powered solutions can help you implement these insights effectively.</p>
    `,
    metaDescription: `Learn about ${topic} in South African mining. Expert insights on safety, efficiency, and technology for mining professionals.`,
    category: "Mining Industry",
    tags: ["mining", "south-africa", "industry", "technology", "safety"],
    featuredImageSuggestion: `Professional image showing ${topic} in a South African mining context with modern equipment and safety protocols`,
    readTime: `${readTime} min read`,
  }
}

export async function generateNewsBasedBlogPost(newsArticle: {
  title: string
  description: string
  content: string
  url?: string
}): Promise<any> {
  try {
    // First, get an AI summary of the news
    const summary = await summarizeNewsArticle(newsArticle)

    // Then generate a full blog post based on the news
    return await generateBlogPost({
      topic: newsArticle.title,
      newsData: {
        ...newsArticle,
        summary,
      },
      category: "Mining News",
      targetAudience: "South African mining professionals",
    })
  } catch (error) {
    console.error("Error generating news-based blog post:", error)
    return generateFallbackBlogPost(newsArticle.title, newsArticle)
  }
}

// Generate blog post from news article
export async function generateBlogFromNews(article: any, category = "Mining News"): Promise<BlogGenerationResult> {
  try {
    // First, summarize the news article to check mining relevance
    const summary = await summarizeNews({
      title: article.title,
      content: article.content || article.description,
      url: article.url,
    })

    // Generate blog content based on the article
    const blogContent = await generateBlogContent(
      article.title,
      `News article context: ${summary.summary}\n\nKey points: ${summary.keyPoints.join(", ")}\n\nMining relevance: ${summary.miningRelevance}`,
    )

    // Create the blog post in Sanity
    const blogPost = await createBlogPost({
      title: blogContent.title,
      slug: {
        current: blogContent.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim(),
      },
      excerpt: blogContent.excerpt,
      content: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: blogContent.content,
            },
          ],
        },
      ],
      publishedAt: new Date().toISOString(),
      author: {
        name: "Hublio AI",
        image: undefined,
      },
      categories: [category],
      tags: blogContent.tags,
      seo: {
        metaTitle: blogContent.title,
        metaDescription: blogContent.excerpt,
      },
    })

    return {
      success: true,
      blogPost,
    }
  } catch (error) {
    console.error("Error generating blog from news:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Generate multiple blog posts from news articles
export async function generateBlogsFromNewsArticles(articles: any[], maxPosts = 3): Promise<BlogGenerationResult[]> {
  const results: BlogGenerationResult[] = []

  // Process articles in batches to avoid rate limiting
  for (let i = 0; i < Math.min(articles.length, maxPosts); i++) {
    const article = articles[i]

    try {
      const result = await generateBlogFromNews(article)
      results.push(result)

      // Add delay between requests to avoid rate limiting
      if (i < maxPosts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    } catch (error) {
      results.push({
        success: false,
        error: `Failed to process article: ${article.title}`,
      })
    }
  }

  return results
}

// Generate topic-based blog post
export async function generateTopicBlog(topic: string, category = "Mining Insights"): Promise<BlogGenerationResult> {
  try {
    const blogContent = await generateBlogContent(topic)

    const blogPost = await createBlogPost({
      title: blogContent.title,
      slug: {
        current: blogContent.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim(),
      },
      excerpt: blogContent.excerpt,
      content: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: blogContent.content,
            },
          ],
        },
      ],
      publishedAt: new Date().toISOString(),
      author: {
        name: "Hublio Team",
        image: undefined,
      },
      categories: [category],
      tags: blogContent.tags,
      seo: {
        metaTitle: blogContent.title,
        metaDescription: blogContent.excerpt,
      },
    })

    return {
      success: true,
      blogPost,
    }
  } catch (error) {
    console.error("Error generating topic blog:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Get mining-related topics for blog generation
export function getMiningTopics(): string[] {
  return [
    "Mining Safety Innovations in South Africa",
    "AI-Powered Predictive Maintenance for Mining Equipment",
    "Sustainable Mining Practices and Environmental Impact",
    "Digital Transformation in South African Mining",
    "Mining Industry Workforce Development",
    "Automation and Robotics in Modern Mining",
    "Mining Data Analytics and Business Intelligence",
    "Health and Safety Compliance in Mining Operations",
    "Mining Equipment Optimization Strategies",
    "Future of Mining Technology in Africa",
  ]
}

// Check if news article is mining-related
export async function isMiningRelated(article: any): Promise<boolean> {
  try {
    const summary = await summarizeNews({
      title: article.title,
      content: article.content || article.description,
      url: article.url,
    })

    // Simple relevance check based on keywords and AI assessment
    const miningKeywords = ["mining", "mine", "mineral", "extraction", "ore", "coal", "gold", "platinum", "diamond"]
    const hasKeywords = miningKeywords.some(
      (keyword) =>
        article.title.toLowerCase().includes(keyword) ||
        (article.content || article.description).toLowerCase().includes(keyword),
    )

    const aiRelevance =
      summary.miningRelevance.toLowerCase().includes("high") ||
      summary.miningRelevance.toLowerCase().includes("significant")

    return hasKeywords || aiRelevance
  } catch (error) {
    console.error("Error checking mining relevance:", error)
    // Fallback to keyword-based check
    const miningKeywords = ["mining", "mine", "mineral", "extraction", "ore", "coal", "gold", "platinum", "diamond"]
    return miningKeywords.some(
      (keyword) =>
        article.title.toLowerCase().includes(keyword) ||
        (article.content || article.description).toLowerCase().includes(keyword),
    )
  }
}
