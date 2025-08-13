'use client'

import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Building, DollarSign, Clock, Search, Briefcase, Star } from 'lucide-react'
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

interface VacanciesPageProps {
  initialVacancies: Vacancy[]
  error?: string
}

export default function VacanciesPage({ initialVacancies, error: serverError }: VacanciesPageProps) {
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
          results[vacancy._id] = matchData.match
        }
      }

      setMatchResults(results)
      setShowMatchDialog(false) // Close the dialog after successful matching
      toast.success('AI matching completed!')
    } catch (error) {
      console.error('AI matching failed:', error)
      toast.error('AI matching failed')
    } finally {
      setMatchingLoading(false)
    }
  }

  const formatSalary = (salary?: { min?: number; max?: number; currency: string }) => {
    if (!salary) return 'Salary not specified'
    
    const { min, max, currency } = salary
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`
    }
    return 'Salary negotiable'
  }

  const getMatchScore = (vacancyId: string): number => {
    return matchResults[vacancyId]?.score || 0
  }

  const getMatchColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    if (score >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  // Sort vacancies with AI matches at the top
  const sortedVacancies = Object.keys(matchResults).length > 0 
    ? [...filteredVacancies].sort((a, b) => {
        const scoreA = getMatchScore(a._id)
        const scoreB = getMatchScore(b._id)
        if (scoreA > 0 && scoreB === 0) return -1
        if (scoreA === 0 && scoreB > 0) return 1
        return scoreB - scoreA
      })
    : filteredVacancies

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Professional Mining Header */}
          <div className="mb-8 text-center bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-8 relative overflow-hidden border border-primary/10">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">Mining Vacancies</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Find your next opportunity in the mining industry across South Africa and neighboring countries
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Live Job Feed
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  AI-Powered Matching
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Enterprise Ready
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Jobs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, company, keywords..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="City, province, country..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="Mining Engineering">Mining Engineering</SelectItem>
                    <SelectItem value="Safety & Compliance">Safety & Compliance</SelectItem>
                    <SelectItem value="Geology & Exploration">Geology & Exploration</SelectItem>
                    <SelectItem value="Equipment & Maintenance">Equipment & Maintenance</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="Entry-level">Entry Level</SelectItem>
                    <SelectItem value="Mid-level">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior Level</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Matching */}
            <div className="flex items-center gap-4">
              <Dialog open={showMatchDialog} onOpenChange={(open) => {
                setShowMatchDialog(open)
                if (!open) {
                  // Reset form when dialog closes
                  setUserSkills('')
                  setMatchingLoading(false)
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Star className="h-4 w-4" />
                    AI Job Matching
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>AI Job Matching</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                      <p>💡 <strong>Smart Job Matching:</strong> Our AI analyzes your skills against job requirements to find your best matches.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Describe your skills, experience, and qualifications:
                      </label>
                      <Textarea
                        placeholder="e.g., 5 years underground mining experience, safety certifications, equipment operation, team leadership..."
                        value={userSkills}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setUserSkills(e.target.value)
                          }
                        }}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {userSkills.length}/500 characters
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAIMatch} 
                        className="flex-1"
                        disabled={matchingLoading || !userSkills.trim()}
                      >
                        {matchingLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                          </div>
                        ) : (
                          'Find My Best Matches'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowMatchDialog(false)}
                        disabled={matchingLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {Object.keys(matchResults).length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    ✨ {Object.keys(matchResults).length} AI matches found
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setMatchResults({})}
                    className="text-sm hover:bg-destructive/10 hover:text-destructive"
                  >
                    Clear Results
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredVacancies.length} of {vacancies.length} positions
              {Object.keys(matchResults).length > 0 && (
                <span className="ml-2 text-sm text-green-600">
                  • AI matching results shown (sorted by relevance)
                </span>
              )}
            </p>
            {Object.keys(matchResults).length > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                Best matches appear first
              </div>
            )}
          </div>

          {/* Professional Job Board */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedVacancies.map((vacancy) => {
              const matchScore = getMatchScore(vacancy._id)
              const match = matchResults[vacancy._id]
              
              return (
                <Card key={vacancy._id} className="relative hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/20 hover:border-l-primary/60">
                  {matchScore > 0 && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(matchScore)}`}>
                      {matchScore}% match
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                      {vacancy.title}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        {vacancy.company}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {vacancy.location}, {vacancy.country}
                      </div>
                      {vacancy.salary && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(vacancy.salary)}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{vacancy.category.replace('-', ' ')}</Badge>
                      <Badge variant="outline">{vacancy.experienceLevel}</Badge>
                      <Badge variant="outline">{vacancy.jobType}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {vacancy.aiSummary || vacancy.description}
                    </p>

                    {match && (
                      <div className="space-y-2 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium">AI Match Analysis:</p>
                        <ul className="text-xs space-y-1">
                          {match.reasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-green-600">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a 
                          href={vacancy.externalUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Apply Now
                        </a>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{vacancy.title}</DialogTitle>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {vacancy.company} • {vacancy.location}, {vacancy.country}
                              </p>
                              {vacancy.salary && (
                                <p className="text-sm font-medium">
                                  {formatSalary(vacancy.salary)}
                                </p>
                              )}
                            </div>
                          </DialogHeader>
                          
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {vacancy.aiSummary && (
                              <div>
                                <h4 className="font-medium mb-2">Summary</h4>
                                <p className="text-sm text-muted-foreground">{vacancy.aiSummary}</p>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {vacancy.description}
                              </p>
                            </div>

                            {vacancy.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {vacancy.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-primary">•</span>
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {match && (
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">AI Match Analysis ({match.score}%)</h4>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-sm font-medium mb-1">Why this is a good match:</h5>
                                    <ul className="text-xs space-y-1">
                                      {match.reasons.map((reason, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                          <span className="text-green-600">•</span>
                                          {reason}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {match.recommendations.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium mb-1">Application tips:</h5>
                                      <ul className="text-xs space-y-1">
                                        {match.recommendations.map((rec, idx) => (
                                          <li key={idx} className="flex items-start gap-1">
                                            <span className="text-blue-600">•</span>
                                            {rec}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {match.missingSkills.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium mb-1">Skills to develop:</h5>
                                      <ul className="text-xs space-y-1">
                                        {match.missingSkills.map((skill, idx) => (
                                          <li key={idx} className="flex items-start gap-1">
                                            <span className="text-orange-600">•</span>
                                            {skill}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button asChild className="flex-1">
                              <a 
                                href={vacancy.externalUrl || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Apply Now
                              </a>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

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
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Server-side data fetching
export const getServerSideProps: GetServerSideProps<VacanciesPageProps> = async () => {
  try {
    // Fetch fresh vacancies with AI summaries
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/vacancies/fresh`)
    const vacancies = response.ok ? await response.json() : []

    return {
      props: {
        initialVacancies: Array.isArray(vacancies) ? vacancies : [],
      },
    }
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    return {
      props: {
        initialVacancies: [],
        error: 'Failed to load job listings',
      },
    }
  }
}
