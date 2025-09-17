"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommodityPrices } from "@/components/sections/commodity-prices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"

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

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  newsArticles: BlogPost[]
  error?: string
}

const categories = ["All", "Technology", "Safety", "Environment", "Commodities", "Regulation", "Mining News", "AI Summarized News"]

export function BlogPageClient({ initialPosts, newsArticles, error: serverError }: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [error, setError] = useState<string | null>(serverError || null)
  const [refreshing, setRefreshing] = useState(false)
  const [posts, setPosts] = useState(initialPosts)
  const [news, setNews] = useState(newsArticles)

  // Auto-refresh content every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing blog content...')
        const response = await fetch('/api/blog/news-feed', {
          cache: 'no-store'
        })
        if (response.ok) {
          const freshNews = await response.json()
          setNews(freshNews)
          console.log('✅ Blog content refreshed')
        }
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/blog/news-feed', {
        cache: 'no-store'
      })
      if (response.ok) {
        const freshNews = await response.json()
        setNews(freshNews)
        setError(null)
      } else {
        setError('Failed to refresh content')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setRefreshing(false)
    }
  }
  
  // Combine Sanity posts with AI-summarized news
  const allPosts = [...initialPosts, ...newsArticles]

  const filteredPosts =
    selectedCategory === "All" 
      ? allPosts 
      : selectedCategory === "AI Summarized News"
      ? newsArticles
      : allPosts.filter((post) => post.category === selectedCategory)

  const featuredPost = filteredPosts[0]
  const otherPosts = filteredPosts.slice(1)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary rotate-45"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border-2 border-secondary rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-primary/50 rotate-45"></div>
            <div className="absolute bottom-32 right-1/3 w-28 h-28 border-2 border-secondary/50 rotate-12"></div>
          </div>

          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Mining <span className="text-primary">Insights</span> & <span className="text-secondary">News</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Real-time mining industry news enhanced with AI-powered insights for South African mining operations.
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="border-primary/20">
                  <span className={`w-2 h-2 ${error ? "bg-yellow-500" : "bg-green-500"} rounded-full mr-2`}></span>
                  {error ? "Connecting..." : "Live News Feed"}
                </Badge>
                <Badge variant="outline" className="border-secondary/20">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  AI-Enhanced
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container">
            {/* Live Commodity Prices Widget */}
            <CommodityPrices />

            {/* Error Banner */}
            {error && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      {category === "AI Summarized News" 
                        ? newsArticles.length
                        : allPosts.filter((post) => post.category === category).length}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Content */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts available for this category.</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <div className="mb-16">
                    <Card className="overflow-hidden border-primary/20 hover:shadow-xl transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                          {featuredPost.imageUrl ? (
                            <img
                              src={featuredPost.imageUrl || "/placeholder.svg"}
                              alt={featuredPost.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <svg className="h-16 w-16 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                            <Badge variant="outline" className="border-secondary/20">
                              {featuredPost.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(featuredPost.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {featuredPost.readTime}
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold mb-4 line-clamp-2">{featuredPost.title}</h2>
                          <p className="text-muted-foreground mb-6 line-clamp-3">{featuredPost.summary}</p>
                          <div className="flex items-center gap-4">
                            {featuredPost.sourceUrl && (
                              <Button asChild>
                                <a href={featuredPost.sourceUrl} target="_blank" rel="noopener noreferrer">
                                  Read Full Article <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                              </Button>
                            )}
                            {featuredPost.isAIGenerated && (
                              <Badge variant="outline" className="border-secondary/20 text-secondary">
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                          {featuredPost.source && (
                            <p className="text-xs text-muted-foreground mt-4">Source: {featuredPost.source}</p>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                )}

                {/* AI Summarized News Section */}
                {selectedCategory === "All" && newsArticles.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-3xl font-bold">AI Summarized Mining News</h2>
                      <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                        Updated Daily
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {newsArticles.slice(0, 6).map((post) => (
                        <Card key={post.slug} className="hover:shadow-lg transition-shadow border-blue-100">
                          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                            <div className="flex items-center justify-center h-full">
                              <svg className="h-12 w-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                              </svg>
                            </div>
                          </div>
                          <CardHeader>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <Badge variant="outline" className="border-blue-200 text-blue-600">
                                AI Summarized News
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.date).toLocaleDateString()}
                              </div>
                            </div>
                            <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime}
                              </span>
                              {post.sourceUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    Read Original <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              {post.source && <p className="text-xs text-muted-foreground">{post.source}</p>}
                              <Badge variant="outline" className="border-blue-200 text-blue-600 text-xs">
                                AI Enhanced
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Grid */}
                {otherPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {otherPosts.map((post) => (
                      <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <svg className="h-12 w-12 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="border-secondary/20">
                              {post.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </div>
                          <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                            {post.sourceUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                                  Read More <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {post.source && <p className="text-xs text-muted-foreground">{post.source}</p>}
                            {post.isAIGenerated && (
                              <Badge variant="outline" className="border-secondary/20 text-secondary text-xs">
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Refresh Button */}
                <div className="text-center">
                  <Button onClick={() => window.location.reload()} variant="outline" size="lg">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh News Feed
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
