export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock system health data
    const healthData = {
      overall: 92,
      apis: [
        {
          name: 'Gemini AI',
          endpoint: 'https://generativelanguage.googleapis.com',
          status: 'online',
          responseTime: 1150,
          lastCheck: new Date().toISOString(),
          icon: 'Bot',
          description: 'AI content generation service'
        },
        {
          name: 'Alpha Vantage',
          endpoint: 'https://www.alphavantage.co/query',
          status: 'online',
          responseTime: 650,
          lastCheck: new Date().toISOString(),
          icon: 'DollarSign',
          description: 'Commodity price data'
        },
        {
          name: 'News API',
          endpoint: 'https://newsapi.org/v2',
          status: 'degraded',
          responseTime: 3400,
          lastCheck: new Date().toISOString(),
          icon: 'Globe',
          description: 'Mining news aggregation'
        },
        {
          name: 'Sanity CMS',
          endpoint: 'https://api.sanity.io',
          status: 'online',
          responseTime: 320,
          lastCheck: new Date().toISOString(),
          icon: 'Database',
          description: 'Content management system'
        },
        {
          name: 'Redis Cache',
          endpoint: 'Upstash Redis',
          status: 'online',
          responseTime: 85,
          lastCheck: new Date().toISOString(),
          icon: 'Zap',
          description: 'Caching and session storage'
        }
      ],
      cronJobs: [
        {
          name: 'Vacancy Sync',
          description: 'Daily sync of mining job vacancies with AI summarization',
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          nextRun: new Date(Date.now() + 82800000).toISOString(),
          status: 'success',
          duration: 42000
        },
        {
          name: 'News & Blog Automation',
          description: 'Daily fetch of mining news and AI blog draft generation',
          lastRun: new Date(Date.now() - 7200000).toISOString(),
          nextRun: new Date(Date.now() + 79200000).toISOString(),
          status: 'success',
          duration: 78000
        }
      ],
      uptime: '99.7%',
      memoryUsage: 72,
      errorRate: 0.3
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error('Error fetching system health:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system health' },
      { status: 500 }
    )
  }
}
