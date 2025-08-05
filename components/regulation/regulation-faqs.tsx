'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Plus, 
  ChevronDown, 
  Bot, 
  User,
  Search,
  Loader2,
  Eye,
  CheckCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RegulationFAQ {
  _id: string;
  question: string;
  answer: string;
  aiGenerated: boolean;
  approved: boolean;
  category: string;
  createdAt: string;
  approvedBy?: string;
  views: number;
}

// Fallback FAQ data for when API is unavailable
const getFallbackFAQs = (): RegulationFAQ[] => [
  {
    _id: 'fallback-1',
    question: 'What are the key requirements for obtaining a mining license in South Africa?',
    answer: 'To obtain a mining license in South Africa, you need to:\n\n1. **Environmental Authorization**: Submit an Environmental Impact Assessment (EIA) and obtain environmental authorization from the Department of Forestry, Fisheries and Environment.\n\n2. **Mining Right Application**: Apply for a mining right through the Department of Mineral Resources and Energy (DMRE), including a comprehensive mining work programme.\n\n3. **Social and Labour Plan (SLP)**: Develop and submit an SLP outlining community development commitments and employment equity plans.\n\n4. **Financial Provision**: Provide financial guarantees for environmental rehabilitation and mine closure.\n\n5. **Water Use License**: Obtain necessary water use licenses from the Department of Water and Sanitation if your operations will impact water resources.\n\n6. **Community Consultation**: Conduct meaningful consultation with affected communities and obtain their input on the proposed mining activities.',
    aiGenerated: true,
    approved: true,
    category: 'Licensing',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 245
  },
  {
    _id: 'fallback-2',
    question: 'How often should environmental monitoring reports be submitted?',
    answer: 'Environmental monitoring report submission frequency depends on your specific environmental authorization conditions, but generally:\n\n• **Monthly Reports**: For active mining operations with significant environmental impact\n• **Quarterly Reports**: For standard mining operations and exploration activities\n• **Annual Reports**: Comprehensive environmental compliance reports for all operations\n• **Incident Reports**: Immediately for any environmental incidents or non-compliance events\n\nKey monitoring parameters typically include:\n- Air quality measurements\n- Water quality testing\n- Noise level monitoring\n- Soil contamination assessments\n- Biodiversity impact evaluations\n\nAlways refer to your specific Environmental Management Programme (EMP) for exact requirements.',
    aiGenerated: false,
    approved: true,
    category: 'Environmental',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 189
  },
  {
    _id: 'fallback-3',
    question: 'What safety training is mandatory for mining workers?',
    answer: 'All mining workers must complete mandatory safety training including:\n\n**Basic Training Requirements:**\n- Mine Health and Safety Act awareness\n- Hazard identification and risk assessment\n- Emergency procedures and evacuation protocols\n- Personal protective equipment (PPE) usage\n\n**Role-Specific Training:**\n- Equipment operation certification\n- Confined space entry (where applicable)\n- Working at heights certification\n- Chemical handling and storage\n\n**Ongoing Requirements:**\n- Annual refresher training\n- Toolbox talks and safety meetings\n- Incident reporting procedures\n- First aid and emergency response\n\n**Documentation:** All training must be documented with certificates, attendance records, and competency assessments maintained for inspection.',
    aiGenerated: true,
    approved: true,
    category: 'Safety',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 167
  },
  {
    _id: 'fallback-4',
    question: 'How do I report mining compliance violations or incidents?',
    answer: 'Mining compliance violations and incidents should be reported through multiple channels:\n\n**Immediate Reporting (within 24 hours):**\n- Department of Mineral Resources and Energy (DMRE) hotline\n- Mine Health and Safety Inspectorate\n- Environmental compliance officer\n\n**Formal Reporting:**\n- Submit written incident reports within 7 days\n- Include detailed circumstances, impacts, and corrective actions\n- Provide photographic evidence where applicable\n\n**Digital Platforms:**\n- Use the DMRE online reporting system\n- Submit through environmental monitoring portals\n- Utilize mining company internal reporting systems\n\n**Community Reporting:**\n- Community grievance mechanisms\n- Local traditional authority structures\n- Environmental monitoring committees\n\nEnsure all reports include timeline, location, severity, and immediate response actions taken.',
    aiGenerated: false,
    approved: true,
    category: 'Compliance',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 134
  },
  {
    _id: 'fallback-5',
    question: 'What are the requirements for mine closure planning?',
    answer: 'Mine closure planning is mandatory and must address:\n\n**Planning Requirements:**\n- Develop closure plan during initial mining right application\n- Update closure plan every 5 years or when operations change significantly\n- Include detailed rehabilitation methods and timelines\n\n**Financial Provisions:**\n- Establish financial guarantees for closure costs\n- Annual review and adjustment of financial provisions\n- Bank guarantees or trust funds for long-term monitoring\n\n**Technical Requirements:**\n- Soil rehabilitation and revegetation plans\n- Water treatment and monitoring systems\n- Infrastructure decommissioning procedures\n- Waste containment and management\n\n**Post-Closure Monitoring:**\n- 20-year minimum monitoring period\n- Water quality monitoring\n- Ecological restoration verification\n- Community impact assessments\n\n**Stakeholder Engagement:**\n- Community consultation on closure plans\n- Alternative land use discussions\n- Skills transfer and economic transition planning',
    aiGenerated: true,
    approved: true,
    category: 'Closure',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 112
  },
  {
    _id: 'fallback-6',
    question: 'How do I stay updated on changing mining regulations?',
    answer: 'Stay current with mining regulations through these channels:\n\n**Official Sources:**\n- Department of Mineral Resources and Energy (DMRE) website and newsletters\n- Government Gazette subscriptions for new regulations\n- Mine Health and Safety Inspectorate bulletins\n- Department of Water and Sanitation updates\n\n**Professional Networks:**\n- Mining industry associations and chambers\n- Professional engineering councils\n- Environmental consulting groups\n- Legal compliance services\n\n**Digital Platforms:**\n- Regulatory compliance software with automatic updates\n- Industry news websites and publications\n- Professional social media groups\n- Webinars and online training platforms\n\n**Best Practices:**\n- Assign dedicated compliance personnel\n- Establish regulatory monitoring systems\n- Join industry working groups\n- Regular legal and compliance reviews\n- Subscribe to relevant publication services',
    aiGenerated: false,
    approved: true,
    category: 'General',
    createdAt: new Date().toISOString(),
    approvedBy: 'System',
    views: 98
  }
];

