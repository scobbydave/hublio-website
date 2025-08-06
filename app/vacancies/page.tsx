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
            description: 'We are seeking an experienced Senior Mining Engineer to lead our underground mining operations. The successful candidate will be responsible for mine planning, safety compliance, and team leadership in our gold mining operations. You will work with state-of-the-art technology and lead a team of 50+ mining professionals.',
            aiSummary: 'Senior-level position requiring extensive mining experience and leadership skills in underground gold mining operations.',
            requirements: [
              'Bachelor\'s degree in Mining Engineering',
              '8+ years of underground mining experience',
              'Professional registration with ECSA',
              'Strong leadership and communication skills',
              'Experience with mine planning software (Surpac, Whittle, Datamine)',
              'Knowledge of MHSA regulations and safety protocols'
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
            description: 'Join our safety team to ensure compliance with mining safety regulations and maintain the highest safety standards. Responsible for conducting safety inspections, training programs, and incident investigations. This role is critical in maintaining our zero-harm vision and protecting our workforce.',
            aiSummary: 'Safety-focused role requiring strong knowledge of mining safety regulations and compliance procedures.',
            requirements: [
              'National Diploma in Safety Management or related field',
              '5+ years mining safety experience',
              'SAMTRAC certification required',
              'Knowledge of MHSA regulations and DMR requirements',
              'Strong analytical and reporting skills',
              'Experience with safety management systems'
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
            description: 'Analyze geological data to support mining operations and exploration activities. Work with advanced geological software and collaborate with multidisciplinary teams to optimize resource extraction. You will interpret drill core data, create geological models, and provide technical recommendations.',
            aiSummary: 'Technical role combining geology expertise with data analysis skills for mining optimization.',
            requirements: [
              'BSc in Geology, Geostatistics, or related field',
              '3+ years geological data analysis experience',
              'Proficiency in geological modeling software (Leapfrog, GEMS, Micromine)',
              'Strong statistical analysis and geostatistics skills',
              'Experience with GIS systems (ArcGIS, QGIS)',
              'Knowledge of ore reserve estimation techniques'
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
            description: 'Maintain and repair heavy mining equipment including excavators, haul trucks, and processing machinery. Ensure optimal equipment performance and minimize downtime through preventive maintenance. Work with CAT, Komatsu, and Liebherr equipment in open pit coal mining operations.',
            aiSummary: 'Hands-on technical role focused on mining equipment maintenance and repair.',
            requirements: [
              'Trade certificate in Mechanical or Electrical Engineering',
              '4+ years heavy equipment maintenance experience',
              'Knowledge of hydraulic, pneumatic, and electrical systems',
              'Experience with CAT, Komatsu, or Liebherr equipment',
              'Strong problem-solving and diagnostic abilities',
              'Valid driver\'s license and willingness to work shifts'
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
            description: 'Lead environmental compliance initiatives and ensure mining operations meet all environmental regulations. Develop sustainability programs and manage environmental impact assessments. Drive our commitment to responsible mining and community engagement.',
            aiSummary: 'Management position focused on environmental compliance and sustainability in diamond mining operations.',
            requirements: [
              'MSc in Environmental Science, Environmental Management, or related',
              '6+ years environmental compliance experience in mining',
              'Knowledge of NEMA, MPRDA, and other mining environmental regulations',
              'Project management experience (PMP certification advantageous)',
              'Strong stakeholder management and communication skills',
              'Experience with EIA processes and water use licenses'
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
            description: 'Entry-level surveying position supporting mining operations through accurate measurement and mapping. Great opportunity for recent graduates to start their mining career. You will work both underground and on surface, using modern surveying equipment and software.',
            aiSummary: 'Entry-level surveying role perfect for new graduates entering the mining industry.',
            requirements: [
              'National Diploma or BTech in Mine Surveying',
              '0-2 years surveying experience (graduates welcome)',
              'Proficiency in surveying software (MineCAD, Surpac, AutoCAD)',
              'Strong attention to detail and accuracy',
              'Willingness to work underground and surface operations',
              'Valid driver\'s license'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Entry-level',
            category: 'Surveying & Mapping',
            postedDate: '2024-07-10',
            externalUrl: 'https://harmony.co.za/careers'
          },
          {
            _id: '7',
            title: 'Metallurgical Engineer - Processing Plant',
            company: 'Impala Platinum',
            location: 'Rustenburg',
            country: 'South Africa',
            salary: {
              min: 420000,
              max: 580000,
              currency: 'ZAR'
            },
            description: 'Lead process optimization initiatives in our platinum concentrator plant. Responsible for improving metallurgical recovery, reducing operating costs, and implementing new technologies. Work with flotation, smelting, and refining processes.',
            aiSummary: 'Technical engineering role focused on metallurgical process optimization in platinum processing.',
            requirements: [
              'BEng/BSc in Metallurgical or Chemical Engineering',
              '5+ years metallurgical processing experience',
              'Experience with PGM (Platinum Group Metals) processing',
              'Knowledge of flotation, grinding, and hydrometallurgy',
              'Strong analytical and problem-solving skills',
              'Experience with process simulation software (HSC, JKSimMet)'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Metallurgy & Processing',
            postedDate: '2024-07-08',
            externalUrl: 'https://implats.co.za/careers'
          },
          {
            _id: '8',
            title: 'Production Shift Supervisor',
            company: 'Kumba Iron Ore',
            location: 'Northern Cape',
            country: 'South Africa',
            salary: {
              min: 380000,
              max: 450000,
              currency: 'ZAR'
            },
            description: 'Supervise production operations during shift work in our open pit iron ore mine. Manage a team of 30+ operators and ensure safe, efficient production targets are met. Coordinate with maintenance, geology, and planning departments.',
            aiSummary: 'Supervisory role managing production operations and teams in open pit iron ore mining.',
            requirements: [
              'National Diploma in Mining or related field',
              '4+ years mining operations experience',
              '2+ years supervisory experience',
              'Knowledge of open pit mining methods',
              'Strong leadership and communication skills',
              'Blasting certificate (advantageous)',
              'First aid certification required'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Operations & Production',
            postedDate: '2024-07-05',
            externalUrl: 'https://kumba.com/careers'
          },
          {
            _id: '9',
            title: 'Health & Safety Specialist - Underground',
            company: 'AngloGold Ashanti',
            location: 'Carletonville',
            country: 'South Africa',
            salary: {
              min: 350000,
              max: 450000,
              currency: 'ZAR'
            },
            description: 'Specialist safety role focusing on underground mining operations. Develop and implement safety procedures, conduct risk assessments, and provide safety training. Critical role in maintaining our industry-leading safety performance.',
            aiSummary: 'Specialized safety role for underground mining operations with focus on risk management and training.',
            requirements: [
              'BTech in Safety Management or related field',
              '4+ years underground mining safety experience',
              'SAMTRAC and other safety certifications',
              'Knowledge of rock mechanics and geotechnical hazards',
              'Experience with JSA, HIRA, and safety management systems',
              'Strong training and presentation skills'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            category: 'Safety & Compliance',
            postedDate: '2024-07-03',
            externalUrl: 'https://anglogoldashanti.com/careers'
          },
          {
            _id: '10',
            title: 'Graduate Mining Engineer',
            company: 'African Rainbow Minerals',
            location: 'Various Locations',
            country: 'South Africa',
            salary: {
              min: 280000,
              max: 350000,
              currency: 'ZAR'
            },
            description: 'Graduate development program for new mining engineers. Rotate through different departments including planning, operations, and projects. Excellent opportunity to develop skills across all aspects of mining operations with mentorship from senior engineers.',
            aiSummary: 'Graduate program offering comprehensive mining engineering experience across multiple disciplines.',
            requirements: [
              'BEng/BSc in Mining Engineering (recent graduate)',
              'Strong academic record',
              'Internship or vacation work experience (advantageous)',
              'Excellent communication and teamwork skills',
              'Willingness to relocate and work in remote areas',
              'Valid driver\'s license and passport'
            ],
            jobType: 'Full-time',
            experienceLevel: 'Entry-level',
            category: 'Mining Engineering',
            postedDate: '2024-07-01',
            externalUrl: 'https://arm.co.za/careers'
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p>💡 <strong>Smart Job Matching:</strong> Our system analyzes your skills against job requirements to find your best matches.</p>
                </div>
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
