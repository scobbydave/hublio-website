'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  MapPin, 
  Tag,
  Loader2,
  ChevronRight,
  Shield,
  Leaf,
  Users,
  FileCheck
} from 'lucide-react';

interface RegulationArticle {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  category: 'safety' | 'labor-law' | 'environmental' | 'licensing';
  region: string;
  tags: string[];
  createdAt: string;
  published: boolean;
}

const categoryConfig = {
  safety: {
    label: 'Safety',
    icon: Shield,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Mining safety regulations and protocols'
  },
  'labor-law': {
    label: 'Labor Law',
    icon: Users,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Employment and labor regulations for mining'
  },
  environmental: {
    label: 'Environmental',
    icon: Leaf,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    description: 'Environmental compliance and regulations'
  },
  licensing: {
    label: 'Licensing',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    description: 'Mining permits and licensing requirements'
  }
};

export function RegulationArticles() {
  const [articles, setArticles] = useState<RegulationArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<RegulationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory, selectedRegion]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/regulation/articles');
      const data = await response.json();
      
      if (response.ok) {
        setArticles(data.articles);
      } else {
        console.error('Failed to fetch articles:', data.error);
        // Use fallback data
        setArticles(getFallbackArticles());
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Use fallback data
      setArticles(getFallbackArticles());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackArticles = (): RegulationArticle[] => [
    {
      _id: '1',
      _type: 'regulationArticle',
      title: 'Mine Safety Regulations Overview',
      slug: { current: 'mine-safety-regulations-overview' },
      body: [],
      category: 'safety',
      region: 'South Africa',
      tags: ['safety', 'regulations', 'mining'],
      author: 'System',
      createdAt: new Date().toISOString(),
      status: 'published',
      excerpt: 'Comprehensive overview of mine safety regulations in South Africa.'
    },
    {
      _id: '2',
      _type: 'regulationArticle',
      title: 'Environmental Compliance for Mining Operations',
      slug: { current: 'environmental-compliance-mining' },
      body: [],
      category: 'environmental',
      region: 'South Africa',
      tags: ['environment', 'compliance', 'mining'],
      author: 'System',
      createdAt: new Date().toISOString(),
      status: 'published',
      excerpt: 'Essential environmental compliance requirements for mining companies.'
    },
    {
      _id: '3',
      _type: 'regulationArticle',
      title: 'Mining Labor Law Requirements',
      slug: { current: 'mining-labor-law-requirements' },
      body: [],
      category: 'labor-law',
      region: 'South Africa',
      tags: ['labor', 'law', 'mining'],
      author: 'System',
      createdAt: new Date().toISOString(),
      status: 'published',
      excerpt: 'Key labor law requirements for mining operations and worker rights.'
    }
  ];

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(article => 
        article.region.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const uniqueRegions = Array.from(new Set(articles.map(article => article.region)));

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
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Regulation Articles
          </CardTitle>
          <CardDescription>
            Comprehensive collection of mining regulation articles and compliance guides
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title or tags..."
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Region Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRegion === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion('all')}
              >
                All Regions
              </Button>
              {uniqueRegions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {region}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No articles found
              </h3>
              <p className="text-slate-500">
                {searchTerm || selectedCategory !== 'all' || selectedRegion !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No regulation articles available yet'}
              </p>
            </div>
          ) : (
            filteredArticles.map((article, index) => {
              const categoryData = categoryConfig[article.category];
              const Icon = categoryData.icon;
              
              return (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={categoryData.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {categoryData.label}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {article.region}
                          </div>
                        </div>

                        {/* Tags */}
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{article.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <Separator />

                        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                          <span className="text-sm font-medium">Read Article</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
              <p className="text-sm text-slate-500">Total Articles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Object.keys(categoryConfig).length}
              </p>
              <p className="text-sm text-slate-500">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{uniqueRegions.length}</p>
              <p className="text-sm text-slate-500">Regions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{filteredArticles.length}</p>
              <p className="text-sm text-slate-500">Filtered Results</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
