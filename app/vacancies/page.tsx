'use client'

import React, { useState, useEffect } from 'react'
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

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  
  // AI Matching
  const [showMatchDialog, setShowMatchDialog] = useState(false)
  const [userSkills, setUserSkills] = useState('')
  const [matchResults, setMatchResults] = useState<{ [key: string]: JobMatch }>({})
  const [matchingLoading, setMatchingLoading] = useState(false)

  useEffect(() => {
    fetchVacancies()
  }, [])

  useEffect(() => {
    filterVacancies()
  }, [vacancies, searchTerm, locationFilter, categoryFilter, experienceFilter])

  const fetchVacancies = async () => {
    try {
      const response = await fetch('/api/vacancies')
      const data = await response.json()
      
      // If no vacancies from API, use sample data
      if (!data.vacancies || data.vacancies.length === 0) {
        const sampleVacancies: Vacancy[] = [
          {
            _id: '1',
            title: 'Senior Mining Engineer',
            company: 'Gold Fields Limited',
            location: 'Johannesburg',
            country: 'South Africa',
            salary: {
              min: 450000,
              max: 650000,
              currency: 'ZAR'
            },
            description: 'We are seeking an experienced Senior Mining Engineer to lead our underground mining operations. The successful candidate will be responsible for mine planning, safety compliance, and team leadership in our gold mining operations.',
            aiSummary: 'Senior-level position requiring extensive mining experience and leadership skills in underground gold mining operations.',
            requirements: [
              'Bachelor\'s degree in Mining Engineering',
              '8+ years of underground mining experience',
              'Professional registration with ECSA',
              'Strong leadership and communication skills',
              'Experience with mine planning software'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Senior',
            category: 'Mining Engineering',
            postedDate: '2024-07-28',
            externalUrl: 'https://goldfields.com/careers'
          },
          {
            _id: '2',
            title: 'Mine Safety Officer',
            company: 'Anglo American',
            location: 'Rustenburg',
            country: 'South Africa',
            salary: {
              min: 320000,
              max: 420000,
              currency: 'ZAR'
            },
            description: 'Join our safety team to ensure compliance with mining safety regulations and maintain the highest safety standards. Responsible for conducting safety inspections, training programs, and incident investigations.',
            aiSummary: 'Safety-focused role requiring strong knowledge of mining safety regulations and compliance procedures.',
            requirements: [
              'National Diploma in Safety Management',
              '5+ years mining safety experience',
              'SAMTRAC certification required',
              'Knowledge of MHSA regulations',
              'Strong analytical and reporting skills'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Safety & Compliance',
            postedDate: '2024-07-25',
            externalUrl: 'https://angloamerican.com/careers'
          },
          {
            _id: '3',
            title: 'Geological Data Analyst',
            company: 'Sibanye-Stillwater',
            location: 'Cape Town',
            country: 'South Africa',
            salary: {
              min: 380000,
              max: 480000,
              currency: 'ZAR'
            },
            description: 'Analyze geological data to support mining operations and exploration activities. Work with advanced geological software and collaborate with multidisciplinary teams to optimize resource extraction.',
            aiSummary: 'Technical role combining geology expertise with data analysis skills for mining optimization.',
            requirements: [
              'BSc in Geology or related field',
              '3+ years geological data analysis',
              'Proficiency in geological modeling software',
              'Strong statistical analysis skills',
              'Experience with GIS systems'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Geology & Exploration',
            postedDate: '2024-07-20',
            externalUrl: 'https://sibanyestillwater.com/careers'
          },
          {
            _id: '4',
            title: 'Mining Equipment Technician',
            company: 'Exxaro Resources',
            location: 'Limpopo',
            country: 'South Africa',
            salary: {
              min: 280000,
              max: 350000,
              currency: 'ZAR'
            },
            description: 'Maintain and repair heavy mining equipment including excavators, haul trucks, and processing machinery. Ensure optimal equipment performance and minimize downtime through preventive maintenance.',
            aiSummary: 'Hands-on technical role focused on mining equipment maintenance and repair.',
            requirements: [
              'Trade certificate in Mechanical Engineering',
              '4+ years heavy equipment maintenance',
              'Knowledge of hydraulic and electrical systems',
              'Strong problem-solving abilities',
              'Valid driver\'s license'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Equipment & Maintenance',
            postedDate: '2024-07-15',
            externalUrl: 'https://exxaro.com/careers'
          },
          {
            _id: '5',
            title: 'Environmental Compliance Manager',
            company: 'Petra Diamonds',
            location: 'Kimberley',
            country: 'South Africa',
            salary: {
              min: 520000,
              max: 680000,
              currency: 'ZAR'
            },
            description: 'Lead environmental compliance initiatives and ensure mining operations meet all environmental regulations. Develop sustainability programs and manage environmental impact assessments.',
            aiSummary: 'Management position focused on environmental compliance and sustainability in diamond mining operations.',
            requirements: [
              'MSc in Environmental Science or related',
              '6+ years environmental compliance experience',
              'Knowledge of mining environmental regulations',
              'Project management experience',
              'Strong stakeholder management skills'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Senior',
            category: 'Environmental & Sustainability',
            postedDate: '2024-07-12',
            externalUrl: 'https://petradiamonds.com/careers'
          },
          {
            _id: '6',
            title: 'Junior Mine Surveyor',
            company: 'Harmony Gold',
            location: 'Welkom',
            country: 'South Africa',
            salary: {
              min: 220000,
              max: 280000,
              currency: 'ZAR'
            },
            description: 'Entry-level surveying position supporting mining operations through accurate measurement and mapping. Great opportunity for recent graduates to start their mining career.',
            aiSummary: 'Entry-level surveying role perfect for new graduates entering the mining industry.',
            requirements: [
              'National Diploma in Surveying',
              '0-2 years surveying experience',
              'Proficiency in surveying software',
              'Strong attention to detail',
              'Willingness to work underground'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Entry-level',
            category: 'Surveying & Mapping',
            postedDate: '2024-07-10',
            externalUrl: 'https://harmony.co.za/careers'
          }
        ]
        setVacancies(sampleVacancies)
      } else {
        setVacancies(data.vacancies || [])
      }
    } catch (error) {
      console.error('Failed to fetch vacancies:', error)
      toast.error('Failed to load vacancies')
      
      // Use sample data as fallback on error
      const sampleVacancies: Vacancy[] = [
        {
          _id: '1',
          title: 'Senior Mining Engineer',
          company: 'Gold Fields Limited',
          location: 'Johannesburg',
          country: 'South Africa',
          salary: {
            min: 450000,
            max: 650000,
            currency: 'ZAR'
          },
          description: 'We are seeking an experienced Senior Mining Engineer to lead our underground mining operations.',
          requirements: ['Bachelor\'s degree in Mining Engineering', '8+ years of underground mining experience'],
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          category: 'Mining Engineering',
          postedDate: '2024-07-28'
        }
      ]
      setVacancies(sampleVacancies)
    } finally {
      setLoading(false)
    }
  }

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
                <SelectItem value="underground">Underground Mining</SelectItem>
                <SelectItem value="surface">Surface Mining</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
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
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Matching */}
        <div className="flex items-center gap-4">
          <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Star className="h-4 w-4" />
                AI Job Matching
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>AI Job Matching</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Describe your skills, experience, and qualifications:
                  </label>
                  <Textarea
                    placeholder="e.g., 5 years underground mining experience, safety certifications, equipment operation, team leadership..."
                    value={userSkills}
                    onChange={(e) => setUserSkills(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleAIMatch} 
                  className="w-full"
                  disabled={matchingLoading}
                >
                  {matchingLoading ? 'Analyzing Jobs...' : 'Find My Best Matches'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {Object.keys(matchResults).length > 0 && (
            <Button 
              variant="ghost" 
              onClick={() => setMatchResults({})}
              className="text-sm"
            >
              Clear AI Results
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredVacancies.length} of {vacancies.length} positions
          {Object.keys(matchResults).length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              • AI matching results shown
            </span>
          )}
        </p>
      </div>

      {/* Professional Job Board */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVacancies.map((vacancy, index) => {
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

      {filteredVacancies.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No vacancies found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
      )}
      </div>
      </main>
      <Footer />
    </div>
  )
}
