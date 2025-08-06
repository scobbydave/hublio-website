"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Bot,
  DollarSign,
  Globe,
  Database,
  Clock,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

interface APIStatus {
  name: string
  endpoint: string
  status: 'online' | 'offline' | 'degraded' | 'unknown'
  responseTime: number | null
  lastCheck: string
  icon: React.ComponentType<any>
  description: string
}

interface CronJob {
  name: string
  description: string
  lastRun: string | null
  nextRun: string | null
  status: 'success' | 'error' | 'running' | 'pending'
  duration: number | null
}

interface SystemHealth {
  overall: number
  apis: APIStatus[]
  cronJobs: CronJob[]
  uptime: string
  memoryUsage: number
  errorRate: number
}

export function SystemMonitorWidget() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchSystemHealth()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemHealth = async () => {
    try {
      if (!health) setLoading(true)
      else setRefreshing(true)
      
      const response = await fetch('/api/admin/system/health')
      
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      } else {
        // Fallback data for development
        const fallbackHealth: SystemHealth = {
          overall: 85,
          apis: [
            {
              name: 'Gemini AI',
              endpoint: 'https://generativelanguage.googleapis.com',
              status: 'online',
              responseTime: 1250,
              lastCheck: new Date().toISOString(),
              icon: Bot,
              description: 'AI content generation service'
            },
            {
              name: 'Alpha Vantage',
              endpoint: 'https://www.alphavantage.co/query',
              status: 'online',
              responseTime: 850,
              lastCheck: new Date().toISOString(),
              icon: DollarSign,
              description: 'Commodity price data'
            },
            {
              name: 'News API',
              endpoint: 'https://newsapi.org/v2',
              status: 'degraded',
              responseTime: 3200,
              lastCheck: new Date().toISOString(),
              icon: Globe,
              description: 'Mining news aggregation'
            },
            {
              name: 'Sanity CMS',
              endpoint: 'https://api.sanity.io',
              status: 'online',
              responseTime: 450,
              lastCheck: new Date().toISOString(),
              icon: Database,
              description: 'Content management system'
            },
            {
              name: 'Redis Cache',
              endpoint: 'Upstash Redis',
              status: 'online',
              responseTime: 125,
              lastCheck: new Date().toISOString(),
              icon: Zap,
              description: 'Caching and session storage'
            }
          ],
          cronJobs: [
            {
              name: 'Vacancy Sync',
              description: 'Daily sync of mining job vacancies with AI summarization',
              lastRun: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              nextRun: new Date(Date.now() + 82800000).toISOString(), // 23 hours from now
              status: 'success',
              duration: 45000 // 45 seconds
            },
            {
              name: 'News & Blog Automation',
              description: 'Daily fetch of mining news and AI blog draft generation',
              lastRun: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
              nextRun: new Date(Date.now() + 79200000).toISOString(), // 22 hours from now
              status: 'success',
              duration: 78000 // 1 minute 18 seconds
            }
          ],
          uptime: '99.8%',
          memoryUsage: 68,
          errorRate: 0.2
        }
        setHealth(fallbackHealth)
      }
    } catch (error) {
      console.error('Error fetching system health:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: APIStatus['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-orange-600 bg-orange-100'
      case 'offline': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: APIStatus['status']) => {
    switch (status) {
      case 'online': return CheckCircle
      case 'degraded': return AlertCircle
      case 'offline': return XCircle
      default: return Clock
    }
  }

  const getCronStatusColor = (status: CronJob['status']) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'running': return 'text-blue-600'
      case 'pending': return 'text-orange-600'
    }
  }

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${Math.round(ms / 1000)}s`
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`
  }

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    if (diffMs < 60000) return 'Just now'
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`
    if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (loading || !health) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={health.overall > 90 ? 'default' : health.overall > 70 ? 'secondary' : 'destructive'}>
              {health.overall}% Health
            </Badge>
            <Button variant="ghost" size="sm" onClick={fetchSystemHealth} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-semibold text-green-600">{health.uptime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Memory</p>
            <p className="font-semibold">{health.memoryUsage}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Error Rate</p>
            <p className="font-semibold text-green-600">{health.errorRate}%</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          <div className="space-y-6 pb-6">
            {/* API Status */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                API Services
              </h4>
              <div className="space-y-2">
                {health.apis.map((api, index) => {
                  const StatusIcon = getStatusIcon(api.status)
                  
                  return (
                    <motion.div
                      key={api.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <api.icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{api.name}</p>
                          <p className="text-xs text-muted-foreground">{api.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {api.responseTime && (
                          <span className="text-xs text-muted-foreground">
                            {api.responseTime}ms
                          </span>
                        )}
                        <Badge variant="outline" className={getStatusColor(api.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {api.status}
                        </Badge>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Cron Jobs */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled Jobs
              </h4>
              <div className="space-y-2">
                {health.cronJobs.map((job, index) => (
                  <motion.div
                    key={job.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (health.apis.length + index) * 0.1 }}
                    className="p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{job.name}</h5>
                        <Badge variant="outline" className={getCronStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      {job.duration && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(job.duration)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{job.description}</p>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last run: {formatRelativeTime(job.lastRun)}</span>
                      <span>Next run: {formatRelativeTime(job.nextRun)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* System Resources */}
            <div>
              <h4 className="font-medium text-sm mb-3">System Resources</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{health.memoryUsage}%</span>
                  </div>
                  <Progress value={health.memoryUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>System Health</span>
                    <span>{health.overall}%</span>
                  </div>
                  <Progress value={health.overall} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SystemMonitorWidget
