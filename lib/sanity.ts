import { createClient } from "@sanity/client"

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
})

// Validate Sanity connection
export function validateSanityConnection(): boolean {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN

  if (!projectId || !dataset || !token) {
    console.error("Sanity configuration missing:", {
      projectId: !!projectId,
      dataset: !!dataset,
      token: !!token,
    })
    return false
  }

  return true
}

// Blog post interface
export interface BlogPost {
  _id?: string
  _type: "post"
  title: string
  slug: {
    _type: "slug"
    current: string
  }
  excerpt: string
  content: any[]
  publishedAt: string
  author?: {
    name: string
    image?: string
  }
  mainImage?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  categories?: string[]
  tags?: string[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

// FAQ interface
export interface FAQ {
  _id?: string
  _type: "faq"
  question: string
  answer: string
  category: string
  order?: number
  publishedAt: string
}

// Create a new blog post
export async function createBlogPost(post: Omit<BlogPost, "_id" | "_type">): Promise<BlogPost> {
  if (!validateSanityConnection()) {
    throw new Error("Sanity not configured. Please set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN.")
  }

  try {
    const result = await sanityClient.create({
      _type: "post",
      ...post,
    })
    return result as BlogPost
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw new Error("Failed to create blog post in Sanity")
  }
}

// Get all blog posts
export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  if (!validateSanityConnection()) {
    console.log("Sanity not configured, returning empty array")
    return []
  }

  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0...${limit}] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        author,
        mainImage,
        categories,
        tags,
        seo
      }
    `)
    return posts || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!validateSanityConnection()) {
    return null
  }

  try {
    const post = await sanityClient.fetch(
      `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        content,
        publishedAt,
        author,
        mainImage,
        categories,
        tags,
        seo
      }
    `,
      { slug },
    )
    return post || null
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

// Create FAQ
export async function createFAQ(faq: Omit<FAQ, "_id" | "_type">): Promise<FAQ> {
  if (!validateSanityConnection()) {
    throw new Error("Sanity not configured. Please set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN.")
  }

  try {
    const result = await sanityClient.create({
      _type: "faq",
      ...faq,
    })
    return result as FAQ
  } catch (error) {
    console.error("Error creating FAQ:", error)
    throw new Error("Failed to create FAQ in Sanity")
  }
}

// Get all FAQs
export async function getFAQs(): Promise<FAQ[]> {
  if (!validateSanityConnection()) {
    return []
  }

  try {
    const faqs = await sanityClient.fetch(`
      *[_type == "faq"] | order(order asc, _createdAt desc) {
        _id,
        question,
        answer,
        category,
        order,
        publishedAt
      }
    `)
    return faqs || []
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
}

// Update blog post
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  if (!validateSanityConnection()) {
    throw new Error("Sanity not configured")
  }

  try {
    const result = await sanityClient.patch(id).set(updates).commit()
    return result as BlogPost
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw new Error("Failed to update blog post")
  }
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<void> {
  if (!validateSanityConnection()) {
    throw new Error("Sanity not configured")
  }

  try {
    await sanityClient.delete(id)
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw new Error("Failed to delete blog post")
  }
}

// Get blog stats
export async function getBlogStats(): Promise<{
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalFAQs: number
}> {
  if (!validateSanityConnection()) {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalFAQs: 0,
    }
  }

  try {
    const [totalPosts, publishedPosts, draftPosts, totalFAQs] = await Promise.all([
      sanityClient.fetch(`count(*[_type == "post"])`),
      sanityClient.fetch(`count(*[_type == "post" && defined(publishedAt)])`),
      sanityClient.fetch(`count(*[_type == "post" && !defined(publishedAt)])`),
      sanityClient.fetch(`count(*[_type == "faq"])`),
    ])

    return {
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      draftPosts: draftPosts || 0,
      totalFAQs: totalFAQs || 0,
    }
  } catch (error) {
    console.error("Error fetching blog stats:", error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalFAQs: 0,
    }
  }
}

export { sanityClient }
