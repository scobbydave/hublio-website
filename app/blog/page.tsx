import { BlogPageClient } from "./blog-client"
import { sanityClient } from "@/lib/sanity"

// Use the same interface as the client component expects
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
  isAIGenerated?: boolean
}

// Server component to fetch fresh data with automatic revalidation
async function getBlogData(): Promise<{ 
  posts: BlogPost[], 
  newsArticles: BlogPost[], 
  error?: string 
}> {
  try {
    // Fetch AI-summarized news with cache tags for revalidation
    const newsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/news-feed`, {
      next: { 
        revalidate: 300, // Revalidate every 5 minutes
        tags: ['news-feed', 'blog-data']
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0'
      }
    })
    
    const newsData = newsResponse.ok ? await newsResponse.json() : []
    
    // Transform news articles to blog post format
    const newsArticles: BlogPost[] = Array.isArray(newsData) ? newsData.map((article: any) => ({
      title: article.title || '',
      summary: article.aiSummary || article.description || '',
      date: article.publishedAt || new Date().toISOString(),
      slug: article.url ? new URL(article.url).pathname : '',
      readTime: '2 min read',
      category: 'AI Summarized News',
      sourceUrl: article.url,
      imageUrl: article.urlToImage,
      source: article.source?.name || 'Mining News',
      isAIGenerated: true
    })) : []

    // For now, return empty regular posts until Sanity is properly set up
    const posts: BlogPost[] = []

    return {
      posts,
      newsArticles,
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    return {
      posts: [],
      newsArticles: [],
      error: 'Failed to load blog content',
    }
  }
}

// Force dynamic rendering and revalidation
export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export default async function BlogPage() {
  const { posts, newsArticles, error } = await getBlogData()

  return (
    <BlogPageClient 
      initialPosts={posts} 
      newsArticles={newsArticles} 
      error={error} 
    />
  )
}
