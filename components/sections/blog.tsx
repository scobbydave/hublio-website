"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar } from "lucide-react"
import AnimatedHeader, { MiningSection } from "@/components/AnimatedHeader"

// Default blog posts (fallback if Sanity is not available)
const defaultBlogPosts = [
  {
    title: "The Future of AI in South African Mining",
    summary:
      "Exploring how artificial intelligence is transforming the mining industry in South Africa, from predictive maintenance to safety optimization.",
    date: "2024-01-15",
    slug: "future-ai-south-african-mining",
  },
  {
    title: "Sustainable Mining Practices with Technology",
    summary:
      "How modern technology and AI solutions are helping mining companies adopt more sustainable and environmentally friendly practices.",
    date: "2024-01-12",
    slug: "sustainable-mining-practices-technology",
  },
  {
    title: "Mining Safety: A Data-Driven Approach",
    summary:
      "Using data analytics and machine learning to predict and prevent mining accidents, creating safer work environments for miners.",
    date: "2024-01-10",
    slug: "mining-safety-data-driven-approach",
  },
]

export function Blog() {
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts)

  useEffect(() => {
    // Try to fetch from Sanity CMS, fallback to default posts
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog/posts")
        if (response.ok) {
          const posts = await response.json()
          if (posts && posts.length > 0) {
            setBlogPosts(posts.slice(0, 3)) // Show latest 3 posts
          }
        }
      } catch (error) {
        console.log("Using default blog posts")
        // Keep default posts
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <MiningSection className="py-20 bg-muted/50" id="blog">
      <div className="container">
        <div className="text-center mb-16">
          <AnimatedHeader>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Insights</h2>
          </AnimatedHeader>
          <AnimatedHeader delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground">
              Stay updated with the latest trends and insights in mining technology
            </p>
          </AnimatedHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {blogPosts.map((post, index) => (
            <AnimatedHeader key={post.slug} delay={0.1 * index}>
              <Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/20 hover:border-l-primary/60">
                {/* Featured post indicator */}
                {index === 0 && (
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Featured
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.summary}</p>
                  <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            </AnimatedHeader>
          ))}
        </div>

        <AnimatedHeader delay={0.5}>
          <div className="text-center">
            <Button asChild className="hover:shadow-lg transition-all">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </AnimatedHeader>
      </div>
    </MiningSection>
  )
}
