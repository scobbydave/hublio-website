"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MessageSquare,
  FileText,
  Briefcase,
  Shield,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  chatSessions: number
  popularPages: {
    path: string
    name: string
    views: number
    change: number
  }[]
  userActivity: {
    vacancyViews: number
    blogReads: number
    regulationHubUsage: number
    contactInquiries: number
  }
  trafficTrends: {
    today: number
    yesterday: number
    thisWeek: number
    lastWeek: number
  }
}

export function AnalyticsV2Widget() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      if (!analytics) setLoading(true)
      else setRefreshing(true)
      
      const response = await fetch('/api/admin/analytics')
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // Fallback analytics data for development
        const fallbackAnalytics: AnalyticsData = {
          totalViews: 15420,
          uniqueVisitors: 8932,
          chatSessions: 1247,
          popularPages: [
            {
              path: '/vacancies',
              name: 'Job Vacancies',
              views: 3245,
              change: +12.5
            },
            {
              path: '/regulation',
              name: 'Regulation Hub',
              views: 2876,
              change: +8.3
            },
            {
              path: '/blog',
              name: 'Mining Blog',
              views: 2134,
              change: -2.1
            },
            {
              path: '/',
              name: 'Homepage',
              views: 4892,
              change: +5.7
            },
            {
              path: '/about',
              name: 'About Us',
              views: 987,
              change: +1.4
            }
          ],
          userActivity: {
            vacancyViews: 3245,
            blogReads: 2134,
            regulationHubUsage: 2876,
            contactInquiries: 156
          },
          trafficTrends: {
            today: 542,
            yesterday: 487,
            thisWeek: 3821,
            lastWeek: 3456
          }
        }
        setAnalytics(fallbackAnalytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading || !analytics) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  const todayChange = calculateChange(analytics.trafficTrends.today, analytics.trafficTrends.yesterday)
  const weekChange = calculateChange(analytics.trafficTrends.thisWeek, analytics.trafficTrends.lastWeek)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchAnalytics} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {formatNumber(analytics.totalViews)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatNumber(analytics.uniqueVisitors)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Unique Visitors</p>
          </motion.div>
        </div>

        {/* Traffic Trends */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Traffic Trends</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Today vs Yesterday</span>
              <div className="flex items-center gap-2">
                <span>{analytics.trafficTrends.today}</span>
                <div className={`flex items-center gap-1 ${
                  todayChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {todayChange >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-xs">
                    {todayChange >= 0 ? '+' : ''}{todayChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>This Week vs Last Week</span>
              <div className="flex items-center gap-2">
                <span>{formatNumber(analytics.trafficTrends.thisWeek)}</span>
                <div className={`flex items-center gap-1 ${
                  weekChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {weekChange >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-xs">
                    {weekChange >= 0 ? '+' : ''}{weekChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">User Activity</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-blue-600" />
                <span>Vacancy Views</span>
              </div>
              <span className="font-medium">{formatNumber(analytics.userActivity.vacancyViews)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-600" />
                <span>Regulation Hub</span>
              </div>
              <span className="font-medium">{formatNumber(analytics.userActivity.regulationHubUsage)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-purple-600" />
                <span>Blog Reads</span>
              </div>
              <span className="font-medium">{formatNumber(analytics.userActivity.blogReads)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-orange-600" />
                <span>Chat Sessions</span>
              </div>
              <span className="font-medium">{formatNumber(analytics.chatSessions)}</span>
            </div>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Popular Pages</h4>
          
          <div className="space-y-2">
            {analytics.popularPages.slice(0, 3).map((page, index) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{page.name}</p>
                  <p className="text-xs text-muted-foreground">{page.path}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatNumber(page.views)}</span>
                  <div className={`flex items-center gap-1 ${
                    page.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {page.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs">
                      {page.change >= 0 ? '+' : ''}{page.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AnalyticsV2Widget
