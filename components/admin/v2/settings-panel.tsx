"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Key, 
  Database,
  Bell,
  Shield,
  Palette,
  Globe,
  Bot,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload
} from 'lucide-react'

interface SystemSettings {
  // API Configuration
  geminiApiKey: string
  sanityProjectId: string
  sanityApiToken: string
  newsApiKey: string
  resendApiKey: string
  upstashUrl: string
  
  // System Configuration
  autoContentGeneration: boolean
  contentApprovalRequired: boolean
  aiAssistanceEnabled: boolean
  maintenanceMode: boolean
  cachingEnabled: boolean
  
  // Notification Settings
  emailNotifications: boolean
  approvalNotifications: boolean
  systemAlerts: boolean
  notificationEmail: string
  
  // Content Settings
  defaultContentRegion: string
  maxContentLength: number
  allowedFileTypes: string[]
  contentModeration: boolean
  
  // Security Settings
  sessionTimeout: number
  maxLoginAttempts: number
  requireStrongPasswords: boolean
  twoFactorEnabled: boolean
  
  // Analytics
  googleAnalyticsId: string
  trackingEnabled: boolean
  dataRetentionDays: number
  
  // Appearance
  brandColor: string
  darkModeEnabled: boolean
  compactMode: boolean
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<SystemSettings>({
    geminiApiKey: '',
    sanityProjectId: '',
    sanityApiToken: '',
    newsApiKey: '',
    resendApiKey: '',
    upstashUrl: '',
    autoContentGeneration: true,
    contentApprovalRequired: true,
    aiAssistanceEnabled: true,
    maintenanceMode: false,
    cachingEnabled: true,
    emailNotifications: true,
    approvalNotifications: true,
    systemAlerts: true,
    notificationEmail: '',
    defaultContentRegion: 'South Africa',
    maxContentLength: 5000,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt'],
    contentModeration: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    twoFactorEnabled: false,
    googleAnalyticsId: '',
    trackingEnabled: true,
    dataRetentionDays: 365,
    brandColor: '#0ea5e9',
    darkModeEnabled: false,
    compactMode: false
  })
  const [loading, setLoading] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated successfully"
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const testApiConnection = async (apiType: string) => {
    try {
      const response = await fetch(`/api/admin/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: apiType, settings })
      })

      const data = await response.json()
      
      toast({
        title: data.success ? "Connection Successful" : "Connection Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to test API connection",
        variant: "destructive"
      })
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hublio-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(prev => ({ ...prev, ...importedSettings }))
          toast({
            title: "Settings Imported",
            description: "Settings imported successfully. Don't forget to save!"
          })
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid settings file format",
            variant: "destructive"
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const copyApiKey = (key: string, value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied",
      description: `${key} copied to clipboard`
    })
  }

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSettings}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('import-settings')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
              <Button
                onClick={saveSettings}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  System Configuration
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultRegion">Default Content Region</Label>
                    <Select value={settings.defaultContentRegion} onValueChange={(value) => updateSetting('defaultContentRegion', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Africa">Africa</SelectItem>
                        <SelectItem value="Global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxContentLength">Max Content Length</Label>
                    <Input
                      id="maxContentLength"
                      type="number"
                      value={settings.maxContentLength}
                      onChange={(e) => updateSetting('maxContentLength', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Content Generation</Label>
                      <p className="text-sm text-muted-foreground">Automatically generate blog posts and content</p>
                    </div>
                    <Switch
                      checked={settings.autoContentGeneration}
                      onCheckedChange={(checked) => updateSetting('autoContentGeneration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Content Approval Required</Label>
                      <p className="text-sm text-muted-foreground">All AI-generated content requires approval</p>
                    </div>
                    <Switch
                      checked={settings.contentApprovalRequired}
                      onCheckedChange={(checked) => updateSetting('contentApprovalRequired', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI Assistance</Label>
                      <p className="text-sm text-muted-foreground">Enable AI-powered features</p>
                    </div>
                    <Switch
                      checked={settings.aiAssistanceEnabled}
                      onCheckedChange={(checked) => updateSetting('aiAssistanceEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Caching Enabled</Label>
                      <p className="text-sm text-muted-foreground">Enable Redis caching for better performance</p>
                    </div>
                    <Switch
                      checked={settings.cachingEnabled}
                      onCheckedChange={(checked) => updateSetting('cachingEnabled', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apis" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Configuration
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                  >
                    {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showApiKeys ? 'Hide' : 'Show'} Keys
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Gemini API Key</Label>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyApiKey('Gemini API Key', settings.geminiApiKey)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testApiConnection('gemini')}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                    <Input
                      type={showApiKeys ? 'text' : 'password'}
                      value={settings.geminiApiKey}
                      onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
                      placeholder="Enter Gemini API key..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sanity Project ID</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testApiConnection('sanity')}
                      >
                        Test
                      </Button>
                    </div>
                    <Input
                      value={settings.sanityProjectId}
                      onChange={(e) => updateSetting('sanityProjectId', e.target.value)}
                      placeholder="Enter Sanity project ID..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sanity API Token</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyApiKey('Sanity API Token', settings.sanityApiToken)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys ? 'text' : 'password'}
                      value={settings.sanityApiToken}
                      onChange={(e) => updateSetting('sanityApiToken', e.target.value)}
                      placeholder="Enter Sanity API token..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>News API Key</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testApiConnection('news')}
                      >
                        Test
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys ? 'text' : 'password'}
                      value={settings.newsApiKey}
                      onChange={(e) => updateSetting('newsApiKey', e.target.value)}
                      placeholder="Enter News API key..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Resend API Key (Email)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testApiConnection('resend')}
                      >
                        Test
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys ? 'text' : 'password'}
                      value={settings.resendApiKey}
                      onChange={(e) => updateSetting('resendApiKey', e.target.value)}
                      placeholder="Enter Resend API key..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upstash Redis URL</Label>
                    <Input
                      type={showApiKeys ? 'text' : 'password'}
                      value={settings.upstashUrl}
                      onChange={(e) => updateSetting('upstashUrl', e.target.value)}
                      placeholder="Enter Upstash Redis URL..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input
                      value={settings.googleAnalyticsId}
                      onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Content Management
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Content Moderation</Label>
                      <p className="text-sm text-muted-foreground">Automatically moderate content for inappropriate material</p>
                    </div>
                    <Switch
                      checked={settings.contentModeration}
                      onCheckedChange={(checked) => updateSetting('contentModeration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track content performance and user engagement</p>
                    </div>
                    <Switch
                      checked={settings.trackingEnabled}
                      onCheckedChange={(checked) => updateSetting('trackingEnabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Allowed File Types</Label>
                    <div className="flex flex-wrap gap-2">
                      {['pdf', 'doc', 'docx', 'txt', 'xlsx', 'ppt', 'pptx'].map((type) => (
                        <Badge
                          key={type}
                          variant={settings.allowedFileTypes.includes(type) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTypes = settings.allowedFileTypes.includes(type)
                              ? settings.allowedFileTypes.filter(t => t !== type)
                              : [...settings.allowedFileTypes, type]
                            updateSetting('allowedFileTypes', newTypes)
                          }}
                        >
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Strong Passwords</Label>
                      <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                    </div>
                    <Switch
                      checked={settings.requireStrongPasswords}
                      onCheckedChange={(checked) => updateSetting('requireStrongPasswords', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enable 2FA for additional security</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </h3>

                <div className="space-y-2">
                  <Label>Notification Email</Label>
                  <Input
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => updateSetting('notificationEmail', e.target.value)}
                    placeholder="admin@hublio.com"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive general email notifications</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Approval Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when content needs approval</p>
                    </div>
                    <Switch
                      checked={settings.approvalNotifications}
                      onCheckedChange={(checked) => updateSetting('approvalNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive system health and error alerts</p>
                    </div>
                    <Switch
                      checked={settings.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('systemAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brand Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.brandColor}
                        onChange={(e) => updateSetting('brandColor', e.target.value)}
                        className="w-20"
                      />
                      <Input
                        value={settings.brandColor}
                        onChange={(e) => updateSetting('brandColor', e.target.value)}
                        placeholder="#0ea5e9"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the admin dashboard</p>
                    </div>
                    <Switch
                      checked={settings.darkModeEnabled}
                      onCheckedChange={(checked) => updateSetting('darkModeEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use compact layout for more content</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SettingsPanel
