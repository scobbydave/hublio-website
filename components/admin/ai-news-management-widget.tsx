import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw, ExternalLink, Newspaper, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface NewsArticle {
  title: string
  summary: string
  date: string
  slug: string
  readTime: string
  category: string
  sourceUrl?: string
  source?: string
  isAIGenerated: boolean
}

export function AINewsManagementWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog/news-feed')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.filter((article: NewsArticle) => article.isAIGenerated))
      } else {
        throw new Error('Failed to fetch articles')
      }
    } catch (error) {
      console.error('Error fetching AI news:', error)
      toast.error('Failed to load AI news articles')
    } finally {
      setLoading(false)
    }
  }

  const refreshNewsFeed = async () => {
    try {
      setRefreshing(true)
      // Clear cache and fetch fresh news
      const response = await fetch('/api/blog/news-feed?refresh=true')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.filter((article: NewsArticle) => article.isAIGenerated))
        toast.success('News feed refreshed successfully')
      } else {
        throw new Error('Failed to refresh news feed')
      }
    } catch (error) {
      console.error('Error refreshing news feed:', error)
      toast.error('Failed to refresh news feed')
    } finally {
      setRefreshing(false)
    }
  }

  const deleteArticle = async (slug: string) => {
    try {
      // Since these are cached articles, we'll just remove from local state
      // In a real implementation, you'd have a DELETE endpoint
      setArticles(articles.filter(article => article.slug !== slug))
      toast.success('Article removed from view')
    } catch (error) {
      console.error('Error removing article:', error)
      toast.error('Failed to remove article')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            AI News Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          AI News Management
          <Badge variant="outline" className="ml-2">
            {articles.length} Articles
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={fetchArticles} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            onClick={refreshNewsFeed} 
            size="sm"
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Fetch New Articles
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No AI-summarized news articles yet.</p>
            <Button onClick={refreshNewsFeed} className="mt-4" disabled={refreshing}>
              {refreshing ? 'Fetching...' : 'Fetch News Articles'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {articles.map((article) => (
              <div 
                key={article.slug} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                  <div className="flex gap-1 ml-2">
                    {article.sourceUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteArticle(article.slug)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                  {article.source && (
                    <span className="text-xs">{article.source}</span>
                  )}
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                    AI Summarized
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
