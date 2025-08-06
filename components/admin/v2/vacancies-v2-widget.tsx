"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Briefcase, 
  RefreshCw, 
  Search, 
  MapPin, 
  DollarSign,
  Clock,
  Bot,
  CheckCircle,
  XCircle,
  Eye,
  Edit
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Vacancy {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: 'full-time' | 'part-time' | 'contract'
  experience: string
  description: string
  aiSummary?: string
  aiSummaryApproved: boolean
  postedDate: string
  source: string
  status: 'active' | 'expired' | 'filled'
}

export function VacanciesV2Widget() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null)

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      if (!vacancies.length) setLoading(true)
      else setRefreshing(true)
      
      const response = await fetch('/api/admin/vacancies')
      
      if (response.ok) {
        const data = await response.json()
        setVacancies(data.vacancies || [])
      } else {
        // Fallback vacancy data for development
        const fallbackVacancies: Vacancy[] = [
          {
            id: '1',
            title: 'Senior Mining Engineer',
            company: 'Anglo American',
            location: 'Johannesburg, South Africa',
            salary: 'R850,000 - R1,200,000',
            type: 'full-time',
            experience: '8-12 years',
            description: 'Lead mining operations and ensure safety compliance across all underground activities...',
            aiSummary: 'Senior role requiring extensive mining experience with focus on safety compliance and team leadership. Competitive package with excellent benefits.',
            aiSummaryApproved: true,
            postedDate: new Date(Date.now() - 86400000).toISOString(),
            source: 'CareerJunction',
            status: 'active'
          },
          {
            id: '2',
            title: 'Environmental Compliance Officer',
            company: 'Sibanye-Stillwater',
            location: 'Rustenburg, South Africa',
            salary: 'R450,000 - R650,000',
            type: 'full-time',
            experience: '3-5 years',
            description: 'Ensure environmental compliance across mining operations and manage regulatory reporting...',
            aiSummary: 'Environmental role focused on regulatory compliance and sustainability initiatives. Great opportunity for career growth.',
            aiSummaryApproved: false,
            postedDate: new Date(Date.now() - 172800000).toISOString(),
            source: 'PNet',
            status: 'active'
          },
          {
            id: '3',
            title: 'Safety Manager',
            company: 'Gold Fields',
            location: 'Welkom, South Africa',
            type: 'full-time',
            experience: '5-8 years',
            description: 'Oversee safety protocols and ensure compliance with mining health and safety regulations...',
            aiSummary: 'Critical safety leadership role with responsibility for comprehensive safety program management.',
            aiSummaryApproved: true,
            postedDate: new Date(Date.now() - 259200000).toISOString(),
            source: 'Indeed',
            status: 'active'
          }
        ]
        setVacancies(fallbackVacancies)
      }
    } catch (error) {
      console.error('Error fetching vacancies:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const approveAISummary = async (vacancyId: string) => {
    try {
      const response = await fetch(`/api/admin/vacancies/${vacancyId}/approve-summary`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setVacancies(prev => 
          prev.map(v => 
            v.id === vacancyId 
              ? { ...v, aiSummaryApproved: true }
              : v
          )
        )
      }
    } catch (error) {
      console.error('Error approving AI summary:', error)
    }
  }

  const syncVacancies = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/admin/vacancies/sync', {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchVacancies()
      }
    } catch (error) {
      console.error('Error syncing vacancies:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredVacancies = vacancies.filter(vacancy =>
    vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: vacancies.length,
    active: vacancies.filter(v => v.status === 'active').length,
    pendingApproval: vacancies.filter(v => v.aiSummary && !v.aiSummaryApproved).length,
    withAISummary: vacancies.filter(v => v.aiSummary).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vacancy Management</h2>
          <p className="text-muted-foreground">
            Manage job vacancies and AI-generated summaries
          </p>
        </div>
        <Button onClick={syncVacancies} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Sync Vacancies
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vacancies</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Summaries</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withAISummary}</p>
              </div>
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApproval}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Vacancies</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search vacancies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredVacancies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Briefcase className="h-8 w-8 mb-2" />
                <p>No vacancies found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredVacancies.map((vacancy, index) => (
                  <motion.div
                    key={vacancy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{vacancy.title}</h3>
                          <Badge variant={vacancy.status === 'active' ? 'default' : 'secondary'}>
                            {vacancy.status}
                          </Badge>
                          {vacancy.aiSummary && (
                            <Badge variant={vacancy.aiSummaryApproved ? 'default' : 'secondary'}>
                              <Bot className="h-3 w-3 mr-1" />
                              {vacancy.aiSummaryApproved ? 'AI Approved' : 'AI Pending'}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="font-medium text-foreground">{vacancy.company}</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{vacancy.location}</span>
                          </div>
                          {vacancy.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{vacancy.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(vacancy.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {vacancy.aiSummary && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">AI Summary</span>
                            </div>
                            <p className="text-sm text-blue-700">{vacancy.aiSummary}</p>
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {vacancy.description}
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Experience: {vacancy.experience}</span>
                          <span>Type: {vacancy.type}</span>
                          <span>Source: {vacancy.source}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {vacancy.aiSummary && !vacancy.aiSummaryApproved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => approveAISummary(vacancy.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve AI
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default VacanciesV2Widget
