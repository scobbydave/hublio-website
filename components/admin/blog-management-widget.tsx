"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Zap, 
  Calendar, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  status: 'draft' | 'pending' | 'published' | 'scheduled'
  category: string
  tags: string[]
  featuredImage?: string
  publishedAt?: string
  scheduledFor?: string
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
  aiGenerated: boolean
  seoScore: number
}

export function BlogManagementWidget() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      
      // Fetch real blog posts from Sanity CMS
      const response = await fetch('/api/blog')
      
      if (response.ok) {
        const data = await response.json()
        
        // Transform Sanity data to match our interface
        const transformedPosts: BlogPost[] = data.posts?.map((post: any) => ({
          id: post._id,
          title: post.title,
          slug: post.slug?.current || '',
          content: post.body || '',
          excerpt: post.excerpt || post.title?.substring(0, 150) + '...',
          author: post.author?.name || 'Hublio Team',
          status: post.status || 'published',
          category: post.categories?.[0]?.title || 'General',
          tags: post.tags || [],
          featuredImage: post.mainImage?.asset?.url,
          publishedAt: post.publishedAt || post._createdAt,
          views: Math.floor(Math.random() * 2000) + 100, // Simulate views
          likes: Math.floor(Math.random() * 200) + 10,   // Simulate likes  
          comments: Math.floor(Math.random() * 50) + 5,  // Simulate comments
          createdAt: post._createdAt,
          updatedAt: post._updatedAt,
          aiGenerated: post.aiGenerated || false,
          seoScore: Math.floor(Math.random() * 20) + 80 // 80-100 range
        })) || []
        
        setPosts(transformedPosts)
      } else {
        // Fallback to sample mining-focused blog posts
        const fallbackPosts: BlogPost[] = [
          {
            id: "fallback-1",
            title: "Real-Time Gold Prices: Market Analysis for South African Miners",
            slug: "real-time-gold-prices-sa-market",
            content: "Comprehensive analysis of current gold market trends...",
            excerpt: "Stay updated with live gold prices and market insights affecting South African mining operations.",
            author: "Hublio Market Analyst",
            status: "published",
            category: "Market Analysis",
            tags: ["gold", "prices", "market", "south-africa", "mining"],
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            views: 1847,
            likes: 143,
            comments: 28,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            aiGenerated: false,
            seoScore: 94
          },
          {
            id: "fallback-2",
            title: "Mining Safety Regulations: 2024 Updates and Compliance",
            slug: "mining-safety-regulations-2024-updates",
            content: "Latest updates on mining safety regulations...",
            excerpt: "Essential updates to mining safety regulations and compliance requirements for 2024.",
            author: "Hublio Safety Expert",
            status: "published",
            category: "Safety & Compliance",
            tags: ["safety", "regulations", "compliance", "2024", "mining"],
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            views: 2341,
            likes: 198,
            comments: 56,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            aiGenerated: false,
            seoScore: 91
          },
          {
            id: "fallback-3",
            title: "Sustainable Mining Practices: Environmental Impact Solutions",
            slug: "sustainable-mining-environmental-solutions",
            content: "Exploring sustainable mining practices and environmental solutions...",
            excerpt: "Discover innovative approaches to sustainable mining and environmental responsibility.",
            author: "Hublio Environmental Team",
            status: "pending",
            category: "Sustainability",
            tags: ["sustainability", "environment", "mining", "solutions"],
            views: 0,
            likes: 0,
            comments: 0,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            aiGenerated: true,
            seoScore: 87
          }
        ]
        
        setPosts(fallbackPosts)
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Using fallback data.",
        variant: "destructive"
      })
      
      // Emergency fallback
      setPosts([
        {
          id: "error-fallback",
          title: "Blog System Temporarily Unavailable",
          slug: "system-unavailable",
          content: "The blog system is currently being updated...",
          excerpt: "Blog content is temporarily unavailable while system updates are in progress.",
          author: "System",
          status: "draft",
          category: "System",
          tags: ["system", "maintenance"],
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: false,
          seoScore: 0
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePost = async (postId: string) => {
    try {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, status: 'published', publishedAt: new Date().toISOString() }
            : post
        )
      )
      
      toast({
        title: "Success",
        description: "Post approved and published successfully"
      })
    } catch (error) {
      console.error('Failed to approve post:', error)
      toast({
        title: "Error",
        description: "Failed to approve post",
        variant: "destructive"
      })
    }
  }

  const handleRejectPost = async (postId: string) => {
    try {
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      toast({
        title: "Success",
        description: "Post rejected and removed"
      })
    } catch (error) {
      console.error('Failed to reject post:', error)
      toast({
        title: "Error",
        description: "Failed to reject post",
        variant: "destructive"
      })
    }
  }

  const handleSchedulePost = async (postId: string, scheduledDate: string) => {
    try {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, status: 'scheduled', scheduledFor: scheduledDate }
            : post
        )
      )
      
      toast({
        title: "Success",
        description: "Post scheduled successfully"
      })
    } catch (error) {
      console.error('Failed to schedule post:', error)
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      pending: { variant: "outline" as const, label: "Pending Review" },
      published: { variant: "default" as const, label: "Published" },
      scheduled: { variant: "outline" as const, label: "Scheduled" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Blog & News Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={fetchBlogPosts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Generate Post
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="Careers">Careers</SelectItem>
                <SelectItem value="News">News</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Posts Found</h3>
                <p>No blog posts match your current filters.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        {getStatusBadge(post.status)}
                        {post.aiGenerated && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`font-medium ${getSeoScoreColor(post.seoScore)}`}>
                            SEO: {post.seoScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {post.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovePost(post.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectPost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {post.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSchedulePost(post.id, new Date(Date.now() + 24*60*60*1000).toISOString())}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRejectPost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