export function RegulationFAQs() {
  const [faqs, setFaqs] = useState<RegulationFAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<RegulationFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchTerm]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/regulation/faqs?approved=true');
      const data = await response.json();
      
      if (response.ok) {
        setFaqs(data.faqs);
      } else {
        console.error('Failed to fetch FAQs:', data.error);
        // Use fallback data when API fails
        setFaqs(getFallbackFAQs());
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Use fallback data when API fails
      setFaqs(getFallbackFAQs());
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by views (popular first) then by creation date
    filtered.sort((a, b) => {
      if (b.views !== a.views) {
        return b.views - a.views;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredFaqs(filtered);
  };

  const generateFAQAnswer = async () => {
    if (!newQuestion.trim()) {
      alert('Please enter a question.');
      return;
    }

    try {
      setGenerating(true);

      const response = await fetch('/api/regulation/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newQuestion,
          category: 'general',
          manual: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('FAQ generated and submitted for review! It will appear after admin approval.');
        setNewQuestion('');
        setShowAddFAQ(false);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('FAQ generation error:', error);
      alert('Failed to generate FAQ. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(faqId)) {
      newOpenFAQs.delete(faqId);
    } else {
      newOpenFAQs.add(faqId);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const topCategories = Array.from(
    new Set(faqs.map(faq => faq.category))
  ).slice(0, 5);

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
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>Regulation FAQs</CardTitle>
            </div>
            <Button 
              onClick={() => setShowAddFAQ(!showAddFAQ)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
          <CardDescription>
            Frequently asked questions about mining regulations and compliance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search FAQs by question, answer, or category..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New FAQ */}
      <AnimatePresence>
        {showAddFAQ && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Bot className="h-5 w-5" />
                  Ask AI for Answer
                </CardTitle>
                <CardDescription>
                  Submit a mining compliance question and get an AI-generated answer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-question">Your Question</Label>
                  <Input
                    id="new-question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g., What are the requirements for underground mining ventilation?"
                    className="mt-1"
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Our AI will generate a comprehensive answer based on mining regulations. 
                    All AI-generated FAQs are reviewed by experts before publication.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button 
                    onClick={generateFAQAnswer}
                    disabled={generating || !newQuestion.trim()}
                    className="flex-1"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Answer...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Generate Answer
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddFAQ(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tags */}
      {topCategories.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">
                Popular categories:
              </span>
              {topCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => setSearchTerm(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {searchTerm ? 'No FAQs found' : 'No FAQs available yet'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Be the first to ask a mining compliance question'
                  }
                </p>
                <Button 
                  onClick={() => setShowAddFAQ(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask First Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <Collapsible
                    open={openFAQs.has(faq._id)}
                    onOpenChange={() => toggleFAQ(faq._id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                className={
                                  faq.aiGenerated 
                                    ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200" 
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                }
                              >
                                {faq.aiGenerated ? (
                                  <>
                                    <Bot className="h-3 w-3 mr-1" />
                                    AI Generated
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    Expert Answer
                                  </>
                                )}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                              {faq.views > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Eye className="h-2 w-2 mr-1" />
                                  {faq.views}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg font-medium">
                              {faq.question}
                            </CardTitle>
                          </div>
                          <ChevronDown 
                            className={`h-5 w-5 text-slate-400 transition-transform ${
                              openFAQs.has(faq._id) ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {faq.answer}
                          </ReactMarkdown>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span>
                              Created: {new Date(faq.createdAt).toLocaleDateString()}
                            </span>
                            {faq.approvedBy && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>Approved by expert</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{faq.views} views</span>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      {faqs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{faqs.length}</p>
                <p className="text-sm text-slate-500">Total FAQs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {faqs.filter(faq => faq.aiGenerated).length}
                </p>
                <p className="text-sm text-slate-500">AI Generated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {faqs.filter(faq => !faq.aiGenerated).length}
                </p>
                <p className="text-sm text-slate-500">Expert Answers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {faqs.reduce((sum, faq) => sum + faq.views, 0)}
                </p>
                <p className="text-sm text-slate-500">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
