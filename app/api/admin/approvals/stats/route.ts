import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock approval statistics
    const stats = {
      pending: 7,
      tips: 2,
      faqs: 1,
      blogs: 3,
      checklists: 1,
      documents: 0,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching approval stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval stats' },
      { status: 500 }
    )
  }
}
