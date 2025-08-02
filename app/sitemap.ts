import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/lib/sanity"
import { env } from "@/lib/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts()

  const staticPages = [
    {
      url: env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]

  const blogPages = blogPosts.map((post: any) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
