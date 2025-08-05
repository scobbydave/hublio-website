'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  FileText, 
  Lightbulb, 
  Upload, 
  HelpCircle, 
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Bot
} from 'lucide-react';
import { ComplianceChat } from '@/components/regulation/compliance-chat';
import { RegulationArticles } from '@/components/regulation/regulation-articles';
import { ComplianceTips } from '@/components/regulation/compliance-tips';
import { DocumentAnalyzer } from '@/components/regulation/document-analyzer';
import { RegulationNews } from '@/components/regulation/regulation-news';
import { RegulationFAQs } from '@/components/regulation/regulation-faqs';

export default function RegulationPage() {
  const [activeTab, setActiveTab] = useState('advisor');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('/mining-pattern.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Regulation & Compliance Hub
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Navigate mining regulations with confidence. Get AI-powered compliance advice,
              analyze documents, and stay updated with the latest regulatory changes.
            </p>
            
            {/* Disclaimer Banner */}
            <Alert className="max-w-4xl mx-auto bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> AI-generated compliance advice is for informational purposes only. 
                Please consult with qualified legal professionals for specific regulatory requirements.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Advisor
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Analyzer
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisor">
            <ComplianceChat />
          </TabsContent>

          <TabsContent value="articles">
            <RegulationArticles />
          </TabsContent>

          <TabsContent value="tips">
            <ComplianceTips />
          </TabsContent>

          <TabsContent value="analyzer">
            <DocumentAnalyzer />
          </TabsContent>

          <TabsContent value="news">
            <RegulationNews />
          </TabsContent>

          <TabsContent value="faqs">
            <RegulationFAQs />
          </TabsContent>
        </Tabs>
      </div>
      </div>
      <Footer />
    </>
  );
}
