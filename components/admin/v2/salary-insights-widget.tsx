"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle,
  Bot,
  RefreshCw,
  Plus,
  BarChart3,
  Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SalaryInsight {
  id: string
  jobTitle: string
  region: string
  aiEstimate: {
    min: number
    max: number
    average: number
    currency: string
  }
  adminOverride?: {
    min: number
    max: number
    average: number
    notes: string
  }
  experienceLevel: string
  tips: string[]
  requiredSkills: string[]
  industry: string
  searchCount: number
  approved: boolean
  aiGenerated: boolean
  createdAt: string
  lastUpdated?: string
}

interface SalaryStats {
  totalInsights: number
  pendingApproval: number
  mostSearched: string
  avgSalaryRange: string
  totalSearches: number
}

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'executive', label: 'Executive Level (10+ years)' }
]

const industries = [
  'Gold Mining',
  'Diamond Mining',
  'Coal Mining',
  'Platinum Mining',
  'Iron Ore',
  'General Mining'
]

const regions = [
  'South Africa',
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West'
]

export function SalaryInsightsWidget() {
  const [insights, setInsights] = useState<SalaryInsight[]>([])
  const [stats, setStats] = useState<SalaryStats>({
    totalInsights: 0,
    pendingApproval: 0,
    mostSearched: '',
    avgSalaryRange: '',
    totalSearches: 0
  })
  const [selectedInsight, setSelectedInsight] = useState<SalaryInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [filterExperience, setFilterExperience] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSalaryInsights()
  }, [])

  const fetchSalaryInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/salary-insights')
      if (!response.ok) throw new Error('Failed to fetch salary insights')
      
      const data = await response.json()
      setInsights(data.insights || [])
      setStats(data.stats || {
        totalInsights: 0,
        pendingApproval: 0,
        mostSearched: '',
        avgSalaryRange: '',
        totalSearches: 0
      })
    } catch (error) {
      console.error('Error fetching salary insights:', error)
      toast({
        title: "Error",
        description: "Failed to load salary insights",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAISalaryEstimate = async (jobTitle: string, region: string, experience: string) => {
    try {
      setProcessing(jobTitle)
      const response = await fetch('/api/admin/salary-insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, region, experienceLevel: experience })
      })

      if (!response.ok) throw new Error('Failed to generate AI estimate')
      
      const data = await response.json()
      await fetchSalaryInsights() // Refresh data
      
      toast({
        title: "AI Estimate Generated",
        description: `Salary estimate created for ${jobTitle}`
      })
    } catch (error) {
      console.error('Error generating AI estimate:', error)
      toast({
        title: "Error",
        description: "Failed to generate AI salary estimate",
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
    }
  }

  const approveInsight = async (insight: SalaryInsight) => {
    try {
      setProcessing(insight.id)
      const response = await fetch('/api/admin/salary-insights/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insightId: insight.id })
      })

      if (!response.ok) throw new Error('Failed to approve insight')

      setInsights(insights.map(i => 
        i.id === insight.id ? { ...i, approved: true } : i
      ))

      toast({
        title: "Insight Approved",
        description: `${insight.jobTitle} salary insight has been approved`
      })
    } catch (error) {
      console.error('Error approving insight:', error)
      toast({
        title: "Error",
        description: "Failed to approve salary insight",
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
    }
  }

  const updateSalaryOverride = async (insight: SalaryInsight, override: any) => {
    try {
      setProcessing(insight.id)
      const response = await fetch('/api/admin/salary-insights/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          insightId: insight.id, 
          override 
        })
      })

      if (!response.ok) throw new Error('Failed to update override')

      setInsights(insights.map(i => 
        i.id === insight.id ? { ...i, adminOverride: override } : i
      ))

      toast({
        title: "Override Updated",
        description: `Salary override updated for ${insight.jobTitle}`
      })
    } catch (error) {
      console.error('Error updating override:', error)
      toast({
        title: "Error",
        description: "Failed to update salary override",
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
    }
  }

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = !searchTerm || 
      insight.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = !filterRegion || insight.region === filterRegion
    const matchesExperience = !filterExperience || insight.experienceLevel === filterExperience
    
    return matchesSearch && matchesRegion && matchesExperience
  })

  const formatSalary = (amount: number, currency = 'ZAR') => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Salary Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Salary Insights
            <Badge variant="secondary">{stats.totalInsights}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSalaryInsights}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalInsights}</div>
            <div className="text-sm text-green-600">Total Insights</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSearches}</div>
            <div className="text-sm text-blue-600">Total Searches</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
            <div className="text-sm text-yellow-600">Pending Approval</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Most Searched</div>
            <div className="text-xs text-purple-600 truncate">{stats.mostSearched || 'N/A'}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterExperience} onValueChange={setFilterExperience}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                {experienceLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Insights List */}
        <ScrollArea className="h-64">
          {filteredInsights.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No salary insights found</p>
              <p className="text-sm">Try adjusting your filters or create new insights</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-3 border rounded-lg ${
                      !insight.approved ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-sm">{insight.jobTitle}</h5>
                          {insight.aiGenerated && <Bot className="h-4 w-4 text-blue-500" />}
                          {!insight.approved && <Badge variant="outline" className="text-xs">Pending</Badge>}
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>{insight.region}</span>
                            <span>{experienceLevels.find(l => l.value === insight.experienceLevel)?.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            <span>
                              {insight.adminOverride 
                                ? `${formatSalary(insight.adminOverride.min)} - ${formatSalary(insight.adminOverride.max)}`
                                : `${formatSalary(insight.aiEstimate.min)} - ${formatSalary(insight.aiEstimate.max)}`
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Search className="h-3 w-3" />
                            <span>{insight.searchCount} searches</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInsight(insight)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                {insight.jobTitle}
                                {insight.aiGenerated && <Bot className="h-4 w-4 text-blue-500" />}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedInsight && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Basic Info</h4>
                                    <div className="space-y-1 text-sm">
                                      <div><strong>Region:</strong> {selectedInsight.region}</div>
                                      <div><strong>Experience:</strong> {experienceLevels.find(l => l.value === selectedInsight.experienceLevel)?.label}</div>
                                      <div><strong>Industry:</strong> {selectedInsight.industry}</div>
                                      <div><strong>Searches:</strong> {selectedInsight.searchCount}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Status</h4>
                                    <div className="space-y-2">
                                      <Badge variant={selectedInsight.approved ? "default" : "secondary"}>
                                        {selectedInsight.approved ? "Approved" : "Pending"}
                                      </Badge>
                                      {selectedInsight.aiGenerated && (
                                        <Badge variant="outline">AI Generated</Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">AI Salary Estimate</h4>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <div className="text-muted-foreground">Minimum</div>
                                      <div className="font-medium">{formatSalary(selectedInsight.aiEstimate.min)}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Average</div>
                                      <div className="font-medium">{formatSalary(selectedInsight.aiEstimate.average)}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Maximum</div>
                                      <div className="font-medium">{formatSalary(selectedInsight.aiEstimate.max)}</div>
                                    </div>
                                  </div>
                                </div>

                                {selectedInsight.adminOverride && (
                                  <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">Admin Override</h4>
                                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                                      <div>
                                        <div className="text-muted-foreground">Minimum</div>
                                        <div className="font-medium">{formatSalary(selectedInsight.adminOverride.min)}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground">Average</div>
                                        <div className="font-medium">{formatSalary(selectedInsight.adminOverride.average)}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground">Maximum</div>
                                        <div className="font-medium">{formatSalary(selectedInsight.adminOverride.max)}</div>
                                      </div>
                                    </div>
                                    {selectedInsight.adminOverride.notes && (
                                      <div className="text-sm text-muted-foreground">
                                        <strong>Notes:</strong> {selectedInsight.adminOverride.notes}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-medium mb-2">Required Skills</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedInsight.requiredSkills.map((skill, index) => (
                                      <Badge key={index} variant="outline">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>

                                {selectedInsight.tips.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Career Tips</h4>
                                    <ul className="space-y-1 text-sm">
                                      {selectedInsight.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-muted-foreground">•</span>
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                  {!selectedInsight.approved && (
                                    <Button
                                      onClick={() => approveInsight(selectedInsight)}
                                      disabled={processing === selectedInsight.id}
                                    >
                                      {processing === selectedInsight.id ? (
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                      )}
                                      Approve
                                    </Button>
                                  )}
                                  <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Override
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {!insight.approved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => approveInsight(insight)}
                            disabled={processing === insight.id}
                          >
                            {processing === insight.id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SalaryInsightsWidget
