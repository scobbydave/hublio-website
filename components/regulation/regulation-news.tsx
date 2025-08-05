'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Calendar, 
  Globe, 
  RefreshCw, 
  Loader2,
  Bot,
  Search,
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  aiSummary: string;
  tags: string[];
}

interface NewsResponse {
  articles: NewsArticle[];
  total: number;
  timestamp: string;
  error?: string;
}

// Fallback news data for when API is unavailable
const getFallbackNews = (): NewsArticle[] => [
  {
    title: 'New Mining Safety Regulations Introduced in South Africa',
    description: 'The Department of Mineral Resources and Energy has announced comprehensive updates to mining safety regulations, focusing on improved worker protection and environmental compliance.',
    url: '#',
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    source: { name: 'Mining Weekly' },
    aiSummary: 'Key changes include mandatory digital safety monitoring systems, enhanced ventilation requirements, and stricter emergency response protocols. Companies have 6 months to comply with new standards.',
    tags: ['Safety', 'Regulation', 'South Africa']
  },
  {
    title: 'Environmental Impact Assessment Updates for Mining Operations',
    description: 'Updated guidelines for environmental impact assessments require more comprehensive water and air quality monitoring for all mining operations.',
    url: '#',
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    source: { name: 'Environment Today' },
    aiSummary: 'New requirements include continuous monitoring systems, quarterly reporting, and community impact assessments. Focus on sustainable mining practices and rehabilitation planning.',
    tags: ['Environmental', 'Assessment', 'Sustainability']
  },
  {
    title: 'Digital Compliance Reporting System Launched',
    description: 'Government introduces new digital platform for mining compliance reporting, streamlining regulatory submissions and improving transparency.',
    url: '#',
    publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    source: { name: 'Tech Mining News' },
    aiSummary: 'The new platform offers real-time submission tracking, automated compliance checking, and integrated document management. Reduces processing time from weeks to days.',
    tags: ['Digital', 'Compliance', 'Technology']
  },
  {
    title: 'Community Engagement Requirements for Mining Permits',
    description: 'Enhanced community consultation requirements introduced for new mining permit applications and existing operation renewals.',
    url: '#',
    publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    source: { name: 'Community Mining Report' },
    aiSummary: 'Mining companies must now conduct quarterly community meetings, establish grievance mechanisms, and provide regular impact reports to local communities.',
    tags: ['Community', 'Permits', 'Engagement']
  },
  {
    title: 'Water Use License Renewal Process Simplified',
    description: 'Streamlined process for water use license renewals reduces bureaucratic delays while maintaining environmental protection standards.',
    url: '#',
    publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    source: { name: 'Water Resources Daily' },
    aiSummary: 'Online renewal system with automated document verification reduces processing time by 60%. Includes integrated water quality monitoring requirements.',
    tags: ['Water', 'Licenses', 'Process']
  },
  {
    title: 'Mine Closure and Rehabilitation Standards Updated',
    description: 'New comprehensive standards for mine closure planning and rehabilitation ensure long-term environmental restoration and community benefit.',
    url: '#',
    publishedAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    source: { name: 'Rehabilitation Today' },
    aiSummary: 'Updated standards require detailed closure plans from project inception, financial guarantees for rehabilitation, and post-closure monitoring for 20 years.',
    tags: ['Closure', 'Rehabilitation', 'Standards']
  }
];

export function RegulationNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('mining');
  const [selectedRegion, setSelectedRegion] = useState('south africa');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedRegion]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        category: selectedCategory,
        region: selectedRegion,
      });

      const response = await fetch(`/api/regulation/news?${params}`);
      const data: NewsResponse = await response.json();

      if (response.ok) {
        setNews(data.articles);
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (error: any) {
      console.error('News fetch error:', error);
      setError(error.message);
      // Use fallback data when API fails
      setNews(getFallbackNews());
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const categories = [
    { value: 'mining', label: 'Mining' },
    { value: 'mining safety', label: 'Mining Safety' },
    { value: 'mining environmental', label: 'Environmental' },
    { value: 'mining regulation', label: 'Regulations' },
    { value: 'mining compliance', label: 'Compliance' },
  ];

  const regions = [
    { value: 'south africa', label: 'South Africa' },
    { value: 'africa', label: 'Africa' },
    { value: 'global', label: 'Global' },
    { value: 'australia', label: 'Australia' },
    { value: 'canada', label: 'Canada' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Regulation News Feed</CardTitle>
            </div>
            <Button 
              onClick={refreshNews} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          <CardDescription>
            Latest mining compliance and regulation news, summarized by AI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Alert */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <Bot className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>AI-Enhanced News:</strong> Each article is automatically summarized by Gemini AI 
          to highlight compliance-relevant information and regulatory implications.
        </AlertDescription>
      </Alert>

      {/* Error State */}
      {error && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* News Articles */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : news.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No news articles found
                </h3>
                <p className="text-slate-500 mb-4">
                  Try adjusting your category or region filters
                </p>
                <Button onClick={refreshNews} disabled={refreshing}>
                  {refreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh News
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            news.map((article, index) => (
              <motion.div
                key={`${article.url}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {article.source.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                          {article.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-shrink-0"
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Read
                        </a>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <Separator />

                      {/* AI Summary */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Bot className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">
                            AI Compliance Summary
                          </h4>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                          <div className="prose prose-sm dark:prose-invert max-w-none text-blue-800 dark:text-blue-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {article.aiSummary}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      {news.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{news.length}</p>
                <p className="text-sm text-slate-500">Articles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(news.map(article => article.source.name)).size}
                </p>
                <p className="text-sm text-slate-500">Sources</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(news.flatMap(article => article.tags)).size}
                </p>
                <p className="text-sm text-slate-500">Topics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {news.filter(article => 
                    new Date(article.publishedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                </p>
                <p className="text-sm text-slate-500">Last 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
