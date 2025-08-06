"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Bot, 
  FileText, 
  HelpCircle, 
  Lightbulb,
  Calendar,
  Users,
  DollarSign,
  Shield,
  Eye,
  Save,
  Send,
  RefreshCw,
  Wand2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentForm {
  type: string
  title: string
  content: string
  category: string
  region: string
  tags: string[]
  aiAssisted: boolean
  publishImmediately: boolean
  excerpt?: string
  metadata?: Record<string, any>
}

const contentTypes = [
  { value: 'blog', label: 'Blog Post', icon: FileText, description: 'Create engaging blog content' },
  { value: 'regulation', label: 'Regulation Article', icon: Shield, description: 'Compliance and regulation guides' },
  { value: 'tip', label: 'Compliance Tip', icon: Lightbulb, description: 'Quick compliance tips' },
  { value: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
  { value: 'event', label: 'Event', icon: Calendar, description: 'Industry events and conferences' },
  { value: 'supplier', label: 'Supplier Profile', icon: Users, description: 'Supplier directory listings' },
  { value: 'salary', label: 'Salary Insight', icon: DollarSign, description: 'Job salary information' }
]

const categories = {
  blog: ['Industry News', 'Career Advice', 'Safety & Compliance', 'Technology', 'Market Analysis', 'Sustainability'],
  regulation: ['Mining Safety', 'Environmental', 'Labor Law', 'Health & Safety', 'Compliance', 'Permits & Licenses'],
  tip: ['Safety', 'Environmental', 'Legal', 'Operational'],
  faq: ['General', 'Safety', 'Environmental', 'Legal', 'Career'],
  event: ['Conference', 'Workshop', 'Webinar', 'Trade Show', 'Networking'],
  supplier: ['Mining Equipment', 'Safety Solutions', 'Environmental Services', 'Consulting', 'Transportation', 'Technology'],
  salary: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive Level']
}

const regions = ['South Africa', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Africa', 'Global']

export function ContentCreationPortal() {
  const [activeTab, setActiveTab] = useState('create')
  const [selectedType, setSelectedType] = useState('')
  const [form, setForm] = useState<ContentForm>({
    type: '',
    title: '',
    content: '',
    category: '',
    region: '',
    tags: [],
    aiAssisted: false,
    publishImmediately: false,
    excerpt: ''
  })
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const { toast } = useToast()

  const updateForm = (field: keyof ContentForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      updateForm('tags', [...form.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    updateForm('tags', form.tags.filter(t => t !== tag))
  }

  const generateAIDraft = async () => {
    if (!form.title || !form.type) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and select content type first",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          category: form.category,
          region: form.region
        })
      })

      if (!response.ok) throw new Error('Failed to generate content')
      
      const data = await response.json()
      updateForm('content', data.content)
      updateForm('excerpt', data.excerpt)
      updateForm('aiAssisted', true)

      toast({
        title: "AI Draft Generated",
        description: "Review and edit the generated content as needed"
      })
    } catch (error) {
      console.error('Error generating AI draft:', error)
      toast({
        title: "Error",
        description: "Failed to generate AI draft",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async (publish = false) => {
    if (!form.title || !form.content || !form.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/content/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          publishImmediately: publish || form.publishImmediately
        })
      })

      if (!response.ok) throw new Error('Failed to save content')
      
      const data = await response.json()
      
      toast({
        title: publish ? "Content Published" : "Content Saved",
        description: publish ? "Content has been published successfully" : "Content saved as draft"
      })

      // Reset form
      setForm({
        type: '',
        title: '',
        content: '',
        category: '',
        region: '',
        tags: [],
        aiAssisted: false,
        publishImmediately: false,
        excerpt: ''
      })
      setSelectedType('')
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePreview = () => {
    const previewContent = `
# ${form.title}

${form.excerpt ? `*${form.excerpt}*\n\n` : ''}

${form.content}

---
**Category:** ${form.category}
**Region:** ${form.region}
**Tags:** ${form.tags.join(', ')}
${form.aiAssisted ? '**AI Assisted:** Yes' : ''}
    `.trim()
    
    setPreview(previewContent)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Content Creation Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Content</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            {/* Content Type Selection */}
            {!selectedType ? (
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <motion.div
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedType(type.value)
                          updateForm('type', type.value)
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header with selected type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {contentTypes.find(t => t.value === selectedType)?.label}
                    </Badge>
                    {form.aiAssisted && <Bot className="h-4 w-4 text-blue-500" />}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedType('')
                      setForm({
                        type: '',
                        title: '',
                        content: '',
                        category: '',
                        region: '',
                        tags: [],
                        aiAssisted: false,
                        publishImmediately: false,
                        excerpt: ''
                      })
                    }}
                  >
                    Change Type
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => updateForm('title', e.target.value)}
                        placeholder="Enter content title..."
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={generateAIDraft}
                        disabled={loading || !form.title}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        AI Draft
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={form.category} onValueChange={(value) => updateForm('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories[form.type as keyof typeof categories]?.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select value={form.region} onValueChange={(value) => updateForm('region', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {form.type === 'blog' && (
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={form.excerpt || ''}
                        onChange={(e) => updateForm('excerpt', e.target.value)}
                        placeholder="Brief description of the content..."
                        rows={2}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={form.content}
                      onChange={(e) => updateForm('content', e.target.value)}
                      placeholder={`Write your ${form.type} content here...

Tips for professional structure:
• Use H1 for main title
• Use H2 for major sections  
• Use H3 for subsections
• Use bullet points for lists
• Keep paragraphs concise`}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {form.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="publish-immediately"
                        checked={form.publishImmediately}
                        onCheckedChange={(checked) => updateForm('publishImmediately', checked)}
                      />
                      <Label htmlFor="publish-immediately">Publish immediately</Label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={generatePreview}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Content Preview</DialogTitle>
                      </DialogHeader>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap">{preview}</pre>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    onClick={() => saveContent(false)}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Draft
                  </Button>

                  <Button
                    onClick={() => saveContent(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {form.aiAssisted && !form.publishImmediately ? 'Submit for Approval' : 'Publish'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Content templates coming soon...</p>
              <p className="text-sm">Pre-built templates for faster content creation</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ContentCreationPortal
