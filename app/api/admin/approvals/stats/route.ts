import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return empty stats since approval data is now handled by /api/admin/approval-queue
    const stats = {
      pending: 0,
      tips: 0,
      faqs: 0,
      blogs: 0,
      checklists: 0,
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
