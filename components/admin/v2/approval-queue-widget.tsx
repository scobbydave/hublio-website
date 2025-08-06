"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bot, 
  FileText, 
  HelpCircle, 
  Lightbulb,
  RefreshCw,
  Eye,
  Edit,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ApprovalItem {
  id: string
  type: 'tip' | 'faq' | 'blog' | 'checklist' | 'document'
  title: string
  content: string
  aiGenerated: boolean
  createdAt: string
  submittedBy?: string
  category?: string
  priority: 'low' | 'medium' | 'high'
}

interface ApprovalStats {
  total: number
  tips: number
  faqs: number
  blogs: number
  checklists: number
  documents: number
}

export function ApprovalQueueWidget() {
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [stats, setStats] = useState<ApprovalStats>({
    total: 0,
    tips: 0,
    faqs: 0,
    blogs: 0,
    checklists: 0,
    documents: 0
  })
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)

  useEffect(() => {
    fetchApprovalQueue()
  }, [])

  const fetchApprovalQueue = async () => {
    try {
      setLoading(true)
      
      // Get admin key from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const key = urlParams.get('key') || localStorage.getItem('adminKey') || 'hublio-secure-2024'
      
      const response = await fetch(`/api/admin/approval-queue?key=${encodeURIComponent(key)}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access')
        }
        throw new Error('Failed to fetch approval queue')
      }
      
      const data = await response.json()
      
      // Set items and stats from the API response
      setItems(data.items || [])
      
      // Convert stats format to match widget expectations
      const apiStats = data.stats || { total: 0, byType: {} }
      setStats({
        total: apiStats.total,
        tips: apiStats.byType.tip || 0,
        faqs: apiStats.byType.faq || 0,
        blogs: apiStats.byType.blog || 0,
        checklists: apiStats.byType.checklist || 0,
        documents: apiStats.byType.document || 0
      })

    } catch (error) {
      console.error('Error fetching approval queue:', error)
      // Set empty state on error rather than demo data
      setItems([])
      setStats({
        total: 0,
        tips: 0,
        faqs: 0,
        blogs: 0,
        checklists: 0,
        documents: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (itemId: string, action: 'approve' | 'reject') => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    setProcessing(itemId)
    
    try {
      const response = await fetch(`/api/admin/approvals/${item.type}/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        // Remove item from queue
        setItems(prev => prev.filter(i => i.id !== itemId))
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [item.type === 'checklist' ? 'checklists' : `${item.type}s`]: prev[item.type === 'checklist' ? 'checklists' : `${item.type}s` as keyof ApprovalStats] - 1
        }))
        
        if (selectedItem?.id === itemId) {
          setSelectedItem(null)
        }
      } else {
        console.error('Failed to process approval')
      }
    } catch (error) {
      console.error('Error processing approval:', error)
    } finally {
      setProcessing(null)
    }
  }

  const getTypeIcon = (type: ApprovalItem['type']) => {
    switch (type) {
      case 'tip': return Lightbulb
      case 'faq': return HelpCircle
      case 'blog': return FileText
      case 'checklist': return CheckCircle
      case 'document': return FileText
      default: return FileText
    }
  }

  const getTypeColor = (type: ApprovalItem['type']) => {
    switch (type) {
      case 'tip': return 'bg-yellow-100 text-yellow-800'
      case 'faq': return 'bg-blue-100 text-blue-800'
      case 'blog': return 'bg-green-100 text-green-800'
      case 'checklist': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: ApprovalItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-orange-500 bg-orange-50'
      case 'low': return 'border-l-green-500 bg-green-50'
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Approval Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {stats.total} pending
            </Badge>
            <Button variant="ghost" size="sm" onClick={fetchApprovalQueue} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 text-sm">
          {stats.tips > 0 && <span className="text-yellow-600">{stats.tips} Tips</span>}
          {stats.faqs > 0 && <span className="text-blue-600">{stats.faqs} FAQs</span>}
          {stats.blogs > 0 && <span className="text-green-600">{stats.blogs} Blogs</span>}
          {stats.checklists > 0 && <span className="text-purple-600">{stats.checklists} Checklists</span>}
          {stats.documents > 0 && <span className="text-gray-600">{stats.documents} Documents</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          <AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
                <p className="font-medium text-green-600">All caught up!</p>
                <p className="text-sm">No items pending approval.</p>
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {items.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`border rounded-lg p-4 border-l-4 ${getPriorityColor(item.priority)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className={getTypeColor(item.type)}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                            {item.aiGenerated && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            <Badge variant="outline" className={
                              item.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                              item.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            }>
                              {item.priority}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">
                            {item.title}
                          </h4>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {item.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            {item.category && <span>• {item.category}</span>}
                            {item.submittedBy && <span>• {item.submittedBy}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproval(item.id, 'approve')}
                            disabled={processing === item.id}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproval(item.id, 'reject')}
                            disabled={processing === item.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ApprovalQueueWidget
