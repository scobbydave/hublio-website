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
  CheckCircle,
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

interface ContentCreationPortalProps {
  dashboardKey?: string
}

export function ContentCreationPortal({ dashboardKey }: ContentCreationPortalProps) {
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
      const key = dashboardKey || 'hublio-secure-2024' // fallback for local development
      const response = await fetch(`/api/admin/content/generate?key=${key}`, {
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
      const key = dashboardKey || 'hublio-secure-2024' // fallback for local development
      const response = await fetch(`/api/admin/content/create?key=${key}`, {
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
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Content Templates</h3>
              
              {/* Quick Start Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('blog')
                  updateForm('type', 'blog')
                  updateForm('title', 'Mining Safety Best Practices')
                  updateForm('category', 'Safety & Compliance')
                  updateForm('content', `# Mining Safety Best Practices

## Introduction
Safety is paramount in mining operations. This guide covers essential safety practices that every mining professional should follow.

## Key Safety Areas

### 1. Personal Protective Equipment (PPE)
- Always wear approved hard hats, safety glasses, and steel-toed boots
- Use respiratory protection in dusty environments
- Ensure high-visibility clothing in active areas

### 2. Equipment Safety
- Conduct pre-shift equipment inspections
- Follow lockout/tagout procedures
- Report any equipment malfunctions immediately

### 3. Emergency Procedures
- Know evacuation routes and assembly points
- Understand emergency communication systems
- Participate in regular safety drills

## Conclusion
By following these safety practices, we can ensure a safer workplace for everyone.`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <Shield className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-medium mb-1">Safety Guide Template</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive safety practices for mining operations</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('regulation')
                  updateForm('type', 'regulation')
                  updateForm('title', 'MHSA Compliance Checklist')
                  updateForm('category', 'Mining Safety')
                  updateForm('content', `# MHSA Compliance Checklist

## Overview
This checklist ensures compliance with the Mine Health and Safety Act requirements.

## Pre-Operation Requirements

### Documentation
- [ ] Valid mining permit
- [ ] Safety management plan
- [ ] Emergency response plan
- [ ] Employee training records

### Equipment Inspections
- [ ] Ventilation systems operational
- [ ] Safety equipment tested
- [ ] Communication systems functional
- [ ] Emergency exits clearly marked

### Personnel Requirements
- [ ] Qualified mine managers appointed
- [ ] Safety representatives elected
- [ ] Medical certificates up to date
- [ ] Safety training completed

## Daily Operations

### Before Each Shift
- [ ] Safety briefings conducted
- [ ] Equipment inspections completed
- [ ] Weather conditions assessed
- [ ] Personnel accounted for

## Review and Updates
This checklist should be reviewed monthly and updated as regulations change.`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-medium mb-1">MHSA Compliance</h4>
                    <p className="text-sm text-muted-foreground">Ready-to-use compliance checklist</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('tip')
                  updateForm('type', 'tip')
                  updateForm('title', 'Equipment Maintenance Best Practice')
                  updateForm('category', 'Operational')
                  updateForm('content', `# Equipment Maintenance Best Practice

## Quick Tip
Schedule preventive maintenance during planned downtime rather than waiting for equipment failure.

## Why It Matters
- Prevents costly emergency repairs
- Extends equipment lifespan
- Reduces safety risks
- Minimizes production interruptions

## Implementation Steps
1. Create maintenance schedules based on manufacturer recommendations
2. Train maintenance staff on proper procedures
3. Keep detailed maintenance logs
4. Stock critical spare parts
5. Review and update schedules quarterly

## Expected Benefits
Following this practice can reduce maintenance costs by up to 30% and increase equipment availability by 15%.`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <Lightbulb className="h-8 w-8 text-yellow-500 mb-2" />
                    <h4 className="font-medium mb-1">Quick Tip Template</h4>
                    <p className="text-sm text-muted-foreground">Short, actionable advice format</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('faq')
                  updateForm('type', 'faq')
                  updateForm('title', 'What are the ventilation requirements for underground mines?')
                  updateForm('category', 'Safety')
                  updateForm('content', `# What are the ventilation requirements for underground mines?

## Question
What are the specific ventilation requirements for underground mines according to MHSA regulations?

## Answer

### Minimum Air Volume Requirements
- **Working places**: Minimum 0.05 m³/s per person
- **Escape routes**: Minimum 0.3 m/s air velocity
- **Main airways**: Calculated based on total personnel and equipment

### Air Quality Standards
- **Oxygen**: Minimum 19.5%
- **Carbon monoxide**: Maximum 30 ppm
- **Methane**: Maximum 1.25% in any location
- **Hydrogen sulfide**: Maximum 10 ppm

### Ventilation System Requirements
1. **Primary ventilation**: Main fans with backup systems
2. **Secondary ventilation**: Local fans for working areas
3. **Monitoring systems**: Continuous air quality monitoring
4. **Emergency ventilation**: Independent system for emergencies

### Compliance Documentation
- Ventilation plans must be submitted to the DMR
- Regular air quality testing reports required
- Fan performance testing documentation
- Emergency ventilation system testing records

### References
- Mine Health and Safety Act, Section 12.5
- DMR Guidelines on Ventilation in Mines
- South African National Standards (SANS) 10228`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <HelpCircle className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-medium mb-1">FAQ Template</h4>
                    <p className="text-sm text-muted-foreground">Structured question and answer format</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('event')
                  updateForm('type', 'event')
                  updateForm('title', 'Mining Safety Conference 2024')
                  updateForm('category', 'Conference')
                  updateForm('content', `# Mining Safety Conference 2024

## Event Details
- **Date**: March 15-17, 2024
- **Time**: 8:00 AM - 5:00 PM daily
- **Venue**: Sandton Convention Centre, Johannesburg
- **Registration**: R2,500 per person (includes materials and meals)

## About the Conference
The premier mining safety event bringing together industry professionals, regulators, and technology providers to discuss the latest in mining safety practices and innovations.

## Key Topics
- **Digital Safety Solutions**: IoT sensors and real-time monitoring
- **Regulatory Updates**: Latest MHSA amendments and compliance requirements
- **Case Studies**: Success stories from leading mining companies
- **Emergency Response**: Best practices and new technologies
- **Mental Health**: Supporting worker wellbeing in mining

## Featured Speakers
- **Dr. Sarah Molefe**: Chief Inspector of Mines
- **John Stevens**: Safety Director, Anglo American
- **Prof. Peter van der Merwe**: University of the Witwatersrand
- **Lisa Rodriguez**: Global Safety Manager, Rio Tinto

## Registration
Visit www.miningsafety2024.co.za or call 011-123-4567 to register.

## Sponsors
Gold Sponsors: Anglo American, Harmony Gold, Sibanye-Stillwater
Silver Sponsors: DRDGold, African Rainbow Minerals`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <Calendar className="h-8 w-8 text-orange-500 mb-2" />
                    <h4 className="font-medium mb-1">Event Template</h4>
                    <p className="text-sm text-muted-foreground">Complete event information format</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedType('salary')
                  updateForm('type', 'salary')
                  updateForm('title', 'Mining Engineer - Senior Level')
                  updateForm('category', 'Senior Level')
                  updateForm('content', `# Mining Engineer - Senior Level Salary Insights

## Position Overview
Senior Mining Engineers lead complex mining projects and manage technical teams in underground or open-pit operations.

## Salary Range
- **Entry into Senior Level**: R650,000 - R800,000
- **Experienced Senior**: R800,000 - R1,200,000  
- **Principal/Lead**: R1,200,000 - R1,800,000

## Factors Affecting Salary

### Location
- **Gauteng**: Above average due to corporate head offices
- **North West**: Premium for Platinum Belt operations
- **Limpopo**: Competitive rates for coal and platinum
- **International**: 50-100% premium for African postings

### Experience & Specialization
- **Rock Engineering**: +10-15% premium
- **Mine Planning**: High demand, competitive salaries
- **Project Development**: +20% for new mine projects
- **Digital Mining**: Emerging field with premium rates

### Company Size
- **Major Miners**: Higher base + excellent benefits
- **Mid-tier**: Competitive with equity participation
- **Junior Miners**: Variable, often equity-heavy
- **Consulting**: Project-based, higher hourly rates

## Additional Benefits
- Medical aid (100% employer paid)
- Pension/Provident fund (15-18% of salary)
- 13th cheque standard
- Performance bonuses (10-25% of annual salary)
- Study assistance for professional development
- Company vehicle or allowance

## Career Progression
Typical path: Junior → Intermediate → Senior → Principal → Engineering Manager → Mine Manager

## Skills in Demand
- Mine planning software (Surpac, Whittle, Deswik)
- Rock mechanics and geotechnics
- Project management (PMP certification)
- Environmental compliance
- Digital mining technologies`)
                  setActiveTab('create')
                }}>
                  <CardContent className="p-4">
                    <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-medium mb-1">Salary Insights</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive salary and career information</p>
                  </CardContent>
                </Card>
              </div>

              {/* Template Categories */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">Browse by Category</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categories).map(([type, cats]) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        setSelectedType(type)
                        updateForm('type', type)
                        setActiveTab('create')
                      }}
                    >
                      {contentTypes.find(ct => ct.value === type)?.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Template Generator */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Template Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Describe what kind of content you need, and AI will create a custom template for you.
                  </p>
                  <Textarea
                    placeholder="Example: Create a safety checklist for surface mining equipment inspection..."
                    rows={3}
                  />
                  <Button>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Custom Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ContentCreationPortal
