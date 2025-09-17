export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    // Check for admin key
    const { key } = await request.json()
    if (key !== 'hublio-secure-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Seed some realistic analytics data
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    // Generate page views for the last 7 days
    const pages = ['/', '/vacancies', '/regulation', '/blog', '/about', '/contact']
    const sampleEvents = []

    for (let i = 0; i < 7; i++) {
      const dayStart = now - (i * dayMs)
      const viewsPerDay = Math.floor(Math.random() * 50) + 20 // 20-70 views per day
      
      for (let j = 0; j < viewsPerDay; j++) {
        const randomPage = pages[Math.floor(Math.random() * pages.length)]
        const timestamp = dayStart + Math.floor(Math.random() * dayMs)
        
        await trackEvent('page_view', {
          page: randomPage,
          timestamp,
          ip: `192.168.1.${Math.floor(Math.random() * 200) + 1}`, // Fake IP for uniqueness
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
      }
    }

    // Generate some chat sessions
    for (let i = 0; i < 25; i++) {
      const timestamp = now - Math.floor(Math.random() * 7 * dayMs)
      
      await trackEvent('chat_session', {
        sessionId: `session_${i}`,
        timestamp,
        duration: Math.floor(Math.random() * 300000) + 60000, // 1-5 minutes
        question: 'Sample mining question',
        category: 'Mining'
      })
    }

    // Generate some contact inquiries
    for (let i = 0; i < 8; i++) {
      const timestamp = now - Math.floor(Math.random() * 7 * dayMs)
      
      await trackEvent('contact_inquiry', {
        timestamp,
        type: 'form_submission',
        source: 'website'
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sample analytics data seeded successfully' 
    })
  } catch (error) {
    console.error('Error seeding analytics:', error)
    return NextResponse.json(
      { error: 'Failed to seed analytics' },
      { status: 500 }
    )
  }
}
