"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Globe, FileText, TrendingUp, Activity, Clock, MessageSquare, Users, Target, Zap, RefreshCw, Settings } from "lucide-react"
import { ChatAnalyticsWidget } from "@/components/admin/chat-analytics-widget"
import { VacanciesWidget } from "@/components/admin/vacancies-widget"
import { SystemHealthWidget } from "@/components/admin/system-health-widget"
import MiningParticles from "@/components/MiningParticles"

interface DashboardStats {
  totalLeads: number
  totalFAQs: number
  totalBlogPosts: number
  chatSessions: number
  faqSuggestions: number
  jobMatchRequests: number
  systemHealth: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardOverview()
  }, [])

  const fetchDashboardOverview = async () => {
    try {
      // Fetch real stats from API
      const response = await fetch('/api/admin/stats')
      
      if (response.ok) {
        const data = await response.json()
        const realStats: DashboardStats = {
          totalLeads: data.leads?.total || 0,
          totalFAQs: data.faqs?.total || 0,
          totalBlogPosts: data.blog?.total || 0,
          chatSessions: data.analytics?.totalSessions || 0,
          faqSuggestions: data.faqs?.aiGenerated || 0,
          jobMatchRequests: data.vacancies?.total || 0,
          systemHealth: 100 // Calculate based on successful API responses
        }
        setStats(realStats)
      } else {
        // Show empty state instead of dummy data
        const emptyStats: DashboardStats = {
          totalLeads: 0,
          totalFAQs: 0,
          totalBlogPosts: 0,
          chatSessions: 0,
          faqSuggestions: 0,
          jobMatchRequests: 0,
          systemHealth: 0
        }
        setStats(emptyStats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error)
      
      // Show empty state on error
      const errorStats: DashboardStats = {
        totalLeads: 0,
        totalFAQs: 0,
        totalBlogPosts: 0,
        chatSessions: 0,
        faqSuggestions: 0,
        jobMatchRequests: 0,
        systemHealth: 0
      }
      setStats(errorStats)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mining-themed background particles */}
      <div className="fixed inset-0 z-0 opacity-30">
        <MiningParticles />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b bg-background/80 backdrop-blur-sm"
        >
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Hublio Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Interactive control center for mining operations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="px-3 py-1">
                  System Health: {stats?.systemHealth || 0}%
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardOverview}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="container py-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {stats?.totalLeads || 0}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Total Leads</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {stats?.chatSessions || 0}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Chat Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {stats?.totalBlogPosts || 0}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Blog Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {stats?.jobMatchRequests || 0}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Job Matches</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {stats?.faqSuggestions || 0}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">FAQ Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-teal-600" />
                  <div>
                    <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                      {stats?.systemHealth || 0}%
                    </div>
                    <div className="text-xs text-teal-600 dark:text-teal-400">System Health</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Tabs */}
          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-fit">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="vacancies" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Vacancies</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Blog</span>
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Suppliers</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Training</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>System</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <ChatAnalyticsWidget />
            </TabsContent>

            <TabsContent value="vacancies" className="space-y-6">
              <VacanciesWidget />
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Blog & News Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Blog Management</h3>
                    <p className="max-w-sm mx-auto">
                      AI-generated blog approval, scheduling, and publishing controls coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Supplier Directory</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Supplier Management</h3>
                    <p className="max-w-sm mx-auto">
                      Supplier approval, inquiry management, and communication tools coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Training & Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Training Management</h3>
                    <p className="max-w-sm mx-auto">
                      Course enrollment tracking, certification management, and progress monitoring coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <SystemHealthWidget />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
