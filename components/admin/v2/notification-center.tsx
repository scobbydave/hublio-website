"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Bot, 
  FileText,
  Users,
  TrendingUp,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'approval' | 'system' | 'user' | 'analytics'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

interface NotificationCenterProps {
  pendingCount: number
}

export function NotificationCenter({ pendingCount }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/notifications')
      
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      } else {
        // Fallback notifications for development
        const fallbackNotifications: Notification[] = [
          {
            id: '1',
            type: 'approval',
            title: 'New Items Awaiting Approval',
            message: `${pendingCount} items are pending your review in the approval queue`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'high'
          },
          {
            id: '2',
            type: 'system',
            title: 'Vacancy Sync Completed',
            message: 'Daily vacancy synchronization completed successfully with 12 new positions',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            priority: 'medium'
          },
          {
            id: '3',
            type: 'analytics',
            title: 'Traffic Spike Detected',
            message: 'Website traffic increased by 35% in the last 24 hours',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
            priority: 'low'
          },
          {
            id: '4',
            type: 'user',
            title: 'New Contact Inquiry',
            message: 'A new business inquiry was submitted through the contact form',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            read: false,
            priority: 'medium'
          },
          {
            id: '5',
            type: 'system',
            title: 'Blog Post Published',
            message: 'AI-generated blog post "Future of Mining Technology" has been published',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            read: true,
            priority: 'low'
          }
        ]
        setNotifications(fallbackNotifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    
    try {
      await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return Clock
      case 'system': return Bot
      case 'user': return Users
      case 'analytics': return TrendingUp
      default: return Bell
    }
  }

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'text-red-600'
    if (priority === 'medium') return 'text-orange-600'
    
    switch (type) {
      case 'approval': return 'text-orange-600'
      case 'system': return 'text-blue-600'
      case 'user': return 'text-green-600'
      case 'analytics': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    if (diffMs < 60000) return 'Just now'
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`
    if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  <AnimatePresence>
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type)
                      const color = getNotificationColor(notification.type, notification.priority)
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''
                          }`}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-medium line-clamp-1 ${
                                  !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </h4>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    dismissNotification(notification.id)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <p className={`text-xs line-clamp-2 mt-1 ${
                                !notification.read ? 'text-muted-foreground' : 'text-muted-foreground/70'
                              }`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                
                                {notification.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs px-1 py-0">
                                    High
                                  </Badge>
                                )}
                                {notification.priority === 'medium' && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    Medium
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationCenter
