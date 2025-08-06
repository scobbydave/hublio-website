"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  MapPin,
  Users,
  BookOpen,
  Lightbulb,
  BarChart3,
  Calculator,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SalaryData {
  id: string
  jobTitle: string
  region: string
  experienceLevel: string
  salaryRange: {
    min: number
    max: number
    average: number
    currency: string
  }
  requiredSkills: string[]
  careerTips: string[]
  industry: string
  searchCount: number
}

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'executive', label: 'Executive Level (10+ years)' }
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

const formatSalary = (amount: number, currency = 'ZAR') => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function SalaryInsightsPublic() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [searchResults, setSearchResults] = useState<SalaryData[]>([])
  const [popularJobs, setPopularJobs] = useState<SalaryData[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { toast } = useToast()
  const { trackSearch, trackSalaryInsightView } = useAnalytics()

  useEffect(() => {
    fetchPopularJobs()
  }, [])

  const fetchPopularJobs = async () => {
    try {
      const response = await fetch('/api/salary-insights/popular')
      if (response.ok) {
        const data = await response.json()
        setPopularJobs(data.insights || [])
      }
    } catch (error) {
      console.error('Error fetching popular jobs:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a job title to search",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      setShowResults(true)
      
      // Track search
      trackSearch(searchTerm, 'salary_insights')

      const params = new URLSearchParams({
        q: searchTerm,
        ...(selectedRegion && { region: selectedRegion }),
        ...(selectedExperience && { experience: selectedExperience })
      })

      const response = await fetch(`/api/salary-insights/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data.results || [])

      if (data.results?.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search criteria or check back later",
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search Error",
        description: "Unable to search salary data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJobClick = (job: SalaryData) => {
    trackSalaryInsightView(job.id, job.jobTitle, job.region)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mining Salary Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get accurate salary information for South African mining jobs. 
              Compare salaries by region, experience level, and get expert career advice.
            </p>
          </motion.div>
        </div>

        {/* Search Section */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Salary Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter job title (e.g., Mine Engineer, Safety Officer)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience level (optional)" />
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
          </CardContent>
        </Card>

        {/* Search Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Searching salary data...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4" />
                      <p>No salary data found for your search criteria.</p>
                      <p className="text-sm">Try different keywords or remove filters.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleJobClick(job)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.jobTitle}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.region}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {experienceLevels.find(l => l.value === job.experienceLevel)?.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatSalary(job.salaryRange.min)} - {formatSalary(job.salaryRange.max)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Avg: {formatSalary(job.salaryRange.average)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                Required Skills
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {job.requiredSkills.slice(0, 4).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.requiredSkills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.requiredSkills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                <Lightbulb className="h-4 w-4" />
                                Career Tips
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {job.careerTips.slice(0, 2).map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span className="line-clamp-2">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Jobs */}
        {popularJobs.length > 0 && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Most Searched Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularJobs.slice(0, 6).map((job) => (
                  <div
                    key={job.id}
                    className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                        <p className="text-sm text-gray-600">{job.region}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          {formatSalary(job.salaryRange.average)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.searchCount} searches
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Footer */}
        <div className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-600">
          <p>
            Salary data is based on industry research, AI analysis, and market trends. 
            Actual salaries may vary based on company size, specific requirements, and negotiations.
          </p>
          <p className="mt-2">
            <strong>Disclaimer:</strong> This information is provided for guidance only and should not be considered as financial or career advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SalaryInsightsPublic
