'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Building, DollarSign, Clock, Search, Briefcase, Star, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Vacancy {
  _id: string
  title: string
  company: string
  location: string
  country: string
  salary?: {
    min?: number
    max?: number
    currency: string
  }
  description: string
  aiSummary?: string
  requirements: string[]
  jobType: string
  experienceLevel: string
  category: string
  postedDate: string
  externalUrl?: string
}

interface JobMatch {
  score: number
  reasons: string[]
  recommendations: string[]
  missingSkills: string[]
}

interface VacanciesPageClientProps {
  initialVacancies: Vacancy[]
  error?: string
}

export function VacanciesPageClient({ initialVacancies, error: serverError }: VacanciesPageClientProps) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies)
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>(initialVacancies)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [error, setError] = useState<string | null>(serverError || null)
  
  // AI Matching
  const [showMatchDialog, setShowMatchDialog] = useState(false)
  const [userSkills, setUserSkills] = useState('')
  const [matchResults, setMatchResults] = useState<{ [key: string]: JobMatch }>({})
  const [matchingLoading, setMatchingLoading] = useState(false)

  const filterVacancies = () => {
    let filtered = vacancies

    if (searchTerm) {
      filtered = filtered.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(vacancy => 
        vacancy.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
        vacancy.country.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(vacancy => vacancy.category === categoryFilter)
    }

    if (experienceFilter && experienceFilter !== 'all') {
      filtered = filtered.filter(vacancy => vacancy.experienceLevel === experienceFilter)
    }

    setFilteredVacancies(filtered)
  }

  useEffect(() => {
    filterVacancies()
  }, [vacancies, searchTerm, locationFilter, categoryFilter, experienceFilter])

  const handleAIMatch = async () => {
    if (!userSkills.trim()) {
      toast.error('Please enter your skills or experience')
      return
    }

    setMatchingLoading(true)
    const results: { [key: string]: JobMatch } = {}

    try {
      for (const vacancy of filteredVacancies.slice(0, 10)) { // Limit to first 10 jobs
        const response = await fetch('/api/ai-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userSkills,
            jobDescription: vacancy.description,
            jobRequirements: vacancy.requirements
          })
        })

        if (response.ok) {
          const matchData = await response.json()
          results[vacancy._id] = matchData
        }
      }

      setMatchResults(results)
      toast.success('AI job matching completed!')
    } catch (error) {
      console.error('Error in AI matching:', error)
      toast.error('Failed to perform AI matching')
    } finally {
      setMatchingLoading(false)
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50'
    if (score >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50'
    return 'text-red-600 border-red-200 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mining Industry <span className="text-primary">Careers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover exciting opportunities in South Africa's mining sector
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="border-primary/20">
              <span className={`w-2 h-2 ${error ? "bg-yellow-500" : "bg-green-500"} rounded-full mr-2`}></span>
              {error ? "Loading..." : "Live Job Feed"}
            </Badge>
            <Badge variant="outline" className="border-secondary/20">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              AI-Enhanced
            </Badge>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 p-6 bg-card rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Mining Engineering">Mining Engineering</SelectItem>
                <SelectItem value="Safety & Compliance">Safety & Compliance</SelectItem>
                <SelectItem value="Geology & Exploration">Geology & Exploration</SelectItem>
                <SelectItem value="Equipment & Maintenance">Equipment & Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid-level">Mid-level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVacancies.length} of {vacancies.length} positions
            </p>

            <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Star className="h-4 w-4" />
                  AI Job Match
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI-Powered Job Matching</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe your skills, experience, and career interests..."
                    value={userSkills}
                    onChange={(e) => setUserSkills(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    onClick={handleAIMatch} 
                    disabled={matchingLoading}
                    className="w-full"
                  >
                    {matchingLoading ? 'Analyzing...' : 'Find My Perfect Match'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredVacancies.length === 0 && !error && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No vacancies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}

          {filteredVacancies.length === 0 && error && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Unable to load vacancies</h3>
              <p className="text-muted-foreground mb-4">
                We're having trouble loading job listings. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          )}

          {filteredVacancies.map((vacancy) => {
            const match = matchResults[vacancy._id]
            return (
              <Card key={vacancy._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{vacancy.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {vacancy.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {vacancy.location}, {vacancy.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(vacancy.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {vacancy.salary && (
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <DollarSign className="h-4 w-4" />
                          {vacancy.salary.currency} {vacancy.salary.min?.toLocaleString()} - {vacancy.salary.max?.toLocaleString()}
                        </div>
                      )}
                      {match && (
                        <Badge className={getMatchColor(match.score)}>
                          {match.score}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      {vacancy.aiSummary && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              AI Summary
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-800">{vacancy.aiSummary}</p>
                        </div>
                      )}
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {vacancy.description}
                      </p>
                      
                      {match && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">AI Match Analysis</h4>
                          <div className="space-y-2">
                            {match.reasons.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-green-700">Why you're a good fit:</p>
                                <ul className="text-sm text-green-600 list-disc list-inside">
                                  {match.reasons.slice(0, 2).map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {match.missingSkills.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-orange-700">Skills to develop:</p>
                                <ul className="text-sm text-orange-600 list-disc list-inside">
                                  {match.missingSkills.slice(0, 2).map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Requirements</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {vacancy.requirements.slice(0, 4).map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{vacancy.jobType}</Badge>
                          <Badge variant="outline">{vacancy.experienceLevel}</Badge>
                          <Badge variant="outline">{vacancy.category}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {vacancy.externalUrl && (
                            <Button asChild className="w-full">
                              <a href={vacancy.externalUrl} target="_blank" rel="noopener noreferrer">
                                Apply Now
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" className="w-full">
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <Button onClick={() => window.location.reload()} variant="outline" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Job Listings
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
