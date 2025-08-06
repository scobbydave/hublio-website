import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo - in production, use a database
let systemSettings = {
  // API Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  sanityApiToken: process.env.SANITY_API_TOKEN || '',
  newsApiKey: process.env.NEWS_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  upstashUrl: process.env.UPSTASH_REDIS_REST_URL || '',
  
  // System Configuration
  autoContentGeneration: true,
  contentApprovalRequired: true,
  aiAssistanceEnabled: true,
  maintenanceMode: false,
  cachingEnabled: true,
  
  // Notification Settings
  emailNotifications: true,
  approvalNotifications: true,
  systemAlerts: true,
  notificationEmail: 'admin@hublio.com',
  
  // Content Settings
  defaultContentRegion: 'South Africa',
  maxContentLength: 5000,
  allowedFileTypes: ['pdf', 'doc', 'docx', 'txt'],
  contentModeration: true,
  
  // Security Settings
  sessionTimeout: 3600,
  maxLoginAttempts: 5,
  requireStrongPasswords: true,
  twoFactorEnabled: false,
  
  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  trackingEnabled: true,
  dataRetentionDays: 365,
  
  // Appearance
  brandColor: '#0ea5e9',
  darkModeEnabled: false,
  compactMode: false
}

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const url = new URL(request.url)
    const key = url.searchParams.get('key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!key || key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return sanitized settings (without sensitive API keys for security)
    const sanitizedSettings = {
      ...systemSettings,
      geminiApiKey: systemSettings.geminiApiKey ? '***CONFIGURED***' : '',
      sanityApiToken: systemSettings.sanityApiToken ? '***CONFIGURED***' : '',
      newsApiKey: systemSettings.newsApiKey ? '***CONFIGURED***' : '',
      resendApiKey: systemSettings.resendApiKey ? '***CONFIGURED***' : '',
      upstashUrl: systemSettings.upstashUrl ? '***CONFIGURED***' : ''
    }

    return NextResponse.json(sanitizedSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Validate admin access
    const url = new URL(request.url)
    const key = url.searchParams.get('key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!key || key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Filter out any attempts to update API keys through the UI for security
    const {
      geminiApiKey,
      sanityApiToken,
      newsApiKey,
      resendApiKey,
      upstashUrl,
      ...safeUpdates
    } = updates

    // Update settings (excluding API keys for security)
    systemSettings = {
      ...systemSettings,
      ...safeUpdates,
      // Keep existing API keys
      geminiApiKey: systemSettings.geminiApiKey,
      sanityApiToken: systemSettings.sanityApiToken,
      newsApiKey: systemSettings.newsApiKey,
      resendApiKey: systemSettings.resendApiKey,
      upstashUrl: systemSettings.upstashUrl
    }

    // In production, you would save to database here
    // await saveSettingsToDatabase(systemSettings)

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: {
        ...systemSettings,
        // Return sanitized version
        geminiApiKey: systemSettings.geminiApiKey ? '***CONFIGURED***' : '',
        sanityApiToken: systemSettings.sanityApiToken ? '***CONFIGURED***' : '',
        newsApiKey: systemSettings.newsApiKey ? '***CONFIGURED***' : '',
        resendApiKey: systemSettings.resendApiKey ? '***CONFIGURED***' : '',
        upstashUrl: systemSettings.upstashUrl ? '***CONFIGURED***' : ''
      }
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
