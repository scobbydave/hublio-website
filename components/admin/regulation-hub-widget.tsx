'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Lightbulb, 
  HelpCircle,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Bot,
  User,
  Eye,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface RegulationStats {
  totalArticles: number;
  pendingTips: number;
  pendingFAQs: number;
  pendingDocuments: number;
  totalViews: number;
}

interface PendingItem {
  _id: string;
  title?: string;
  question?: string;
  fileName?: string;
  description?: string;
  createdAt: string;
  type: 'tip' | 'faq' | 'document';
  aiGenerated: boolean;
}

export function RegulationHubWidget() {
  const [stats, setStats] = useState<RegulationStats | null>(null);
  const [pendingTips, setPendingTips] = useState<PendingItem[]>([]);
  const [pendingFAQs, setPendingFAQs] = useState<PendingItem[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRegulationData();
  }, []);

  const fetchRegulationData = async () => {
    try {
      setLoading(true);
      
      // Fetch all regulation data
      const [tipsResponse, faqsResponse, documentsResponse, articlesResponse] = await Promise.allSettled([
        fetch('/api/regulation/tips?approved=false'),
        fetch('/api/regulation/faqs?approved=false'),
        fetch('/api/regulation/documents?approved=false'),
        fetch('/api/regulation/articles?approved=true')
      ]);

      let tips: PendingItem[] = [];
      let faqs: PendingItem[] = [];
      let documents: PendingItem[] = [];
      let totalArticles = 0;

      // Process tips
      if (tipsResponse.status === 'fulfilled' && tipsResponse.value.ok) {
        const tipsData = await tipsResponse.value.json();
        tips = tipsData.tips.map((tip: any) => ({
          ...tip,
          type: 'tip' as const
        }));
      }

      // Process FAQs
      if (faqsResponse.status === 'fulfilled' && faqsResponse.value.ok) {
        const faqsData = await faqsResponse.value.json();
        faqs = faqsData.faqs.map((faq: any) => ({
          ...faq,
          type: 'faq' as const
        }));
      }

      // Process documents
      if (documentsResponse.status === 'fulfilled' && documentsResponse.value.ok) {
        const documentsData = await documentsResponse.value.json();
        documents = documentsData.documents.map((doc: any) => ({
          ...doc,
          type: 'document' as const
        }));
      }

      // Process articles
      if (articlesResponse.status === 'fulfilled' && articlesResponse.value.ok) {
        const articlesData = await articlesResponse.value.json();
        totalArticles = articlesData.articles?.length || 0;
      }

      setPendingTips(tips);
      setPendingFAQs(faqs);
      setPendingDocuments(documents);

      setStats({
        totalArticles,
        pendingTips: tips.length,
        pendingFAQs: faqs.length,
        pendingDocuments: documents.length,
        totalViews: Math.floor(Math.random() * 5000) + 1000, // Mock data for now
      });

    } catch (error) {
      console.error('Failed to fetch regulation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchRegulationData();
    setRefreshing(false);
  };

  const approveItem = async (item: PendingItem) => {
    try {
      const endpoint = item.type === 'tip' ? 'tips' : item.type === 'faq' ? 'faqs' : 'documents';
      const response = await fetch(`/api/regulation/${endpoint}/${item._id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'Admin', // In a real app, get from user session
        }),
      });

      if (response.ok) {
        // Remove from pending lists
        if (item.type === 'tip') {
          setPendingTips(prev => prev.filter(t => t._id !== item._id));
        } else if (item.type === 'faq') {
          setPendingFAQs(prev => prev.filter(f => f._id !== item._id));
        } else {
          setPendingDocuments(prev => prev.filter(d => d._id !== item._id));
        }
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          [`pending${item.type === 'tip' ? 'Tips' : item.type === 'faq' ? 'FAQs' : 'Documents'}`]: 
            prev[`pending${item.type === 'tip' ? 'Tips' : item.type === 'faq' ? 'FAQs' : 'Documents'}` as keyof RegulationStats] as number - 1
        } : null);
      }
    } catch (error) {
      console.error('Failed to approve item:', error);
      alert('Failed to approve item. Please try again.');
    }
  };

  const rejectItem = async (item: PendingItem) => {
    try {
      const endpoint = item.type === 'tip' ? 'tips' : item.type === 'faq' ? 'faqs' : 'documents';
      const response = await fetch(`/api/regulation/${endpoint}/${item._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from pending lists
        if (item.type === 'tip') {
          setPendingTips(prev => prev.filter(t => t._id !== item._id));
        } else if (item.type === 'faq') {
          setPendingFAQs(prev => prev.filter(f => f._id !== item._id));
        } else {
          setPendingDocuments(prev => prev.filter(d => d._id !== item._id));
        }
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          [`pending${item.type === 'tip' ? 'Tips' : item.type === 'faq' ? 'FAQs' : 'Documents'}`]: 
            prev[`pending${item.type === 'tip' ? 'Tips' : item.type === 'faq' ? 'FAQs' : 'Documents'}` as keyof RegulationStats] as number - 1
        } : null);
      }
    } catch (error) {
      console.error('Failed to reject item:', error);
      alert('Failed to reject item. Please try again.');
    }
  };

  const renderPendingItem = (item: PendingItem) => (
    <Card key={item._id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={
                  item.aiGenerated 
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200" 
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                }
              >
                {item.aiGenerated ? (
                  <>
                    <Bot className="h-3 w-3 mr-1" />
                    AI Generated
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Manual
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.type}
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {item.title || item.question || item.fileName}
            </CardTitle>
            {item.description && (
              <CardDescription className="mt-1">
                {item.description.length > 150 
                  ? `${item.description.substring(0, 150)}...` 
                  : item.description
                }
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => rejectItem(item)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
            <Button 
              size="sm" 
              onClick={() => approveItem(item)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>Regulation Hub Management</CardTitle>
            </div>
            <Button 
              onClick={refreshData} 
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
            Manage AI-generated content and regulation hub analytics
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {stats?.totalArticles || 0}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Articles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {stats?.pendingTips || 0}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending Tips</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {stats?.pendingFAQs || 0}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Pending FAQs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {stats?.pendingDocuments || 0}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Pending Docs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {stats?.totalViews || 0}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Review Tabs */}
      <Tabs defaultValue="tips" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips Review ({stats?.pendingTips || 0})
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs Review ({stats?.pendingFAQs || 0})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Documents Review ({stats?.pendingDocuments || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Pending Compliance Tips
              </CardTitle>
              <CardDescription>
                Review and approve AI-generated compliance tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pendingTips.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-500">No pending tips to review</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  {pendingTips.map(renderPendingItem)}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Pending FAQ Answers
              </CardTitle>
              <CardDescription>
                Review and approve AI-generated FAQ answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pendingFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-500">No pending FAQs to review</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  {pendingFAQs.map(renderPendingItem)}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Pending Document Analysis
              </CardTitle>
              <CardDescription>
                Review and approve AI-analyzed document summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pendingDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-500">No pending documents to review</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  {pendingDocuments.map(renderPendingItem)}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col p-4">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col p-4">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Articles</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col p-4">
              <Bot className="h-6 w-6 mb-2" />
              <span className="text-sm">AI Settings</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col p-4">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">Compliance Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
