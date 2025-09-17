export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock approval items for tips
    const items = [
      {
        id: 'tip-1',
        type: 'tip',
        title: 'Safety Protocol Update',
        content: 'New safety requirements for underground mining operations including enhanced ventilation systems and emergency response procedures.',
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        category: 'Safety',
        priority: 'high'
      },
      {
        id: 'tip-2',
        type: 'tip',
        title: 'Environmental Monitoring Best Practices',
        content: 'Implement continuous water quality monitoring at all discharge points with real-time alerts for parameter exceedances.',
        aiGenerated: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        category: 'Environmental',
        priority: 'medium'
      }
    ]

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching approval tips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval tips' },
      { status: 500 }
    )
  }
}
