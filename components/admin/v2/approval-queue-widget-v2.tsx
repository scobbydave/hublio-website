"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
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
  AlertCircle,
  DollarSign,
  Calendar,
  Users,
  Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ApprovalItem {
  id: string
  type: 'tip' | 'faq' | 'blog' | 'regulation' | 'salary' | 'document' | 'event' | 'supplier'
  title: string
  content: string
  aiGenerated: boolean
  createdAt: string
  submittedBy?: string
  category?: string
  priority: 'low' | 'medium' | 'high'
  metadata?: {
    jobTitle?: string
    salaryRange?: string
    fileName?: string
    originalQuestion?: string
    region?: string
    tags?: string[]
  }
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
}

interface ApprovalStats {
  total: number
  byType: Record<string, number>
  byPriority: Record<string, number>
}

const typeIcons = {
  tip: Lightbulb,
  faq: HelpCircle,
  blog: FileText,
  regulation: Shield,
  salary: DollarSign,
  document: FileText,
  event: Calendar,
  supplier: Users
}

const typeColors = {
  tip: 'bg-yellow-100 text-yellow-800',
  faq: 'bg-blue-100 text-blue-800',
  blog: 'bg-green-100 text-green-800',
  regulation: 'bg-red-100 text-red-800',
  salary: 'bg-purple-100 text-purple-800',
  document: 'bg-gray-100 text-gray-800',
  event: 'bg-orange-100 text-orange-800',
  supplier: 'bg-cyan-100 text-cyan-800'
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-green-500 bg-green-50'
}

export function ApprovalQueueWidgetV2() {
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [stats, setStats] = useState<ApprovalStats>({
    total: 0,
    byType: {},
    byPriority: { high: 0, medium: 0, low: 0 }
  })
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchApprovalItems()
  }, [])

  const fetchApprovalItems = async () => {
    try {
      setLoading(true)
      // Get admin key from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const key = urlParams.get('key') || localStorage.getItem('adminKey') || 'hublio-secure-2024' // fallback for local development
      const response = await fetch(`/api/admin/approval-queue?key=${encodeURIComponent(key || '')}`)
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access')
        }
        throw new Error('Failed to fetch approval items')
      }
      const data = await response.json()
      setItems(data.items || [])
      setStats(data.stats || { total: 0, byType: {}, byPriority: { high: 0, medium: 0, low: 0 } })
    } catch (error) {
      console.error('Error fetching approval items:', error)
      toast({
        title: "Error",
        description: "Failed to load approval queue",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (item: ApprovalItem) => {
    try {
      setProcessing(item.id)
      const urlParams = new URLSearchParams(window.location.search)
      const key = urlParams.get('key') || localStorage.getItem('adminKey')
      
      const response = await fetch('/api/admin/approval-queue/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemId: item.id, 
          notes: reviewNotes,
          key: key
        })
      })

      if (!response.ok) throw new Error('Failed to approve item')

      toast({
        title: "Content Approved",
        description: `${item.title} has been published successfully`
      })

      // Remove approved item from queue
      setItems(items.filter(i => i.id !== item.id))
      setSelectedItem(null)
      setReviewNotes('')
    } catch (error) {
      console.error('Error approving item:', error)
      toast({
        title: "Error",
        description: "Failed to approve item",
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (item: ApprovalItem) => {
    try {
      setProcessing(item.id)
      const urlParams = new URLSearchParams(window.location.search)
      const key = urlParams.get('key') || localStorage.getItem('adminKey')
      
      const response = await fetch('/api/admin/approval-queue/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemId: item.id, 
          notes: reviewNotes,
          key: key
        })
      })

      if (!response.ok) throw new Error('Failed to reject item')

      toast({
        title: "Content Rejected",
        description: `${item.title} has been removed from queue`
      })

      // Remove rejected item from queue
      setItems(items.filter(i => i.id !== item.id))
      setSelectedItem(null)
      setReviewNotes('')
    } catch (error) {
      console.error('Error rejecting item:', error)
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive"
      })
    } finally {
      setProcessing(null)
    }
  }

  const truncateContent = (content: string, limit = 100) => {
    return content.length > limit ? `${content.substring(0, limit)}...` : content
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Approval Queue
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={fetchApprovalItems}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.byPriority.high || 0}</div>
            <div className="text-sm text-red-600">High Priority</div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Content Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="capitalize">{type}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Items List */}
        <ScrollArea className="h-64">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>All caught up! No items pending approval.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => {
                  const IconComponent = typeIcons[item.type]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-3 border-l-4 rounded-r-lg ${priorityColors[item.priority]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="h-4 w-4" />
                            <Badge className={typeColors[item.type]} variant="secondary">
                              {item.type.toUpperCase()}
                            </Badge>
                            {item.aiGenerated && <Bot className="h-4 w-4 text-blue-500" />}
                          </div>
                          <h5 className="font-medium text-sm">{item.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {truncateContent(item.content)}
                          </p>
                          {item.metadata && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.metadata.jobTitle && (
                                <Badge variant="outline" className="text-xs">
                                  {item.metadata.jobTitle}
                                </Badge>
                              )}
                              {item.metadata.region && (
                                <Badge variant="outline" className="text-xs">
                                  {item.metadata.region}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <IconComponent className="h-5 w-5" />
                                  {item.title}
                                  {item.aiGenerated && <Bot className="h-4 w-4 text-blue-500" />}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <Badge className={typeColors[item.type]}>
                                    {item.type.toUpperCase()}
                                  </Badge>
                                  <Badge variant={item.priority === 'high' ? 'destructive' : 
                                    item.priority === 'medium' ? 'default' : 'secondary'}>
                                    {item.priority.toUpperCase()} PRIORITY
                                  </Badge>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Content:</h4>
                                  <div className="whitespace-pre-wrap text-sm">
                                    {item.content}
                                  </div>
                                </div>

                                {item.metadata && (
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">Metadata:</h4>
                                    <div className="space-y-1 text-sm">
                                      {item.metadata.jobTitle && (
                                        <div><strong>Job Title:</strong> {item.metadata.jobTitle}</div>
                                      )}
                                      {item.metadata.salaryRange && (
                                        <div><strong>Salary Range:</strong> {item.metadata.salaryRange}</div>
                                      )}
                                      {item.metadata.fileName && (
                                        <div><strong>File:</strong> {item.metadata.fileName}</div>
                                      )}
                                      {item.metadata.region && (
                                        <div><strong>Region:</strong> {item.metadata.region}</div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Review Notes (Optional):
                                  </label>
                                  <Textarea
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    placeholder="Add any notes about your decision..."
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApprove(item)}
                                    disabled={processing === item.id}
                                    className="flex-1"
                                  >
                                    {processing === item.id ? (
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Approve & Publish
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleReject(item)}
                                    disabled={processing === item.id}
                                    className="flex-1"
                                  >
                                    {processing === item.id ? (
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(item.createdAt).toLocaleDateString()} • 
                        {item.submittedBy ? ` by ${item.submittedBy}` : ' AI Generated'}
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
  )
}

export { ApprovalQueueWidgetV2 as ApprovalQueueWidget }
