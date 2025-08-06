"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Shield, 
  FolderOpen, 
  Users, 
  Calendar,
  Settings,
  Bell,
  User,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

// Import widgets
import { ApprovalQueueWidget } from '@/components/admin/v2/approval-queue-widget-v2'
import { VacanciesV2Widget } from '@/components/admin/v2/vacancies-v2-widget'
import { BlogsV2Widget } from '@/components/admin/v2/blogs-v2-widget'
import { RegulationV2Widget } from '@/components/admin/v2/regulation-v2-widget'
import { ResourceLibraryWidget } from '@/components/admin/v2/resource-library-widget'
import { SupplierV2Widget } from '@/components/admin/v2/supplier-v2-widget'
import { EventCalendarWidget } from '@/components/admin/v2/event-calendar-widget'
import { AnalyticsV2Widget } from '@/components/admin/v2/analytics-v2-widget'
import { SystemMonitorWidget } from '@/components/admin/v2/system-monitor-widget'
import { CommodityPriceBar } from '@/components/admin/v2/commodity-price-bar'
import { NotificationCenter } from '@/components/admin/v2/notification-center'
import { ContentCreationPortal } from '@/components/admin/v2/content-creation-portal'
import { SalaryInsightsWidget } from '@/components/admin/v2/salary-insights-widget'

interface AdminDashboardV2Props {
  initialKey?: string
}

type DashboardSection = 
  | 'overview' 
  | 'content-portal'
  | 'approval-queue'
  | 'vacancies' 
  | 'blogs' 
  | 'regulation' 
  | 'resources' 
  | 'suppliers' 
  | 'events' 
  | 'salary-insights'
  | 'analytics'
  | 'settings'

interface DashboardStats {
  pendingApprovals: number
  totalVacancies: number
  totalBlogs: number
  systemHealth: number
  activeUsers: number
}

export function AdminDashboardV2({ initialKey }: AdminDashboardV2Props) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    totalVacancies: 0,
    totalBlogs: 0,
    systemHealth: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      const [approvalRes, vacancyRes, blogRes, healthRes] = await Promise.allSettled([
        fetch('/api/admin/approvals/stats'),
        fetch('/api/admin/vacancies/stats'),
        fetch('/api/admin/blogs/stats'),
        fetch('/api/admin/system/health')
      ])

      const newStats = { ...stats }

      if (approvalRes.status === 'fulfilled' && approvalRes.value.ok) {
        const data = await approvalRes.value.json()
        newStats.pendingApprovals = data.pending || 0
      }

      if (vacancyRes.status === 'fulfilled' && vacancyRes.value.ok) {
        const data = await vacancyRes.value.json()
        newStats.totalVacancies = data.total || 0
      }

      if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
        const data = await blogRes.value.json()
        newStats.totalBlogs = data.total || 0
      }

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        const data = await healthRes.value.json()
        newStats.systemHealth = data.healthScore || 0
      }

      setStats(newStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content-portal', label: 'Content Portal', icon: Edit },
    { id: 'approval-queue', label: 'Approval Queue', icon: Clock, badge: stats.pendingApprovals },
    { id: 'vacancies', label: 'Vacancies', icon: Briefcase, badge: stats.totalVacancies },
    { id: 'blogs', label: 'Blogs', icon: FileText, badge: stats.totalBlogs },
    { id: 'regulation', label: 'Regulation Hub', icon: Shield },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'salary-insights', label: 'Salary Insights', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Approvals</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Vacancies</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalVacancies}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Blog Posts</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalBlogs}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">System Health</p>
                      <p className="text-2xl font-bold text-emerald-600">{stats.systemHealth}%</p>
                    </div>
                    <Activity className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApprovalQueueWidget />
              <SystemMonitorWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AnalyticsV2Widget />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New blog post approved</span>
                      <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Vacancy sync completed</span>
                      <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Compliance tip pending review</span>
                      <span className="text-xs text-muted-foreground ml-auto">12m ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Vacancies
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Blog Post
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Review Compliance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'content-portal':
        return <ContentCreationPortal />
      
      case 'approval-queue':
        return <ApprovalQueueWidget />
      
      case 'vacancies':
        return <VacanciesV2Widget />
      
      case 'blogs':
        return <BlogsV2Widget />
      
      case 'regulation':
        return <RegulationV2Widget />
      
      case 'resources':
        return <ResourceLibraryWidget />
      
      case 'suppliers':
        return <SupplierV2Widget />
      
      case 'events':
        return <EventCalendarWidget />
      
      case 'salary-insights':
        return <SalaryInsightsWidget />
      
      case 'analytics':
        return <AnalyticsV2Widget />
      
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Admin Dashboard V2</h1>
          </div>

          <div className="flex items-center gap-4">
            <CommodityPriceBar />
            <NotificationCenter pendingCount={stats.pendingApprovals} />
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 240 }}
          transition={{ duration: 0.2 }}
          className="border-r bg-card/30 backdrop-blur-sm sticky top-[73px] h-[calc(100vh-73px)]"
        >
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                  onClick={() => setActiveSection(item.id as DashboardSection)}
                >
                  <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-73px)]">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardV2
