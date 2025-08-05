'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Bot, 
  RefreshCw, 
  Loader2, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

interface ComplianceTip {
  _id: string;
  title: string;
  description: string;
  aiGenerated: boolean;
  approved: boolean;
  category: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Fallback tips data for when API is unavailable
const getFallbackTips = (): ComplianceTip[] => [
  {
    _id: 'fallback-1',
    title: 'Regular Environmental Impact Assessments',
    description: 'Conduct quarterly environmental impact assessments to ensure compliance with local and federal environmental regulations. Document all findings and remediation actions taken.',
    aiGenerated: false,
    approved: true,
    category: 'Environmental',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  },
  {
    _id: 'fallback-2',
    title: 'Safety Training Documentation',
    description: 'Maintain comprehensive records of all safety training sessions, including attendance, training materials, and competency assessments. Update training programs based on latest safety regulations.',
    aiGenerated: false,
    approved: true,
    category: 'Safety',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  },
  {
    _id: 'fallback-3',
    title: 'Permit Expiration Tracking',
    description: 'Implement a digital tracking system for all mining permits and licenses. Set up automated alerts 90 days before expiration to ensure timely renewals and avoid operational disruptions.',
    aiGenerated: true,
    approved: true,
    category: 'Permits',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  },
  {
    _id: 'fallback-4',
    title: 'Water Quality Monitoring',
    description: 'Establish continuous water quality monitoring at all discharge points. Implement real-time alerts for parameter exceedances and maintain detailed logs for regulatory reporting.',
    aiGenerated: false,
    approved: true,
    category: 'Environmental',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  },
  {
    _id: 'fallback-5',
    title: 'Community Engagement Records',
    description: 'Document all community engagement activities, including consultation meetings, feedback received, and actions taken. Maintain transparent communication channels with local stakeholders.',
    aiGenerated: true,
    approved: true,
    category: 'Community',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  },
  {
    _id: 'fallback-6',
    title: 'Emergency Response Plan Updates',
    description: 'Review and update emergency response plans annually or after any significant operational changes. Conduct regular drills and document lessons learned for continuous improvement.',
    aiGenerated: false,
    approved: true,
    category: 'Safety',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    approvedAt: new Date().toISOString()
  }
];

export function ComplianceTips() {
  const [tips, setTips] = useState<ComplianceTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/regulation/tips?approved=true');
      const data = await response.json();
      
      if (response.ok) {
        setTips(data.tips);
      } else {
        console.error('Failed to fetch tips:', data.error);
        // Use fallback data when API fails
        setTips(getFallbackTips());
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      // Use fallback data when API fails
      setTips(getFallbackTips());
    } finally {
      setLoading(false);
    }
  };

  const generateNewTip = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/regulation/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manual: false }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Show success message
        alert('New compliance tip generated! It will appear after admin approval.');
      } else {
        console.error('Failed to generate tip:', data.error);
        alert('Failed to generate tip. Please try again.');
      }
    } catch (error) {
      console.error('Error generating tip:', error);
      alert('Failed to generate tip. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

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
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <CardTitle>Compliance Tips</CardTitle>
            </div>
            <Button 
              onClick={generateNewTip} 
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Tip
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Actionable compliance tips to keep your mining operations safe and compliant
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Generation Alert */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <Bot className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>AI-Powered Tips:</strong> Generate new compliance tips using our Gemini AI assistant. 
          All AI-generated tips are reviewed by compliance experts before publication.
        </AlertDescription>
      </Alert>

      {/* Tips Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : tips.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No tips available yet
              </h3>
              <p className="text-slate-500 mb-4">
                Be the first to generate a compliance tip using our AI assistant
              </p>
              <Button 
                onClick={generateNewTip} 
                disabled={generating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate First Tip
                  </>
                )}
              </Button>
            </div>
          ) : (
            tips.map((tip, index) => (
              <motion.div
                key={tip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge 
                        className={
                          tip.aiGenerated 
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200" 
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }
                      >
                        {tip.aiGenerated ? (
                          <>
                            <Bot className="h-3 w-3 mr-1" />
                            AI Generated
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Expert Approved
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {tip.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(tip.createdAt).toLocaleDateString()}
                        </div>
                        {tip.approvedBy && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Approved
                          </div>
                        )}
                      </div>

                      {tip.aiGenerated && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3 w-3" />
                            <span>Generated by Gemini AI</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      {tips.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{tips.length}</p>
                <p className="text-sm text-slate-500">Total Tips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {tips.filter(tip => tip.aiGenerated).length}
                </p>
                <p className="text-sm text-slate-500">AI Generated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {tips.filter(tip => !tip.aiGenerated).length}
                </p>
                <p className="text-sm text-slate-500">Expert Created</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(tips.map(tip => tip.category)).size}
                </p>
                <p className="text-sm text-slate-500">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Stay Ahead of Compliance</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Get personalized compliance tips generated by our AI assistant based on the latest mining regulations
            </p>
            <Button 
              onClick={generateNewTip} 
              disabled={generating}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating New Tip...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Tip
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
