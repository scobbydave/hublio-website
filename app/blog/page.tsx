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
    // For now, return empty regular posts until Sanity is properly set up
    const posts: BlogPost[] = []

    // Return empty news articles to avoid SSR fetch issues
    const newsArticles: BlogPost[] = []

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

// Remove dynamic rendering to prevent SSR issues
export const dynamic = 'auto'
export const revalidate = false

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
